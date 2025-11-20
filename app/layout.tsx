import "./globals.css"
import { Suspense } from "react"
import LoadingBar from "./LoadingBar" // Assuming LoadingBar is a component in the same directory
import SearchHeader from "./SearchHeader" // Assuming SearchHeader is a component in the same directory

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LoadingBar />
        <Suspense fallback={<div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm h-32 animate-pulse" />}>
          <SearchHeader />
        </Suspense>
        {children}
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
