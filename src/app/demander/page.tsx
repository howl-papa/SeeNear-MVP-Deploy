"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, ShieldCheck, User, MapPin, Award, HelpCircle, Sparkles, Home } from "lucide-react"
import { useStore } from "@/lib/store"

// Mock Candidates
const CANDIDATES = [
    {
        id: 1,
        name: "김철수 선생님",
        age: 72,
        dist: "걸어서 5분",
        badge: "Gold",
        verifiedCenter: "마포노인복지관",
        jobs: ["반려동물 산책", "순찰"],
        desc: "강아지를 너무 좋아해요. 매일 아침 저녁으로 동네를 돌며 건강을 챙깁니다.",
        trustScore: 98,
        tier: "Master"
    },
    {
        id: 2,
        name: "이영희 선생님",
        age: 68,
        dist: "걸어서 8분",
        badge: "Silver",
        verifiedCenter: "서대문복지관",
        jobs: ["반찬 준비", "하교 지도"],
        desc: "30년 주부 경력으로 영양 가득한 반찬을 맛있게 준비해 드립니다.",
        trustScore: 92,
        tier: "Expert"
    },
    {
        id: 3,
        name: "박상훈 선생님",
        age: 70,
        dist: "걸어서 12분",
        badge: "Silver",
        verifiedCenter: "용산복지관",
        jobs: ["분리수거", "청결 관리"],
        desc: "꼼꼼하고 부지런하여 약속 시간은 반드시 엄수합니다.",
        trustScore: 95,
        tier: "Expert"
    },
    {
        id: 4,
        name: "정경숙 선생님",
        age: 65,
        dist: "걸어서 3분",
        badge: "Gold",
        verifiedCenter: "마포노인복지관",
        jobs: ["약 수령", "하교 지도"],
        desc: "인자한 미소로 아이들과 소통하는 것을 좋아합니다. 동네 지리도 밝아요.",
        trustScore: 99,
        tier: "Master"
    },
    {
        id: 5,
        name: "최용남 선생님",
        age: 74,
        dist: "걸어서 15분",
        badge: "Bronze",
        verifiedCenter: "마포복지관",
        jobs: ["순찰", "분리수거"],
        desc: "해병대 출신으로 동네 안전만큼은 제가 책임지겠습니다.",
        trustScore: 88,
        tier: "Advanced"
    },
    {
        id: 6,
        name: "김미자 선생님",
        age: 69,
        dist: "걸어서 6분",
        badge: "Silver",
        verifiedCenter: "서대문복지관",
        jobs: ["재료 손질", "전단지 배포"],
        desc: "한식 자격증 보유 중이며, 손이 빠르고 꼼꼼하여 식당 보조에 최적입니다.",
        trustScore: 94,
        tier: "Expert"
    },
    {
        id: 7,
        name: "한석봉 선생님",
        age: 71,
        dist: "걸어서 9분",
        badge: "Gold",
        verifiedCenter: "용산복지관",
        jobs: ["청결 관리", "재료 손질"],
        desc: "성실함 하나로 평생을 살았습니다. 카페 정리는 제게 맡겨주세요.",
        trustScore: 97,
        tier: "Master"
    },
    {
        id: 8,
        name: "조순례 선생님",
        age: 73,
        dist: "걸어서 7분",
        badge: "Silver",
        verifiedCenter: "마포노인복지관",
        jobs: ["약 수령", "반찬 준비"],
        desc: "내 가족의 일처럼 정성스럽게 챙겨드립니다. 믿고 맡겨주세요.",
        trustScore: 91,
        tier: "Expert"
    },
    {
        id: 9,
        name: "배철호 선생님",
        age: 67,
        dist: "걸어서 10분",
        badge: "Bronze",
        verifiedCenter: "서대문복지관",
        jobs: ["전단지 배포", "순찰"],
        desc: "동네 구석구석을 잘 알고 있습니다. 성실하게 뛰어다니겠습니다.",
        trustScore: 89,
        tier: "Advanced"
    }
]

const QUICK_SELECT_CATEGORIES = [
    {
        title: "가정 지원",
        items: [
            { label: "하교 지도", template: "초등학교 3학년 아이 하교 지도 부탁드립니다. 학교에서 집까지 걸어서 5분 거리인데, 평일 오후 2시 30분쯤 같이 걸어와 주시면 감사하겠습니다." },
            { label: "반찬 준비", template: "간단한 반찬 몇 가지 만드는 것 도와주실 분 찾습니다. 저희 집에서 오전 10시쯤 2시간 정도 함께 요리하면서 밑반찬 준비하려고 해요. 재료는 제가 준비할게요!" },
            { label: "약 수령", template: "동네 약국에서 처방약 수령 부탁드려요. 제가 거동이 불편해서 직접 가기 어려운데, 약국이 걸어서 10분 거리에 있어요. 처방전은 미리 보내드릴게요." }
        ]
    },
    {
        title: "환경 관리",
        items: [
            { label: "분리수거", template: "매주 화요일 아침 분리수거 도와주실 분 구합니다. 저희 집 앞에 내놓는 것만 도와주시면 돼요. 아침 8시~9시 사이에 10분 정도면 충분할 것 같아요." },
            { label: "반려동물 산책", template: "귀여운 강아지(말티즈, 5살) 산책 도우미 찾아요! 평일 오후 4시쯤 30분 정도 근처 공원에서 산책시켜 주시면 됩니다. 순하고 사람을 좋아하는 아이예요 🐕" },
            { label: "순찰", template: "우리 동네 골목길 저녁 순찰 함께 해주실 분 계실까요? 매일 저녁 7시쯤 30분 정도 동네 한 바퀴 돌면서 가로등 확인하고 쓰레기 있으면 치우는 정도입니다." }
        ]
    },
    {
        title: "사업 보조",
        items: [
            { label: "재료 손질", template: "작은 식당 운영 중인데 아침 재료 손질 도와주실 분 찾습니다. 평일 오전 8시~11시, 채소 다듬고 양념 준비하는 간단한 일이에요. 경력 있으신 분이면 더 좋겠어요!" },
            { label: "전단지 배포", template: "우리 가게 오픈 기념 전단지 500장 정도 동네에 배포해주실 분 구해요. 이번 주말 중 하루, 2~3시간 정도면 될 것 같아요. 근처 아파트 단지 위주로 부탁드려요." },
            { label: "청결 관리", template: "카페 마감 후 청소 도와주실 분 찾습니다. 매일 저녁 9시~10시, 테이블 닦고 바닥 쓸고 닦는 정도예요. 꼼꼼하게 해주시면 감사하겠습니다!" }
        ]
    }
]

