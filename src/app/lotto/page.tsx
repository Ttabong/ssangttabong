'use client'

import { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'

const getBallColor = (num: number) => {
  if (num <= 10) return 'bg-yellow-400'
  if (num <= 20) return 'bg-blue-500'
  if (num <= 30) return 'bg-red-500'
  if (num <= 40) return 'bg-gray-500'
  return 'bg-green-500'
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

const ballVariants: Variants = {
  floating: {
    y: [0, -10, 0],
    x: [0, 10, 0],
    transition: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 3,
      ease: 'easeInOut',
    },
  },
  draw: {
    scale: [0, 1.4, 1],
    rotate: [0, 360, 0],
    transition: {
      type: 'keyframes',
      duration: 1,
      ease: 'easeInOut',
    },
  },
}

function Ball({ num, borderColor }: { num: number; borderColor?: string }) {
  const baseColor = getBallColor(num)
  return (
    <motion.div
      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl shadow-lg ${baseColor} ${borderColor ? borderColor : ''} border-4`}
      variants={ballVariants}
      initial="floating"
      animate="draw"
      transition={{ delay: num * 0.3 }}
      aria-label={`번호 ${num}`}
      role="img"
    >
      {num}
    </motion.div>
  )
}

export default function LottoTensionPage() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [countDown, setCountDown] = useState(0)
  const [drawnBalls, setDrawnBalls] = useState<number[]>([])
  const [history, setHistory] = useState<number[][]>([])

  const generateNumbers = () => {
    const numbers = Array.from({ length: 45 }, (_, i) => i + 1)
    const shuffled = numbers.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 6).sort((a, b) => a - b)
  }

  const startCountDown = () => {
    if (isDrawing || history.length >= 5) return
    setCountDown(3)
    setDrawnBalls([])
    setIsDrawing(true)
  }

  useEffect(() => {
    if (countDown === 0) return
    const timer = setTimeout(() => {
      setCountDown(countDown - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [countDown])

  useEffect(() => {
    if (countDown === 0 && isDrawing) {
      drawNumbers()
    }
  }, [countDown, isDrawing])

  const drawNumbers = async () => {
    const main = generateNumbers()
    for (let i = 0; i < main.length; i++) {
      setDrawnBalls((prev) => [...prev, main[i]])
      await delay(600)
    }
    setIsDrawing(false)
    setHistory((prev) => {
      if (prev.length >= 5) return prev
      return [main, ...prev]
    })
    setDrawnBalls([])
  }

  const resetHistory = () => {
    setHistory([])
    setDrawnBalls([])
    setCountDown(0)
    setIsDrawing(false)
  }

  function Stars() {
    const [stars, setStars] = useState<
      { cx: string; cy: string; r: number; opacity: number }[]
    >([])

    useEffect(() => {
      const generatedStars = Array.from({ length: 100 }).map(() => ({
        cx: `${Math.random() * 100}%`,
        cy: `${Math.random() * 100}%`,
        r: Math.random() * 1.2 + 0.3,
        opacity: Math.random(),
      }))
      setStars(generatedStars)
    }, [])

    return (
      <svg
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {stars.map((star, i) => (
          <circle
            key={i}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill="white"
            opacity={star.opacity}
          />
        ))}
      </svg>
    )
  }

  return (
    <main className="container magB min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center  p-4 sm:p-6 md:p-8 relative overflow-hidden text-white w-full max-w-screen-lg mx-auto">

      {/* 별빛 배경 */}
      <div className="absolute inset-0 pointer-events-none">
        <Stars />
      </div>

        <section
            className="w-9/10 h-50 text-center relative overflow-hidden"
            style={{
            backgroundImage: 'url("/images/lottoLink.jpg")',
            backgroundSize: '100%',           // 또는 'cover' 또는 'contain'
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',   // ✅ 반복 제거
            }}
                >
        </section>


      <div className='h-10'></div>

      {/* 타이틀 */}
      <h1 className="magB text-xl sm:text-2xl md:text-5xl font-extrabold mb-10 drop-shadow-lg text-yellow-400 text-center">
        🎉 복덕방에서 복을 담아 드립니다. 🎉
      </h1>

      <div className='h-8' />

      <h3 className="magB text-lg sm:text-xl md:text-2xl font-extrabold mb-10 drop-shadow-lg text-orange-400 text-center">
        <p># 로또는 못드리지만..</p>
        <p>번호는 얼마든지 드립니다.</p>
      </h3>

      <div className='h-5' />      

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-10 drop-shadow-lg text-red-400 text-center">
        꼭! 부자되세요~~^^
      </h2>


      <div className='h-15' />

      {/* 카운트다운 표시 */}
      {countDown > 0 && (
        <div className="text-5xl sm:text-6xl md:text-8xl font-black text-red-500 drop-shadow-lg animate-pulse select-none">
          {countDown}
        </div>
      )}

      {/* 현재 추첨중인 공들 */}
      {drawnBalls.length > 0 && (
        <div className="flex justify-center gap-2 sm:gap-3 md:gap-5 mb-12 flex-wrap max-w-lg p-4 shadow-lg rounded-lg bg-gray-800/60">
          {drawnBalls.map((num) => (
            <Ball key={num} num={num} borderColor="border-yellow-200" />
          ))}
        </div>
      )}

      <div className='h-20' />

      {/* 버튼 */}
      {history.length >= 5 ? (
        <button
          className="btn-loginR h-15 bg-red-500 text-white font-bold text-xl sm:text-2xl md:text-4xl px-6 py-2 sm:px-8 sm:py-3 md:px-10 md:py-4 rounded-full shadow-lg transition hover:bg-red-700 mt-10"
          onClick={resetHistory}
          aria-label="추첨 기록 초기화 리셋 버튼"
        >
          다시받기 🔄
        </button>
      ) : (
        <button
          className={`btn-login h-15 bg-yellow-400 text-xl sm:text-2xl md:text-4xl text-gray-900 font-bold px-6 py-2 sm:px-8 sm:py-3 md:px-10 md:py-4 rounded-full shadow-lg transition
            hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed mt-10`}
          onClick={startCountDown}
          disabled={isDrawing}
          aria-label="로또 번호 추첨 시작 버튼"
        >
          {isDrawing ? '추첨 중...' : '번호 뽑기 🎲'}
        </button>
      )}

      <div className='h-10'></div>

      {/* 이전 추첨 결과들 */}
      <div className="w-full max-w-3xl space-y-6">
        {history.map((nums, i) => (
        <div
        key={i}
        className="magB flex flex-col md:flex-row justify-center gap-2 sm:gap-4 md:gap-5 flex-wrap shadow-inner rounded-lg bg-gray-800/40 p-4"
        aria-label={`이전 추첨 번호 ${i + 1}`}
        >
            {/* Game 텍스트: self-center로 세로 중앙 정렬 */}
            <div className="text-lg sm:text-xl md:text-2xl text-orange-400 mb-2 md:mb-0 md:mr-4 self-center">
                Game {i + 1} :
            </div>

            {/* 공 묶음 */}
            <div className="magB flex justify-center flex-wrap gap-2 sm:gap-3 md:gap-4">
                {nums.map((num) => (
                <Ball key={num} num={num} borderColor="border-orange-200" />
                ))}  
            </div>
            <div className='h-2'/>
        </div>
        ))}
      </div>
    </main>
  )
}
