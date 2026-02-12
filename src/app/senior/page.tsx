"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Award, ShieldCheck } from "lucide-react"
import { VoiceRecorder } from "@/components/voice-recorder"
import { useStore } from "@/lib/store"

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
    const [step, setStep] = useState<'checklist' | 'voice' | 'profile'>('checklist')
    const [checkedItems, setCheckedItems] = useState<number[]>([])
    const seniorProfile = useStore(state => state.seniorProfile)

    const handleCheckToggle = (id: number) => {
        setCheckedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const handleNext = () => {
        if (checkedItems.length >= 3) {
            setStep('voice')
        }
    }

    if (step === 'checklist') {
        return (
            <div className="min-h-screen bg-stone-50 p-6 flex flex-col items-center justify-center">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-stone-800">선생님, 환영합니다</h1>
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
                            onClick={() => setStep('profile')}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95"
                        >
                            프로필 확인하기
                        </button>
                    )}
                </div>
            </div>
        )
    }

    if (step === 'profile' && seniorProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-400 to-amber-500 p-6 flex flex-col items-center justify-center">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full px-4 py-1 text-white text-sm font-bold mb-4 shadow-sm border border-white/30">
                            <Award className="w-4 h-4 mr-1 text-yellow-300" />
                            선생님의 멋진 경험을 정리했어요!
                        </div>

                        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg border-4 border-orange-300">
                            <span className="text-5xl">👴</span>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-1 shadow-sm">{seniorProfile.name} 선생님</h2>
                        <div className="flex justify-center gap-2 mt-3">
                            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">
                                <ShieldCheck size={14} /> {seniorProfile.badge} 인증 완료
                            </span>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
                        <h3 className="text-xl font-bold text-stone-800 mb-3">핵심 역량</h3>
                        <p className="text-lg text-stone-600 leading-relaxed">{seniorProfile.summary}</p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/jobs')}
                            className="w-full bg-white text-orange-500 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
                        >
                            💼 일자리 시작하기
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full bg-white/20 backdrop-blur-sm border-2 border-white text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-white/30 transition-all active:scale-95"
                        >
                            홈으로 돌아가기
                        </button>
                        <p className="text-white/80 text-sm text-center">
                            프로필이 저장되었습니다. 바로 일자리를 찾아보세요!
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
