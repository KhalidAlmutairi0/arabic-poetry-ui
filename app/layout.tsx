import type { Metadata, Viewport } from 'next'
import { Aref_Ruqaa, IBM_Plex_Sans_Arabic, Noto_Naskh_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const arefRuqaa = Aref_Ruqaa({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-aref',
})

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-arabic',
})

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-naskh',
})

export const metadata: Metadata = {
  title: 'قافية · ديوان الشعر العربي',
  description:
    'قافية — منصة الشعر العربي. أكثر من ١٤٣٬٠٠٠ قصيدة لـ ٦٬٨٠٠ شاعر عبر عشرة عصور أدبية، مع شروحات ذكية وبحث دلالي.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#0F0D0A',
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
      className={`${arefRuqaa.variable} ${plexArabic.variable} ${notoNaskh.variable} bg-background`}
    >
      <body className="font-sans antialiased text-foreground min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster position="top-center" theme="dark" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
