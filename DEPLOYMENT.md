# 🚀 部署指南

本文档说明如何将博客部署到 GitHub Pages。

## 📋 前置要求

- GitHub 账号
- Git 已安装并配置
- 项目已推送到 GitHub 仓库

## 🎯 快速开始

### 1. 推送代码到 GitHub

```bash
# 初始化 git（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/<你的用户名>/web_code.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit with GitHub Actions"

# 推送到 main 分支
git push -u origin main
```

### 2. 配置 GitHub Pages

1. 访问你的 GitHub 仓库
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 部分：
   - 选择 **GitHub Actions**
   - 保存设置

### 3. 等待自动部署

- 访问仓库的 **Actions** 标签页
- 查看 "Deploy to GitHub Pages" 工作流运行状态
- 等待工作流完成（通常 1-2 分钟）

### 4. 访问你的博客

部署成功后，你的博客将在以下地址可用：

```
https://<你的用户名>.github.io/web_code/
```

---

## ⚙️ 配置自定义仓库名

如果你的仓库名不是 `web_code`，需要修改 `vite.config.js` 文件：

```javascript
// 将 '/web_code/' 改为 '/你的仓库名/'
base: mode === 'production' ? '/你的仓库名/' : '/',
```

然后重新提交并推送：

```bash
git add vite.config.js
git commit -m "Update base path for GitHub Pages"
git push
```

---

## 🌐 使用自定义域名

### 配置自定义域名步骤：

1. **在 DNS 提供商处配置：**
   - 添加 CNAME 记录指向 `<你的用户名>.github.io`
   - 或添加 A 记录指向 GitHub Pages 的 IP 地址

2. **在 GitHub 配置：**
   - 进入 Settings > Pages
   - 在 "Custom domain" 输入你的域名
   - 等待 DNS 检查完成
   - 启用 "Enforce HTTPS"

3. **修改 `vite.config.js`：**
   ```javascript
   base: '/',  // 使用自定义域名时设置为根路径
   ```

4. **重新部署：**
   ```bash
   git add vite.config.js
   git commit -m "Configure for custom domain"
   git push
   ```

---

## 🔄 更新部署

每次推送到 `main` 分支时，GitHub Actions 会自动：

1. 运行 lint 检查
2. 构建项目
3. 部署到 GitHub Pages

```bash
# 修改代码后
git add .
git commit -m "Update content"
git push
```

---

## 🐛 常见问题

### 问题 1: 页面显示 404

**原因：** Base path 配置不正确

**解决：**
- 检查 `vite.config.js` 中的 base 配置
- 确保与仓库名匹配

### 问题 2: 样式或资源加载失败

**原因：** 资源路径不正确

**解决：**
- 确认 base path 配置正确
- 检查浏览器控制台的错误信息
- 确保所有资源使用相对路径或正确的绝对路径

### 问题 3: 部署失败

**原因：** 构建或权限问题

**解决：**
1. 查看 Actions 页面的错误日志
2. 确认 GitHub Pages 已启用
3. 检查仓库是否为 public（或 Pro 账户的 private）
4. 确认 workflow 权限正确配置

### 问题 4: 手动触发部署

如果需要手动触发部署：

1. 进入 **Actions** 标签页
2. 选择 "Deploy to GitHub Pages"
3. 点击 **Run workflow**
4. 选择分支并确认

---

## 📊 查看部署状态

### 工作流徽章

在 README.md 中添加徽章显示部署状态：

```markdown
![Deploy Status](https://github.com/<用户名>/web_code/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
```

### 部署历史

- 访问 Settings > Pages 查看部署历史
- 访问 Actions 标签页查看所有工作流运行记录

---

## 🎨 本地预览生产构建

部署前在本地测试：

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

访问 http://localhost:4173 查看生产版本。

---

## 📝 提示

- ✅ 每次推送都会触发自动部署
- ✅ 部署通常需要 1-2 分钟
- ✅ 可以在 Actions 页面查看实时日志
- ✅ GitHub Pages 支持 HTTPS
- ✅ 部署完成后可能需要几分钟才能访问（DNS 传播）

---

## 🔗 相关链接

- [GitHub Pages 文档](https://docs.github.com/pages)
- [GitHub Actions 文档](https://docs.github.com/actions)
- [Vite 部署文档](https://vitejs.dev/guide/static-deploy.html)
