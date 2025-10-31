import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClockWidget } from "@/components/widgets/ClockWidget"
import { CalendarWidget } from "@/components/widgets/CalendarWidget"
import { WeatherWidget } from "@/components/widgets/WeatherWidget"
import { StatsWidget } from "@/components/widgets/StatsWidget"

// 模拟博客文章数据
const blogPosts = [
  {
    id: 1,
    title: "React 19 新特性详解",
    description: "深入探讨 React 19 带来的革命性变化，包括新的编译器、并发特性和服务器组件。",
    date: "2024-10-20",
    category: "技术",
    tags: ["React", "前端开发", "JavaScript"],
    readTime: "8 分钟",
  },
  {
    id: 2,
    title: "如何构建高性能的 Web 应用",
    description: "从性能优化的角度出发，探讨现代 Web 应用开发的最佳实践。",
    date: "2024-10-15",
    category: "技术",
    tags: ["性能优化", "Web开发", "最佳实践"],
    readTime: "12 分钟",
  },
  {
    id: 3,
    title: "TypeScript 类型系统深度解析",
    description: "理解 TypeScript 的类型系统如何帮助我们写出更安全、更可维护的代码。",
    date: "2024-10-10",
    category: "技术",
    tags: ["TypeScript", "类型系统", "编程语言"],
    readTime: "15 分钟",
  },
  {
    id: 4,
    title: "我的编程之旅",
    description: "分享我从编程新手到专业开发者的成长历程，以及一路上的经验教训。",
    date: "2024-10-05",
    category: "生活",
    tags: ["个人成长", "编程", "职业发展"],
    readTime: "10 分钟",
  },
  {
    id: 5,
    title: "关于代码可读性的思考",
    description: "探讨什么是好的代码，以及如何编写让团队成员易于理解和维护的代码。",
    date: "2024-09-28",
    category: "思考",
    tags: ["代码质量", "团队协作", "软件工程"],
    readTime: "7 分钟",
  },
  {
    id: 6,
    title: "Tailwind CSS 实战经验分享",
    description: "使用 Tailwind CSS 一年后的感受，以及如何在实际项目中高效使用它。",
    date: "2024-09-20",
    category: "技术",
    tags: ["CSS", "Tailwind", "UI设计"],
    readTime: "9 分钟",
  },
]

export function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="mb-16 text-center py-12 px-6 md:px-8 lg:px-16">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl mb-4">
          欢迎来到我的博客
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          分享技术见解、生活感悟与编程思考
        </p>
      </section>

      {/* Widgets Section */}
      <section className="mb-16 px-6 md:px-8 lg:px-16 max-w-[1800px] mx-auto">
        <h2 className="text-2xl font-bold mb-6">快捷信息</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ClockWidget />
          <CalendarWidget />
          <WeatherWidget />
          <StatsWidget />
        </div>
      </section>

      {/* Featured Post */}
      <section className="mb-16 px-6 md:px-8 lg:px-16 max-w-[1800px] mx-auto">
        <h2 className="text-2xl font-bold mb-6">精选文章</h2>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="md:flex">
            <div className="md:w-2/5 bg-muted flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-muted-foreground">
                  React
                </div>
                <div className="text-sm text-muted-foreground mt-2">精选</div>
              </div>
            </div>
            <div className="md:w-3/5">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{blogPosts[0]?.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {blogPosts[0]?.date}
                  </span>
                </div>
                <CardTitle className="text-2xl">{blogPosts[0]?.title}</CardTitle>
                <CardDescription className="text-base">
                  {blogPosts[0]?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {blogPosts[0]?.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {blogPosts[0]?.readTime}
                </span>
                <Button asChild>
                  <Link to={`/post/${blogPosts[0]?.id}`}>阅读更多</Link>
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      </section>

      {/* Recent Posts */}
      <section className="px-6 md:px-8 lg:px-16 max-w-[1800px] mx-auto">
        <h2 className="text-2xl font-bold mb-6">最新文章</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blogPosts.slice(1).map((post) => (
            <Card
              key={post.id}
              className="flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {post.date}
                  </span>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {post.readTime}
                </span>
                <Button variant="ghost" asChild>
                  <Link to={`/post/${post.id}`}>阅读更多 →</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Load More */}
      <div className="mt-12 mb-12 text-center px-6 md:px-8 lg:px-16">
        <Button size="lg" variant="outline">
          加载更多文章
        </Button>
      </div>
    </div>
  )
}