const UNSAFE_KEYWORDS = ["술", "대리", "아빠", "엄마", "렌탈"]

export default function DemanderPage() {
    const router = useRouter()
    const [request, setRequest] = useState("")
    const [isSafe, setIsSafe] = useState(true)
    const [showTooltip, setShowTooltip] = useState<number | null>(null)
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null)

    // Helper function to get tier badge styling
    const getTierStyle = (tier: string) => {
        switch (tier) {
            case "Master":
                return "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
            case "Expert":
                return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
            case "Advanced":
                return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
            default:
                return "bg-gradient-to-r from-stone-400 to-stone-500 text-white"
        }
    }

    const handleRequestChange = (value: string) => {
        setRequest(value)
        const containsUnsafe = UNSAFE_KEYWORDS.some(keyword => value.includes(keyword))
        setIsSafe(!containsUnsafe)
        // Clear label if user types manually
        setSelectedLabel(null)
    }

    const handleQuickSelect = (template: string, label: string) => {
        setRequest(template)
        setIsSafe(true)
        setSelectedLabel(label)
    }

    // Filtered candidates based on label
    const filteredCandidates = selectedLabel
        ? CANDIDATES.filter(c => c.jobs.includes(selectedLabel))
        : CANDIDATES.slice(0, 3) // Default show top 3 if no selection or manual typing


    return (
        <div className="min-h-screen bg-stone-50 p-6 flex flex-col items-center">
            <div className="max-w-md w-full space-y-8">
                <header className="space-y-4 pt-6">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => router.push('/')}
                            className="p-2 -ml-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
                        >
                            <Home size={24} />
                        </button>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-stone-800">어떤 도움이 필요하세요?</h1>
                        <p className="text-stone-500">믿을 수 있는 동네 이웃 선생님이 도와드려요.</p>
                    </div>
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
                                        onClick={() => handleQuickSelect(item.template, item.label)}
                                        className={`px-3 py-1.5 border rounded-full text-sm font-medium transition-colors ${selectedLabel === item.label
                                            ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                                            : 'bg-white border-stone-200 text-stone-700 hover:border-orange-300 hover:bg-orange-50'
                                            }`}
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
                        {filteredCandidates.map(candidate => (
                            <div
                                key={candidate.id}
                                onClick={() => {
                                    useStore.getState().setDemanderRequest(request)
                                    router.push('/matching')
                                }}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:shadow-md transition-all cursor-pointer hover:border-orange-200 active:scale-[0.98]"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-7 h-7 text-orange-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h3 className="font-bold text-lg text-stone-800">{candidate.name}</h3>
                                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-200">
                                                <ShieldCheck size={12} />
                                                [{candidate.verifiedCenter} 인증]
                                            </span>
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
                                        <p className="text-sm text-stone-600 leading-relaxed mb-3">{candidate.desc}</p>

                                        {/* AI Trust Score Section */}
                                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border-2 border-orange-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-orange-600" />
                                                    <span className="text-xs font-semibold text-orange-900">SeeNear 신뢰 점수</span>
                                                    <div className="relative">
                                                        <HelpCircle
                                                            className="w-3.5 h-3.5 text-orange-400 cursor-help"
                                                            onMouseEnter={() => setShowTooltip(candidate.id)}
                                                            onMouseLeave={() => setShowTooltip(null)}
                                                        />
                                                        {showTooltip === candidate.id && (
                                                            <div className="absolute left-0 top-6 z-10 w-64 bg-stone-800 text-white text-xs rounded-lg p-3 shadow-xl">
                                                                <div className="absolute -top-1 left-2 w-2 h-2 bg-stone-800 rotate-45"></div>
                                                                거점 인증, 활동 성실도, 평판을 AI가 종합 분석한 결과입니다
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${getTierStyle(candidate.tier)}`}>
                                                    {candidate.tier} 등급
                                                </div>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-bold text-orange-900">{candidate.trustScore}</span>
                                                <span className="text-lg font-semibold text-orange-700">점</span>
                                            </div>
                                        </div>
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
