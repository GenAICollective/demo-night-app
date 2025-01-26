"use client";

import { useQueryState } from "nuqs";

import { type CurrentEvent } from "~/lib/types/currentEvent";

import { AdminSidebar, AdminTab } from "./components/AdminSidebar";
import AttendeesTab from "./components/Attendees/AttendeesTab";
import { AwardsTab } from "./components/Awards/AwardsTab";
import ControlCenterTab from "./components/ControlCenter/ControlCenterTab";
import { DemosTab } from "./components/Demos/DemosTab";
import EventFeedbackTab from "./components/EventFeedback/EventFeedbackTab";
import { PartnersTab } from "./components/Partners/PartnersTab";
import SubmissionsTab from "./components/Submissions/SubmissionsTab";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

import { type AdminEvent, DashboardContext } from "./contexts/DashboardContext";
import { useEventAdmin } from "./hooks/useEventAdmin";

export function ClientEventDashboard({
  event: initialEvent,
  currentEvent: initialCurrentEvent,
}: {
  event: AdminEvent;
  currentEvent: CurrentEvent | null;
}) {
  const { event, currentEvent, refetch } = useEventAdmin({
    initialEvent,
    initialCurrentEvent,
  });
  const [selectedTab, setSelectedTab] = useQueryState<AdminTab>("tab", {
    defaultValue: AdminTab.DemosAndFeedback,
    parse: (value) => value as AdminTab,
    serialize: (value) => value,
  });

  function dashboard() {
    switch (selectedTab) {
      case AdminTab.Submissions:
        return <SubmissionsTab />;
      case AdminTab.Demos:
        return <DemosTab />;
      case AdminTab.Awards:
        return <AwardsTab />;
      case AdminTab.Partners:
        return <PartnersTab />;
      case AdminTab.DemosAndFeedback:
      case AdminTab.AwardsAndVoting:
        return (
          <ControlCenterTab
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        );
      case AdminTab.Attendees:
        return <AttendeesTab />;
      case AdminTab.EventFeedback:
        return <EventFeedbackTab />;
    }
  }

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContext.Provider
      value={{
        event: event,
        currentEvent: currentEvent,
        refetchEvent: refetch,
      }}
    >
      <SidebarProvider defaultOpen>
        <div className="flex h-screen w-full">
          <AdminSidebar
            event={event}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          <SidebarInset className="flex-1 p-4">{dashboard()}</SidebarInset>
        </div>
      </SidebarProvider>
    </DashboardContext.Provider>
  );
}
