import { getCloudflareContext } from "@opennextjs/cloudflare"
import { subDays, subHours, subWeeks } from "date-fns"
import { and, eq, gt } from "drizzle-orm"
import { NextResponse } from "next/server"
import { StatusCodes } from "http-status-codes"
import { z } from "zod"
import { useDrizzle } from "@solstatus/common/db"
import { UptimeChecksTable } from "@solstatus/common/db/schema"
import type { uptimeChecksSelectSchema } from "@solstatus/common/db"
import { createRoute } from "@/lib/api-utils"
import { idStringParamsSchema } from "@/lib/route-schemas"

const querySchema = z.object({
  range: z.enum(["1h", "1d", "7d"]).default("1h"),
})

/**
 * GET /api/endpoint-monitors/[id]/uptime/range
 *
 * Retrieves uptime data for a specific endpointMonitor within a given time range.
 *
 * @params {string} id - EndpointMonitor ID
 * @query {string} range - Time range ('1h', '1d', '7d', default: '1h')
 * @returns {Promise<NextResponse>} JSON response with uptime data
 * @throws {NextResponse} 500 Internal Server Error on database errors
 */
export const GET = createRoute
  .params(idStringParamsSchema)
  .query(querySchema)
  .handler(async (_request, context) => {
    const { env } = getCloudflareContext()
    const db = useDrizzle(env.DB)
    const { id: endpointMonitorId } = context.params
    const { range } = context.query

    const now = new Date()
    let startTime: Date
    switch (range) {
      case "1d":
        startTime = subDays(now, 1)
        break
      case "7d":
        startTime = subWeeks(now, 1)
        break
      default:
        startTime = subHours(now, 1)
        break
    }

    try {
      const results: z.infer<typeof uptimeChecksSelectSchema>[] = await db
        .select()
        .from(UptimeChecksTable)
        .where(
          and(
            eq(UptimeChecksTable.endpointMonitorId, endpointMonitorId),
            gt(UptimeChecksTable.timestamp, startTime),
          ),
        )
        .orderBy(UptimeChecksTable.timestamp)

      console.log(
        `Uptime checks in range [${range}] for endpointMonitor [${endpointMonitorId}]: ${results.length}`,
      )
      return NextResponse.json(results, { status: StatusCodes.OK })
    } catch (error) {
      console.error("Error fetching uptime data: ", error)
      return NextResponse.json(
        { error: "Failed to fetch uptime data" },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      )
    }
  })
