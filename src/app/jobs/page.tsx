"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Clock, Coins, CheckCircle2, Briefcase, Home, Leaf } from "lucide-react"

// Mock job listings
const JOB_LISTINGS = [
    {
        id: 1,
        title: "반려견 산책 도우미",
        category: "가정 지원",
        icon: Home,
        location: "걸어서 5분",
        time: "오후 3-4시",
        pay: "15,000원/시간",
        description: "귀여운 강아지와 함께 공원 산책해주실 분을 찾습니다.",
        requester: "김영희님",
        distance: "250m"
    },
    {
        id: 2,
        title: "반찬 만들기 도움",
        category: "가정 지원",
        icon: Home,
        location: "걸어서 8분",
        time: "오전 10-12시",
        pay: "20,000원/시간",
        description: "간단한 반찬 만들기를 도와주실 분을 구합니다.",
        requester: "박민수님",
        distance: "400m"
    },
    {
        id: 3,
        title: "분리수거 도움",
        category: "환경 관리",
        icon: Leaf,
        location: "걸어서 3분",
        time: "아침 9-10시",
        pay: "12,000원/시간",
        description: "매주 화요일 분리수거를 도와주실 분을 찾습니다.",
        requester: "이철수님",
        distance: "150m"
    },
    {
        id: 4,
        title: "재료 손질 보조",
        category: "사업 보조",
        icon: Briefcase,
        location: "걸어서 12분",
        time: "오전 8-11시",
        pay: "18,000원/시간",
        description: "식당에서 간단한 재료 손질을 도와주실 분을 구합니다.",
        requester: "최영수님",
        distance: "600m"
    }
]

const CATEGORIES = ["전체", "가정 지원", "환경 관리", "사업 보조"]

export default function JobsPage() {
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState("전체")
    const [appliedJobs, setAppliedJobs] = useState<number[]>([])

    const filteredJobs = selectedCategory === "전체"
        ? JOB_LISTINGS
        : JOB_LISTINGS.filter(job => job.category === selectedCategory)

    const handleApply = (jobId: number) => {
        setAppliedJobs(prev => [...prev, jobId])
        // Simulate application success
        setTimeout(() => {
            alert("지원이 완료되었습니다! 요청자가 곧 연락드릴 예정입니다.")
        }, 500)
    }

    return (
        <div className="min-h-screen bg-stone-50 p-6 flex flex-col">
            <div className="max-w-2xl w-full mx-auto space-y-6">
                <header className="space-y-4 pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-stone-800">일자리 찾기</h1>
                            <p className="text-stone-500 mt-1">가까운 이웃이 필요로 하는 일을 도와주세요</p>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                        >
                            홈으로
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'bg-white text-stone-600 border border-stone-200 hover:border-orange-300'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Job Listings */}
                <div className="space-y-4">
                    {filteredJobs.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center">
                            <p className="text-stone-400 text-lg">해당 카테고리에 일자리가 없습니다</p>
                        </div>
                    ) : (
                        filteredJobs.map(job => {
                            const Icon = job.icon
                            const isApplied = appliedJobs.includes(job.id)

                            return (
                                <div key={job.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-7 h-7 text-orange-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div>
                                                    <h3 className="font-bold text-xl text-stone-800 mb-1">{job.title}</h3>
                                                    <span className="inline-block px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium">
                                                        {job.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-stone-600 mb-3 leading-relaxed">{job.description}</p>

                                            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                                <div className="flex items-center gap-1.5 text-stone-500">
                                                    <MapPin size={16} className="text-orange-500" />
                                                    <span>{job.location} ({job.distance})</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-stone-500">
                                                    <Clock size={16} className="text-orange-500" />
                                                    <span>{job.time}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-stone-500">
                                                    <Coins size={16} className="text-orange-500" />
                                                    <span className="font-bold text-green-600">{job.pay}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-stone-500">
                                                    <span className="text-xs">요청자: {job.requester}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleApply(job.id)}
                                                disabled={isApplied}
                                                className={`w-full py-3 rounded-xl font-bold text-base transition-all ${isApplied
                                                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                                        : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98] shadow-sm'
                                                    }`}
                                            >
                                                {isApplied ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <CheckCircle2 size={20} />
                                                        지원 완료
                                                    </span>
                                                ) : (
                                                    '지원하기'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-6 border border-orange-200">
                    <h3 className="font-bold text-stone-800 mb-2 flex items-center gap-2">
                        <span className="text-2xl">💡</span>
                        일자리 지원 안내
                    </h3>
                    <ul className="text-sm text-stone-600 space-y-1">
                        <li>• 지원하시면 요청자가 24시간 내에 연락드립니다</li>
                        <li>• 가까운 거리의 일자리부터 추천됩니다</li>
                        <li>• 안전한 일자리만 엄선하여 제공합니다</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
