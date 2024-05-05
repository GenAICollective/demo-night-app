import { type Demo } from "@prisma/client";
import { motion } from "framer-motion";
import { CircleCheck } from "lucide-react";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export function DemoItem({
  demo,
  selectedDemo,
  setSelectedDemo,
  isCurrent,
  refetchEvent,
}: {
  demo: Demo;
  selectedDemo: Demo | undefined;
  setSelectedDemo: (demo: Demo) => void;
  isCurrent: boolean;
  refetchEvent: () => void;
}) {
  const updateCurrentEventStateMutation =
    api.event.updateCurrentState.useMutation();
  const updateIndexMutation = api.demo.updateIndex.useMutation();

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-row items-center gap-2"
    >
      <p className="w-[17px] font-bold">{`${demo.index + 1}.`}</p>
      <button
        title="Select"
        className={cn(
          "flex flex-1 cursor-pointer flex-row items-center justify-between rounded-xl p-2 text-start font-medium focus:outline-none",
          isCurrent ? "bg-green-200" : "bg-white",
        )}
        onClick={() => {
          setSelectedDemo(demo);
        }}
      >
        <p className="line-clamp-1">{demo.name}</p>
        {selectedDemo?.id === demo.id && (
          <CircleCheck size={14} strokeWidth={3} />
        )}
      </button>
      <div className="flex flex-row gap-2 font-semibold">
        <button
          title="Set as Current"
          onClick={() => {
            setSelectedDemo(demo);
            updateCurrentEventStateMutation
              .mutateAsync({ currentDemoId: demo.id })
              .then(() => refetchEvent());
          }}
          className="focus:outline-none"
        >
          ⊕
        </button>
        <button
          title="Move Up"
          onClick={() => {
            updateIndexMutation
              .mutateAsync({
                id: demo.id,
                index: demo.index - 1,
              })
              .then(() => refetchEvent());
          }}
          className="focus:outline-none"
        >
          ↑
        </button>
        <button
          title="Move Down"
          onClick={() => {
            updateIndexMutation
              .mutateAsync({
                id: demo.id,
                index: demo.index + 1,
              })
              .then(() => refetchEvent());
          }}
          className="focus:outline-none"
        >
          ↓
        </button>
      </div>
    </motion.li>
  );
}
