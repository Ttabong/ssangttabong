    'use client'

    import { useEffect, useState } from 'react'
    import { motion, Variants } from 'framer-motion'

    // 번호별 공 색상 함수
    const getBallColor = (num: number) => {
    if (num <= 10) return 'bg-yellow-400'
    if (num <= 20) return 'bg-blue-500'
    if (num <= 30) return 'bg-red-500'
    if (num <= 40) return 'bg-gray-500'
    return 'bg-green-500'
    }

    // 딜레이 함수
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

    // 공 애니메이션 Variants 정의
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

    // 공 컴포넌트, 번호와 테두리 색상 props로 받음
    function Ball({ num, borderColor }: { num: number; borderColor?: string }) {
    const baseColor = getBallColor(num)
    return (
    <motion.div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg
        ${baseColor} ${borderColor ? borderColor : ''} border-4`}
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
    const [isDrawing, setIsDrawing] = useState(false) // 추첨 중 여부
    const [countDown, setCountDown] = useState(0) // 카운트다운 숫자
    const [drawnBalls, setDrawnBalls] = useState<number[]>([]) // 현재 추첨중인 공 번호들
    const [history, setHistory] = useState<number[][]>([]) // 이전 추첨 결과들

    // 1~45 숫자 중 6개 랜덤 뽑아 정렬해서 반환
    const generateNumbers = () => {
    const numbers = Array.from({ length: 45 }, (_, i) => i + 1)
    const shuffled = numbers.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 6).sort((a, b) => a - b)
    }

    // 추첨 시작 함수 (카운트다운 3초)
    const startCountDown = () => {
    if (isDrawing || history.length >= 5) return
    setCountDown(3)
    setDrawnBalls([])
    setIsDrawing(true)
    }

    // 카운트다운 1초씩 감소
    useEffect(() => {
    if (countDown === 0) return
    const timer = setTimeout(() => {
        setCountDown(countDown - 1)
    }, 1000)
    return () => clearTimeout(timer)
    }, [countDown])

    // 카운트다운 0 이면 번호 추첨 시작
    useEffect(() => {
    if (countDown === 0 && isDrawing) {
        drawNumbers()
    }
    }, [countDown, isDrawing])

    // 번호를 하나씩 차례로 보여주는 애니메이션 함수
    const drawNumbers = async () => {
    const main = generateNumbers()

    // 하나씩 차례로 drawnBalls에 추가 (0.6초 간격)
    for (let i = 0; i < main.length; i++) {
        setDrawnBalls((prev) => [...prev, main[i]])
        await delay(600)
    }

    // 추첨 완료 표시
    setIsDrawing(false)

    // 현재 추첨된 번호들을 history에 추가 (맨 앞에 넣음)
    setHistory((prev) => {
        // 만약 5개 이미 있으면 그대로 유지
        if (prev.length >= 5) return prev
        return [main, ...prev]
    })

    setDrawnBalls([]) // 화면에서 현재 추첨 공 초기화
    }

    // 이전 결과 모두 초기화하는 함수
    const resetHistory = () => {
    setHistory([])
    setDrawnBalls([])
    setCountDown(0)
    setIsDrawing(false)
    }

    // 클라이언트에서만 랜덤 생성하도록 별빛 배경 수정 (hydration 오류 방지)
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
    <main className="magB min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-8 relative overflow-hidden text-white">
      
        {/* 별빛 배경 */}
        <div className="absolute inset-0 pointer-events-none">
            <Stars />
            </div>

            {/* 타이틀 */}
            <h1 className="magB text-5xl font-extrabold mb-10 drop-shadow-lg text-yellow-400">
            🎉 복덕방에서 복을 담아 드립니다.  🎉
            </h1>    

            <div className='h-15'></div>

            <h3 className="magB text-2xl font-extrabold mb-10 drop-shadow-lg text-orange-400 flex item-center">
                <p> # 로또는 못드리지만..  번호는 드릴 수 있습니다!!</p> 
            </h3>

            <h2 className="text-5xl font-extrabold mb-10 drop-shadow-lg text-orange-400">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 꼭! 부자되세요~~^^
            </h2>

            <div className='h-15'></div>  

            {/* 카운트다운 표시 (3,2,1) */}
            {countDown > 0 && (
            <div className="text-8xl font-black text-red-500 drop-shadow-lg animate-pulse select-none">
                {countDown}
            </div>
            )}


            {/* 현재 추첨중인 공들 (노란 테두리) */}
            {drawnBalls.length > 0 && (
            <div className="flex justify-center gap-5 mb-12 flex-wrap max-w-lg p-4 shadow-lg rounded-lg bg-gray-800/60">
                {drawnBalls.map((num) => (
                <Ball key={num} num={num} borderColor="border-yellow-200" />
                ))}
            </div>
            )}

            <div className='h-20'></div>    

            {/* 5개 누적되면 리셋버튼, 아니면 추첨 버튼 */}
            {history.length >= 5 ? (
            <button
                className="btn-loginR h-15 bg-red-500 text-white font-bold text-4xl px-8 py-4 rounded-full shadow-lg transition hover:bg-red-700 mt-10"
                onClick={resetHistory}
                aria-label="추첨 기록 초기화 리셋 버튼"
            >
                리셋하기 🔄
            </button>
            ) : (
            <button
                className={`btn-login h-15 bg-yellow-400 text-4xl text-gray-900 font-bold px-8 py-4 rounded-full shadow-lg transition
                hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed mt-10`}
                onClick={startCountDown}
                disabled={isDrawing}
                aria-label="로또 번호 추첨 시작 버튼"
            >
                {isDrawing ? '추첨 중...' : '번호 뽑기 🎲'}
            </button>
            )}

            <div className='h-10'></div> 

            {/* 이전 추첨 결과들 (오렌지 테두리) */}
            <div className="max-h-[some-large-value] w-full max-w-3xl space-y-6">
            {history.map((nums, i) => (
                <div
                key={i}
                className=" magB flex justify-center gap-5 flex-wrap shadow-inner rounded-lg bg-gray-800/40 p-4"
                aria-label={`이전 추첨 번호 ${i + 1}`}
                >
                <span className='flex items-center text-2xl text-orange-400'> Game {i + 1} :</span> {nums.map((num) => (
                    <Ball key={num} num={num} borderColor="border-orange-200" />
                ))}
                </div>
            ))}
        </div>
    </main>
  )
}
