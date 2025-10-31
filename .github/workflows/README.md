# GitHub Actions 工作流说明

本项目配置了两个 GitHub Actions 工作流来实现自动化构建、测试和部署。

## 📋 工作流列表

### 1. CI 工作流 (`ci.yml`)

**触发条件：**
- 推送到 `main` 分支
- 针对 `main` 分支的 Pull Request

**功能：**
- ✅ 在 Node.js 20.x 和 22.x 版本上测试构建
- ✅ 运行 ESLint 代码检查
- ✅ 构建生产版本
- ✅ 上传构建产物（仅 Node.js 22.x）

**查看状态：**
访问仓库的 Actions 标签页查看工作流运行状态。

---

### 2. 部署工作流 (`deploy.yml`)

**触发条件：**
- 推送到 `main` 分支
- 手动触发（workflow_dispatch）

**功能：**
- 🚀 自动构建项目
- 🚀 部署到 GitHub Pages
- 🚀 生成部署 URL

**部署地址：**
```
https://<你的用户名>.github.io/web_code/
```

---

## 🚀 首次设置 GitHub Pages

1. **推送代码到 GitHub：**
   ```bash
   git add .
   git commit -m "Add GitHub Actions workflows"
   git push origin main
   ```

2. **启用 GitHub Pages：**
   - 进入仓库的 **Settings** > **Pages**
   - 在 **Source** 下选择 **GitHub Actions**
   - 保存设置

3. **等待部署完成：**
   - 进入 **Actions** 标签页
   - 查看 "Deploy to GitHub Pages" 工作流
   - 部署成功后，可以访问你的网站

4. **访问网站：**
   ```
   https://<USERNAME>.github.io/web_code/
   ```

---

## ⚙️ 配置说明

### Base Path 配置

在 `vite.config.js` 中，base path 根据环境自动设置：
- **开发环境**：`/`
- **生产环境**：`/web_code/`

如果你的仓库名不是 `web_code`，需要修改 `vite.config.js` 第 14 行：

```javascript
base: mode === 'production' ? '/你的仓库名/' : '/',
```

### 自定义域名

如果使用自定义域名，请：
1. 在 GitHub Pages 设置中配置自定义域名
2. 修改 `vite.config.js`：
   ```javascript
   base: '/',
   ```

---

## 🔧 本地测试生产构建

测试生产版本在本地是否正常工作：

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

---

## 📝 工作流徽章

可以在 README.md 中添加工作流状态徽章：

```markdown
![CI](https://github.com/<USERNAME>/web_code/workflows/CI/badge.svg)
![Deploy](https://github.com/<USERNAME>/web_code/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
```

---

## 🐛 故障排查

### 部署失败

1. 检查 Actions 标签页的错误日志
2. 确认 GitHub Pages 已启用
3. 确认 base path 配置正确

### 页面空白或样式丢失

检查 `vite.config.js` 中的 base path 是否与仓库名匹配。

### 手动触发部署

进入 Actions 标签页 > Deploy to GitHub Pages > Run workflow
