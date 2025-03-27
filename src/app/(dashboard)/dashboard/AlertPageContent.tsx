"use client";
import React from "react";
import {
  CartesianGrid,
  XAxis,
  Area,
  AreaChart,
  LabelList,
  Bar,
  YAxis,
  BarChart,
  Line,
  LineChart,
  PieChart,
  Pie,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Heading, LucideProps } from "lucide-react";

interface Alert {
  id: string;
  type: string;
  severity: string;
  status: string;
  message: string;
  serverUptime: number;
  createdAt: string; // ISO date string
  networkData: string | null; // JSON string or null
  payloadError: any | null; // Can be `null` or contain error details
}

function AlertPageContent() {
  //MAIN LOGIC STARTS FROM HERE
  const { data, isLoading } = useQuery({
    queryKey: ["fetch-alerts"],
    queryFn: async () => {
      const response = await axios.get("/api/get-alerts");
      return await response.data;
    },
    refetchInterval: (query) => {
      return query.state.data?.isSynced ? false : 600000; // 10 minutes
    },
  });
  // FOR THE CPU USAGE
  const chartData = Array.isArray(data?.alerts)
    ? data.alerts.map((alert: Alert) => {
        const networkData = alert.networkData
          ? JSON.parse(alert.networkData)
          : {};
        const formattedDate = new Date(alert.createdAt).toLocaleString(
          "en-US",
          {
            month: "short", // "Mar"
            day: "2-digit", // "26"
          }
        );

        return {
          dateTime: formattedDate,
          cpuUsage: networkData.cpuUsage || 0,
        };
      })
    : [];

  const chartConfig = {
    cpuUsage: {
      label: "CPU Usage",
      color: "hsl(var(--chart-1))",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig;

  // FOR MEMORY USAGE
  const memoryData = Array.isArray(data?.alerts)
    ? data.alerts.map((alert: Alert) => {
        const networkData = alert.networkData
          ? JSON.parse(alert.networkData)
          : {};
        const formattedDate = new Date(alert.createdAt).toLocaleString(
          "en-US",
          {
            month: "short", // "Mar"
            day: "2-digit", // "26"
          }
        );

        return {
          dateTime: formattedDate,
          memoryUsage: networkData.memoryUsage || 0,
        };
      })
    : [];
  const chartConfig3 = {
    memoryUsage: {
      label: "Memory usage ",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // FOR SERVER UP TIME
  const serverUptimeData = data?.alerts.map((alert: Alert) => {
    const formattedDate = new Date(alert.createdAt).toLocaleString("en-US", {
      month: "short", // "Mar"
      day: "2-digit", // "26"
    });

    return {
      dateTime: formattedDate,
      serverUptime: alert.serverUptime,
    };
  });

  const chartConfig4 = {
    serverUptime: {
      label: "Server Uptime",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // CPU SERVITY
  const cpuAlerts =
    data?.alerts?.filter((alert: Alert) => alert.type === "CPU") || [];

  // Initialize severityCounts to ensure LOW, MEDIUM, HIGH always exist
  const severityCounts = cpuAlerts.reduce(
    (acc: Record<"LOW" | "MEDIUM" | "HIGH", number>, alert: Alert) => {
      const severity = alert.severity as keyof typeof acc; // Assert it matches known keys
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    },
    { LOW: 0, MEDIUM: 0, HIGH: 0 } // Ensure all keys exist even if no alerts
  );

  // Format the chart data for shadcn
  const cpuServityData = [
    { severity: "LOW", count: severityCounts.LOW, fill: "var(--color-LOW)" },
    {
      severity: "MEDIUM",
      count: severityCounts.MEDIUM,
      fill: "var(--color-MEDIUM)",
    },
    { severity: "HIGH", count: severityCounts.HIGH, fill: "var(--color-HIGH)" },
  ];

  // Chart configuration
  const chartConfig5 = {
    count: {
      label: "Count",
    },
    LOW: {
      label: "Low Severity",
      color: "hsl(var(--chart-1))",
    },
    MEDIUM: {
      label: "Medium Severity",
      color: "hsl(var(--chart-2))",
    },
    HIGH: {
      label: "High Severity",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  // DISK SEVERITY
  const diskAlerts =
    data?.alerts?.filter((alert: Alert) => alert.type === "Disk") || [];

  // Initialize severityCounts to ensure LOW, MEDIUM, HIGH always exist
  const diskSeverityCounts = diskAlerts.reduce(
    (acc: Record<"LOW" | "MEDIUM" | "HIGH", number>, alert: Alert) => {
      const severity = alert.severity as keyof typeof acc; // Type assertion
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    },
    { LOW: 0, MEDIUM: 0, HIGH: 0 } // Ensure all keys exist even if no alerts
  );

  // Format the chart data for shadcn
  const diskServityData = [
    {
      severity: "LOW",
      count: diskSeverityCounts.LOW,
      fill: "var(--color-LOW)",
    },
    {
      severity: "MEDIUM",
      count: diskSeverityCounts.MEDIUM,
      fill: "var(--color-MEDIUM)",
    },
    {
      severity: "HIGH",
      count: diskSeverityCounts.HIGH,
      fill: "var(--color-HIGH)",
    },
  ];

  // Chart configuration
  const chartConfig6 = {
    count: {
      label: "Count",
    },
    LOW: {
      label: "Low Severity",
      color: "hsl(var(--chart-1))",
    },
    MEDIUM: {
      label: "Medium Severity",
      color: "hsl(var(--chart-2))",
    },
    HIGH: {
      label: "High Severity",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  //MEMORY SERVITY
  const memoryAlerts =
    data?.alerts?.filter((alert: Alert) => alert.type === "Memory") || [];

  // Initialize severityCounts to ensure LOW, MEDIUM, HIGH always exist
  const memorySeverityCounts = memoryAlerts.reduce(
    (acc: Record<"LOW" | "MEDIUM" | "HIGH", number>, alert: Alert) => {
      const severity = alert.severity as keyof typeof acc; // Ensure TypeScript understands the key
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    },
    { LOW: 0, MEDIUM: 0, HIGH: 0 } // Ensure all keys exist even if no alerts
  );

  // Format the chart data for shadcn
  const memoryServityData = [
    {
      severity: "LOW",
      count: memorySeverityCounts.LOW,
      fill: "var(--color-LOW)",
    },
    {
      severity: "MEDIUM",
      count: memorySeverityCounts.MEDIUM,
      fill: "var(--color-MEDIUM)",
    },
    {
      severity: "HIGH",
      count: memorySeverityCounts.HIGH,
      fill: "var(--color-HIGH)",
    },
  ];

  // Chart configuration
  const chartConfig7 = {
    count: {
      label: "Count",
    },
    LOW: {
      label: "Low Severity",
      color: "hsl(var(--chart-1))",
    },
    MEDIUM: {
      label: "Medium Severity",
      color: "hsl(var(--chart-2))",
    },
    HIGH: {
      label: "High Severity",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full flex flex-col gap-5">
      {isLoading ? (
        <>
          <div className="flex-w-full h-[80vh]  pt-30 flex-1 items-center justify-center px-4">
            <BackgroundPattern className="absolute inset-0 left-1/2 z-0 -translate-x-1/2 opacity-75" />
            <div className="relative z-10 flex -transalte-y-1/2 flex-col items-center gap-6 text-center">
              <LoadingSpinner size={"md"} />

              <Heading>Fetching alerts</Heading>
              <p className="text-base/7 text-gray-600 max-w-prose">
                Just a moment while we set things up for you...
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full flex items-center  gap-2">
            <h1 className="text-xl font-medium">CPU Information</h1>
            <div className="h-px flex-1 bg-gray-300" />
          </div>
          <section className="w-full flex -mt-10 items-center justify-between">
            <div className="h-fit flex-1  p-8">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-2xl">CPU Usage</CardTitle>
                  <CardDescription>
                    Overall CPU usage this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart
                      accessibilityLayer
                      data={chartData}
                      layout="vertical"
                      margin={{
                        right: 16,
                      }}
                    >
                      <CartesianGrid horizontal={false} />
                      <YAxis
                        dataKey="dateTime"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                        hide
                      />
                      <XAxis dataKey="cpuUsage" type="number" hide />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <Bar
                        capHeight={10}
                        dataKey="cpuUsage"
                        layout="vertical"
                        fill="var(--color-cpuUsage)"
                        radius={5}
                        className="bg-green-500"
                      >
                        <LabelList
                          dataKey="dateTime"
                          position="insideLeft"
                          offset={2}
                          className="fill-[--color-label]"
                          fontSize={10}
                        />
                        <LabelList
                          dataKey="cpuUsage"
                          position="right"
                          offset={5}
                          className="fill-foreground"
                          fontSize={10}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </section>
          <div className="w-full flex items-center  gap-2">
            <h1 className="text-xl font-medium">Memory Information</h1>
            <div className="h-px flex-1 bg-gray-300" />
          </div>
          <section className="w-full  flex -mt-10 items-center justify-between">
            <div className="h-fit flex-1  p-8">
              <Card>
                <CardHeader>
                  <CardTitle>Memory Usage </CardTitle>
                  <CardDescription>
                    Showing total memory usage till now
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    className="w-full h-80 "
                    config={chartConfig3}
                  >
                    <AreaChart
                      accessibilityLayer
                      data={memoryData}
                      margin={{
                        left: 12,
                        right: 12,
                        top: 50,
                        bottom: 50,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="dateTime"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 6)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <Area
                        dataKey="memoryUsage"
                        type="natural"
                        fill="var(--color-memoryUsage)"
                        fillOpacity={0.4}
                        stroke="var(--color-memoryUsage)"
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </section>
          <div className="w-full flex items-center  gap-2">
            <h1 className="text-xl font-medium">Server up time (in ms)</h1>
            <div className="h-px flex-1 bg-gray-300" />
          </div>
          <section className="w-full  flex -mt-10 items-center justify-between">
            <div className="h-fit flex-1  p-8">
              <Card>
                <CardHeader className="flex flex-col items-stretch space-y-0  p-0 sm:flex-row">
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Server up time </CardTitle>
                    <CardDescription>Showing server up time</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-2 sm:p-6">
                  <ChartContainer
                    config={chartConfig4}
                    className="aspect-auto h-[250px] w-full"
                  >
                    <LineChart
                      accessibilityLayer
                      data={serverUptimeData}
                      margin={{
                        left: 12,
                        right: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="dateTime"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            className="w-[150px]"
                            nameKey="views"
                            labelFormatter={(value) => {
                              return new Date(value).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              );
                            }}
                          />
                        }
                      />
                      <Line
                        dataKey="serverUptime"
                        type="monotone"
                        stroke={`var(--color-serverUptime)`}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </section>
          <div className="w-full flex items-center  gap-2">
            <h1 className="text-xl font-medium">Types and servity</h1>
            <div className="h-px flex-1 bg-gray-300" />
          </div>
          <section className="w-full  flex -mt-10 py-8 items-center justify-between">
            <div className="h-full flex-1 p-8 border-r">
              <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                  <CardTitle>CPU Servity Data</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={chartConfig5}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={cpuServityData}
                        dataKey="count"
                        nameKey="severity"
                        fillOpacity={0.8}
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
            <div className="h-full flex-1 p-8 border-r">
              <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Disk Servity Data</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={chartConfig6}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={diskServityData}
                        dataKey="count"
                        nameKey="severity"
                        fillOpacity={0.8}
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
            <div className="h-full flex-1 p-8 ">
              <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Memory Servity Data</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={chartConfig7}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={memoryServityData}
                        dataKey="count"
                        nameKey="severity"
                        fillOpacity={0.8}
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
const BackgroundPattern = (props: LucideProps) => {
  return (
    <svg
      width="768"
      height="736"
      viewBox="0 0 768 736"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <mask
        id="mask0_5036_374506"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="-32"
        width="768"
        height="768"
      >
        <rect
          width="768"
          height="768"
          transform="translate(0 -32)"
          fill="url(#paint0_radial_5036_374506)"
        />
      </mask>
      <g mask="url(#mask0_5036_374506)">
        <g clipPath="url(#clip0_5036_374506)">
          <g clipPath="url(#clip1_5036_374506)">
            <line x1="0.5" y1="-32" x2="0.5" y2="736" stroke="#E4E7EC" />
            <line x1="48.5" y1="-32" x2="48.5" y2="736" stroke="#E4E7EC" />
            <line x1="96.5" y1="-32" x2="96.5" y2="736" stroke="#E4E7EC" />
            <line x1="144.5" y1="-32" x2="144.5" y2="736" stroke="#E4E7EC" />
            <line x1="192.5" y1="-32" x2="192.5" y2="736" stroke="#E4E7EC" />
            <line x1="240.5" y1="-32" x2="240.5" y2="736" stroke="#E4E7EC" />
            <line x1="288.5" y1="-32" x2="288.5" y2="736" stroke="#E4E7EC" />
            <line x1="336.5" y1="-32" x2="336.5" y2="736" stroke="#E4E7EC" />
            <line x1="384.5" y1="-32" x2="384.5" y2="736" stroke="#E4E7EC" />
            <line x1="432.5" y1="-32" x2="432.5" y2="736" stroke="#E4E7EC" />
            <line x1="480.5" y1="-32" x2="480.5" y2="736" stroke="#E4E7EC" />
            <line x1="528.5" y1="-32" x2="528.5" y2="736" stroke="#E4E7EC" />
            <line x1="576.5" y1="-32" x2="576.5" y2="736" stroke="#E4E7EC" />
            <line x1="624.5" y1="-32" x2="624.5" y2="736" stroke="#E4E7EC" />
            <line x1="672.5" y1="-32" x2="672.5" y2="736" stroke="#E4E7EC" />
            <line x1="720.5" y1="-32" x2="720.5" y2="736" stroke="#E4E7EC" />
          </g>
          <rect x="0.5" y="-31.5" width="767" height="767" stroke="#E4E7EC" />
          <g clipPath="url(#clip2_5036_374506)">
            <line y1="15.5" x2="768" y2="15.5" stroke="#E4E7EC" />
            <line y1="63.5" x2="768" y2="63.5" stroke="#E4E7EC" />
            <line y1="111.5" x2="768" y2="111.5" stroke="#E4E7EC" />
            <line y1="159.5" x2="768" y2="159.5" stroke="#E4E7EC" />
            <line y1="207.5" x2="768" y2="207.5" stroke="#E4E7EC" />
            <line y1="255.5" x2="768" y2="255.5" stroke="#E4E7EC" />
            <line y1="303.5" x2="768" y2="303.5" stroke="#E4E7EC" />
            <line y1="351.5" x2="768" y2="351.5" stroke="#E4E7EC" />
            <line y1="399.5" x2="768" y2="399.5" stroke="#E4E7EC" />
            <line y1="447.5" x2="768" y2="447.5" stroke="#E4E7EC" />
            <line y1="495.5" x2="768" y2="495.5" stroke="#E4E7EC" />
            <line y1="543.5" x2="768" y2="543.5" stroke="#E4E7EC" />
            <line y1="591.5" x2="768" y2="591.5" stroke="#E4E7EC" />
            <line y1="639.5" x2="768" y2="639.5" stroke="#E4E7EC" />
            <line y1="687.5" x2="768" y2="687.5" stroke="#E4E7EC" />
            <line y1="735.5" x2="768" y2="735.5" stroke="#E4E7EC" />
          </g>
          <rect x="0.5" y="-31.5" width="767" height="767" stroke="#E4E7EC" />
        </g>
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_5036_374506"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(384 384) rotate(90) scale(384 384)"
        >
          <stop />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <clipPath id="clip0_5036_374506">
          <rect
            width="768"
            height="768"
            fill="white"
            transform="translate(0 -32)"
          />
        </clipPath>
        <clipPath id="clip1_5036_374506">
          <rect y="-32" width="768" height="768" fill="white" />
        </clipPath>
        <clipPath id="clip2_5036_374506">
          <rect y="-32" width="768" height="768" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export default AlertPageContent;
