import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Rating } from '@/components/ui/rating'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getBookList, uploadBookCover } from '@/api/book'
import type { Book } from '@/api/types'
import { toast } from 'sonner'

export function BookHistory() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterRating, setFilterRating] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('recent')

  // 上传封面相关状态
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadBookId, setUploadBookId] = useState<number | ''>('')
  const [uploadCoverFile, setUploadCoverFile] = useState<File | null>(null)
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string>('')

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    filterAndSortBooks()
  }, [books, searchKeyword, filterRating, sortBy])

  const fetchBooks = async () => {
    setLoading(true)
    const response = await getBookList() as { code: number; data: any; message: string }
    console.log('获取书籍列表响应:', response)

    if (response.code === 200 || response.code === 0) {
      // 处理响应数据，兼容不同的返回格式
      const bookList = Array.isArray(response.data) ? response.data : response.data?.list || []

      // 模拟添加个人阅读信息（实际应该从后端或 localStorage 获取）
      const booksWithReadingInfo = bookList.map((book: any, index: number) => ({
        ...book,
        myRating: Math.floor(Math.random() * 5) + 1,
        myReview: index % 3 === 0 ? '这本书很不错，推荐阅读！' : undefined,
        readingStatus: 'read' as const,
        readDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        coverUrl: `https://picsum.photos/seed/${book.id}/300/400`
      }))
      setBooks(booksWithReadingInfo)
    } else {
      console.error('获取书籍列表失败:', response.message)
    }

    setLoading(false)
  }

  const filterAndSortBooks = () => {
    let result = [...books]

    // 搜索过滤
    if (searchKeyword) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          book.author.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    }

    // 评分过滤
    if (filterRating !== 'all') {
      const rating = parseInt(filterRating)
      result = result.filter((book) => (book.myRating || 0) >= rating)
    }

    // 排序
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.myRating || 0) - (a.myRating || 0))
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'recent':
      default:
        result.sort((a, b) => (b.readDate || '').localeCompare(a.readDate || ''))
    }

    setFilteredBooks(result)
  }

  const updateBookRating = (bookId: number, rating: number) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId ? { ...book, myRating: rating } : book
      )
    )
    if (selectedBook?.id === bookId) {
      setSelectedBook((prev) => (prev ? { ...prev, myRating: rating } : null))
    }
  }

  const updateBookReview = (bookId: number, review: string) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId ? { ...book, myReview: review } : book
      )
    )
    if (selectedBook?.id === bookId) {
      setSelectedBook((prev) => (prev ? { ...prev, myReview: review } : null))
    }
  }

  // 处理封面文件选择
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadCoverFile(file)
      // 生成预览URL
      const previewUrl = URL.createObjectURL(file)
      setUploadPreviewUrl(previewUrl)
    }
  }

  // 重置上传表单
  const resetUploadForm = () => {
    setUploadBookId('')
    setUploadCoverFile(null)
    if (uploadPreviewUrl) {
      URL.revokeObjectURL(uploadPreviewUrl)
    }
    setUploadPreviewUrl('')
  }

  // 处理上传提交
  const handleUploadSubmit = async () => {
    if (!uploadBookId || !uploadCoverFile) {
      toast.error('请填写完整信息')
      return
    }

    const formData = new FormData()
    formData.append('bookId', String(uploadBookId))
    formData.append('file', uploadCoverFile)
    const uploadRes = await uploadBookCover(formData) as { code: number; data: unknown; message: string }
    console.log('上传响应:', uploadRes)

    // 统一处理所有错误（业务错误 + 网络错误）
    if (uploadRes.code === 200 || uploadRes.code === 0) {
      toast.success('封面上传成功！')
      setUploadDialogOpen(false)
      resetUploadForm()
      // 刷新书籍列表
      await fetchBooks()
    } else {
      // 其他业务错误
      toast.error(uploadRes.message)
    }
  }

  const stats = {
    totalBooks: books.length,
    totalAuthors: new Set(books.map((b) => b.author)).size,
    avgRating: books.length > 0
      ? books.reduce((sum, b) => sum + (b.myRating || 0), 0) / books.length
      : 0,
  }

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      want: { label: '想读', variant: 'secondary' as const },
      reading: { label: '在读', variant: 'default' as const },
      read: { label: '已读', variant: 'outline' as const },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.read
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* 页面标题 */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">📚 书迹</h1>
        <p className="text-muted-foreground text-lg">
          每一本书都是一段故事
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-lg border p-6 text-center hover:shadow-lg transition-shadow">
          <div className="text-3xl font-bold text-primary mb-2">
            {stats.totalBooks}
          </div>
          <div className="text-sm text-muted-foreground">已读书籍</div>
        </div>
        <div className="bg-card rounded-lg border p-6 text-center hover:shadow-lg transition-shadow">
          <div className="text-3xl font-bold text-primary mb-2">
            {stats.totalAuthors}
          </div>
          <div className="text-sm text-muted-foreground">不同作者</div>
        </div>
        <div className="bg-card rounded-lg border p-6 text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl font-bold text-primary">
              {stats.avgRating.toFixed(1)}
            </span>
            <span className="text-yellow-400">⭐</span>
          </div>
          <div className="text-sm text-muted-foreground">平均评分</div>
        </div>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="搜索书名或作者..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="筛选评分" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部评分</SelectItem>
            <SelectItem value="5">5星</SelectItem>
            <SelectItem value="4">4星及以上</SelectItem>
            <SelectItem value="3">3星及以上</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">最近阅读</SelectItem>
            <SelectItem value="rating">评分最高</SelectItem>
            <SelectItem value="title">书名排序</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => setUploadDialogOpen(true)}
          className="w-full md:w-auto"
        >
          上传封面
        </Button>
      </div>

      {/* 书籍列表 */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            {searchKeyword ? '没有找到匹配的书籍' : '还没有添加任何书籍'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="cursor-pointer group"
              onClick={() => setSelectedBook(book)}
            >
              {/* 封面 */}
              <div className="relative aspect-[3/4] mb-2 rounded-lg overflow-hidden bg-muted shadow-sm group-hover:shadow-lg transition-shadow">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs p-2 text-center">
                    {book.title}
                  </div>
                )}
                {/* 评分角标 */}
                {book.myRating && book.myRating > 0 && (
                  <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    {book.myRating}
                    <span>⭐</span>
                  </div>
                )}
              </div>

              {/* 书名 */}
              <h3 className="text-sm font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                {book.title}
              </h3>

              {/* 作者 */}
              <p className="text-xs text-muted-foreground line-clamp-1">
                {book.author}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 书籍详情弹窗 */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedBook?.title}</DialogTitle>
            <DialogDescription>{selectedBook?.author}</DialogDescription>
          </DialogHeader>

          {selectedBook && (
            <div className="space-y-6">
              {/* 封面和基本信息 */}
              <div className="flex gap-6">
                {selectedBook.coverUrl && (
                  <img
                    src={selectedBook.coverUrl}
                    alt={selectedBook.title}
                    className="w-32 h-44 object-cover rounded-lg shadow-md"
                  />
                )}
                <div className="flex-1 space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">状态：</span>
                    {getStatusBadge(selectedBook.readingStatus)}
                  </div>
                  {selectedBook.readDate && (
                    <div>
                      <span className="text-sm text-muted-foreground">
                        阅读日期：
                      </span>
                      <span className="text-sm">{selectedBook.readDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 我的评分 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  我的评分
                </label>
                <Rating
                  value={selectedBook.myRating || 0}
                  onChange={(rating) => updateBookRating(selectedBook.id, rating)}
                  size="lg"
                />
              </div>

              {/* 我的书评 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  我的书评
                </label>
                <Textarea
                  placeholder="写下你的阅读感受..."
                  value={selectedBook.myReview || ''}
                  onChange={(e) =>
                    updateBookReview(selectedBook.id, e.target.value)
                  }
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedBook(null)}>
                  关闭
                </Button>
                <Button onClick={() => setSelectedBook(null)}>
                  保存
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 上传封面弹窗 */}
      <Dialog
        open={uploadDialogOpen}
        onOpenChange={(open) => {
          setUploadDialogOpen(open)
          if (!open) {
            resetUploadForm()
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>上传书籍封面</DialogTitle>
            <DialogDescription>
              请填写书籍ID并选择封面图片
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 书籍ID */}
            <div>
              <label className="block text-sm font-medium mb-2">
                书籍ID
              </label>
              <Input
                type="number"
                placeholder="请输入书籍ID"
                value={uploadBookId}
                onChange={(e) => setUploadBookId(e.target.value ? Number(e.target.value) : '')}
              />
            </div>

            {/* 封面上传 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                书籍封面
              </label>
              <div className="space-y-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                />
                {uploadPreviewUrl && (
                  <div className="relative w-full aspect-[3/4] max-w-[200px] rounded-lg overflow-hidden border">
                    <img
                      src={uploadPreviewUrl}
                      alt="封面预览"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setUploadDialogOpen(false)
                  resetUploadForm()
                }}
              >
                取消
              </Button>
              <Button onClick={handleUploadSubmit}>
                确认上传
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
