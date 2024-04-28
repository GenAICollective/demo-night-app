import { type Award, type Demo } from "@prisma/client";

import { api } from "~/trpc/react";

import { CreateAwardButton } from "./CreateAward";
import { CreateDemoButton } from "./CreateDemo";

export default function PreEventDashboard({
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
  return (
    <div className="flex size-full flex-row gap-2">
      <div className="flex flex-1 flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <h2 className="text-2xl font-bold">Demos</h2>
        <ul className="flex flex-col gap-2 overflow-auto">
          {demos.map((demo) => (
            <DemoItem key={demo.id} demo={demo} refetchEvent={refetchEvent} />
          ))}
          <li>
            <CreateDemoButton eventId={eventId} onCreated={refetchEvent} />
          </li>
        </ul>
      </div>
      <div className="flex w-[300px] flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <h2 className="text-2xl font-bold">Awards</h2>
        <ul className="flex flex-col gap-2 overflow-auto">
          {awards.map((award) => (
            <AwardItem
              key={award.id}
              award={award}
              refetchEvent={refetchEvent}
            />
          ))}
          <li>
            <CreateAwardButton eventId={eventId} onCreated={refetchEvent} />
          </li>
        </ul>
      </div>
    </div>
  );
}

function DemoItem({
  demo,
  refetchEvent,
}: {
  demo: Demo;
  refetchEvent: () => void;
}) {
  const updateMutation = api.demo.update.useMutation();
  const updateIndexMutation = api.demo.updateIndex.useMutation();
  const deleteMutation = api.demo.delete.useMutation();

  return (
    <li className="flex flex-row items-center gap-2">
      <input
        className="flex-1 rounded-lg bg-white p-2 font-medium focus:outline-none"
        type="text"
        value={demo.name}
        onChange={(e) => {
          demo.name = e.target.value;
          updateMutation.mutate({ id: demo.id, name: e.target.value });
        }}
      />
      <input
        className="w-[80px] rounded-lg bg-white p-2 font-medium focus:outline-none"
        type="email"
        value={demo.email}
        onChange={(e) => {
          demo.email = e.target.value;
          updateMutation.mutate({ id: demo.id, email: e.target.value });
        }}
      />
      <input
        className="w-[80px] rounded-lg bg-white p-2 font-medium focus:outline-none"
        type="url"
        value={demo.url}
        onChange={(e) => {
          demo.url = e.target.value;
          updateMutation.mutate({ id: demo.id, url: e.target.value });
        }}
      />
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
    </li>
  );
}

function AwardItem({
  award,
  refetchEvent,
}: {
  award: Award;
  refetchEvent: () => void;
}) {
  const updateMutation = api.award.update.useMutation();
  const updateIndexMutation = api.award.updateIndex.useMutation();
  const deleteMutation = api.award.delete.useMutation();

  return (
    <li className="flex flex-row items-center gap-2">
      <input
        className="flex-1 rounded-lg bg-white p-2 font-medium focus:outline-none"
        type="text"
        value={award.name}
        onChange={(e) => {
          award.name = e.target.value;
          updateMutation.mutate({ id: award.id, name: e.target.value });
        }}
      />
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
    </li>
  );
}
