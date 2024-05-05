import { useDashboardContext } from "../../contexts/DashboardContext";

import { EventPhase } from "~/lib/currentEvent";

export default function RecapDashboard() {
  const { currentEvent } = useDashboardContext();

  const message =
    currentEvent?.phase === EventPhase.Recap
      ? "Job well done! 😄"
      : "Don't forget to set the phase to Recap!";

  return (
    <div className="flex size-full flex-1 flex-col items-center justify-center gap-2 rounded-xl bg-gray-100 p-4">
      <h1 className="font-kallisto text-4xl font-bold">{message}</h1>
    </div>
  );
}
