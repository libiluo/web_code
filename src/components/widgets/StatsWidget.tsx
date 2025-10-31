import { Card } from "@/components/ui/card"

export function StatsWidget() {
  const stats = {
    posts: 42,
    views: 1234,
    likes: 567,
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200/50 dark:border-green-800/50 hover:shadow-lg transition-all">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">博客统计</h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-2xl font-bold">{stats.posts}</p>
            <p className="text-xs text-muted-foreground">文章</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{stats.views}</p>
            <p className="text-xs text-muted-foreground">浏览</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{stats.likes}</p>
            <p className="text-xs text-muted-foreground">点赞</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
