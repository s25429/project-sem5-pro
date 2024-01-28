import { createContext, useContext, useState } from 'react'


const ShopIdContext = createContext(null)


export default function ShopIdProvider({ children }) {
    const [shopId, setShopId] = useState(null)

    return (
        <ShopIdContext.Provider value={{ shopId, setShopId }}>
            {children}
        </ShopIdContext.Provider>
    )
}


export const useShopIdProvider = () => useContext(ShopIdContext)
