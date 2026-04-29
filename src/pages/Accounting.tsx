import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  addAccountCategories,
  getCategories,
  addTransactionEntry,
  getTransactionList,
  deleteTransactionEntry,
  getTransactionsSummary,
} from "@/api/modules/accounting"
import type { Category } from "@/api/types"

type TxType = "expense" | "income"

interface Transaction {
  id: number
  type: TxType
  amount: number
  category_id: number
  transaction_date: string
  note: string
}

type Period = 'day' | 'month' | 'year'

const PERIOD_LABEL: Record<Period, string> = {
  day: '今日',
  month: '本月',
  year: '今年',
}

function getDateRange(p: Period): { start_date: string; end_date: string } {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const fmt = (date: Date) => date.toISOString().slice(0, 10)
  if (p === 'day') {
    const today = fmt(now)
    return { start_date: today, end_date: today }
  }
  if (p === 'month') {
    return {
      start_date: fmt(new Date(y, m, 1)),
      end_date: fmt(new Date(y, m + 1, 0)),
    }
  }
  return {
    start_date: fmt(new Date(y, 0, 1)),
    end_date: fmt(new Date(y, 11, 31)),
  }
}

function formatDateGroup(dateStr: string) {
  const d = new Date(dateStr)
  const md = `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}`
  const weekday = d.toLocaleDateString('zh-CN', { weekday: 'long' })
  return `${md} ${weekday}`
}

