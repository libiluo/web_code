import { get, post, put, del ,upload} from '@/lib/request'
import type { Book ,PageResponse,uploadBookCoverRequest} from '@/api/types'


// 获取图书列表
export function getBookList() {
  return get<PageResponse<Book>>('/book')
}

// 获取图书详情
export function getBookDetail(id: number) {
  return get<Book>(`/books/${id}`)
}

// 搜索图书
export function searchBooks(keyword: string) {
  return get<Book[]>('/books/search', {
    params: { keyword }
  })
}

//上传图书封面
export function uploadBookCover(coverData: FormData) {
  return upload<Object>('/upload/book-cover', coverData)
}