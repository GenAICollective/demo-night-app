import { type Demo } from "@prisma/client";
import { useEffect, useState } from "react";

import { cn } from "~/lib/utils";

export default function DemoWorkspace({
  demos,
  currentDemoId,
}: {
  demos: Demo[];
  currentDemoId: string | null;
}) {
  const [selectedDemo, setSelectedDemo] = useState<Demo | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={toggleExpand}
        className={cn(
          "cursor-pointer rounded-lg p-2 text-center font-semibold focus:outline-none",
          selectedDemo?.id === currentDemoId ? "bg-green-200" : "bg-red-200",
        )}
      >
        {selectedDemo ? selectedDemo.name : "Select a Demo"}
      </div>
      {isExpanded && (
        <div className="mt-2 space-y-1">
          {demos.map((demo) => (
            <div
              key={demo.id}
              onClick={() => {
                setSelectedDemo(demo);
                setIsExpanded(false);
              }}
              className={cn(
                "cursor-pointer rounded-lg p-2 text-center font-semibold focus:outline-none",
                demo.id === currentDemoId ? "bg-green-200" : "bg-red-200",
              )}
            >
              {demo.name}
            </div>
          ))}
        </div>
      )}
      <div className="size-full flex-1 bg-gray-200">
        {selectedDemo && <div>{selectedDemo.name}</div>}
      </div>
    </div>
  );
}
