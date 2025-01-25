"use client";

import { useEffect, useState } from "react";

import { api } from "~/trpc/react";

import { AdminSidebar, AdminTab } from "./components/AdminSidebar";
import AttendeesTab from "./components/Attendees/AttendeesTab";
import { AwardsTab } from "./components/Awards/AwardsTab";
import ControlCenterTab from "./components/ControlCenter/ControlCenterTab";
import { DemosTab } from "./components/Demos/DemosTab";
import EventFeedbackTab from "./components/EventFeedback/EventFeedbackTab";
import { PartnersTab } from "./components/Partners/PartnersTab";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

import {
  DashboardContext,
  useDashboardContext,
} from "./contexts/DashboardContext";
import { useEventAdmin } from "./hooks/useEventAdmin";

export default function AdminEventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const {
    currentEvent,
    event,
    refetch: refetchEvent,
    setSelectedEventId,
  } = useEventAdmin();

  useEffect(() => {
    setSelectedEventId(params.eventId);
  }, [params.eventId, setSelectedEventId]);

  return (
    <main className="flex min-h-screen w-full">
      <DashboardContext.Provider value={{ currentEvent, event, refetchEvent }}>
        {event ? (
          <EventDashboard />
        ) : (
          <div className="w-full p-2 text-center text-2xl font-semibold">
            No event selected
          </div>
        )}
      </DashboardContext.Provider>
    </main>
  );
}

function EventDashboard() {
  const { event } = useDashboardContext();
  const [selectedTab, setSelectedTab] = useState<AdminTab>(
    AdminTab.DemosAndFeedback,
  );
  const { data: eventData } = api.event.getAdmin.useQuery(event?.id ?? "", {
    enabled: !!event?.id,
  });

  function dashboard() {
    switch (selectedTab) {
      case AdminTab.Submissions:
        return <div></div>;
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

  if (!event) return null;

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full">
        <AdminSidebar
          event={event}
          submissions={eventData?.submissions}
          attendees={eventData?.attendees}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <SidebarInset className="flex-1 p-4">{dashboard()}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
