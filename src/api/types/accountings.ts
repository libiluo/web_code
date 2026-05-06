import type { AccountType } from "./basicModel";

/**
 * 交易涉及类型
 */

export interface AddTransactionEntryRequest {
    category_id: number
    type: AccountType
    amount: number
    transaction_date: string
    note?: string
}

export interface TransactionListItem {
    id: number,
    type: AccountType,
    category_name: string,
    amount: number,
    parent_category_name: string,
    transaction_date: string,
    note: string,
    icon: string | null,
    category_id: number
}
export interface TransactionListResponse {
    items: TransactionListItem[]
    total: number
    page: number
    page_size: number
}

/**
 * 交易分类涉及类型
 */
export interface AddAccountCategoryRequest {
    name :string,
    type : AccountType,
    parent_id?: number,
    icon?: string,
    sort_order?: number
}
export interface CategoryListRequest {
    type?: AccountType
}

export interface Category {
    id: number
    name: string
    type: AccountType
    parent_id: number | null
    icon: string | null
}