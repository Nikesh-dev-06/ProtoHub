import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { AIMaintenanceProvider } from '@/lib/ai-maintenance-context';
import { AIMaintenanceModal } from '@/components/ai/ai-maintenance-modal';
import { Toaster } from 'sonner';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PROTOFIX by Albedrix Systems — Embedded Systems Development Platform',
  description:
    'AI-assisted platform for Arduino, ESP32, firmware debugging, component compatibility, and electronics troubleshooting.',
  keywords: 'Arduino, ESP32, firmware debugging, embedded systems, electronics, PROTOFIX, Albedrix',
  openGraph: {
    title: 'PROTOFIX by Albedrix Systems',
    description:
      'AI-assisted embedded systems development platform for Arduino, ESP32, firmware debugging and electronics troubleshooting.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <AuthProvider>
              <AIMaintenanceProvider>
                {children}
                <AIMaintenanceModal />
              </AIMaintenanceProvider>
            </AuthProvider>
          </QueryProvider>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
