import { useWorkspaceContext } from "../../contexts/WorkspaceContext";
import { UpdateAttendeeForm } from "../UpdateAttendee";

import { GaicoConfetti } from "~/components/Confetti";

export default function PreWorkspace() {
  const { attendee, setAttendee } = useWorkspaceContext();
  return (
    <>
      <div className="flex size-full flex-1 flex-col items-center justify-center gap-2 p-4">
        <div className="absolute bottom-0 max-h-[calc(100dvh-80px)] w-full max-w-xl p-4">
          <UpdateAttendeeForm attendee={attendee} setAttendee={setAttendee} />
        </div>
      </div>
      <div className="z-3 pointer-events-none fixed inset-0">
        <GaicoConfetti />
      </div>
    </>
  );
}
