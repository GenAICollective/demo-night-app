import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function AdminEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
