"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, ShieldCheck, MapPin, Sparkles, Mic, MapPinned, Square, Loader2 } from "lucide-react"
import { VoiceRecorder } from "@/components/voice-recorder"
import { useStore } from "@/lib/store"
import { RecommendedJob } from "@/lib/store"
import dynamic from 'next/dynamic'

// Dynamically import map to avoid SSR issues
const MapClient = dynamic(() => import('@/components/map-client'), { ssr: false })

const CHECKLIST_ITEMS = [
    { id: 1, label: "시력이 괜찮아요" },
    { id: 2, label: "걷기 편해요" },
    { id: 3, label: "사람 만나는 걸 좋아해요" },
    { id: 4, label: "간단한 심부름 가능해요" },
    { id: 5, label: "스마트폰 사용 가능해요" },
    { id: 6, label: "안전 교육 이수했어요" }
]


export default function SeniorPage() {
    const router = useRouter()
    const [showConsent, setShowConsent] = useState(false)
    const [step, setStep] = useState<'auth' | 'checklist' | 'voice' | 'analyzing' | 'jobs'>('auth')
    const [pin, setPin] = useState('')
    const [pinError, setPinError] = useState('')
    const [checkedItems, setCheckedItems] = useState<number[]>([])
    const seniorProfile = useStore(state => state.seniorProfile)
    const seniorAuthInfo = useStore(state => state.seniorAuthInfo)
    const setSeniorAuthInfo = useStore(state => state.setSeniorAuthInfo)
    const setCheckedLabels = useStore(state => state.setCheckedLabels)

    // Auto-transition from analyzing to jobs screen
    useEffect(() => {
        if (step === 'analyzing') {
            const timer = setTimeout(() => {
                setStep('jobs')
            }, 2500)
            return () => clearTimeout(timer)
        }
    }, [step])

    const handleCheckToggle = (id: number) => {
        setCheckedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const handleNext = () => {
        if (checkedItems.length >= 3) {
            const labels = checkedItems.map(id => CHECKLIST_ITEMS.find(item => item.id === id)?.label || '')
            setCheckedLabels(labels)
            setStep('voice')
        }
    }

    const handleAuth = () => {
        if (pin === '2026') {
            setSeniorAuthInfo({
                name: '김철수',
                birthYear: '1960',
                centerName: '종로 노인종합복지관'
            })
            setShowConsent(true)
        } else {
            setPinError('올바른 인증 번호가 아닙니다.')
            setPin('')
        }
    }

    const handleConsent = () => {
        setShowConsent(false)
        setStep('checklist')
    }

    const handleDecline = () => {
        router.push('/')
    }

    // --- RENDERING LOGIC ---

    // Consent Modal (Higher priority than step screens)
    if (showConsent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-400 to-amber-500 p-6 flex items-center justify-center">
                <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto flex items-center justify-center">
                            <span className="text-5xl">👋</span>
                        </div>
                        <h1 className="text-3xl font-bold text-stone-800">SeeNear와 함께 하시겠어요?</h1>
                    </div>

                    {/* Explanation */}
                    <div className="bg-orange-50 rounded-2xl p-6 space-y-4">
                        <p className="text-xl text-stone-700 leading-relaxed text-center">
                            선생님에게 <span className="font-bold text-orange-600">딱 맞는 일자리</span>를 찾기 위해 다음 정보를 분석합니다.
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Mic className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-stone-800 mb-1">목소리</h3>
                                    <p className="text-base text-stone-600">경험을 듣고 맞는 일자리를 찾아드려요</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <MapPinned className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-stone-800 mb-1">위치 정보</h3>
                                    <p className="text-base text-stone-600">집 근처 일자리를 추천해드려요</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Question */}
                    <p className="text-2xl font-bold text-center text-stone-800">
                        동의하시나요?
                    </p>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleConsent}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-bold text-xl shadow-lg transition-all active:scale-95"
                        >
                            네, 동의합니다
                        </button>
                        <button
                            onClick={handleDecline}
                            className="w-full bg-stone-200 hover:bg-stone-300 text-stone-600 py-4 rounded-2xl font-semibold text-lg transition-all active:scale-95"
                        >
                            아니오
                        </button>
                    </div>

                    {/* Privacy Note */}
                    <p className="text-sm text-stone-500 text-center">
                        개인정보는 안전하게 보호되며, 일자리 매칭 목적으로만 사용됩니다.
                    </p>
                </div>
            </div>
        )
    }

    // Step 0: PIN Authentication
    if (step === 'auth') {
        return (
            <div className="min-h-screen bg-stone-50 p-6 flex flex-col items-center justify-center">
                <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-orange-100 rounded-2xl mx-auto flex items-center justify-center shadow-sm">
                            <ShieldCheck className="w-10 h-10 text-orange-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-stone-800 leading-tight">
                            복지관에서 안내받은<br />인증 번호 4자리를 입력하세요.
                        </h1>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-center gap-3">
                            {[0, 1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`w-14 h-20 bg-white border-2 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-sm transition-all
                                        ${pinError ? 'border-red-300 bg-red-50' : pin.length === i ? 'border-orange-400 ring-4 ring-orange-50' : 'border-stone-200'}
                                    `}
                                >
                                    {pin[i] || ''}
                                </div>
                            ))}
                        </div>

                        {pinError && (
                            <p className="text-center text-red-500 font-semibold animate-bounce">
                                {pinError}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'delete'].map((num, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setPinError('')
                                    if (num === 'delete') {
                                        setPin(prev => prev.slice(0, -1))
                                    } else if (typeof num === 'number' && pin.length < 4) {
                                        setPin(prev => prev + num)
                                    }
                                }}
                                className={`h-16 rounded-2xl text-2xl font-bold transition-all active:scale-90
                                    ${typeof num === 'number' ? 'bg-white text-stone-700 shadow-sm hover:bg-stone-50' : 'text-stone-400'}
                                `}
                            >
                                {num === 'delete' ? '←' : num}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleAuth}
                        disabled={pin.length < 4}
                        className={`w-full py-5 rounded-2xl font-bold text-xl shadow-lg transition-all
                            ${pin.length === 4
                                ? 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95'
                                : 'bg-stone-200 text-stone-400 cursor-not-allowed'}
                        `}
                    >
                        인증하기
                    </button>
                </div>
            </div>
        )
    }

    if (step === 'checklist') {
        return (
            <div className="min-h-screen bg-stone-50 p-6 flex flex-col items-center justify-center">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-stone-800 whitespace-pre-wrap">
                            {seniorAuthInfo ? `${seniorAuthInfo.centerName} \n ${seniorAuthInfo.name} 선생님, 환영합니다` : '선생님, 환영합니다'}
                        </h1>
                        <p className="text-stone-600 text-lg">해당되는 내용을 모두 선택해주세요.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-6 space-y-3">
                        {CHECKLIST_ITEMS.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleCheckToggle(item.id)}
                                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${checkedItems.includes(item.id)
                                    ? 'border-orange-400 bg-orange-50'
                                    : 'border-stone-200 hover:border-orange-200'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${checkedItems.includes(item.id)
                                    ? 'border-orange-500 bg-orange-500'
                                    : 'border-stone-300'
                                    }`}>
                                    {checkedItems.includes(item.id) && (
                                        <CheckCircle2 size={20} className="text-white" />
                                    )}
                                </div>
                                <span className="text-lg font-medium text-stone-700">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={checkedItems.length < 3}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${checkedItems.length >= 3
                            ? 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95'
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            }`}
                    >
                        {checkedItems.length < 3 ? `최소 3개 선택 (${checkedItems.length}/6)` : '다음 단계로'}
                    </button>
                </div>
            </div>
        )
    }

    if (step === 'voice') {
        return (
            <div className="min-h-screen bg-stone-50 p-6 flex flex-col items-center justify-center">
                <div className="max-w-md w-full space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-stone-800">경험을 들려주세요</h1>
                        <p className="text-stone-600">
                            선생님의 멋진 경험을 정리했어요!
                        </p>
                    </div>

                    <VoiceRecorder />

                    {seniorProfile && (
                        <button
                            onClick={() => setStep('analyzing')}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95"
                        >
                            일자리 추천 받기
                        </button>
                    )}
                </div>
            </div>
        )
    }


    if (step === 'analyzing' && seniorProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-400 to-amber-500 p-6 flex flex-col items-center justify-center">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-2xl animate-pulse">
                        <Sparkles size={48} className="text-orange-500" />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-white drop-shadow-lg">분석 완료!</h1>
                        <p className="text-xl text-white/90">선생님에게 딱 맞는 일자리를 찾았어요</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-white">
                        <p className="text-sm animate-pulse">AI가 최적의 일자리를 매칭하고 있습니다...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Job recommendations screen
    if (step === 'jobs' && seniorProfile) {
        return (
            <div className="min-h-screen bg-stone-50 p-6 flex flex-col">
                <div className="max-w-4xl w-full mx-auto space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2 pt-6">
                        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold mb-2">
                            <Sparkles size={16} />
                            AI 추천
                        </div>
                        <h1 className="text-3xl font-bold text-stone-800">
                            {seniorAuthInfo?.name && seniorProfile.name === '선생님' ? `${seniorAuthInfo.name} 선생님!` : seniorProfile.name.includes('선생님') ? seniorProfile.name : `${seniorProfile.name} 선생님!`}
                        </h1>
                        <p className="text-lg text-stone-600">집 근처에 이런 일감이 있어요!</p>
                    </div>

                    {/* Map */}
                    <div className="bg-white rounded-3xl shadow-lg p-6 h-[300px]">
                        <MapClient />
                    </div>

                    {/* AI Recommendation Message */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border-2 border-orange-200">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Sparkles size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-orange-900 mb-1">AI 추천 이유</h3>
                                <p className="text-orange-800 leading-relaxed">
                                    <span className="font-bold">
                                        {seniorAuthInfo?.name || seniorProfile.name} 선생님은
                                    </span>
                                    {' '}
                                    {seniorProfile.recommendReason ?? '수많은 생활 지혜를 가지고 계신 만큼, 지역 사회에 큰 도움이 되어주실 수 있어 추천해 드립니다.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Job Cards */}
                    {(() => {
                        const jobs: RecommendedJob[] = seniorProfile.recommendedJobs ?? []
                        return (
                            <div className="space-y-3">
                                <h2 className="text-lg font-bold text-stone-800">추천 일자리 ({jobs.length}개)</h2>
                                {jobs.map((job, idx) => (
                                    <div
                                        key={job.id}
                                        className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom"
                                        style={{ animationDelay: `${idx * 150}ms` }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <MapPin className="w-6 h-6 text-orange-500" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-stone-800 mb-1">{job.title}</h3>
                                                <div className="flex items-center gap-3 text-sm text-stone-500 mb-2">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={14} className="text-orange-500" />
                                                        {job.location}
                                                    </span>
                                                    <span className="font-bold text-green-600">{job.pay}</span>
                                                </div>
                                                <div className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    <Sparkles size={12} />
                                                    {job.reason}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    })()}

                    {/* Action Buttons */}
                    <div className="space-y-3 pb-6">
                        <button
                            onClick={() => router.push('/jobs')}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95"
                        >
                            💼 일자리 자세히 보기
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full bg-white border-2 border-stone-200 text-stone-700 py-4 rounded-2xl font-bold text-lg hover:bg-stone-50 transition-all active:scale-95"
                        >
                            홈으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
