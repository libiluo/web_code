import request from "../request";
import type { 
    //交易类型相关
    AddAccountCategoryRequest, 
    Category, 
    CategoryListRequest,
    //交易相关
    AddTransactionEntryRequest
} from "../types";

export const addTransactionEntry = (data:AddTransactionEntryRequest) => {
    return request.post('/transactions/add_transaction',data)
}

export const addAccountCategories = (data: AddAccountCategoryRequest) => {
    return request.post('/categories/add_category', data)
}

export const getCategories = (data: CategoryListRequest) => {
    return request.get<Category[]>('/categories/categories_list', data)
}