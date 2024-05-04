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
        "flex h-14 w-full items-center justify-center space-x-2 rounded-xl bg-orange-500 px-4 py-2 font-kallisto text-xl font-bold tracking-wide text-white transition-all focus:outline-none",
        pending ? "cursor-not-allowed" : "hover:bg-orange-600",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>{title}</p>}
    </button>
  );
}
