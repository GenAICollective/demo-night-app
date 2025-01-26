import SubmissionsDashboard from "../../submissions/components/SubmissionsDashboard";

import { useDashboardContext } from "~/app/admin/[eventId]/contexts/DashboardContext";

export default function SubmissionsTab() {
  const { event } = useDashboardContext();
  if (!event) return null;
  return <SubmissionsDashboard event={event} isAdmin={true} />;
}
