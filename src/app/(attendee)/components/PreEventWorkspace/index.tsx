import { type Demo } from "@prisma/client";

export default function PreEventWorkspace({ demos }: { demos: Demo[] }) {
  return <div className="flex flex-col gap-2"></div>;
}
