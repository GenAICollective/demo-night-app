"use client";

export function LiveIndicator() {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-2 py-1">
      <div className="relative flex size-2">
        <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <div className="relative inline-flex size-2 rounded-full bg-green-500" />
      </div>
      <span className="text-xs font-medium text-green-500">LIVE</span>
    </div>
  );
}
