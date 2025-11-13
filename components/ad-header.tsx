"use client"

import { useEffect, useRef } from "react"

export function AdHeader() {
  const scriptRef = useRef<boolean>(false)

  useEffect(() => {
    if (!scriptRef.current) {
      scriptRef.current = true

      const script = document.createElement("script")
      script.type = "text/javascript"
      script.src = "//www.highperformanceformat.com/adbca21718cb4509133c8bbfdde356f3/invoke.js"
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="w-full h-[60px] flex justify-center items-center overflow-hidden">
        <div className="w-full max-w-[468px] h-[60px]">
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                atOptions = {
                  'key': 'adbca21718cb4509133c8bbfdde356f3',
                  'format': 'iframe',
                  'height': 60,
                  'width': 468,
                  'params': {}
                };
              `,
            }}
          />
        </div>
      </div>
    </header>
  )
}
