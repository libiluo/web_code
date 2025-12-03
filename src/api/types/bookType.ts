// 图书信息类型
export interface Book {
  id: number
  title: string
  author: string
  price?: number
  isbn?: string
  coverUrl?: string
  publishDate?: string
  category?: string
  // 个人阅读信息（前端自维护）
  myRating?: number // 我的评分 1-5
  myReview?: string // 我的书评
  readingStatus?: 'want' | 'reading' | 'read' // 阅读状态
  readDate?: string // 阅读日期
}

// 分页响应类型
export interface PageResponse<T> {
  list: T[]
  total: number
}

//
export interface uploadBookCoverRequest{
    bookId: number,
    bookTitle: string,
    coverFile: File
}