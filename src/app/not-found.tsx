import Image from "next/image";

import { LinkButton } from "~/components/Button";
import { GaicoConfetti } from "~/components/Confetti";

export default async function NotFoundPage({
  searchParams,
}: {
  searchParams?: { type?: string };
}) {
  let title = "URL not found 🥲";
  let message = "(hang with us!) ";
  if (searchParams?.type === "invalid-secret") {
    title = "Invalid secret 😬";
    message = "You need a valid secret to access this page";
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center px-4 pb-16 text-center font-kallisto text-black">
      <Image
        src="/images/logo.png"
        id="logo"
        alt="logo"
        width={160}
        height={160}
      />
      <h1 className="pt-4 text-center text-2xl font-bold">{title}</h1>
      <p className="text-lg font-semibold italic text-gray-500">{message}</p>
      <LinkButton href="/">Back to home</LinkButton>
      <div className="z-3 pointer-events-none fixed inset-0">
        <GaicoConfetti />
      </div>
    </main>
  );
}
