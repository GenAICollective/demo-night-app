import Image from "next/image";

export default function EventHeader({
  eventName,
  demoName,
}: {
  eventName: string;
  demoName?: string;
}) {
  return (
    <header className="fixed left-0 right-0 z-20 flex h-14 w-full select-none flex-col items-center bg-white/60 text-black backdrop-blur">
      <div className="flex w-full max-w-xl flex-1 flex-col items-center justify-between">
        <div className="flex w-full flex-1 flex-row items-center justify-between px-3">
          <Image
            id="logo"
            src="/images/logo.png"
            alt="logo"
            width={36}
            height={36}
          />
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
          <div className="flex aspect-square w-9 items-center justify-center" />
        </div>
      </div>
    </header>
  );
}
