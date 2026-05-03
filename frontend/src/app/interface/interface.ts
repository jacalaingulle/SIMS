export interface productsInterface {
    id: number,
    serial: number,
    brand: string,
    name: string,
    category: string,
    qty: number,
    unit: string,
    unitCost: number,
    discount: number,
    retailPrice: number,
    wholesalePrice: number
}

export interface usersInterface{
    id: number,
    name: string,
    username: string,
    password: string,
    type: string,
    email: string,
    address: string,
    number: string
}