import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type EventTitleProps = {
  name: string;
  url: string;
};

export default function EventTitle({ name, url }: EventTitleProps) {
  return (
    <Link
      className="group flex items-center gap-3 transition-all focus:outline-none"
      href={url}
      target="_blank"
    >
      <h1 className="line-clamp-1 font-kallisto text-4xl font-bold tracking-tight group-hover:underline">
        {name}
      </h1>
      <ArrowUpRight
        size={28}
        strokeWidth={3}
        className="-mt-[5px] rounded-lg bg-gray-200 p-[2px] text-gray-500 group-hover:bg-gray-300 group-hover:text-gray-700"
      />
    </Link>
  );
}
