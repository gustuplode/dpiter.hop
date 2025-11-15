"use client"

import { useEffect, useState } from "react"

export function CurrencyDisplay({ price }: { price: number }) {
  const [displayPrice, setDisplayPrice] = useState({ symbol: "₹", amount: price })

  useEffect(() => {
    if (typeof price !== 'number' || isNaN(price)) {
      setDisplayPrice({ symbol: "₹", amount: 0 })
      return
    }

    const updateCurrency = () => {
      const selected = localStorage.getItem("selected_currency") || "INR"
      
      const rates: Record<string, number> = {
        USD: 1,
        INR: 83.12,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.50,
        AUD: 1.52,
        CAD: 1.36,
      }

      const symbols: Record<string, string> = {
        USD: "$",
        INR: "₹",
        EUR: "€",
        GBP: "£",
        JPY: "¥",
        AUD: "A$",
        CAD: "C$",
      }

      const convertedAmount = price * rates[selected]
      
      setDisplayPrice({
        symbol: symbols[selected] || "₹",
        amount: convertedAmount
      })
    }

    updateCurrency()

    const handleCurrencyChange = () => {
      updateCurrency()
    }

    window.addEventListener("currencychange", handleCurrencyChange)
    return () => window.removeEventListener("currencychange", handleCurrencyChange)
  }, [price])

  return (
    <span>
      ₹{displayPrice.amount.toFixed(2)}
    </span>
  )
}
