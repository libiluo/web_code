import { Outlet, NavLink } from "react-router-dom"
import { Home, BookOpen, FileText, Wallet } from "lucide-react"

const navItems = [
  { to: "/", label: "首页", icon: Home },
  { to: "/accounting", label: "记账", icon: Wallet },
  { to: "/books", label: "书籍", icon: BookOpen },
  { to: "/articles", label: "文章", icon: FileText },
]

export default function MainLayout() {
  return (
    <div className="min-h-svh flex flex-col bg-muted dark:bg-background">
      {/* Header：仅桌面端，移动端由页面自身提供标题 */}
      <header className="sticky top-0 z-50 hidden border-b border-border bg-background/80 backdrop-blur md:block">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <NavLink to="/" className="text-lg font-semibold tracking-tight text-foreground">
            My Site
          </NavLink>

          <nav className="flex gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* 内容区 */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-28 md:pb-6">
        <Outlet />
      </main>

      {/* Footer：仅桌面端 */}
      <footer className="hidden border-t border-border md:block">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-muted-foreground">
          © 2026 My Site
        </div>
      </footer>

      {/* 移动端底部 Tab 栏 */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background shadow-[0_-1px_8px_rgba(0,0,0,0.04)] md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="mx-auto flex max-w-5xl">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <Icon size={22} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
