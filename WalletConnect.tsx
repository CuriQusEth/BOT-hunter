import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ResponseLogger } from "@/components/response-logger";
import { cookies } from "next/headers";
import FarcasterWrapper from "@/components/FarcasterWrapper";
import { Web3Provider } from "@/components/Web3Provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestId = cookies().get("x-request-id")?.value;

  return (
        <html lang="en">
          <head>
            {requestId && <meta name="x-request-id" content={requestId} />}
          </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Web3Provider>
              <FarcasterWrapper>
                {children}
              </FarcasterWrapper>
            </Web3Provider>
            <ResponseLogger />
          </body>
        </html>
      );
}

export const metadata: Metadata = {
        title: "Bot Hunter",
        description: "Join Bot Hunter, a fast-paced game where you eliminate spam bots in the Farcaster network. Test your reflexes and protect the feed from spam attacks. Fast, addictive, and humorous gameplay awaits!",
        other: { 
          "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_c11c84a0-de63-44a7-ab1b-5b87f4cddd76-FZbCAVFayzvfu6xypDk1eI9Gq0Z6ci","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"Bot Hunter","url":"https://highway-total-368.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ),
          "base:app_id": "68f40c278c4fe3f562003d93"
        }
    };
