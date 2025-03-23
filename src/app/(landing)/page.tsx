import Heading from "@/components/Heading";
import MaxWidth from "@/components/MaxWidth";
import ShinyButton from "@/components/ShinyButton";
import { Check } from "lucide-react";
import React from "react";

function Page() {
  return (
    <div className="w-full  flex flex-col items-center justify-center relative">
      <MaxWidth className="flex  pt-20 items-center gap-12 justify-center  flex-col">
        <Heading badgeText="Seamlessly track and manage systems">
          Simplified Alert & Ticket Management
        </Heading>
        <p className="text-sm md:text-lg max-w-prose text-center ">
          Monitor and manage system alerts effortlessly with{" "}
          <span className="font-semibold text-orange-500">
            real-time tracking
          </span>
          ,{" "}
          <span className="font-semibold text-orange-500">
            ticket generation
          </span>
          , and{" "}
          <span className="font-semibold text-orange-500">status updates</span>{" "}
          delivered instantly to your dashboard.
        </p>
        <ul className="    flex flex-col items-start gap-1">
          {[
            "Real-time system alert monitoring and tracking.",
            "Effortless ticket generation for critical issues.",
            "Manage and resolve tickets seamlessly from a dashboard.",
          ].map((items, index) => (
            <li
              key={index}
              className="flex items-center gap-2  text-sm md:text-xl"
            >
              <Check className="size-5 text-orange-500 font-semibold text-xl" />
              {items}
            </li>
          ))}
        </ul>
        <div className="w-full max-w-80">
          <ShinyButton className="capitalize relative h-14 w-full  shadow-xl transition-shadow duration-300 hover:shadow-xl text-2xl"
          
            href="/recommend">
            Get Started

          </ShinyButton>
        </div>
      </MaxWidth>
    </div>
  );
}

export default Page;
