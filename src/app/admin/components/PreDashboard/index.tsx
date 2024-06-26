import { useDashboardContext } from "../../contexts/DashboardContext";
import CsvButton from "../CsvButton";
import InfoButton from "../InfoButton";
import { type Award, type Demo } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";

import { api } from "~/trpc/react";

import { useModal } from "~/components/modal/provider";

import { AwardItem } from "./AwardItem";
import { DemoItem } from "./DemoItem";
import { DemoQRModal } from "./DemoQRModal";
import { UpsertAwardModal } from "./UpsertAwardModal";
import { UpsertDemoModal } from "./UpsertDemoModal";

const DEMO_CSV_HEADERS = ["id", "name", "description", "email", "url"];
const AWARD_CSV_HEADERS = ["id", "name", "description"];

export default function PreDashboard() {
  const { event, refetchEvent } = useDashboardContext();
  const modal = useModal();
  const setDemosMutation = api.demo.setDemos.useMutation();
  const setAwardsMutation = api.award.setAwards.useMutation();

  if (!event) return null;

  const showUpsertDemoModal = (demo?: Demo) => {
    modal?.show(
      <UpsertDemoModal
        eventId={event.id}
        demo={demo}
        onSubmit={refetchEvent}
      />,
    );
  };

  const showUpsertAwardModal = (award?: Award) => {
    modal?.show(
      <UpsertAwardModal
        eventId={event.id}
        award={award}
        onSubmit={refetchEvent}
      />,
    );
  };

  const showDemoQRModal = (demo: Demo) => {
    modal?.show(<DemoQRModal demo={demo} />);
  };

  const onUploadDemos = (rows: Record<string, string>[]) => {
    setDemosMutation.mutate({
      eventId: event.id,
      demos: rows as any,
    });
  };

  const onUploadAwards = (rows: Record<string, string>[]) => {
    setAwardsMutation.mutate({
      eventId: event.id,
      awards: rows as any,
    });
  };

  return (
    <div className="flex size-full flex-row gap-2">
      <div className="flex flex-1 flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-bold">Demos</h2>
          <InfoButton
            title="Demos"
            message="Send the demoists their URL or have them scan the QR code to edit their information before the demo phase starts!"
          />
        </div>
        <ul className="flex flex-col gap-2 overflow-y-auto overflow-x-clip">
          <AnimatePresence>
            {event.demos.map((demo) => (
              <DemoItem
                key={demo.id}
                demo={demo}
                eventId={event.id}
                onClick={() => showUpsertDemoModal(demo)}
                onClickQR={() => showDemoQRModal(demo)}
                refetchEvent={refetchEvent}
              />
            ))}
            <motion.li
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-row items-center justify-start gap-2"
            >
              <button
                className="rounded-xl bg-blue-200 p-2 font-semibold outline-none transition-all hover:bg-blue-300 focus:outline-none"
                onClick={() => showUpsertDemoModal()}
              >
                ⊕ Demo
              </button>
              <CsvButton
                data={event.demos}
                headers={DEMO_CSV_HEADERS}
                filename="demos.csv"
                onUpload={onUploadDemos}
              />
            </motion.li>
          </AnimatePresence>
        </ul>
      </div>
      <div className="flex w-[300px] flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-bold">Awards</h2>
          <InfoButton
            title="Awards"
            message="Attendees will be able to vote for these awards during the voting phase!"
          />
        </div>
        <ul className="flex flex-col gap-2 overflow-y-auto overflow-x-clip">
          <AnimatePresence>
            {event.awards.map((award) => (
              <AwardItem
                key={award.id}
                award={award}
                onClick={() => showUpsertAwardModal(award)}
                refetchEvent={refetchEvent}
              />
            ))}
            <motion.li
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-row items-center justify-start gap-2"
            >
              <button
                className="rounded-xl bg-blue-200 p-2 font-semibold transition-all hover:bg-blue-300 focus:outline-none"
                onClick={() => showUpsertAwardModal()}
              >
                ⊕ Award
              </button>
              <CsvButton
                data={event.awards}
                headers={AWARD_CSV_HEADERS}
                filename="awards.csv"
                onUpload={onUploadAwards}
              />
            </motion.li>
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
