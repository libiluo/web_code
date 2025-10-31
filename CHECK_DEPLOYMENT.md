# 🔍 部署验证指南

## 快速检查清单

### ✅ 必须检查的项目

- [ ] GitHub Actions 工作流显示绿色对勾
- [ ] 服务器目录 `/var/www/myapp/` 有新文件
- [ ] 网站可以通过浏览器访问
- [ ] 网站功能正常（小组件、导航等）

---

## 1. 查看 GitHub Actions 状态

### 访问链接
```
https://github.com/libiluo/web_code/actions
```

### 查看内容
1. **工作流列表**
   - 找到 "Deploy to Server" 工作流
   - 查看最新运行记录

2. **运行详情**
   - 点击最新的运行记录
   - 查看每个步骤的状态：
     - ✅ 📥 检出代码
     - ✅ 🔧 设置 Node.js
     - ✅ 📦 安装依赖
     - ✅ 🏗️ 构建项目
     - ✅ 📝 创建部署包
     - ✅ 📤 上传到服务器
     - ✅ 🚀 解压并部署

3. **查看日志**
   - 点击任意步骤查看详细日志
   - 最后一步应该显示 "✅ 部署完成！"

### 常见问题

**如果看到 ❌ 红色叉号：**
1. 点击失败的步骤
2. 查看错误信息
3. 常见错误：
   - `Permission denied` - SSH 密钥或权限问题
   - `No such file or directory` - 路径配置错误
   - `Connection refused` - 服务器连接问题

---

## 2. SSH 验证部署

### 连接到服务器
```bash
# 使用你配置的用户名和服务器地址
ssh your-username@your-server-ip
```

### 检查部署目录
```bash
# 查看目录内容
ls -la /var/www/myapp/

# 应该看到：
# - index.html
# - assets/ 目录
# - vite.svg 等静态文件
```

### 检查文件时间戳
```bash
# 查看最新修改的文件
ls -lt /var/www/myapp/ | head -10

# 时间戳应该是最近的（刚刚部署的时间）
```

### 检查关键文件
```bash
# 检查 index.html
cat /var/www/myapp/index.html

# 应该能看到 React 应用的 HTML 结构
```

### 检查文件权限
```bash
# 查看目录权限
ls -ld /var/www/myapp/

# 应该是 755 权限，所有者是 www-data
# drwxr-xr-x www-data www-data
```

---

## 3. 浏览器访问测试

### 访问网站

根据你的服务器配置，访问以下地址之一：

```
http://your-server-ip/
http://your-domain.com/
```

### 功能检查清单

**页面加载：**
- [ ] 网站能正常打开
- [ ] 没有白屏或错误页面
- [ ] 加载速度正常

**顶部导航（Header）：**
- [ ] "我的博客" logo 显示
- [ ] 导航链接（首页、关于、归档）显示
- [ ] 搜索和主题切换按钮显示

**小组件区域：**
- [ ] ⏰ 时钟小组件显示当前时间
- [ ] 时钟每秒自动更新
- [ ] 📅 日历小组件显示当月日历
- [ ] 今天的日期被高亮
- [ ] 🌤️ 天气小组件显示
- [ ] 📊 统计小组件显示

**博客文章：**
- [ ] 精选文章卡片显示
- [ ] 最新文章网格显示
- [ ] 文章卡片有悬浮效果（hover 时阴影）
- [ ] 标签和分类显示正常

**底部信息（Footer）：**
- [ ] 多列布局显示
- [ ] 导航链接可点击
- [ ] 版权信息显示

**样式和资源：**
- [ ] 页面样式正确（没有样式丢失）
- [ ] 颜色、间距、字体正常
- [ ] 响应式布局正常（调整浏览器窗口大小）
- [ ] 没有图片或资源加载失败

### 浏览器控制台检查

**打开开发者工具：**
- Chrome/Edge: `F12` 或 `Ctrl+Shift+I`（Mac: `Cmd+Option+I`）
- Firefox: `F12`

**Console 标签：**
- [ ] 没有红色错误信息
- [ ] 没有 404 资源加载失败
- [ ] 没有 JavaScript 错误

**Network 标签：**
- [ ] 刷新页面，查看资源加载
- [ ] 所有请求状态码应该是 200
- [ ] 没有失败的请求（红色）

---

## 4. 测试网站功能

### 导航测试
```
1. 点击顶部"关于"链接
   → 应该跳转到关于页面（虽然是占位符）

2. 点击"归档"链接
   → 应该跳转到归档页面

3. 点击"我的博客" logo
   → 应该返回首页
```

### 文章点击测试
```
1. 点击任意文章的"阅读更多"按钮
   → 应该跳转到文章详情页（占位符）

2. 点击精选文章
   → 同样应该有响应
```

### 响应式测试
```
1. 调整浏览器窗口大小
   → 布局应该自动调整

2. 在手机上访问（如果可以）
   → 应该显示移动端布局
```

---

## 5. 性能检查（可选）

### Lighthouse 测试
1. 打开 Chrome DevTools
2. 点击 "Lighthouse" 标签
3. 选择 "Performance"、"Accessibility"、"Best Practices"
4. 点击 "Generate report"
5. 查看评分

**目标分数：**
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90

---

## 🐛 常见问题排查

### 问题 1: 页面打不开
**可能原因：**
- Web 服务器未启动（Nginx/Apache）
- 防火墙阻止端口
- 部署路径配置错误

**解决方法：**
```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 检查端口是否监听
sudo netstat -tlnp | grep :80

# 重启 Nginx
sudo systemctl restart nginx
```

### 问题 2: 样式丢失
**可能原因：**
- 静态资源路径错误
- Vite base path 配置问题

**解决方法：**
- 检查浏览器控制台 404 错误
- 查看 `vite.config.js` 中的 base 配置

### 问题 3: 部署成功但显示旧版本
**可能原因：**
- 浏览器缓存
- CDN 缓存

**解决方法：**
```bash
# 强制刷新浏览器
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)

# 或清除浏览器缓存
```

### 问题 4: GitHub Actions 失败
**常见错误及解决：**

**SSH 连接失败：**
```
Error: Permission denied (publickey)
```
→ 检查 `SERVER_SSH_KEY` secret 是否正确

**找不到目录：**
```
Error: No such file or directory: /var/www/myapp
```
→ 在服务器上创建目录：
```bash
sudo mkdir -p /var/www/myapp
sudo chown -R www-data:www-data /var/www/myapp
```

**权限问题：**
```
Error: Permission denied
```
→ 检查用户是否有 sudo 权限，或修改目录权限

---

## 📊 部署成功的标志

当以下所有项都 ✅ 时，说明部署成功：

- [x] GitHub Actions 显示绿色对勾
- [x] 服务器目录有最新文件
- [x] 网站可以通过浏览器访问
- [x] 时钟小组件在实时更新
- [x] 所有样式和功能正常
- [x] 浏览器控制台无错误
- [x] 响应式布局正常工作

---

## 🎉 下一步

部署成功后，你可以：

1. **配置域名**
   - 在 DNS 添加 A 记录指向服务器 IP
   - 配置 Nginx 虚拟主机

2. **配置 HTTPS**
   - 使用 Let's Encrypt 免费证书
   - 配置自动续期

3. **设置 CDN**
   - 使用 Cloudflare 等 CDN 加速

4. **监控和日志**
   - 设置服务器监控
   - 配置错误日志收集

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看 GitHub Actions 日志
2. 检查服务器日志：`sudo tail -f /var/log/nginx/error.log`
3. 查看本文档的故障排查部分
