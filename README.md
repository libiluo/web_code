# 个人博客

[![Deploy Status](https://github.com/libiluo/web_code/workflows/Deploy%20to%20Server/badge.svg)](https://github.com/libiluo/web_code/actions)
[![CI](https://github.com/libiluo/web_code/workflows/CI/badge.svg)](https://github.com/libiluo/web_code/actions)

一个基于 React + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui 构建的现代化个人博客。

## ✨ 特性

- 🚀 **React 19** + **Vite 7** - 最新技术栈，极速开发体验
- ⚡ **React Compiler** - 自动优化性能
- 🎨 **Tailwind CSS v4** + **shadcn/ui** - 现代化 UI 组件库
- 📱 **响应式设计** - 完美适配各种设备
- 🎯 **TypeScript** - 类型安全，减少错误
- 🔄 **React Router v7** - 现代化路由方案
- 🎭 **苹果风格小组件** - 时钟、日历、天气、统计
- 🚢 **自动化部署** - GitHub Actions CI/CD

## 📦 技术栈

### 核心框架
- **React** 19.1.1 - UI 框架
- **Vite** 7.1.7 - 构建工具
- **TypeScript** 5.9.3 - 类型系统
- **React Router** 7.9.4 - 路由管理

### UI 框架
- **Tailwind CSS** 4.1.16 - CSS 框架
- **shadcn/ui** - UI 组件库
- **Radix UI** - 无样式组件
- **Lucide React** - 图标库

### 开发工具
- **ESLint** 9.36.0 - 代码检查
- **React Compiler** - 性能优化
- **GitHub Actions** - CI/CD

## 🚀 快速开始

### 前置要求

- Node.js 20.19+ 或 22.12+
- npm 或其他包管理器

### 安装依赖

```bash
npm install
```

### 开发

```bash
npm run dev
```

访问 http://localhost:5173 查看开发环境。

### 构建

```bash
npm run build
```

构建产物在 `dist/` 目录。

### 预览构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 📁 项目结构

```
web_code/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI 工作流
│       ├── deploy.yml          # 部署工作流
│       └── README.md           # 工作流说明
├── src/
│   ├── components/
│   │   ├── layout/            # 布局组件
│   │   │   ├── Header.tsx     # 顶部导航
│   │   │   ├── Footer.tsx     # 底部信息
│   │   │   └── Layout.tsx     # 布局包装器
│   │   ├── ui/                # shadcn/ui 组件
│   │   └── widgets/           # 小组件
│   │       ├── ClockWidget.tsx    # 时钟
│   │       ├── CalendarWidget.tsx # 日历
│   │       ├── WeatherWidget.tsx  # 天气
│   │       └── StatsWidget.tsx    # 统计
│   ├── pages/
│   │   └── Home.tsx           # 首页
│   ├── lib/
│   │   └── utils.ts           # 工具函数
│   ├── App.tsx                # 主应用
│   ├── main.tsx               # 入口文件
│   └── index.css              # 全局样式
├── public/                    # 静态资源
├── CLAUDE.md                  # Claude Code 项目指南
├── DEPLOYMENT.md              # 部署详细指南
└── package.json               # 项目配置
```

## 🚢 自动化部署

本项目使用 GitHub Actions 实现自动化部署。

### 部署流程

当代码推送到 `main` 分支时，会自动触发以下流程：

1. **📥 检出代码** - 从 GitHub 拉取最新代码
2. **🔧 设置环境** - 配置 Node.js 22
3. **📦 安装依赖** - 运行 `npm ci`
4. **🏗️ 构建项目** - 运行 `npm run build`
5. **📝 创建部署包** - 打包 dist 目录为 tar.gz
6. **📤 上传到服务器** - 通过 SCP 上传部署包
7. **🚀 解压并部署** - SSH 连接服务器并解压到目标目录

### 配置 GitHub Secrets

在仓库的 Settings > Secrets and variables > Actions 中添加以下密钥：

| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `SERVER_HOST` | 服务器 IP 地址或域名 | `192.168.1.100` 或 `example.com` |
| `SERVER_USER` | SSH 用户名 | `deployer` |
| `SERVER_SSH_KEY` | SSH 私钥内容 | 完整的私钥文件内容 |

### 手动触发部署

1. 进入仓库的 **Actions** 标签页
2. 选择 **Deploy to Server** 工作流
3. 点击 **Run workflow**
4. 选择分支并确认

详细部署说明请查看 [DEPLOYMENT.md](DEPLOYMENT.md)。

## 🎨 添加 shadcn/ui 组件

使用 shadcn CLI 添加新组件：

```bash
npx shadcn@latest add [component-name]
```

例如：
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

组件会自动添加到 `src/components/ui/` 目录。

## 🎯 核心功能

### 布局系统
- **公共顶部导航** - 固定顶部，响应式设计
- **公共底部信息** - 多列布局，链接导航
- **统一内边距** - 响应式边距系统（px-6 md:px-8 lg:px-16）

### 首页小组件
- **⏰ 时钟小组件** - 实时显示时间和日期
- **📅 日历小组件** - 当月完整日历，高亮今天
- **🌤️ 天气小组件** - 天气信息展示
- **📊 统计小组件** - 博客数据统计

### 博客功能
- **精选文章** - 大卡片展示
- **最新文章** - 网格布局，响应式列数（1→2→3→4）
- **文章预览** - 标题、描述、分类、标签、阅读时间
- **悬浮效果** - 卡片阴影动画

## 🎨 样式配置

### Tailwind CSS v4

本项目使用 Tailwind CSS v4，配置方式与 v3 不同：
- 无需 `tailwind.config.js`
- 使用 CSS 变量和 `@theme` 指令
- 配置在 `src/index.css` 中

### shadcn/ui 配置

配置文件：`components.json`
- 风格：new-york
- 基础颜色：neutral
- CSS 变量：启用
- 图标库：lucide-react

### 路径别名

配置在 `vite.config.js` 和 `tsconfig.json` 中：
- `@/` → `src/`
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/ui` → `src/components/ui`
- `@/hooks` → `src/hooks`
- `@/pages` → `src/pages`

始终使用路径别名而非相对路径。

## 🔧 开发说明

### React Compiler

本项目启用了 React Compiler（通过 `babel-plugin-react-compiler`），会自动优化组件性能。注意 React Compiler 对组件纯度有一定要求。

### TypeScript 配置

启用了严格模式和额外的类型检查：
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`

### ESLint 配置

- 使用 flat config 格式 (`eslint.config.js`)
- 仅配置 `.js` 和 `.jsx` 文件
- React Hooks 规则：recommended-latest
- React Refresh 插件支持

## 📝 文档

- [CLAUDE.md](CLAUDE.md) - Claude Code 项目指南
- [DEPLOYMENT.md](DEPLOYMENT.md) - 详细部署文档
- [.github/workflows/README.md](.github/workflows/README.md) - GitHub Actions 说明

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [React 文档](https://react.dev/)
- [Vite 文档](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Router](https://reactrouter.com/)

---

⭐ 如果这个项目对你有帮助，欢迎 Star！
