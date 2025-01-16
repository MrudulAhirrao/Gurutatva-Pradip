"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { supabase } from "@/lib/supabase"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  user: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Component() {
  const [chartData, setChartData] = useState<
    { month: string; user: number }[]
  >([
    { month: "January", user: 0 },
    { month: "February", user: 0 },
    { month: "March", user: 0 },
    { month: "April", user: 0 },
    { month: "May", user: 0 },
    { month: "June", user: 0 },
    { month: "July", user: 0 },
    { month: "August", user: 0 },
    { month: "September", user: 0 },
    { month: "October", user: 0 },
    { month: "November", user: 0 },
    { month: "December", user: 0 },
  ])

  useEffect(() => {
    const fetchUserRegistrations = async () => {
      try {
        // Fetch all users from the `users` table, including `created_at`
        const { data: users, error } = await supabase
          .from("users")
          .select("id, created_at")

        if (error) {
          throw error
        }

        // Aggregate user registrations by month
        const monthlyCounts = users.reduce((acc, user) => {
          const registrationDate = new Date(user.created_at)
          const month = registrationDate.toLocaleString("default", { month: "long" })
          acc[month] = (acc[month] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        // Update chart data with the aggregated counts
        const updatedChartData = chartData.map((item) => ({
          ...item,
          user: monthlyCounts[item.month] || 0,
        }))

        setChartData(updatedChartData)
      } catch (error) {
        console.error("Error fetching user registrations:", error)
      }
    }

    fetchUserRegistrations()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Users</CardTitle>
        <CardDescription>January - December 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="user" fill="hsl(var(--chart-3))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total registered in the last 12 months
        </div>
      </CardFooter>
    </Card>
  )
}