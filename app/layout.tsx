import './globals.css';
import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import { AuthProvider } from '@/components/providers/auth-provider';

const lato = Lato({ 
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: 'Chargebyte - Smart Powerbank Rental System',
  description: 'Comprehensive powerbank rental and advertisement management system',
  icons: {
    icon: [
      // Add your favicon files here
      { url: '/images/logo-small.png' },
      { url: '/images/logo-small.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/logo-small.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo-small.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}