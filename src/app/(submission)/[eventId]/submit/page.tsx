import Image from "next/image";
import { redirect } from "next/navigation";

import { type CompleteEvent } from "~/server/api/routers/event";
import { api } from "~/trpc/server";

import SubmitDemo from "./components/SubmitDemo";
import { LinkButton } from "~/components/Button";
import { GaicoConfetti } from "~/components/Confetti";
import EventHeader from "~/components/EventHeader";

enum SubmissionDeadline {
  SATURDAY_BEFORE_EVENT = 1,
  DAY_OF_EVENT = 2,
}

const DEADLINE: SubmissionDeadline = SubmissionDeadline.DAY_OF_EVENT;

export default async function SubmitDemoPage({
  params,
  searchParams,
}: {
  params: { eventId: string };
  searchParams?: { success?: boolean };
}) {
  const event = await api.event.get(params.eventId);

  if (!event) {
    redirect("/404");
  }

  if (searchParams?.success) {
    return <SubmitDemoMessagePage success={true} event={event} />;
  }

  const eventDate = new Date(event.date);
  if (DEADLINE === SubmissionDeadline.SATURDAY_BEFORE_EVENT) {
    const saturdayBeforeEvent = new Date(eventDate);
    saturdayBeforeEvent.setDate(eventDate.getDate() - eventDate.getDay() - 1); // Get the previous Saturday
    saturdayBeforeEvent.setHours(23, 59, 59, 999); // Set to 11:59:59 PM

    if (new Date() > saturdayBeforeEvent) {
      return <SubmitDemoMessagePage success={false} event={event} />;
    }
  } else if (DEADLINE === SubmissionDeadline.DAY_OF_EVENT) {
    if (new Date() > eventDate) {
      return <SubmitDemoMessagePage success={false} event={event} />;
    }
  }

  return (
    <main className="m-auto flex size-full max-w-4xl flex-col text-black">
      <EventHeader eventName={event.name} />
      <SubmitDemo event={event} />
    </main>
  );
}

function SubmitDemoMessagePage({
  success,
  event,
}: {
  success: boolean;
  event: CompleteEvent;
}) {
  const title = success ? "Submission successful! 🥳" : "Submissions closed 😬";
  const message = success
    ? "Your submission has been received. Expect to hear from us a few days before the event!"
    : "Oof. Sorry, but the buzzer has already sounded!";

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
      <LinkButton href={event.url}>Back to event</LinkButton>
      <div className="z-3 pointer-events-none fixed inset-0">
        <GaicoConfetti />
      </div>
    </main>
  );
}
