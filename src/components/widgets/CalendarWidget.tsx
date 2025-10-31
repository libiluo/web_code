import { Card } from "@/components/ui/card"

export function CalendarWidget() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()

  // 获取当月第一天是星期几
  const firstDay = new Date(year, month, 1).getDay()
  // 获取当月天数
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // 生成日历数据
  const days = []
  // 添加空白占位
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  // 添加日期
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthName = now.toLocaleDateString("zh-CN", { month: "long" })

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-pink-500/10 border-orange-200/50 dark:border-orange-800/50 hover:shadow-lg transition-all">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{monthName}</h3>
          <span className="text-sm text-muted-foreground">{year}年</span>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground h-8 flex items-center justify-center"
            >
              {day}
            </div>
          ))}

          {days.map((day, index) => (
            <div
              key={index}
              className={`
                text-center text-sm h-8 flex items-center justify-center rounded-md
                ${day === today ? "bg-primary text-primary-foreground font-bold" : ""}
                ${day && day !== today ? "hover:bg-accent transition-colors" : ""}
                ${!day ? "invisible" : ""}
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
