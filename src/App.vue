<template>
  <div class="chat-container">
    <h1>AI 伴侣对话</h1>
    <div class="chat-box">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', msg.role]"
      >
        <strong>{{ msg.role === 'user' ? '你' : 'AI' }}:</strong>
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <div class="input-area">
      <input
        v-model="input"
        @keyup.enter="sendMessage"
        placeholder="输入你的消息"
      />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const input = ref('')
const messages = ref([])

const sendMessage = async () => {
  if (!input.value.trim()) return

  const userMsg = input.value.trim()
  messages.value.push({ role: 'user', content: userMsg })
  input.value = ''

  try {
    const response = await axios.post('http://192.168.110.67:5001/api/chat', {
      message: userMsg,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    messages.value.push({ role: 'ai', content: response.data })
  } catch (err) {
    console.log(err)
    messages.value.push({ role: 'ai', content: '⚠️ 请求失败，请检查服务是否启动。' })
    console.error(err)
  }
}
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
}

.chat-box {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  height: 400px;
  overflow-y: auto;
  background: #fafafa;
}

.message {
  margin-bottom: 1rem;
}

.message.user {
  text-align: right;
  color: #333;
}

.message.ai {
  text-align: left;
  color: #2c7;
}

.input-area {
  margin-top: 1rem;
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #aaa;
  border-radius: 5px;
}

button {
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
}
</style>