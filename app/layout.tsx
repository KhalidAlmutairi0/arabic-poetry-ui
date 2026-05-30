import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans_Arabic, Noto_Naskh_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

// Primary UI font - Modern, clean Arabic
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans-arabic',
  display: 'swap',
})

// Poetry display font - Traditional, elegant Naskh
const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-naskh-arabic',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ديوان | Diwan - Arabic Poetry Platform',
  description: 'اكتشف جمال الشعر العربي - Discover the beauty of Arabic poetry. Search, explore, and understand verses from the greatest Arabic poets.',
  keywords: ['Arabic poetry', 'الشعر العربي', 'ديوان', 'قصائد', 'شعراء', 'أدب عربي'],
  authors: [{ name: 'Diwan' }],
  creator: 'Diwan',
  openGraph: {
    title: 'ديوان | Diwan - Arabic Poetry Platform',
    description: 'اكتشف جمال الشعر العربي - Discover the beauty of Arabic poetry',
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ديوان | Diwan',
    description: 'اكتشف جمال الشعر العربي',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f5f0' },
    { media: '(prefers-color-scheme: dark)', color: '#2a2520' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmPlexSansArabic.variable} ${notoNaskhArabic.variable} bg-background`}
      suppressHydrationWarning
      style={{ scrollBehavior: "smooth" }}
    >
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
