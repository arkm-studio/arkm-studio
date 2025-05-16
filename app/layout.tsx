import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { inter } from "./_lib/fonts";
import GoogleAnalytics from "./_components/GoogleAnalytics";
import "@/app/_styles/globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pablokaram.com"),
  title: {
    template: "%s - Pablo Karam",
    default: "Pablo Karam",
  },
  authors: [{ name: "Pablo Karam" }],
  creator: "Pablo Karam",
  publisher: "Pablo Karam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/mke4enw.css"
          // as="style"
        />
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
