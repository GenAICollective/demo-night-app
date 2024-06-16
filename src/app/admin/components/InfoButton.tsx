import { BadgeInfo } from "lucide-react";

import { cn } from "~/lib/utils";

import Button from "~/components/Button";
import { useModal } from "~/components/modal/provider";

export default function InfoButton({
  variant = "default",
  title,
  message,
}: {
  variant?: "default" | "warning";
  title: string;
  message: string;
}) {
  const modal = useModal();

  return (
    <button
      className={cn(
        "group h-6 w-6 rounded-full p-1 outline-none transition-all duration-300 hover:shadow-md",
        variant === "warning"
          ? "bg-red-200 hover:bg-red-300"
          : "bg-gray-200 hover:bg-gray-300",
      )}
      onClick={() => modal?.show(<InfoModal title={title} message={message} />)}
    >
      <BadgeInfo
        className={cn(
          "h-4 w-4",
          variant === "warning"
            ? "text-red-500 group-hover:text-red-600"
            : "text-gray-500 group-hover:text-gray-600",
        )}
      />
    </button>
  );
}

export function InfoModal({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  const modal = useModal();

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-center text-2xl font-bold">{title}</h1>
      <p className="w-[300px] text-wrap text-center">{message}</p>
      <Button onClick={() => modal?.hide()}>Done</Button>
    </div>
  );
}
