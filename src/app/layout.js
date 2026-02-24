import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import ClientHeader from "./components/ClientHeader";
import ClientWrapper from "./components/ClientWrapper";
import Providers from "./components/Providers";
import ClientFooter from "./components/ClientFooter";

export const metadata = {
  title: "MCM",
  description: "MCM",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
      >
        <Providers>
          <ClientWrapper>
            <ClientHeader />
            {children}
            <ClientFooter />
          </ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
