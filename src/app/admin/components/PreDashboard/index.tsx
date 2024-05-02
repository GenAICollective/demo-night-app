import { type Award, type Demo } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";

import { api } from "~/trpc/react";

import { useModal } from "~/components/modal/provider";

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
      <UpsertDemoModal
        eventId={eventId}
        demo={demo}
        onCreated={refetchEvent}
      />,
    );
  };

  const showUpsertAwardModal = (award?: Award) => {
    modal?.show(
      <UpsertAwardModal
        eventId={eventId}
        award={award}
        onCreated={refetchEvent}
      />,
    );
  };

  return (
    <div className="flex size-full flex-row gap-2">
      <div className="flex flex-1 basis-1/2 flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <h2 className="text-2xl font-bold">Demos</h2>
        <ul className="flex flex-col gap-2 overflow-y-auto overflow-x-clip">
          <AnimatePresence>
            {demos.map((demo) => (
              <DemoItem
                key={demo.id}
                demo={demo}
                onClick={() => showUpsertDemoModal(demo)}
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
      <div className="flex basis-1/2 flex-col gap-2 rounded-xl bg-gray-100 p-4">
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

function DemoItem({
  demo,
  onClick,
  refetchEvent,
}: {
  demo: Demo;
  onClick: () => void;
  refetchEvent: () => void;
}) {
  const updateIndexMutation = api.demo.updateIndex.useMutation();
  const deleteMutation = api.demo.delete.useMutation();

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-row items-center gap-2"
    >
      <p className="min-w-[25px] font-bold">{`${demo.index + 1}.`}</p>
      <button
        onClick={onClick}
        className="flex-1 rounded-xl bg-white p-2 text-start font-medium focus:outline-none"
      >
        {demo.name}
      </button>
      <div className="flex flex-row gap-2 font-semibold">
        <button
          onClick={() => {
            updateIndexMutation
              .mutateAsync({
                id: demo.id,
                index: demo.index - 1,
              })
              .then(() => refetchEvent());
          }}
        >
          ↑
        </button>
        <button
          onClick={() => {
            updateIndexMutation
              .mutateAsync({
                id: demo.id,
                index: demo.index + 1,
              })
              .then(() => refetchEvent());
          }}
        >
          ↓
        </button>

        <button
          onClick={() => {
            deleteMutation.mutateAsync(demo.id).then(() => refetchEvent());
          }}
        >
          🗑️
        </button>
      </div>
    </motion.li>
  );
}

function AwardItem({
  award,
  onClick,
  refetchEvent,
}: {
  award: Award;
  onClick: () => void;
  refetchEvent: () => void;
}) {
  const updateIndexMutation = api.award.updateIndex.useMutation();
  const deleteMutation = api.award.delete.useMutation();

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-row items-center gap-2"
    >
      <p className="min-w-[25px] font-bold">{`${award.index + 1}.`}</p>
      <button
        className="flex-1 rounded-xl bg-white p-2 text-start font-medium focus:outline-none"
        onClick={onClick}
      >
        {award.name}
      </button>
      <div className="flex flex-row gap-2 font-semibold">
        <button
          onClick={() => {
            updateIndexMutation
              .mutateAsync({
                id: award.id,
                index: award.index - 1,
              })
              .then(() => refetchEvent());
          }}
        >
          ↑
        </button>
        <button
          onClick={() => {
            updateIndexMutation
              .mutateAsync({
                id: award.id,
                index: award.index + 1,
              })
              .then(() => refetchEvent());
          }}
        >
          ↓
        </button>
        <button
          onClick={() => {
            deleteMutation.mutateAsync(award.id).then(() => refetchEvent());
          }}
        >
          🗑️
        </button>
      </div>
    </motion.li>
  );
}
