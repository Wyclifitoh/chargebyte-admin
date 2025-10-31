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