import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db";
import type { Guitar, CartGuitar } from "../types";

const useCart = () => {

    const initialCart = () : CartGuitar[] => {
        const lsCart = localStorage.getItem('cart')
        return lsCart ? JSON.parse(lsCart) : []
    }

    const [ data ] = useState(db)
    const [ cart, setCart ] = useState(initialCart)

    const MAX_ITEMS = 5
    const MAX_ITEMS_DECREASE = 1

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (item : Guitar) => {
        const itemExist = cart.findIndex(guitar => guitar.id === item.id) 
        if(itemExist === -1){
            const newItem : CartGuitar = { ...item, quantity : 1 } 
            setCart([...cart, newItem])
        } else { 
            if(cart[itemExist].quantity >= MAX_ITEMS) return
            const updatedCart = [...cart]
            updatedCart[itemExist].quantity++
            setCart(updatedCart)
        }
    }

    const removeToCart = (id : Guitar['id']) => {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    const increaseQuantity = (id : Guitar['id']) => {
        const updatedCart = cart.map(item => {
            if(item.id === id && item.quantity < MAX_ITEMS) {
                return { 
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updatedCart)
    } 

    const decreaseQuantity = (id : Guitar['id']) => {
        const updatedCart = cart.map(item => {
            if(item.id === id && item.quantity > MAX_ITEMS_DECREASE) {
                return { 
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    const clearCart = () => {
        setCart([])
    }

    // state derivado 
    const cartTotal = useMemo (() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart] )

    return {
        data,
        cart,
        setCart,
        initialCart,
        addToCart,
        removeToCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartTotal
    }
}

export default useCart