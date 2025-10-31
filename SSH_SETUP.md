# 🔐 SSH 密钥配置指南

## 问题描述

GitHub Actions 部署失败，错误信息：
```
ssh.ParsePrivateKey: ssh: no key found
ssh: unable to authenticate
```

**原因：** SSH 私钥配置不正确。

---

## ✅ 完整解决方案

### 步骤 1：生成 SSH 密钥对

在**服务器**上执行：

```bash
# SSH 连接到服务器
ssh your-username@your-server-ip

# 生成新的 SSH 密钥（RSA 格式，兼容性最好）
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# 提示时：
# - Enter passphrase: 直接回车（不设置密码）
# - Enter same passphrase again: 直接回车
```

**会生成两个文件：**
- `~/.ssh/github_deploy` - 私钥（给 GitHub Actions 用）
- `~/.ssh/github_deploy.pub` - 公钥（添加到服务器）

---

### 步骤 2：配置服务器授权

```bash
# 将公钥添加到 authorized_keys
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys

# 设置正确的权限（非常重要！）
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/github_deploy
chmod 644 ~/.ssh/github_deploy.pub

# 确保 SSH 目录所有者正确
chown -R $USER:$USER ~/.ssh
```

---

### 步骤 3：复制私钥内容

```bash
# 查看私钥内容
cat ~/.ssh/github_deploy
```

**输出示例：**
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAACFwAAAAdzc2gtcn
NhAAAAAwEAAQAAAgEAw8KD5Z... (很多行)
...
-----END OPENSSH PRIVATE KEY-----
```

**重要！完整复制以下内容：**
- ✅ 包含 `-----BEGIN OPENSSH PRIVATE KEY-----`
- ✅ 包含所有中间内容（不要漏行）
- ✅ 包含 `-----END OPENSSH PRIVATE KEY-----`
- ✅ 保持原有的换行格式

---

### 步骤 4：配置 GitHub Secrets

#### 4.1 访问 Secrets 设置页面
```
https://github.com/libiluo/web_code/settings/secrets/actions
```

#### 4.2 更新 `SERVER_SSH_KEY`

**如果已存在：**
1. 找到 `SERVER_SSH_KEY`
2. 点击右侧的 **Update**
3. 粘贴步骤 3 复制的**完整私钥内容**
4. 点击 **Update secret**

**如果不存在：**
1. 点击 **New repository secret**
2. Name: `SERVER_SSH_KEY`
3. Secret: 粘贴完整私钥内容
4. 点击 **Add secret**

#### 4.3 确认其他 Secrets

确保这三个 secrets 都已配置：
- ✅ `SERVER_HOST` - 服务器 IP 或域名
- ✅ `SERVER_USER` - SSH 用户名
- ✅ `SERVER_SSH_KEY` - 刚才配置的私钥

---

### 步骤 5：测试 SSH 连接

在**本地**测试（可选，用于验证）：

```bash
# 将私钥保存到本地临时文件
vim /tmp/test_key
# 粘贴私钥内容，保存退出

# 设置权限
chmod 600 /tmp/test_key

# 测试连接
ssh -i /tmp/test_key your-username@your-server-ip

# 如果能连接成功，说明密钥配置正确

# 清理临时文件
rm /tmp/test_key
```

---

### 步骤 6：重新触发部署

#### 方法 1：手动触发（推荐）
1. 访问：https://github.com/libiluo/web_code/actions
2. 点击左侧 "Deploy to Server"
3. 点击右上角 "Run workflow"
4. 选择 `main` 分支
5. 点击绿色 "Run workflow" 按钮

#### 方法 2：推送代码触发
```bash
git commit --allow-empty -m "Trigger deployment after SSH fix"
git push origin main
```

---

## 🐛 常见问题排查

### 问题 1：仍然显示 "no key found"

**检查清单：**
- [ ] 私钥格式是否为 `-----BEGIN OPENSSH PRIVATE KEY-----`
- [ ] 是否包含完整的开始和结束行
- [ ] 是否保持了原有的换行（不是一行）
- [ ] GitHub Secret 中是否有多余的空格

**解决：**
重新复制私钥内容，确保完全准确。

---

### 问题 2：Permission denied

**错误信息：**
```
Permission denied (publickey)
```

**原因：**
- 公钥没有正确添加到 `authorized_keys`
- 文件权限不正确

**解决：**
```bash
# 确认 authorized_keys 中有公钥
cat ~/.ssh/authorized_keys | grep github-actions-deploy

# 重新设置权限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

### 问题 3：密钥类型不支持

**错误信息：**
```
ssh: unsupported key type
```

**原因：**
某些旧版本的 SSH 不支持新的密钥格式。

**解决：**
使用 RSA 格式（兼容性最好）：
```bash
ssh-keygen -t rsa -b 4096 -m PEM -f ~/.ssh/github_deploy
```

注意：添加 `-m PEM` 参数使用旧格式。

---

### 问题 4：多个密钥冲突

如果服务器上已有多个 SSH 密钥，确保 GitHub Actions 使用正确的密钥。

**解决：**
在 `~/.ssh/config` 中配置（服务器端）：
```bash
# 编辑 SSH 配置
vim ~/.ssh/config

# 添加内容：
Host *
    IdentityFile ~/.ssh/github_deploy
    IdentityFile ~/.ssh/id_rsa
```

---

## 🔒 安全最佳实践

### 1. 密钥权限
```bash
# SSH 目录：700
chmod 700 ~/.ssh

# 私钥：600（只有所有者可读写）
chmod 600 ~/.ssh/github_deploy

# 公钥：644（所有人可读）
chmod 644 ~/.ssh/github_deploy.pub

# authorized_keys：600
chmod 600 ~/.ssh/authorized_keys
```

### 2. 使用专用密钥
- ✅ 为 GitHub Actions 创建专用密钥
- ✅ 不要使用个人的主密钥
- ✅ 可以为不同项目使用不同密钥

### 3. 定期轮换
- 建议每 6-12 个月更换一次密钥
- 旧密钥从 `authorized_keys` 中移除

### 4. 限制密钥权限
可以在 `authorized_keys` 中限制密钥的使用范围：
```bash
# 限制只能执行特定命令
command="rsync --server" ssh-rsa AAAAB3...
```

---

## ✅ 验证成功的标志

部署成功后，GitHub Actions 会显示：
```
✅ 📥 检出代码
✅ 🔧 设置 Node.js
✅ 📦 安装依赖
✅ 🏗️ 构建项目
✅ 📝 创建部署包
✅ 📤 上传到服务器
✅ 🚀 解压并部署
```

最后一步会输出：
```
✅ 部署完成！
```

---

## 📞 仍然遇到问题？

如果按照以上步骤操作后仍然失败，请检查：

1. **服务器 SSH 服务状态**
   ```bash
   sudo systemctl status sshd
   ```

2. **服务器防火墙**
   ```bash
   sudo ufw status
   # 确保 22 端口开放
   ```

3. **SSH 日志**
   ```bash
   sudo tail -f /var/log/auth.log
   # 或
   sudo tail -f /var/log/secure
   ```

4. **GitHub Actions 详细日志**
   - 在 Actions 页面点击步骤查看完整日志
   - 寻找更详细的错误信息
