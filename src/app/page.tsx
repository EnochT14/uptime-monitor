"use client"

import { useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { useHeaderContext } from "@/context/header-context"

export default function Page() {
  const { setHeaderContent } = useHeaderContext()
  useEffect(() => {
    setHeaderContent(
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Updating every 60 seconds
        </p>

        <div className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-green-500" />
        </div>
      </div>,
    )
  }, [setHeaderContent])

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <SectionCards />
        {/* <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div> */}
        <DataTable />
      </div>
    </div>
  )
}
