import { cn } from "~/lib/utils";

import LoadingDots from "./loading/LoadingDots";

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
        "z-30 flex h-14 w-full items-center justify-center space-x-2 rounded-xl bg-orange-500/80 px-4 py-2 font-kallisto text-xl font-bold tracking-wide text-white shadow-lg backdrop-blur transition-all focus:outline-none active:scale-95 active:shadow-md",
        pending ? "cursor-not-allowed" : "hover:bg-orange-600/80",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#fff" /> : <p>{title}</p>}
    </button>
  );
}
