import { Routes, Route } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { Home } from "@/pages/Home"
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<div className="container py-12"><h1 className="text-4xl font-bold">关于页面</h1><p className="mt-4 text-muted-foreground">关于页面开发中...</p></div>} />
        <Route path="/archive" element={<div className="container py-12"><h1 className="text-4xl font-bold">归档页面</h1><p className="mt-4 text-muted-foreground">归档页面开发中...</p></div>} />
        <Route path="/post/:id" element={<div className="container py-12"><h1 className="text-4xl font-bold">文章详情</h1><p className="mt-4 text-muted-foreground">文章详情页面开发中...</p></div>} />
      </Routes>
    </Layout>
  )
}

export default App
