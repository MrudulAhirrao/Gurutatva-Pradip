"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
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
  users: {
    label: "Users",
  },
  january: {
    label: "January",
    color: "hsl(var(--chart-1))",
  },
  february: {
    label: "February",
    color: "hsl(var(--chart-2))",
  },
  march: {
    label: "March",
    color: "hsl(var(--chart-3))",
  },
  april: {
    label: "April",
    color: "hsl(var(--chart-4))",
  },
  may: {
    label: "May",
    color: "hsl(var(--chart-5))",
  },
  june: {
    label: "June",
    color: "hsl(var(--chart-6))",
  },
  july: {
    label: "July",
    color: "hsl(var(--chart-7))",
  },
  august: {
    label: "August",
    color: "hsl(var(--chart-8))",
  },
  september: {
    label: "September",
    color: "hsl(var(--chart-9))",
  },
  october: {
    label: "October",
    color: "hsl(var(--chart-10))",
  },
  november: {
    label: "November",
    color: "hsl(var(--chart-11))",
  },
  december: {
    label: "December",
    color: "hsl(var(--chart-12))",
  },
} satisfies ChartConfig

export function Components() {
  const [chartData, setChartData] = React.useState<
    { months: string; users: number; fill: string }[]
  >([
    { months: "January", users: 0, fill: "var(--color-january)" },
    { months: "February", users: 0, fill: "var(--color-february)" },
    { months: "March", users: 0, fill: "var(--color-march)" },
    { months: "April", users: 0, fill: "var(--color-april)" },
    { months: "May", users: 0, fill: "var(--color-may)" },
    { months: "June", users: 0, fill: "var(--color-june)" },
    { months: "July", users: 0, fill: "var(--color-july)" },
    { months: "August", users: 0, fill: "var(--color-august)" },
    { months: "September", users: 0, fill: "var(--color-september)" },
    { months: "October", users: 0, fill: "var(--color-october)" },
    { months: "November", users: 0, fill: "var(--color-november)" },
    { months: "December", users: 0, fill: "var(--color-december)" },
  ])

  const [totalUsers, setTotalUsers] = React.useState(0)

  React.useEffect(() => {
    const fetchUserData = async () => {
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
        const updatedChartData
        = chartData.map((item) => ({
          months: item.months,
          users: monthlyCounts[item.months] || 0,
          fill: item.fill,
        }))

        setChartData(updatedChartData)
        setTotalUsers(users.length)
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>Monthly User Distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="months"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalUsers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Users
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total users for the last 12 months
        </div>
      </CardFooter>
    </Card>
  )
}