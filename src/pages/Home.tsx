import { addAccountingEntry } from '@/api/modulse/accounting'

export default function Home() {
  const handleClick = async () => {
    try {
      const res = await addAccountingEntry()
      console.log('result:', res)
    } catch (err) {
      console.error('request failed:', err)
    }
  }

  return (
    <div>
      <h1>首页</h1>
      <button onClick={handleClick}>测试 addAccountingEntry</button>
    </div>
  )
}