"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"
import { ChartContainer } from "./chart"

export const description = "A pie chart with no separator"

const chartData = [
  { browser: "Chrome", visitors: 275, fill: "#5A37F1" },
  { browser: "Safari", visitors: 200, fill: "#34C759" },
  { browser: "Firefox", visitors: 187, fill: "#FF9500" },
  { browser: "Edge", visitors: 173, fill: "#FF2D55" },
  { browser: "Other", visitors: 90, fill: "#5856D6" },
]

export function ChartPieSeparatorNone() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Separator None</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {/* ✅ Chart container with ResponsiveContainer */}
        <ChartContainer className="mx-auto aspect-square max-h-[250px]">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              {/* ✅ Use Recharts Tooltip instead of broken custom one */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                  border: "1px solid #eee",
                  padding: "8px",
                  fontSize: "12px",
                }}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
