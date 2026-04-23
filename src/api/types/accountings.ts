import type { AccountType } from "./basicModel";

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