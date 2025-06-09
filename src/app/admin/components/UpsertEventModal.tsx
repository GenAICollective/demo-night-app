"use client";

import { type Event } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import { DeleteEventButton } from "./DeleteEvent";

const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 5).toUpperCase();
};

export function UpsertEventModal({
  event,
  onSubmit,
  onDeleted,
  open,
  onOpenChange,
}: {
  event?: Event;
  onSubmit: (event: Event) => void;
  onDeleted: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [defaultId] = useState(() => generateRandomId());
  const upsertMutation = api.event.upsert.useMutation();
  const { register, handleSubmit } = useForm({
    values: {
      name: event?.name ?? "",
      id: event?.id ?? defaultId,
      date: (event?.date ?? new Date()).toISOString().substring(0, 10),
      url: event?.url ?? "",
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit" : "Create New"} Event</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => {
            upsertMutation
              .mutateAsync({
                originalId: event?.id,
                id: data.id,
                name: data.name,
                date: new Date(data.date),
                url: data.url,
              })
              .then((result) => {
                onOpenChange(false);
                toast.success(
                  `Successfully ${event ? "updated" : "created"} event!`,
                );
                onSubmit(result);
              })
              .catch((error) => {
                toast.error(
                  `Failed to ${event ? "update" : "create"} event: ${error.message}`,
                );
              });
          })}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1">
            <span className="font-semibold">Name</span>
            <input
              type="text"
              {...register("name", { required: true })}
              className="rounded-xl border border-gray-200 p-2"
              placeholder="SF Demo Night 🚀"
              autoComplete="off"
              autoFocus
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-semibold">ID</span>
            <input
              type="text"
              {...register("id")}
              className="rounded-xl border border-gray-200 p-2 font-mono"
              autoComplete="off"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-semibold">Date</span>
            <input
              type="date"
              {...register("date", { valueAsDate: true })}
              className="rounded-xl border border-gray-200 p-2"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-semibold">URL</span>
            <input
              type="url"
              {...register("url")}
              className="rounded-xl border border-gray-200 p-2"
              autoComplete="off"
              placeholder="https://lu.ma/demo-night"
              required
            />
          </label>
          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={upsertMutation.isPending}
            >
              {event ? "Update Event" : "Create Event"}
            </Button>
            {event && (
              <DeleteEventButton eventId={event.id} onDeleted={onDeleted} />
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
