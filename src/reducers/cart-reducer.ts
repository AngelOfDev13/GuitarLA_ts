import { db } from "../data/db"
import { CartGuitar, Guitar } from "../types"

export type CartActions = 
   { type: 'add-to-cart', payload: { item: Guitar} } |
   { type: 'remove-to-cart', payload: { id: Guitar['id']} } |
   { type: 'increase-to-cart', payload: { id: Guitar['id']} } |
   { type: 'decrease-to-cart', payload: { id: Guitar['id']} } | 
   { type: 'clear-to-cart' }
   
export type CartState = {
    cart: CartGuitar[]
    data: Guitar[]
}

const initialCart = () : CartGuitar[] => {
    const lsCart = localStorage.getItem('cart')
    return lsCart ? JSON.parse(lsCart) : []
}

export const initialState : CartState = {
    data: db,
    cart: initialCart()
} 

const MAX_ITEMS = 5
const MAX_ITEMS_DECREASE = 1

export const cartReducer = (
    state: CartState = initialState,
    actions: CartActions
) => {

    if(actions.type === 'add-to-cart') {

        const itemExist = state.cart.find(guitar => guitar.id === actions.payload.item.id) 

        let updatedCart : CartGuitar[] = [] 

        if(itemExist){

            updatedCart = state.cart.map(item => {
                if(item.id === actions.payload.item.id) {
                    if(item.quantity < MAX_ITEMS) {
                        return{...item, quantity: item.quantity + 1}
                    } else { 
                        return item
                    }
                } else {
                    return item
                }
            })

        } else { 

            const newItem : CartGuitar = { ...actions.payload.item, quantity : 1 }
            updatedCart = [...state.cart, newItem]
        }

        return {
            ...state,
            cart: updatedCart
        }
    }

    if(actions.type === 'remove-to-cart') {

        const updatedCart = state.cart.filter(item => item.id !== actions.payload.id)
        return {
            ...state,
            cart: updatedCart
        }
    }

    if(actions.type === 'increase-to-cart') {
        const updatedCart = state.cart.map(item => {
            if(item.id === actions.payload.id && item.quantity < MAX_ITEMS) {
                return { 
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })

        return {
            ...state,
            cart: updatedCart

        }
    }

    if(actions.type === 'decrease-to-cart') {
        const updatedCart = state.cart.map(item => {
            if(item.id === actions.payload.id && item.quantity > MAX_ITEMS_DECREASE) {
                return { 
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })

        return {
            ...state,
            cart: updatedCart
        }
    }

    if(actions.type === 'clear-to-cart') {
        
        return {
            ...state,
            cart: []
        }
    }
}