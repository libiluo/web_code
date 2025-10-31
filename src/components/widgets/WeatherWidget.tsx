import { Card } from "@/components/ui/card"

export function WeatherWidget() {
  // 模拟天气数据
  const weather = {
    temp: 24,
    condition: "晴天",
    high: 28,
    low: 18,
    icon: "☀️",
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-200/50 dark:border-cyan-800/50 hover:shadow-lg transition-all">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">当前温度</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{weather.temp}</span>
              <span className="text-xl text-muted-foreground">°C</span>
            </div>
          </div>
          <div className="text-5xl">{weather.icon}</div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">{weather.condition}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>↑ {weather.high}°</span>
            <span>•</span>
            <span>↓ {weather.low}°</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
