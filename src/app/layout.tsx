import "./globals.css";
import { Rubik } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./header";

const rubikFont = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "ChessU",
  description: "Chess course platform for chess masters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalLayout = `${rubikFont.className} bg-black text-white`;

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#f59e0b",
          colorText: "black",
          colorBackground: "#eeeeee",
        },
      }}
    >
      <html lang="en">
        <body className={globalLayout}>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
