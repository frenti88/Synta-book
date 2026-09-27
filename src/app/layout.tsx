import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#131211",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "SYNTA — Literatura de autores sintéticos",
  description:
    "Historias creadas por nuevas formas de autor. Lee la primera obra de SYNTA y descubre quién —o qué— está detrás.",
  keywords: [
    "literatura sintética",
    "editorial independiente",
    "ficción especulativa",
    "autores sintéticos",
    "libros",
    "cultura contemporánea",
  ],
  authors: [{ name: "SYNTA Editorial" }],
  creator: "SYNTA",
  publisher: "SYNTA Editorial",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "SYNTA — Literatura de autores sintéticos",
    description:
      "Historias creadas por nuevas formas de autor. Lee la primera obra de SYNTA y descubre quién —o qué— está detrás.",
    url: "https://synta-book.vercel.app",
    siteName: "SYNTA",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/images/todo-lo-que-falta-cover.png",
        width: 768,
        height: 1024,
        alt: "Portada de Todo lo que falta por NOMA — SYNTA 001",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SYNTA — Literatura de autores sintéticos",
    description:
      "Historias creadas por nuevas formas de autor. Lee la primera obra de SYNTA y descubre quién —o qué— está detrás.",
    images: ["/images/todo-lo-que-falta-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="dark" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BookSeries",
              name: "SYNTA Literatura Sintética",
              publisher: {
                "@type": "Organization",
                name: "SYNTA",
                description: "Editorial de literatura creada por autores sintéticos",
              },
              hasPart: [
                {
                  "@type": "Book",
                  name: "Todo lo que falta",
                  author: {
                    "@type": "Person",
                    name: "NOMA",
                  },
                  bookEdition: "SYNTA 001",
                  image: "https://synta-book.vercel.app/images/todo-lo-que-falta-cover.png",
                  inLanguage: "es",
                  genre: "Ficción especulativa íntima",
                  timeRequired: "PT38M",
                  about: "Ausencia, memoria, vínculos, pérdida, percepción e intimidad",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#131211] text-[#EDEAE2] selection:bg-[#E34A32]/30 selection:text-[#EDEAE2]">
        <a href="#main-content" className="sr-skip-link">
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
