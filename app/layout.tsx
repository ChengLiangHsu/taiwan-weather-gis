import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "台灣天氣通 Taiwan Weather GIS - 即時氣象與生活指南",
  description: "結合中央氣象署 (CWA) 開放資料平臺與 GIS 互動地圖的台灣氣象生活儀表板",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f8f9ff] font-sans text-[#0b1c30] antialiased min-h-screen flex flex-col selection:bg-primary-fixed selection:text-[#001d31]">
        {children}
      </body>
    </html>
  );
}
