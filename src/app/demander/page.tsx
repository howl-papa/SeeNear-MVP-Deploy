"use client"

import { useState } from "react"
import { Shield, ShieldCheck, User, MapPin, Award } from "lucide-react"

// Mock Candidates
const CANDIDATES = [
    { id: 1, name: "김철수 선생님", age: 72, dist: "걸어서 5분", badge: "Gold", jobs: ["반려견케어", "등하원도우미"], desc: "강아지를 너무 좋아해요. 체력 자신 있습니다." },
    { id: 2, name: "이영희 선생님", age: 68, dist: "걸어서 8분", badge: "Silver", jobs: ["반찬만들기", "아이돌봄"], desc: "손주 셋을 키운 경험으로 따뜻하게 돌봐드려요." },
    { id: 3, name: "박상훈 선생님", age: 70, dist: "걸어서 12분", badge: "Silver", jobs: ["간단청소", "분리수거"], desc: "꼼꼼하고 깔끔한 성격입니다." },
]

const QUICK_SELECT_CATEGORIES = [
    {
        title: "가정 지원",
        items: [
            { label: "하교 지도", template: "하교 지도 도와주실 분 구합니다. (시간/장소 협의)" },
            { label: "반찬 준비", template: "반찬 준비 도와주실 분 구합니다. (시간/장소 협의)" },
            { label: "약 수령", template: "약 수령 도와주실 분 구합니다. (시간/장소 협의)" }
        ]
    },
    {
        title: "환경 관리",
        items: [
            { label: "분리수거", template: "분리수거 도와주실 분 구합니다. (시간/장소 협의)" },
            { label: "반려동물 산책", template: "반려동물 산책 도와주실 분 구합니다. (시간/장소 협의)" },
            { label: "순찰", template: "순찰 도와주실 분 구합니다. (시간/장소 협의)" }
        ]
    },
    {
        title: "사업 보조",
        items: [
            { label: "재료 손질", template: "재료 손질 도와주실 분 구합니다. (시간/장소 협의)" },
            { label: "전단지 배포", template: "전단지 배포 도와주실 분 구합니다. (시간/장소 협의)" },
            { label: "청결 관리", template: "청결 관리 도와주실 분 구합니다. (시간/장소 협의)" }
        ]
    }
]

const UNSAFE_KEYWORDS = ["술", "대리", "아빠", "엄마", "렌탈"]

export default function DemanderPage() {
    const [request, setRequest] = useState("")
    const [isSafe, setIsSafe] = useState(true)

    const handleRequestChange = (value: string) => {
        setRequest(value)
        const containsUnsafe = UNSAFE_KEYWORDS.some(keyword => value.includes(keyword))
        setIsSafe(!containsUnsafe)
    }

    const handleQuickSelect = (template: string) => {
        setRequest(template)
        setIsSafe(true)
    }

    return (
        <div className="min-h-screen bg-stone-50 p-6 flex flex-col items-center">
            <div className="max-w-md w-full space-y-8">
                <header className="space-y-2 pt-6">
                    <h1 className="text-2xl font-bold text-stone-800">어떤 도움이 필요하세요?</h1>
                    <p className="text-stone-500">믿을 수 있는 동네 이웃 선생님이 도와드려요.</p>
                </header>

                {/* Quick Select Categories */}
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-stone-600 uppercase tracking-wide">빠른 선택</h2>
                    {QUICK_SELECT_CATEGORIES.map((category, idx) => (
                        <div key={idx} className="space-y-2">
                            <h3 className="text-xs font-semibold text-stone-500">{category.title}</h3>
                            <div className="flex flex-wrap gap-2">
                                {category.items.map((item, itemIdx) => (
                                    <button
                                        key={itemIdx}
                                        onClick={() => handleQuickSelect(item.template)}
                                        className="px-3 py-1.5 bg-white border border-stone-200 rounded-full text-sm font-medium text-stone-700 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Request Input */}
                <div className="relative">
                    <textarea
                        value={request}
                        onChange={(e) => handleRequestChange(e.target.value)}
                        placeholder="예: 반려견 산책 도와주실 분 구합니다."
                        className="w-full p-4 pr-12 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none resize-none h-32 text-lg"
                    />
                    <div className="absolute top-4 right-4">
                        {isSafe ? (
                            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                                <ShieldCheck size={14} />
                                안전
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                                <Shield size={14} />
                                위험
                            </div>
                        )}
                    </div>
                </div>

                {!isSafe && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
                        ⚠️ 부적절한 요청이 감지되었습니다. 건전한 요청만 가능합니다.
                    </div>
                )}

                {/* Candidates List */}
                {isSafe && request.length > 5 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <h2 className="text-lg font-bold text-stone-800">추천 후보</h2>
                        {CANDIDATES.map(candidate => (
                            <div key={candidate.id} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-7 h-7 text-orange-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-stone-800">{candidate.name}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${candidate.badge === 'Gold'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                <Award size={10} className="inline mr-0.5" />
                                                {candidate.badge}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-stone-500 mb-2">
                                            <MapPin size={14} />
                                            <span>{candidate.dist}</span>
                                            <span className="mx-1">•</span>
                                            <span>{candidate.age}세</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {candidate.jobs.map((job, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium">
                                                    #{job}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-sm text-stone-600 leading-relaxed">{candidate.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
