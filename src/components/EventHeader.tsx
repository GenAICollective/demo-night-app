import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { env } from "~/env";

export default function EventHeader({
  eventName,
  demoName,
  eventId,
  isAdmin,
}: {
  eventName: string;
  demoName?: string;
  eventId?: string;
  isAdmin?: boolean;
}) {
  return (
    <header className="fixed left-0 right-0 z-20 flex h-14 w-full select-none flex-col items-center bg-white/60 text-black backdrop-blur">
      <div className="flex w-full max-w-xl flex-1 flex-col items-center justify-between">
        <div className="flex w-full flex-1 flex-row items-center justify-between px-3">
          <Link
            href={env.NEXT_PUBLIC_BASE_URL}
            className="-ml-1 flex items-center p-1"
            target="_blank"
          >
            <Image
              id="logo"
              src="/images/logo.png"
              alt="logo"
              width={36}
              height={36}
            />
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="mt-1 line-clamp-1 text-ellipsis px-1 font-kallisto text-xl font-bold tracking-tight">
              {demoName ? `${demoName} Demo Recap` : eventName}
            </h1>
            {demoName && (
              <h2 className="-mt-1 line-clamp-1 text-ellipsis px-1 font-kallisto text-sm font-bold tracking-tight">
                {eventName}
              </h2>
            )}
          </div>
          <div className="flex aspect-square w-9 items-center justify-center">
            {isAdmin && eventId && (
              <Link
                href={`/admin/${eventId}`}
                className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 p-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
              >
                Admin
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
