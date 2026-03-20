import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QueueEase | Real-time Digital Queue Management System",
  description: "Ditch the lines and empower your customers with digital token management. Real-time updates, no app required. The ultimate digital waitlist software for businesses.",
  keywords: ["queue management", "digital waitlist", "virtual queue", "restaurant waitlist", "clinic queue system", "queue software"],
  authors: [{ name: "QueueEase" }],
  openGraph: {
    title: "QueueEase | Real-time Digital Queue Management",
    description: "The ultimate zero-friction waiting line manager. No apps to download. No hardware to buy.",
    url: "https://queue-ease-umber.vercel.app",
    siteName: "QueueEase",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QueueEase | Wait List Software",
    description: "The ultimate zero-friction waiting line manager.",
    images: ["/logo.png"],
  },
  verification: {
    google: "23CdBJkd0MUDCmPcSybd-31YjPRzHY9VJxg1WrOm5zM",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
  },
};

import { AuthProvider } from "@/context/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
