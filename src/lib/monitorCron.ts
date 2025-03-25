import cron from "node-cron";
import { monitorSystem } from "./alertService";

export const startMonitoring = () => {
  cron.schedule("* * * * *", async () => {
    await monitorSystem();
  });
};
