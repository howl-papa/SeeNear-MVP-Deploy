"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Phone, PhoneOff, CheckCircle2, MapPin } from "lucide-react"
import dynamic from 'next/dynamic'

// Dynamically import map to avoid SSR issues
const MapClient = dynamic(() => import('@/components/map-client'), { ssr: false })

export default function MatchingPage() {
    const router = useRouter()
    const [status, setStatus] = useState<'analyzing' | 'calling' | 'accepted'>('analyzing')
    const [logs, setLogs] = useState<string[]>([])

    useEffect(() => {
        // Reset state on mount
        setStatus('analyzing')
        setLogs([])

        // Simulate matching process
        const logMessages = [
            "🔍 후보자 분석 중...",
            "📍 위치 기반 매칭 시작",
            "✅ 최적 후보 발견: 김철수 선생님",
            "📞 연결 시도 중..."
        ]

        const timeouts: NodeJS.Timeout[] = []

        logMessages.forEach((msg, idx) => {
            const timeout = setTimeout(() => {
                setLogs(prev => [...prev, msg])
                if (idx === logMessages.length - 1) {
                    setTimeout(() => setStatus('calling'), 1000)
                }
            }, idx * 800)
            timeouts.push(timeout)
        })

        return () => {
            timeouts.forEach(timeout => clearTimeout(timeout))
        }
    }, [])

    useEffect(() => {
        if (status === 'calling') {
            // Text-to-speech for incoming call
            const utterance = new SpeechSynthesisUtterance("김철수 선생님으로부터 전화가 왔습니다. 수락하시겠습니까?")
            utterance.lang = 'ko-KR'
            window.speechSynthesis.speak(utterance)
        }
    }, [status])

    const handleAccept = () => {
        setStatus('accepted')
    }

    const handleDecline = () => {
        router.push('/demander')
    }

    if (status === 'calling') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in">
                    <div className="w-32 h-32 bg-white rounded-full mx-auto flex items-center justify-center shadow-2xl animate-pulse">
                        <span className="text-6xl">👴</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">김철수 선생님</h1>
                        <p className="text-xl text-white/90">전화가 왔습니다</p>
                        <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
                            <MapPin size={16} />
                            <span>걸어서 5분 거리</span>
                        </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-white">
                        <p className="text-lg leading-relaxed">
                            "안녕하세요! 반려견 산책 도와드릴 수 있습니다. 30년 경력으로 믿고 맡겨주세요."
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center pt-4">
                        <button
                            onClick={handleDecline}
                            className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95"
                        >
                            <PhoneOff size={32} className="text-white" />
                        </button>
                        <button
                            onClick={handleAccept}
                            className="w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 animate-bounce"
                        >
                            <Phone size={32} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (status === 'accepted') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in">
                    <div className="flex justify-center">
                        <CheckCircle2 size={100} className="text-white drop-shadow-2xl" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">매칭 성공!</h1>
                        <p className="text-xl text-white/90">김철수 선생님과 연결되었습니다</p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 space-y-3 text-white">
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-80">만남 장소</span>
                            <span className="font-bold">우리집 앞 공원</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-80">예상 시간</span>
                            <span className="font-bold">오후 3시</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-80">연락처</span>
                            <span className="font-bold">010-1234-5678</span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-white text-green-600 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all active:scale-95"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        )
    }

    // Analyzing state
    return (
        <div className="min-h-screen bg-stone-50 p-6 flex flex-col">
            <div className="max-w-4xl w-full mx-auto space-y-6">
                <header className="text-center space-y-2 pt-6">
                    <h1 className="text-2xl font-bold text-stone-800">매칭 진행 중</h1>
                    <p className="text-stone-500">최적의 후보를 찾고 있습니다...</p>
                </header>

                <div className="bg-white rounded-3xl shadow-lg p-6 h-[400px]">
                    <MapClient />
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
                    <h2 className="font-bold text-lg text-stone-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        실시간 로그
                    </h2>
                    <div className="space-y-2 font-mono text-sm">
                        {logs.map((log, idx) => (
                            <div key={idx} className="text-stone-600 animate-in fade-in slide-in-from-left">
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
