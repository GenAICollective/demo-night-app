import localFont from "next/font/local";
import { Toaster } from "sonner";

import { TRPCReactProvider } from "~/trpc/react";

import { ModalProvider } from "~/components/modal/provider";

import "~/styles/globals.css";

export const metadata = {
  title: "Demo Night App",
  description: "Demo Night App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${kallisto.variable} font-sans`}>
      <body>
        <TRPCReactProvider>
          <Toaster position="top-center" />
          <ModalProvider>{children}</ModalProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

const kallisto = localFont({
  src: [
    {
      path: "../../public/fonts/Kallisto/Kallisto Thin.otf",
      weight: "300",
    },
    {
      path: "../../public/fonts/Kallisto/Kallisto Thin Italic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/Kallisto/Kallisto Light.otf",
      weight: "400",
    },
    {
      path: "../../public/fonts/Kallisto/Kallisto Light Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Kallisto/Kallisto Medium.otf",
      weight: "500",
    },
    {
      path: "../../public/fonts/Kallisto/Kallisto Medium Italic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/Kallisto/Kallisto Bold.otf",
      weight: "600",
    },
    {
      path: "../../public/fonts/Kallisto/Kallisto Bold Italic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/Kallisto/Kallisto Heavy.otf",
      weight: "700",
    },
    {
      path: "../../public/fonts/Kallisto/Kallisto Heavy Italic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-kallisto",
});
