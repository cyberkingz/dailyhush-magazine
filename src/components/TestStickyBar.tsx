interface TestStickyBarProps {
  price: number
  originalPrice: number
  productName: string
  onBuyClick: () => void
}

export function TestStickyBar({ price, originalPrice, productName, onBuyClick }: TestStickyBarProps) {
  console.log('🟥 TEST STICKY BAR RENDERED!')

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-red-600 p-4 border-4 border-yellow-400"
      style={{
        zIndex: 9999,
      }}
    >
      <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
        <div className="text-white">
          <div className="text-xs font-bold mb-1">TEST STICKY BAR</div>
          <div className="text-3xl font-bold">${price}</div>
          <div className="text-sm line-through">${originalPrice}</div>
        </div>
        <button
          onClick={() => {
            console.log('🔥 BUTTON CLICKED!')
            onBuyClick()
          }}
          className="flex-1 bg-yellow-400 text-black font-bold py-4 px-8 rounded-full hover:bg-yellow-300 transition-colors text-lg"
        >
          BUY NOW
        </button>
      </div>
    </div>
  )
}
