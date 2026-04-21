export interface AddAccountCategoryRequest {
    name :string,
    type : string,
    parent_id?: number,
    icon?: string,
    sort_order?: number
}