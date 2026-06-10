import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import VisitorTracker from "./components/VisitorTracker";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne  = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["700","800"] });


  

export const metadata = {
  title: "Dharma Web Services | Premium Website Development",
  metadataBase: new URL("https://dharmawebservice.in"),
  description: "Premium, performance-first websites for startups & businesses. From ₹2499. Built to convert.",
  keywords: "web development, website design, Hyderabad, affordable, premium, Next.js, DWS",
  icons: {
    icon: "/favicon.png",
    apple: "/dws-logo-dark.png",
  },
  openGraph: {
    title: "Dharma Web Services",
    description: "Premium websites that convert. Built in India.",
    url: "https://dws.monster",
    siteName: "DWS",
    type: "website",
    images: [{ url: "/dws-logo-dark.png", width: 1024, height: 1024 }],
  },
  twitter: {
    card: "summary",
    title: "Dharma Web Services",
    description: "Premium websites that convert.",
    images: ["/dws-logo-dark.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${syne.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* Prevent FOUC: immediately read stored theme */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){var t=localStorage.getItem('dws-theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();`
        }} />
      </head>
      <body className={`font-(--font-inter) antialiased overflow-x-hidden`}>
        <ThemeProvider>
          <VisitorTracker />
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
