import Image from "next/image";

import { type CurrentEvent } from "~/server/api/routers/event";

export default function EventHeader({
  currentEvent,
}: {
  currentEvent: CurrentEvent;
}) {
  return (
    <header className="flex w-full items-center justify-between bg-gray-100 p-2 text-black">
      <div className="flex flex-row items-center gap-2">
        <Image src="/images/logo.png" alt="logo" width={30} height={30} />
        <h1 className="font-kallisto text-2xl font-bold">
          {currentEvent.name}
        </h1>
      </div>
      <div className="flex flex-row items-center gap-2"></div>
    </header>
  );
}
