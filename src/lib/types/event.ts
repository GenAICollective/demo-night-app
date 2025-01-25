import { type Event } from "@prisma/client";

import { type Partner } from "./partner";

export type EventWithPartners = Omit<Event, "partners"> & {
  partners: Partner[];
};
