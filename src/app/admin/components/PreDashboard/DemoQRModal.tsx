"use client";

import QRCode from "react-qr-code";

import SubmitButton from "~/components/SubmitButton";
import { useModal } from "~/components/modal/provider";

export function DemoQRModal({
  eventId,
  demoId,
}: {
  eventId: string;
  demoId: string;
}) {
  const modal = useModal();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        modal?.hide();
      }}
      className="flex flex-col items-center gap-4"
    >
      <h1 className="text-center text-xl font-bold">Demo QR Code</h1>
      <QRCode
        size={150}
        value={`${window.location.origin}/${eventId}/${demoId}`}
      />
      <SubmitButton title="Done" pending={false} />
    </form>
  );
}
