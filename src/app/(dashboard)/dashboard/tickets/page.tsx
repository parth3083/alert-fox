import DashboardPage from "@/components/DashboardPage";
import React from "react";
import TicketsPageContent from "./TicketsPageContent";

function Page() {
  return (
    <DashboardPage title="Tickets">
      <TicketsPageContent />
    </DashboardPage>
  );
}

export default Page;
