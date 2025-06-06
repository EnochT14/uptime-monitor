import { getCloudflareContext } from "@opennextjs/cloudflare"
import { useDrizzle } from "@solstatus/common/db"
import { UptimeChecksTable } from "@solstatus/common/db/schema"
import { and, desc, eq, gt } from "drizzle-orm"
import { StatusCodes } from "http-status-codes"
import { NextResponse } from "next/server"
import { createRoute } from "@/lib/api-utils"
import { idStringParamsSchema, timeRangeQuerySchema } from "@/lib/route-schemas"
import { getTimeRangeInMinutes } from "@/lib/uptime-utils"
import type { TimeRange } from "@/types/endpointMonitor"

/**
 * GET /api/endpoint-monitors/[id]/checks
 *
 * Retrieves uptime checks for a specific endpointMonitor within a given time range.
 *
 * @params {string} id - EndpointMonitor ID
 * @query {TimeRange} timeRange - Time range to filter results
 * @returns {Promise<NextResponse>} JSON response with uptime checks
 * @throws {NextResponse} 500 Internal Server Error on database errors
 */
export const GET = createRoute
  .params(idStringParamsSchema)
  .query(timeRangeQuerySchema)
  .handler(async (_request, context) => {
    const { env } = getCloudflareContext()
    const db = useDrizzle(env.DB)
    const { timeRange } = context.query

    try {
      // Calculate start time based on time range
      const startTime = new Date()
      startTime.setMinutes(
        startTime.getMinutes() - getTimeRangeInMinutes(timeRange as TimeRange),
      )

      const results = await db
        .select()
        .from(UptimeChecksTable)
        .where(
          and(
            eq(UptimeChecksTable.endpointMonitorId, context.params.id),
            gt(UptimeChecksTable.timestamp, startTime),
          ),
        )
        .orderBy(desc(UptimeChecksTable.timestamp))

      return NextResponse.json(results, { status: StatusCodes.OK })
    } catch (error) {
      console.error("Error fetching uptime checks: ", error)
      return NextResponse.json(
        { error: "Failed to fetch uptime checks" },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  })
