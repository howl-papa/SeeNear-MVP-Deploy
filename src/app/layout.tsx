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
  title: "SeeNear - 이웃과 함께하는 따뜻한 돌봄 서비스",
  description: "SeeNear는 선생님들의 경험과 이웃의 필요를 연결하는 AI 기반 돌봄 매칭 플랫폼입니다. 반려동물 돌봄, 가사 지원, 환경 관리 등 다양한 일자리를 제공합니다.",
  keywords: ["돌봄 서비스", "이웃 매칭", "시니어 일자리", "반려동물 돌봄", "가사 지원", "AI 매칭"],
  authors: [{ name: "Yongrak Park" }],
  creator: "Yongrak Park",
  publisher: "SeeNear",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://see-near-mvp-deploy.vercel.app",
    siteName: "SeeNear",
    title: "SeeNear - 이웃과 함께하는 따뜻한 돌봄 서비스",
    description: "선생님들의 경험과 이웃의 필요를 연결하는 AI 기반 돌봄 매칭 플랫폼",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SeeNear - 이웃과 함께하는 따뜻한 돌봄 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SeeNear - 이웃과 함께하는 따뜻한 돌봄 서비스",
    description: "선생님들의 경험과 이웃의 필요를 연결하는 AI 기반 돌봄 매칭 플랫폼",
    images: ["/og-image.png"],
    creator: "@seenear",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
