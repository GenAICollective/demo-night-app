import { useWorkspaceContext } from "../../contexts/WorkspaceContext";
import { UpdateAttendeeForm } from "../UpdateAttendee";

import { GaicoConfetti } from "~/components/Confetti";

export default function PreWorkspace() {
  const { attendee, setAttendee } = useWorkspaceContext();
  return (
    <>
      <div className="absolute bottom-0 max-h-[calc(100dvh-120px)] w-full max-w-xl">
        <div className="size-full p-4">
          <UpdateAttendeeForm attendee={attendee} setAttendee={setAttendee} />
        </div>
      </div>

      <div className="z-3 pointer-events-none fixed inset-0">
        <GaicoConfetti />
      </div>
    </>
  );
}
