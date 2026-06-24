import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "지구최강 - 지구과학 쌈싸먹기",
  description: "지구과학을 가장 쉽고 재미있게 배우는 지구최강 교육용 서비스",
  keywords: ["지구과학", "지구최강", "지구과학쌈싸먹기", "교육용 웹서비스", "과학 학습"],
  authors: [{ name: "지구최강 개발팀" }],
  openGraph: {
    title: "지구최강 - 지구과학 쌈싸먹기",
    description: "지구과학을 가장 쉽고 재미있게 배우는 지구최강 교육용 서비스",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
