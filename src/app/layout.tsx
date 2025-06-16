import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const geistMono = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Country Explorer",
  description: "Explore countries and their information",
  icons: {
    icon: "/new-logo-search.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          limit={1}
          pauseOnFocusLoss={true}
          draggable
          pauseOnHover
          theme="dark"
        />
      </body>
    </html>
  );
}
