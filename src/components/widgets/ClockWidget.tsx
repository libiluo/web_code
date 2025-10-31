import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

export function ClockWidget() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours().toString().padStart(2, "0")
  const minutes = time.getMinutes().toString().padStart(2, "0")
  const seconds = time.getSeconds().toString().padStart(2, "0")
  const weekday = time.toLocaleDateString("zh-CN", { weekday: "long" })
  const date = time.toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all">
      <div className="space-y-2">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold tabular-nums tracking-tight">
            {hours}:{minutes}
          </span>
          <span className="text-2xl font-medium text-muted-foreground tabular-nums">
            :{seconds}
          </span>
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-muted-foreground">{weekday}</p>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
      </div>
    </Card>
  )
}
