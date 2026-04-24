import { useEffect , useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  addAccountCategories,
  getCategories,
  addTransactionEntry
} from "@/api/modulse/accounting"
import type {
  Category
 } from "@/api/types"
type TxType = "expense" | "income"


interface Transaction {
  id: number
  type: TxType
  amount: number
  category_id: number
  transaction_date: string
  note: string
}


export default function Accounting() {
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [txOpen, setTxOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)

  //默认获取分类
  useEffect(() => {
    getCategories({ type: 'expense' })
      .then((res: Category[]) => setCategories(res))
      .catch(() => {})
  }, [])


  async function handleAddTransaction(tx: Omit<Transaction, "id">) {
    await addTransactionEntry({ ...tx })
    setTransactions((prev) => [{ ...tx, id: Date.now() }, ...prev])
    setTxOpen(false)
    toast.success("交易添加成功")
  }

  async function handleAddCategory(cat: Omit<Category, "id">) {
    try {
      await addAccountCategories({
        name: cat.name,
        type: cat.type,
        parent_id: cat.parent_id || undefined,
        icon: cat.icon || undefined,
      })
      setCategories((prev) => [...prev, { ...cat, id: Date.now() }])
      setCatOpen(false)
      toast.success("分类添加成功")
    } catch {
      // 错误 toast 已由拦截器统一处理
    }
  }

  return (
    <div className="mx-auto max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-semibold mb-6">记账</h1>

      <div className="flex gap-3 mb-8">
        <Dialog open={txOpen} onOpenChange={setTxOpen}>
          <DialogTrigger asChild>
            <Button>添加交易</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加交易记录</DialogTitle>
              <DialogDescription>记录一笔收入或支出</DialogDescription>
            </DialogHeader>
            <TransactionForm categories={categories} onSubmit={handleAddTransaction} />
          </DialogContent>
        </Dialog>

        <Dialog open={catOpen} onOpenChange={setCatOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">添加分类</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加分类</DialogTitle>
              <DialogDescription>新建一个交易分类</DialogDescription>
            </DialogHeader>
            <CategoryForm categories={categories} onSubmit={handleAddCategory} />
          </DialogContent>
        </Dialog>
      </div>

      {transactions.length > 0 ? (
        <div>
          <h2 className="text-lg font-medium mb-3">交易记录</h2>
          <div className="space-y-2">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                      t.type === "expense"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {t.type === "expense" ? "支出" : "收入"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {categories.find((c) => c.id === t.category_id)?.name ?? t.category_id}
                  </span>
                  {t.note && (
                    <span className="text-sm text-muted-foreground">· {t.note}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{t.transaction_date}</span>
                  <span
                    className={`font-medium ${
                      t.type === "expense"
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {t.type === "expense" ? "-" : "+"}¥{t.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">暂无交易记录</p>
      )}
    </div>
  )
}

// -------------------- 交易表单 --------------------

interface TransactionFormProps {
  categories: Category[]
  onSubmit: (tx: Omit<Transaction, "id">) => void
}

function TransactionForm({ categories, onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<TxType>("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [transactionDate, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState("")

  const filtered = categories.filter((c) => c.type === type)

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault()
    if (!amount || !category) return
    onSubmit({ type, amount: parseFloat(amount), category_id : Number(category), transaction_date: transactionDate, note })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={type === "expense" ? "default" : "outline"}
          onClick={() => { setType("expense"); setCategory("") }}
        >
          支出
        </Button>
        <Button
          type="button"
          variant={type === "income" ? "default" : "outline"}
          onClick={() => { setType("income"); setCategory("") }}
        >
          收入
        </Button>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="amount">金额</Label>
        <Input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="请输入金额"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label>分类</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent position="popper" className="w-(--radix-select-trigger-width)">
            {filtered.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.icon ? `${cat.icon} ${cat.name}` : cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="date">日期</Label>
        <Input
          id="date"
          type="date"
          value={transactionDate}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="note">备注</Label>
        <Input
          id="note"
          placeholder="备注（可选）"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <DialogFooter>
        <Button type="submit">添加记录</Button>
      </DialogFooter>
    </form>
  )
}

// -------------------- 分类表单 --------------------

interface CategoryFormProps {
  categories: Category[]
  onSubmit: (cat: Omit<Category, "id">) => void
}

const NO_PARENT = "__none__"

function CategoryForm({ categories, onSubmit }: CategoryFormProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<TxType>("expense")
  const [parentId, setParentId] = useState<string>(NO_PARENT)
  const [icon, setIcon] = useState("")

  // 父类型只能是同类型下的顶层分类
  const parentOptions = categories.filter((c) => c.type === type && c.parent_id === null)

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({
      name: name.trim(),
      type,
      parent_id: parentId === NO_PARENT ? null : Number(parentId),
      icon: icon.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="cat-name">名称</Label>
        <Input
          id="cat-name"
          placeholder="例如：餐饮"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label>类型</Label>
        <Select
          value={type}
          onValueChange={(v: TxType) => { setType(v); setParentId(NO_PARENT) }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" className="w-(--radix-select-trigger-width)">
            <SelectItem value="expense">支出</SelectItem>
            <SelectItem value="income">收入</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>父类型（可选）</Label>
        <Select value={parentId} onValueChange={setParentId}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" className="w-(--radix-select-trigger-width)">
            <SelectItem value={NO_PARENT}>无</SelectItem>
            {parentOptions.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cat-icon">图标（可选）</Label>
        <Input
          id="cat-icon"
          placeholder="例如：🍔"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
        />
      </div>

      <DialogFooter>
        <Button type="submit">添加分类</Button>
      </DialogFooter>
    </form>
  )
}
