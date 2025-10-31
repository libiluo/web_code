import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="py-8 md:py-12 px-6 md:px-8 lg:px-16 mx-auto max-w-[1800px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">我的博客</h3>
            <p className="text-sm text-muted-foreground">
              分享技术、生活与思考
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">导航</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  关于
                </Link>
              </li>
              <li>
                <Link
                  to="/archive"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  归档
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">分类</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/category/tech"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  技术
                </Link>
              </li>
              <li>
                <Link
                  to="/category/life"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  生活
                </Link>
              </li>
              <li>
                <Link
                  to="/category/thoughts"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  思考
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">联系方式</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="mailto:your@email.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} 我的博客. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
