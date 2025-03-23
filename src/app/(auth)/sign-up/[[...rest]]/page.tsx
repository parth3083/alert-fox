import { SignUp } from "@clerk/nextjs";
import React from "react";

function page() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full ">
      <SignUp forceRedirectUrl={"/role-selection"}/>
    </div>
  );
}

export default page;
