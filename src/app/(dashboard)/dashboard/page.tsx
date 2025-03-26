"use client"
import DashboardPage from "@/components/DashboardPage";
import React from "react";
import AlertPageContent from "./AlertPageContent";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";

function Page() {
  // const {} = useQuery({
  //   queryKey: ["starting the node cron"],
  //   queryFn: async () => {
  //     const response = await axios.get("/api/system-monitor");
  //     return await response.data;
  //   },
  // });

  return <DashboardPage title="Alerts">

    <AlertPageContent/>
  </DashboardPage>;
}

export default Page;
