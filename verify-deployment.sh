#!/bin/bash
# 部署验证脚本

echo "🔍 开始验证部署..."
echo ""

# 替换为你的服务器信息
SERVER_USER="your-username"  # 替换为你的用户名
SERVER_HOST="your-server-ip"  # 替换为你的服务器IP

echo "1️⃣ 检查部署目录是否存在..."
ssh ${SERVER_USER}@${SERVER_HOST} "ls -la /var/www/myapp/"

echo ""
echo "2️⃣ 检查最新修改时间..."
ssh ${SERVER_USER}@${SERVER_HOST} "ls -lt /var/www/myapp/ | head -10"

echo ""
echo "3️⃣ 检查关键文件..."
ssh ${SERVER_USER}@${SERVER_HOST} "test -f /var/www/myapp/index.html && echo '✅ index.html 存在' || echo '❌ index.html 不存在'"

echo ""
echo "4️⃣ 检查文件权限..."
ssh ${SERVER_USER}@${SERVER_HOST} "ls -ld /var/www/myapp/"

echo ""
echo "✅ 验证完成！"
