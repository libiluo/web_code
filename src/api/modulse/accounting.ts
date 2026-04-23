import request from "../request";
import type { AddAccountCategoryRequest, Category, CategoryListRequest } from "../types";

export const addAccountingEntry = () => {
    return request.get('/test-db')
}

export const addAccountCategories = (data: AddAccountCategoryRequest) => {
    return request.post('/categories/add_category', data)
}

export const getCategories = (data: CategoryListRequest) => {
    return request.get<Category[]>('/categories/categories_list', data)
}