export default function Accounting() {
  const [period, setPeriod] = useState<Period>('month')
  const [txOpen, setTxOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const [expense, income] = await Promise.all([
        getCategories({ type: 'expense' }),
        getCategories({ type: 'income' }),
      ])
      return [...expense, ...income]
    },
  })

  const { data: transactionData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getTransactionList(),
  })
  const transactions = useMemo(
    () => (transactionData?.items ?? []) as Transaction[],
    [transactionData],
  )

  const {
    data: summary = { expense: 0, income: 0 },
    isFetching: summaryLoading,
  } = useQuery({
    queryKey: ['summary', period],
    queryFn: () => getTransactionsSummary(getDateRange(period)),
  })

  function invalidateTxAndSummary() {
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
    queryClient.invalidateQueries({ queryKey: ['summary'] })
  }

  const addTxMutation = useMutation({
    mutationFn: addTransactionEntry,
    onSuccess: () => {
      invalidateTxAndSummary()
      setTxOpen(false)
      toast.success('交易添加成功')
    },
  })

  const deleteTxMutation = useMutation({
    mutationFn: deleteTransactionEntry,
    onSuccess: () => {
      invalidateTxAndSummary()
      toast.success('交易已删除')
    },
  })

  const addCatMutation = useMutation({
    mutationFn: addAccountCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setCatOpen(false)
      toast.success('分类添加成功')
    },
  })

  function handleDeleteTransaction(id: number) {
    deleteTxMutation.mutate(id)
  }

  function handleAddTransaction(tx: Omit<Transaction, 'id'>) {
    addTxMutation.mutate(tx)
  }

  function handleAddCategory(cat: Omit<Category, 'id'>) {
    addCatMutation.mutate({
      name: cat.name,
      type: cat.type,
      parent_id: cat.parent_id || undefined,
      icon: cat.icon || undefined,
    })
  }

  const isDeletingId = (id: number) =>
    deleteTxMutation.isPending && deleteTxMutation.variables === id

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  )

  const grouped = useMemo(() => {
    const map: Record<string, Transaction[]> = {}
    for (const t of transactions) {
      ;(map[t.transaction_date] ??= []).push(t)
    }
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
  }, [transactions])

  return (
    <div className="mx-auto max-w-xl">
      {/* 页头 */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="mt-3 flex gap-1.5">
            {(['day', 'month', 'year'] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  period === p
                    ? 'bg-foreground text-background'
                    : 'bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {PERIOD_LABEL[p]}
              </button>
            ))}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setCatOpen(true)}>
          管理分类
        </Button>
      </div>

      {/* 汇总卡片 */}
      <div className="mb-6 rounded-3xl bg-card p-6 shadow-sm">
        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-red-500" />
          总支出 · {PERIOD_LABEL[period]}
          {summaryLoading && (
            <Loader2 className="ml-1 size-3 animate-spin text-muted-foreground" />
          )}
        </div>
        {summaryLoading && !summary.expense && !summary.income ? (
          <Skeleton className="mb-5 h-10 w-40" />
        ) : (
          <div className="mb-5 text-4xl font-bold tracking-tight text-foreground tabular-nums">
            ¥{Number(summary.expense).toFixed(2)}
          </div>
        )}
        <div className="flex gap-8 text-sm">
          <div>
            <span className="mr-2 text-muted-foreground">总收入</span>
            <span className="font-medium tabular-nums">
              ¥{Number(summary.income).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 交易记录（按日期分组） */}
      {transactionsLoading || categoriesLoading ? (
        <TransactionListSkeleton />
      ) : grouped.length > 0 ? (
        <div className="space-y-6">
          {grouped.map(([date, txs]) => {
            const dailyExpense = txs
              .filter((t) => t.type === 'expense')
              .reduce((s, t) => s + Number(t.amount), 0)
            const dailyIncome = txs
              .filter((t) => t.type === 'income')
              .reduce((s, t) => s + Number(t.amount), 0)
            return (
              <div key={date}>
                <div className="mb-2 flex justify-between px-1 text-xs text-muted-foreground">
                  <span>{formatDateGroup(date)}</span>
                  <span className="tabular-nums">
                    {dailyExpense > 0 && `支出 ¥${dailyExpense.toFixed(2)}`}
                    {dailyIncome > 0 && (dailyExpense > 0 ? ' · ' : '') +
                      `收入 ¥${dailyIncome.toFixed(2)}`}
                  </span>
                </div>
                <div className="divide-y divide-border/50 overflow-hidden rounded-2xl bg-card shadow-sm">
                  {txs.map((t) => {
                    const cat = categoryById.get(t.category_id)
                    return (
                      <div
                        key={t.id}
                        className="group flex items-center gap-3 px-4 py-3"
                      >
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-lg ${
                            t.type === 'expense'
                              ? 'bg-red-50 dark:bg-red-950/30'
                              : 'bg-green-50 dark:bg-green-950/30'
                          }`}
                        >
                          {cat?.icon || (t.type === 'expense' ? '💸' : '💰')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-foreground">
                            {cat?.name ?? `分类 #${t.category_id}`}
                          </div>
                          {t.note && (
                            <div className="truncate text-xs text-muted-foreground">
                              {t.note}
                            </div>
                          )}
                        </div>
                        <div
                          className={`text-sm font-semibold tabular-nums ${
                            t.type === 'expense'
                              ? 'text-foreground'
                              : 'text-green-600 dark:text-green-400'
                          }`}
                        >
                          {t.type === 'expense' ? '-' : '+'}¥
                          {Number(t.amount).toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleDeleteTransaction(t.id)}
                          disabled={isDeletingId(t.id)}
                          className="text-muted-foreground/30 transition-colors hover:text-red-500 disabled:opacity-50"
                          aria-label="删除"
                        >
                          {isDeletingId(t.id) ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-card py-16 text-center text-sm text-muted-foreground shadow-sm">
          暂无交易记录
        </div>
      )}

      {/* 浮动添加按钮 */}
      <button
        type="button"
        onClick={() => setTxOpen(true)}
        className="fixed bottom-24 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-amber-400 shadow-lg transition hover:bg-amber-500 active:scale-95 md:bottom-8 md:right-8"
        aria-label="添加交易"
      >
        <Plus size={26} strokeWidth={2.5} className="text-white" />
      </button>

      {/* 弹窗 */}
      <Dialog open={txOpen} onOpenChange={setTxOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加交易记录</DialogTitle>
            <DialogDescription>记录一笔收入或支出</DialogDescription>
          </DialogHeader>
          <TransactionForm
            categories={categories}
            submitting={addTxMutation.isPending}
            onSubmit={handleAddTransaction}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={catOpen} onOpenChange={setCatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加分类</DialogTitle>
            <DialogDescription>新建一个交易分类</DialogDescription>
          </DialogHeader>
          <CategoryForm
            categories={categories}
            submitting={addCatMutation.isPending}
            onSubmit={handleAddCategory}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// -------------------- 列表骨架 --------------------

function TransactionListSkeleton() {
  return (
    <div className="space-y-6">
      {[0, 1].map((g) => (
        <div key={g}>
          <div className="mb-2 flex justify-between px-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="divide-y divide-border/50 overflow-hidden rounded-2xl bg-card shadow-sm">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// -------------------- 交易表单 --------------------

interface TransactionFormProps {
  categories: Category[]
  submitting?: boolean
  onSubmit: (tx: Omit<Transaction, "id">) => void
}

function TransactionForm({ categories, submitting, onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<TxType>("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [transactionDate, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState("")

  const filtered = categories.filter((c) => c.type === type)

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault()
    if (!amount || !category) return
    onSubmit({ type, amount: parseFloat(amount), category_id: Number(category), transaction_date: transactionDate, note })
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
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          添加记录
        </Button>
      </DialogFooter>
    </form>
  )
}

// -------------------- 分类表单 --------------------

interface CategoryFormProps {
  categories: Category[]
  submitting?: boolean
  onSubmit: (cat: Omit<Category, "id">) => void
}

const NO_PARENT = "__none__"

function CategoryForm({ categories, submitting, onSubmit }: CategoryFormProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<TxType>("expense")
  const [parentId, setParentId] = useState<string>(NO_PARENT)
  const [icon, setIcon] = useState("")

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
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          添加分类
        </Button>
      </DialogFooter>
    </form>
  )
}
