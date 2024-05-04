import { type Award, type Demo } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";

import { useModal } from "~/components/modal/provider";

import { AwardItem } from "./AwardItem";
import { DemoItem } from "./DemoItem";
import { DemoQRModal } from "./DemoQRModal";
import { UpsertAwardModal } from "./UpsertAwardModal";
import { UpsertDemoModal } from "./UpsertDemoModal";

export default function PreDashboard({
  eventId,
  demos,
  awards,
  refetchEvent,
}: {
  eventId: string;
  demos: Demo[];
  awards: Award[];
  refetchEvent: () => void;
}) {
  const modal = useModal();

  const showUpsertDemoModal = (demo?: Demo) => {
    modal?.show(
      <UpsertDemoModal eventId={eventId} demo={demo} onSubmit={refetchEvent} />,
    );
  };

  const showUpsertAwardModal = (award?: Award) => {
    modal?.show(
      <UpsertAwardModal
        eventId={eventId}
        award={award}
        onSubmit={refetchEvent}
      />,
    );
  };

  const showDemoQRModal = (demo: Demo) => {
    modal?.show(<DemoQRModal eventId={eventId} demoId={demo.id} />);
  };

  return (
    <div className="flex size-full flex-row gap-2">
      <div className="flex flex-1 flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <h2 className="text-2xl font-bold">Demos</h2>
        <ul className="flex flex-col gap-2 overflow-y-auto overflow-x-clip">
          <AnimatePresence>
            {demos.map((demo) => (
              <DemoItem
                key={demo.id}
                demo={demo}
                eventId={eventId}
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
            >
              <button
                className="rounded-xl bg-blue-200 p-2 font-semibold transition-all hover:bg-blue-300 focus:outline-none"
                onClick={() => showUpsertDemoModal()}
              >
                ⊕ Demo
              </button>
            </motion.li>
          </AnimatePresence>
        </ul>
      </div>
      <div className="flex w-[300px] flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <h2 className="text-2xl font-bold">Awards</h2>
        <ul className="flex flex-col gap-2 overflow-y-auto overflow-x-clip">
          <AnimatePresence>
            {awards.map((award) => (
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
            >
              <button
                className="rounded-xl bg-blue-200 p-2 font-semibold transition-all hover:bg-blue-300 focus:outline-none"
                onClick={() => showUpsertAwardModal()}
              >
                ⊕ Award
              </button>
            </motion.li>
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
