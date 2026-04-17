import request from "../request";

export const addAccountingEntry = () => {
    return request.get('/test-db')
}