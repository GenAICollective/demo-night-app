import { useWorkspaceContext } from "../../contexts/WorkspaceContext";
import { UpdateAttendeeForm } from "../UpdateAttendee";

export default function PreWorkspace() {
  const { attendee, setAttendee } = useWorkspaceContext();
  return (
    <div className="flex size-full flex-1 flex-col items-center justify-center gap-2 p-4">
      <div className="absolute bottom-0 w-full max-w-xl p-4">
        <UpdateAttendeeForm attendee={attendee} setAttendee={setAttendee} />
      </div>
    </div>
  );
}
