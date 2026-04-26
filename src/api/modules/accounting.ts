import request from "../request";
import type { 
    //交易类型相关
    AddAccountCategoryRequest, 
    Category, 
    CategoryListRequest,
    //交易相关
    AddTransactionEntryRequest
} from "../types";


/**
 * 交易相关 /transactions
 */
export const addTransactionEntry = (data:AddTransactionEntryRequest) => {
    return request.post('/transactions/add_transaction',data)
}

export const getTransactionList = () => {
    return request.get<{
        items: unknown[]
        summary: { expense: number; income: number }
    }>('/transactions/transactions_list')
}

export const deleteTransactionEntry = (id: number) => {
    return request.delete(`/transactions/remove_transaction/${id}`)
}

export const getTransactionsSummary = (params: {
    start_date: string
    end_date: string
}) => {
    return request.get<{ expense: number; income: number }>('/transactions/transactions_summary', params)
}

/**
 * 交易类型相关 /categories
 */

export const addAccountCategories = (data: AddAccountCategoryRequest) => {
    return request.post('/categories/add_category', data)
}

export const getCategories = (data: CategoryListRequest) => {
    return request.get<Category[]>('/categories/categories_list', data)
}

export const deleteCategoryEntry = (id: number) => {
    return request.delete(`/categories/remove_category/${id}`)
}
