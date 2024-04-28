import { type Event } from "@prisma/client";
import Image from "next/image";

export default function DemoSelectionHeader({ event }: { event: Event }) {
  return (
    <header className="flex w-full items-center justify-between bg-gray-100 p-2 text-black">
      <div className="flex flex-row items-center gap-2">
        <Image src="/images/logo.png" alt="logo" width={30} height={30} />
        <h1 className="font-kallisto text-2xl font-bold">{event.name}</h1>
      </div>
      <div className="flex flex-row items-center gap-2"></div>
    </header>
  );
}
