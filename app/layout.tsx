import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Met Gala AI',
  description:
    'An AI stylist that reads any company and dresses it for the Met Gala. Built by Yamini.',
  openGraph: {
    title: 'Met Gala AI',
    description:
      'What would your company wear to the Met Gala? An AI stylist for the runway.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Met Gala AI',
    description:
      'What would your company wear to the Met Gala? An AI stylist for the runway.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bone text-ink">{children}</body>
    </html>
  );
}
