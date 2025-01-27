import LoadingDots from "./LoadingDots";

export default function LoadingScreen() {
  return (
    <div className="flex w-full flex-1 animate-pulse flex-col items-center justify-center gap-2 py-16 font-kallisto text-black">
      <h1 className="pt-4 text-center text-2xl font-bold">Loading Demos!</h1>
      <p className="text-lg font-semibold italic text-gray-500">
        (hold tight!)
      </p>
      <LoadingDots />
    </div>
  );
}
