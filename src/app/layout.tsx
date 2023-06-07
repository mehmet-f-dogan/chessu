import "./globals.css";
import { Rubik } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/app/components/header";

const rubikFont = Rubik({
  subsets: ["latin"],
});

export const metadata = {
  title: "ChessU",
  description: "Chess course platform for chess masters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalLayout = `${rubikFont.className} bg-black text-white flex flex-col min-h-screen min-w-screen justify-start`;

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
          <div className="flex flex-grow flex-col md:px-8 md:pb-8">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
