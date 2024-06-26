"use client";

import { type Demo } from "@prisma/client";
import QRCode from "react-qr-code";

import Button from "~/components/Button";
import { useModal } from "~/components/modal/provider";

export function DemoQRModal({ demo }: { demo: Demo }) {
  const modal = useModal();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        modal?.hide();
      }}
      className="flex flex-col items-center gap-4"
    >
      <h1 className="text-center text-xl font-bold">Edit Demo</h1>
      <QRCode
        size={150}
        value={`${window.location.origin}/${demo.eventId}/${demo.id}?secret=${demo.secret}`}
      />
      <Button pending={false}>Done</Button>
    </form>
  );
}
