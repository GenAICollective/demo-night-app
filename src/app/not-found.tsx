import Image from "next/image";
import Link from "next/link";

export default async function NotFoundPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center pb-16 font-kallisto text-black">
      <Image src="/images/logo.png" alt="logo" width={160} height={160} />
      <h1 className="pt-4 text-center text-2xl font-semibold">
        URL not found 🥲
      </h1>
      <p className="text-lg font-semibold italic">(hang with us!)</p>
      <Link
        className="mt-4 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-xl hover:bg-orange-600"
        href="/"
      >
        Back to home
      </Link>
    </main>
  );
}
