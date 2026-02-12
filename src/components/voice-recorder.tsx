"use client"

import { useState, useEffect } from 'react'
import { Mic, Square, Loader2, CheckCircle2 } from 'lucide-react'
import { useVoiceRecorder } from '@/hooks/use-voice-recorder'
import { useStore } from '@/lib/store'

const MOCK_SUMMARY = "반려동물 케어 능숙, 친화력 높음 (30년 경력)"
const FALLBACK_TRANSCRIPT = "예전에 학교 급식소에서 조리원으로 30년 근무했고, 손주들을 돌본 경험이 있어서 아이들이나 반려동물을 케어하는 데 자신 있습니다."

export function VoiceRecorder() {
    const { isRecording, transcript, startRecording, stopRecording, permissionError } = useVoiceRecorder()
    const setSeniorProfile = useStore(state => state.setSeniorProfile)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isDone, setIsDone] = useState(false)
    const [showManualSimulateButton, setShowManualSimulateButton] = useState(false)

    const runMagicSimulation = (mockTranscript = "") => {
        setIsAnalyzing(true)

        setTimeout(() => {
            setIsAnalyzing(false)
            setIsDone(true)

            setSeniorProfile({
                summary: MOCK_SUMMARY,
                voiceRaw: mockTranscript || transcript || FALLBACK_TRANSCRIPT,
                badge: 'Gold',
                name: '김철수'
            })
        }, 2000)
    }

    const handleStop = () => {
        stopRecording()
        runMagicSimulation()
    }

    const handleManualSimulate = () => {
        runMagicSimulation(FALLBACK_TRANSCRIPT)
    }

    useEffect(() => {
        if (permissionError) {
            setShowManualSimulateButton(true)
            setIsDone(false)
            setIsAnalyzing(false)
        }
    }, [permissionError])

    if (isDone) {
        return (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500 py-10">
                <div className="flex justify-center text-green-500">
                    <CheckCircle2 size={80} className="drop-shadow-lg" />
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-stone-800 mb-2">분석 완료!</h3>
                    <p className="text-xl text-stone-500">선생님의 말씀을 바탕으로 멋진 이력서가 만들어졌어요.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center space-y-8 w-full max-w-md mx-auto p-6">
            <div className="relative pt-8 pb-4">
                {isRecording && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-200 rounded-full animate-ping opacity-50 pointer-events-none" />
                )}

                <button
                    onClick={isRecording ? handleStop : startRecording}
                    disabled={isAnalyzing || showManualSimulateButton}
                    className={`
                        relative z-10 flex flex-col items-center justify-center 
                        w-48 h-48 rounded-full shadow-xl transition-all duration-300 transform active:scale-95
                        ${isRecording
                            ? 'bg-red-500 hover:bg-red-600 text-white ring-8 ring-red-100'
                            : 'bg-orange-400 hover:bg-orange-500 text-white ring-8 ring-orange-100'}
                        ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    {isRecording ? (
                        <Square size={64} fill="currentColor" className="animate-pulse" />
                    ) : (
                        <Mic size={80} />
                    )}
                </button>
            </div>

            <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-stone-800">
                    {isRecording ? "듣고 있어요..." : "여기를 누르고 말씀해주세요"}
                </h2>
                {!isRecording && (
                    <p className="text-stone-500 text-lg">
                        "예전에 어떤 일을 하셨나요?"
                    </p>
                )}
            </div>

            <div className="w-full bg-stone-50 p-6 rounded-2xl min-h-[120px] border-2 border-stone-100 shadow-inner">
                <p className="text-stone-700 text-lg whitespace-pre-wrap leading-relaxed text-center">
                    {transcript || (isRecording ? "말씀을 기다리는 중..." : "버튼을 누르고 이야기를 들려주세요.\n(예: 식당에서 10년 일했어~)")}
                </p>
            </div>

            {showManualSimulateButton && !isRecording && (
                <div className="w-full animate-in fade-in slide-in-from-top-2">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800 text-center">
                        마이크 사용이 어렵습니다. 데모를 위해 음성 입력을 시뮬레이션 할 수 있습니다.
                    </div>
                    <button
                        onClick={handleManualSimulate}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg"
                    >
                        🎤 (데모용) 음성 입력 시뮬레이션
                    </button>
                </div>
            )}

            {isAnalyzing && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-3xl">
                    <Loader2 className="w-16 h-16 text-orange-500 animate-spin mb-6" />
                    <p className="text-2xl font-bold text-stone-800">AI가 말씀을 분석하고 있어요...</p>
                    <p className="text-stone-500 mt-2">핵심 역량 추출 중</p>
                </div>
            )}
        </div>
    )
}
