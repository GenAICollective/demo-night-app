import { cn } from "~/lib/utils";

import LoadingDots from "./loading/loading-dots";

export default function SubmitButton({
  title,
  pending,
}: {
  title: string;
  pending: boolean;
}) {
  return (
    <button
      type="submit"
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-lg bg-gray-200 font-semibold text-black transition-all focus:outline-none",
        pending ? "cursor-not-allowed" : "hover:bg-gray-300",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>{title}</p>}
    </button>
  );
}
