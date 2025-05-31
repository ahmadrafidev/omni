import { Geist } from "next/font/google"
import { ThemeProvider } from "./components/theme-provider"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
})

export const metadata = {
  title: "Omni",
  description: "A responsive layout testing tool",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
