import { SignIn } from "@clerk/nextjs";
import React from "react";

function page() {
  return (
    <div className="flex flex-col flex-1 w-full items-center justify-center">
      <SignIn forceRedirectUrl={"/logging-account"} />
    </div>
  );
}

export default page;
