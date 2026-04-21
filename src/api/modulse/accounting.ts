import request from "../request";
import type { AddAccountCategoryRequest } from "../types";

export const addAccountingEntry = () => {
    return request.get('/test-db')
}

export const addAccountCategories = (data: AddAccountCategoryRequest) => {
    return request.post('/categories/add_category', data)
}