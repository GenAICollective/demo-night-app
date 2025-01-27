import { cn } from "../lib/utils";
import Image from "next/image";
import React from "react";
import { type ReactNode } from "react";

export default function Logos({
  size,
  className,
}: {
  size?: number;
  className?: string;
}): ReactNode {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center gap-0",
        className,
      )}
    >
      <Image
        src="/images/logo.png"
        id="logo"
        alt="logo"
        width={size}
        height={size}
        className="logo"
      />
      <Image
        src="/images/genai-collective.png"
        id="logo"
        alt="logo"
        width={size}
        height={size}
        className="logo"
      />
      <Image
        src="/images/produnt-hunt.png"
        id="logo"
        alt="logo"
        width={size}
        height={size}
        className="logo"
      />
    </div>
  );
}
