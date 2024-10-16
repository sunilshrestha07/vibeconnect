
import ClientLayout from "./clientLayout";

export const metadata = {
  title: 'VibeConnect',
  description: 'Connect with your friends who matches your vibe',
  openGraph: {
    title: 'VibeConnect',
    description: 'Connect with your friends who matches your vibe',
    url: 'https://vibeconnect-suneel.vercel.app/login',
    images: [
      {
        url: '/logo.png',  // The image to display
        width: 1200,  // Preferred size for Messenger and Instagram
        height: 630,
        alt: 'vibeconnect image',
      },
    ],
    siteName: 'VibeConnect',  // Name of your website
  },
  twitter: {
    card: '/logo.png',
    title: 'Your Website Title',
    description: 'Your website description',
    images: ['/logo.png'], // Use the same image
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
