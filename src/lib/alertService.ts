import osu from "node-os-utils";
import os from "os";
import { exec } from "child_process";
import {
  PrismaClient,
  Severity,
  Priority,
  Alertstatus,
  Ticketstatus,
} from "@prisma/client";

const prisma = new PrismaClient();
const { cpu, mem, netstat } = osu;

// Thresholds for Alerts
const CPU_THRESHOLD = 80;
const MEMORY_THRESHOLD = 65;
const DISK_THRESHOLD = 85;
const NETWORK_THRESHOLD = 900; //900 Kbps

// Get Windows Disk Usage
const getWindowsDiskUsage = (drive: string = "C:"): Promise<number> => {
  return new Promise((resolve, reject) => {
    exec(
      `wmic logicaldisk where DeviceID="${drive}" get Size,FreeSpace`,
      (error, stdout) => {
        if (error) {
          reject(`Error fetching disk usage: ${error.message}`);
          return;
        }

        const lines = stdout.trim().split("\n");
        if (lines.length < 2) {
          reject("Invalid disk usage output.");
          return;
        }

        const values = lines[1].trim().split(/\s+/);
        const freeSpace = parseInt(values[0], 10);
        const totalSize = parseInt(values[1], 10);

        if (isNaN(freeSpace) || isNaN(totalSize)) {
          reject("Invalid disk size values.");
          return;
        }

        const usedPercentage = ((totalSize - freeSpace) / totalSize) * 100;
        resolve(usedPercentage);
      }
    );
  });
};

// Safely parse network information
const parseNetworkInfo = (networkInfo: any) => {
  try {
    // Handle different possible network info formats
    if (typeof networkInfo === "string") {
      console.warn("Network info is a string, cannot parse");
      return {
        inputMb: 0,
        outputMb: 0,
        total: 0,
      };
    }

    if (!networkInfo || !networkInfo.total) {
      console.warn("Incomplete network information");
      return {
        inputMb: 0,
        outputMb: 0,
        total: 0,
      };
    }

    return {
      inputMb: networkInfo.total.inputMb || 0,
      outputMb: networkInfo.total.outputMb || 0,
      total:
        (networkInfo.total.inputMb || 0) + (networkInfo.total.outputMb || 0),
    };
  } catch (error) {
    console.error("Error parsing network info:", error);
    return {
      inputMb: 0,
      outputMb: 0,
      total: 0,
    };
  }
};

// Determine Alert Severity
const determineSeverity = (value: number, threshold: number): Severity => {
  if (value >= threshold + 20) return Severity.HIGH;
  if (value >= threshold + 10) return Severity.MEDIUM;
  return Severity.LOW;
};

// Create Alert & Ticket
const createAlert = async (
  type: string,
  value: number,
  threshold: number,
  additionalContext?: {
    cpuUsage?: number;
    memoryUsage?: number;
    networkUsage?: number;
    serverUptime?: number;
  }
) => {
  try {
    const severity = determineSeverity(value, threshold);

    const alert = await prisma.alert.create({
      data: {
        type,
        severity,
        message: `${type} usage exceeded threshold: ${value.toFixed(2)}%`,
        status: Alertstatus.NEW,
        // Store additional context
        serverUptime: additionalContext?.serverUptime
          ? Math.round(additionalContext.serverUptime)
          : undefined,
        networkData: additionalContext
          ? JSON.stringify({
              cpuUsage: additionalContext.cpuUsage,
              memoryUsage: additionalContext.memoryUsage,
              networkUsage: additionalContext.networkUsage,
            })
          : undefined,
        payloadError: undefined, // Can be used to store specific error details if needed
      },
    });

    // Only create a ticket if severity is high
    if (severity === Severity.HIGH) {
      await prisma.ticket.create({
        data: {
          alert: { connect: { id: alert.id } },
          status: Ticketstatus.OPEN,
          priority: Priority.HIGH,
        },
      });
    }

    console.log(`🚨 Alert created: ${type} - ${value.toFixed(2)}%`);
  } catch (error) {
    console.error("❌ Error creating alert or ticket:", error);
  }
};

// Resolve Ticket if Metric is Back to Normal
const resolveTicket = async (type: string) => {
  try {
    const openTicket = await prisma.ticket.findFirst({
      where: {
        alert: { type },
        status: Ticketstatus.OPEN,
      },
    });

    if (openTicket) {
      await prisma.ticket.update({
        where: { id: openTicket.id },
        data: { status: Ticketstatus.CLOSED },
      });
      console.log(`✅ ${type} issue resolved.`);
    }
  } catch (error) {
    console.error("❌ Error resolving ticket:", error);
  }
};

// Monitor System
export const monitorSystem = async () => {
  try {
    const [cpuUsage, memoryInfo, networkInfo] = await Promise.all([
      cpu.usage(),
      mem.info(),
      netstat.inOut(),
    ]);

    // Parse network info safely
    const parsedNetworkInfo = parseNetworkInfo(networkInfo);
    const serverUptime = os.uptime();

    // CPU Check
    if (cpuUsage > CPU_THRESHOLD) {
      await createAlert("CPU", cpuUsage, CPU_THRESHOLD, {
        cpuUsage,
        memoryUsage: (memoryInfo.usedMemMb / memoryInfo.totalMemMb) * 100,
        networkUsage: parsedNetworkInfo.total,
        serverUptime,
      });
    } else {
      await resolveTicket("CPU");
    }

    // Memory Check
    const memoryUsage = (memoryInfo.usedMemMb / memoryInfo.totalMemMb) * 100;
    if (memoryUsage > MEMORY_THRESHOLD) {
      await createAlert("Memory", memoryUsage, MEMORY_THRESHOLD, {
        cpuUsage,
        memoryUsage,
        networkUsage: parsedNetworkInfo.total,
        serverUptime,
      });
    } else {
      await resolveTicket("Memory");
    }

    // Disk Check
    if (os.platform() === "win32") {
      try {
        const diskUsage = await getWindowsDiskUsage();
        if (diskUsage > DISK_THRESHOLD) {
          await createAlert("Disk", diskUsage, DISK_THRESHOLD, {
            cpuUsage,
            memoryUsage,
            networkUsage: parsedNetworkInfo.total,
            serverUptime,
          });
        } else {
          await resolveTicket("Disk");
        }
      } catch (diskError) {
        console.error("❌ Disk usage check failed:", diskError);
      }
    }

    // Network Check
    if (parsedNetworkInfo.total > 0) {
      const totalNetworkUsage = parsedNetworkInfo.total;
      if (totalNetworkUsage > NETWORK_THRESHOLD) {
        await createAlert("Network", totalNetworkUsage, NETWORK_THRESHOLD, {
          cpuUsage,
          memoryUsage,
          networkUsage: totalNetworkUsage,
          serverUptime,
        });
      } else {
        await resolveTicket("Network");
      }
    }

    // Log uptime
    console.log(`⏳ Server Uptime: ${serverUptime} seconds`);
  } catch (error) {
    console.error("❌ Error monitoring system:", error);
  }
};

// Initial Monitoring Call
monitorSystem();

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});
