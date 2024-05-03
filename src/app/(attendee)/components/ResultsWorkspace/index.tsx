import { useWorkspaceContext } from "../../contexts/WorkspaceContext";

export default function ResultsWorkspace() {
  const { currentEvent, attendee } = useWorkspaceContext();

  return <div>ResultsWorkspace</div>;
}
