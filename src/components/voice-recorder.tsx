"use client"

import { useState, useEffect, useRef } from 'react'
import { Mic, Square, Loader2, CheckCircle2 } from 'lucide-react'
import { useVoiceRecorder } from '@/hooks/use-voice-recorder'
import { useStore } from '@/lib/store'

// Fallback 데이터 (API 실패 시 데모 안정성 보장)
const FALLBACK_SUMMARY = "반려동물 케어 능숙, 친화력 높음 (30년 경력)"
const FALLBACK_TRANSCRIPT = "예전에 학교 급식소에서 조리원으로 30년 근무했고, 손주들을 돌본 경험이 있어서 아이들이나 반려동물을 케어하는 데 자신 있습니다."

export function VoiceRecorder() {
    const { isRecording, audioBlob, startRecording, stopRecording, permissionError } = useVoiceRecorder()
    const setSeniorProfile = useStore(state => state.setSeniorProfile)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isDone, setIsDone] = useState(false)
    const [showManualSimulateButton, setShowManualSimulateButton] = useState(false)
    const [transcript, setTranscript] = useState('')
    const checkedLabels = useStore(state => state.checkedLabels)
    const seniorAuthInfo = useStore(state => state.seniorAuthInfo)
    const [aiQuestion, setAiQuestion] = useState("선생님, 편하게 말씀해 주세요.")
    const [isTtsPlaying, setIsTtsPlaying] = useState(false)
    const [autoplayBlocked, setAutoplayBlocked] = useState(false)
    const hasAnalyzedRef = useRef(false)
    const hasSpokenRef = useRef(false)
    const ttsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // AI Deep Question Generation Logic (Based on Checklist Context)
    const generateDeepQuestion = (labels: string[]) => {
        const namePart = seniorAuthInfo ? `${seniorAuthInfo.name} 선생님! ` : "선생님, "

        // 1. Digital & Detailed (Detail oriented + Tech)
        if (labels.includes("시력이 괜찮아요") && labels.includes("스마트폰 사용 가능해요")) {
            return namePart + "스마트폰으로 정보를 찾거나 세밀한 물건을 꼼꼼하게 분류하며, 누군가의 불편함을 해결해 주셨던 보람찬 경험이 있으신가요? 편하게 말씀해 주세요."
        }

        // 2. Social & Care (Social + Care oriented)
        if (labels.includes("사람 만나는 걸 좋아해요") && (labels.includes("간단한 심부름 가능해요") || labels.includes("걷기 편해요"))) {
            return namePart + "거동이 불편한 이웃의 말벗이 되어드리거나 장보기를 대신해주며, 이웃과 따뜻한 정을 나누었던 경험이 있으신가요? 편하게 말씀해 주세요."
        }

        // 3. Safety & Physical (Active + Safety oriented)
        if (labels.includes("걷기 편해요") && labels.includes("안전 교육 이수했어요")) {
            return namePart + "우리 동네 아이들의 등하교를 안전하게 돕거나, 활기차게 걸으며 주변을 살피는 '든든한 보안관'처럼 활동해 보신 경험이 있으신가요? 편하게 말씀해 주세요."
        }

        // 4. Individual Strengths
        if (labels.includes("사람 만나는 걸 좋아해요")) {
            return namePart + "처음 보는 이웃에게도 다정하게 안부를 묻거나, 갈등을 지혜롭게 해결하며 주변을 밝게 만드셨던 특별한 순간이 있으신가요? 편하게 말씀해 주세요."
        }

        if (labels.includes("간단한 심부름 가능해요")) {
            return namePart + "분리수거 대행이나 약 배달처럼, 내 가족을 돕는 마음으로 이웃의 생활 편의를 꼼꼼하게 챙겨주셨던 다정한 경험이 있으신가요? 편하게 말씀해 주세요."
        }

        if (labels.includes("스마트폰 사용 가능해요")) {
            return namePart + "길 찾기 앱을 사용하거나 어플로 필요한 서비스를 예약하며, 주변 분들에게 '해결사' 역할을 해주셨던 편리한 경험이 있으신가요? 편하게 말씀해 주세요."
        }

        return namePart + "선생님이 가진 손기술이나 동네를 잘 아시는 강점을 살려 이웃을 도울 수 있는 멋진 경험을 들려주세요."
    }

    const playTts = (text: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return

        setIsTtsPlaying(true)
        window.speechSynthesis.cancel()

        // Some browsers need a moment to load voices
        const voices = window.speechSynthesis.getVoices()
        console.log('VoiceRecorder: Available voices ->', voices.length)

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'ko-KR'
        utterance.rate = 1.0

        utterance.onstart = () => {
            console.log('VoiceRecorder: TTS Started')
            setIsTtsPlaying(true)
            setAutoplayBlocked(false)
            if (ttsTimeoutRef.current) clearTimeout(ttsTimeoutRef.current)
        }

        utterance.onend = () => {
            console.log('VoiceRecorder: TTS Ended')
            setIsTtsPlaying(false)
        }

        utterance.onerror = (e) => {
            const errorType = (e as any).error

            // 'interrupted' is often a normal side effect of cancel()
            if (errorType === 'interrupted') {
                console.log('VoiceRecorder: TTS Interrupted (expected status)')
                setIsTtsPlaying(false)
                return
            }

            console.error('TTS Error Event:', e)
            console.error('TTS Error Detail (e.error):', errorType)
            setIsTtsPlaying(false)

            // Standards: 'not-allowed', 'audio-busy', 'network'
            if (['not-allowed', 'audio-busy', 'network'].includes(errorType)) {
                setAutoplayBlocked(true)
            } else {
                // Fallback for unknown errors (like empty object)
                setAutoplayBlocked(true)
            }
        }

        window.speechSynthesis.speak(utterance)

        // Robust autoplay block detection
        ttsTimeoutRef.current = setTimeout(() => {
            if (!window.speechSynthesis.speaking && !isTtsPlaying) {
                console.warn('VoiceRecorder: TTS Autoplay possibly blocked (timeout)')
                setAutoplayBlocked(true)
                setIsTtsPlaying(false)
            }
        }, 1500)
    }

    useEffect(() => {
        const question = generateDeepQuestion(checkedLabels)
        setAiQuestion(question)

        if (!hasSpokenRef.current) {
            playTts(question)
            hasSpokenRef.current = true
        }

        return () => {
            window.speechSynthesis.cancel()
            if (ttsTimeoutRef.current) clearTimeout(ttsTimeoutRef.current)
        }
    }, [checkedLabels])

    // audioBlob이 생기면 자동으로 API 호출
    useEffect(() => {
        if (!audioBlob || hasAnalyzedRef.current) return
        hasAnalyzedRef.current = true
        runAnalysis(audioBlob)
    }, [audioBlob])

    const runAnalysis = async (blob: Blob) => {
        setIsAnalyzing(true)

        try {
            const extension = blob.type.includes('mp4') ? 'mp4' : 'webm'
            const file = new File([blob], `voice.${extension}`, { type: blob.type })

            const formData = new FormData()
            formData.append('audio', file, `voice.${extension}`)
            formData.append('labels', JSON.stringify(checkedLabels))

            const res = await fetch('/api/analyze-voice', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                throw new Error(`API error: ${res.status}`)
            }

            const data = await res.json()

            // Whisper가 인식한 텍스트를 블럭에 표시
            if (data.transcript) {
                setTranscript(data.transcript)
            }

            setSeniorProfile({
                name: data.name || '선생님',
                summary: data.summary || FALLBACK_SUMMARY,
                voiceRaw: data.transcript || FALLBACK_TRANSCRIPT,
                badge: 'Gold',
                recommendReason: data.recommendReason,
                recommendedJobs: data.recommendedJobs,
            })
        } catch (err) {
            console.error('[VoiceRecorder] API failed, using fallback:', err)
            // API 실패 시 Mock으로 Fallback → 데모 안정성 보장
            setSeniorProfile({
                summary: FALLBACK_SUMMARY,
                voiceRaw: FALLBACK_TRANSCRIPT,
                badge: 'Gold',
                name: '김철수',
            })
        } finally {
            setIsAnalyzing(false)
            setIsDone(true)
            hasAnalyzedRef.current = false
        }
    }

    const handleStop = () => {
        stopRecording()
        // audioBlob은 useEffect에서 자동 감지됨
    }

    // 데모용 시뮬레이션: 텍스트를 직접 API로 전송
    const handleManualSimulate = async () => {
        setIsAnalyzing(true)
        try {
            // Fallback transcript를 텍스트 음성 파일로 만들어 Whisper로 보내는 대신,
            // 이 경우에는 transcript를 직접 요약 API에 전달 (오디오 없는 fallback 경로)
            const res = await fetch('/api/analyze-voice', {
                method: 'POST',
                body: (() => {
                    // WAV 형태의 빈 파일을 보내되, fallback_text를 함께 전달
                    const fd = new FormData()
                    // 최소한의 1초짜리 무음 webm Blob 대신 FALLBACK_TRANSCRIPT를 별도 필드로 전달
                    fd.append('fallback_text', FALLBACK_TRANSCRIPT)
                    return fd
                })(),
            })

            if (res.ok) {
                const data = await res.json()
                setSeniorProfile({
                    summary: data.summary || FALLBACK_SUMMARY,
                    voiceRaw: FALLBACK_TRANSCRIPT,
                    badge: 'Gold',
                    name: '김철수',
                })
            } else {
                throw new Error('API failed')
            }
        } catch {
            setSeniorProfile({
                summary: FALLBACK_SUMMARY,
                voiceRaw: FALLBACK_TRANSCRIPT,
                badge: 'Gold',
                name: '김철수',
            })
        } finally {
            setIsAnalyzing(false)
            setIsDone(true)
        }
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
                    disabled={isAnalyzing || showManualSimulateButton || isTtsPlaying}
                    className={`
                        relative z-10 flex flex-col items-center justify-center 
                        w-48 h-48 rounded-full shadow-xl transition-all duration-300 transform active:scale-95
                        ${isRecording
                            ? 'bg-red-500 hover:bg-red-600 text-white ring-8 ring-red-100'
                            : isTtsPlaying
                                ? 'bg-stone-300 text-stone-100 cursor-not-allowed'
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

            {autoplayBlocked && (
                <button
                    onClick={() => playTts(aiQuestion)}
                    className="flex items-center gap-2 bg-white border-2 border-orange-200 text-orange-600 px-6 py-3 rounded-2xl font-bold shadow-md hover:bg-orange-50 animate-in fade-in slide-in-from-top-2"
                >
                    🔊 질문 다시 듣기
                </button>
            )}

            <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-stone-800 leading-tight">
                    {isTtsPlaying ? "질문을 들어주세요..." : isRecording ? "듣고 있어요..." : "여기를 누르고 말씀해주세요"}
                </h2>
                <p className="text-orange-600 text-lg font-semibold bg-orange-50 p-4 rounded-2xl border-2 border-orange-100 animate-in fade-in slide-in-from-bottom duration-700">
                    {aiQuestion}
                </p>
            </div>

            <div className="w-full bg-stone-50 p-6 rounded-2xl min-h-[80px] border-2 border-stone-100 shadow-inner flex items-center justify-center">
                <p className={`text-base text-center whitespace-pre-wrap leading-relaxed ${transcript ? 'text-stone-800 font-medium' : 'text-stone-400'
                    }`}>
                    {isRecording
                        ? '🎙️ 녹음 중... 말씀이 끝나시면 버튼을 눌러주세요.'
                        : transcript
                            ? transcript
                            : '버튼을 누르고 이야기를 들려주세요.\n(예: 식당에서 10년 일했어~)'}
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
                    <p className="text-stone-500 mt-2">Whisper로 인식 → 핵심 역량 추출 중</p>
                </div>
            )}
        </div>
    )
}
