"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Clock, Coins, CheckCircle2, Briefcase, Home, Leaf, Phone, PhoneOff } from "lucide-react"

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
        description: "저희 집 귀여운 말티즈(3살, 이름은 복실이에요!) 평일 오후에 30분~1시간 정도 근처 공원에서 산책시켜 주실 분을 찾아요. 순하고 사람을 정말 좋아하는 아이라 산책이 즐거우실 거예요 🐕",
        requester: "김영희",
        distance: "250m",
        message: "안녕하세요! 복실이 산책 도와주실 수 있으실까요? 저도 강아지를 키워봐서 반려견 돌보는 게 얼마나 중요한지 잘 알아요. 믿고 맡길 수 있는 분을 찾고 있습니다!"
    },
    {
        id: 2,
        title: "반찬 만들기 도움",
        category: "가정 지원",
        icon: Home,
        location: "걸어서 8분",
        time: "오전 10-12시",
        pay: "20,000원/시간",
        description: "주말에 일주일 먹을 밑반찬 4-5가지 정도 같이 만들어요. 저희 집 주방에서 함께 요리하면서 담소도 나누고 즐겁게 준비하려고 해요. 재료는 제가 다 준비할게요. 요리 좋아하시는 분이면 더 좋겠어요!",
        requester: "박민수",
        distance: "400m",
        message: "반찬 만들기 같이 하실 분 계실까요? 혼자 하면 심심하고 시간도 오래 걸리는데, 같이 하면 더 즐겁고 빠를 것 같아요. 요리 경험 많으신 분이면 저도 많이 배울 수 있을 것 같습니다!"
    },
    {
        id: 3,
        title: "분리수거 도움",
        category: "환경 관리",
        icon: Leaf,
        location: "걸어서 3분",
        time: "아침 9-10시",
        pay: "12,000원/시간",
        description: "매주 화요일 아침 분리수거 하는 날인데, 제가 허리가 안 좋아서 무거운 것 들기가 힘들어요. 집 앞 분리수거장까지 같이 가서 분리수거 도와주시면 정말 감사하겠습니다. 10-15분이면 충분해요.",
        requester: "이철수",
        distance: "150m",
        message: "매주 화요일 아침에 분리수거 좀 도와주실 수 있으실까요? 바로 옆 동네라 가까워요. 제가 나이가 들어서 무거운 걸 들기가 힘들어졌네요. 도움 주시면 정말 고맙겠습니다!"
    },
    {
        id: 4,
        title: "재료 손질 보조",
        category: "사업 보조",
        icon: Briefcase,
        location: "걸어서 12분",
        time: "오전 8-11시",
        pay: "18,000원/시간",
        description: "작은 한식당을 운영하고 있어요. 평일 아침 영업 준비하면서 채소 다듬고 양념 준비하는 일 도와주실 분 찾습니다. 칼질이나 요리 경험 있으신 분이면 더 좋지만, 없어도 괜찮아요. 친절하게 알려드릴게요!",
        requester: "최영수",
        distance: "600m",
        message: "식당 재료 손질 도와주실 분 계실까요? 저희 작은 식당인데 아침마다 준비할 게 많아서요. 경험 있으신 분이면 정말 좋겠지만, 배우고 싶으신 분도 환영합니다. 같이 일하면서 요리도 배워가실 수 있어요!"
    }
]

const CATEGORIES = ["전체", "가정 지원", "환경 관리", "사업 보조"]

export default function JobsPage() {
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState("전체")
    const [appliedJobs, setAppliedJobs] = useState<number[]>([])
    const [callStatus, setCallStatus] = useState<'none' | 'calling' | 'accepted'>('none')
    const [selectedJob, setSelectedJob] = useState<typeof JOB_LISTINGS[0] | null>(null)

    const filteredJobs = selectedCategory === "전체"
        ? JOB_LISTINGS
        : JOB_LISTINGS.filter(job => job.category === selectedCategory)

    const handleApply = (jobId: number) => {
        const job = JOB_LISTINGS.find(j => j.id === jobId)
        if (!job) return

        setAppliedJobs(prev => [...prev, jobId])
        setSelectedJob(job)

        // Show incoming call after 3 seconds
        setTimeout(() => {
            setCallStatus('calling')
        }, 3000)
    }

    const handleAccept = () => {
        setCallStatus('accepted')
    }

    const handleDecline = () => {
        setCallStatus('none')
        setSelectedJob(null)
    }

    useEffect(() => {
        if (callStatus === 'calling' && selectedJob) {
            // Text-to-speech for incoming call (with error handling for mobile)
            try {
                if (typeof window !== 'undefined' && window.speechSynthesis) {
                    const utterance = new SpeechSynthesisUtterance(`${selectedJob.requester}님으로부터 전화가 왔습니다. 수락하시겠습니까?`)
                    utterance.lang = 'ko-KR'
                    window.speechSynthesis.speak(utterance)
                }
            } catch (error) {
                // Silently fail on mobile devices that don't support speech synthesis
                console.error('Speech synthesis not supported:', error)
            }
        }
    }, [callStatus, selectedJob])

    // Incoming Call Screen
    if (callStatus === 'calling' && selectedJob) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in">
                    <div className="w-32 h-32 bg-white rounded-full mx-auto flex items-center justify-center shadow-2xl animate-pulse">
                        <span className="text-6xl">👴</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">{selectedJob.requester} 선생님</h1>
                        <p className="text-xl text-white/90">전화가 왔습니다</p>
                        <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
                            <MapPin size={16} />
                            <span>{selectedJob.location}</span>
                        </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-white">
                        <p className="text-lg leading-relaxed">
                            "{selectedJob.message}"
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

    // Job Accepted Screen
    if (callStatus === 'accepted' && selectedJob) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in">
                    <div className="flex justify-center">
                        <CheckCircle2 size={100} className="text-white drop-shadow-2xl" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">일자리 확정!</h1>
                        <p className="text-xl text-white/90">{selectedJob.requester}님과 연결되었습니다</p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 space-y-3 text-white">
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-80">일자리</span>
                            <span className="font-bold">{selectedJob.title}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-80">근무 시간</span>
                            <span className="font-bold">{selectedJob.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-80">시급</span>
                            <span className="font-bold text-yellow-200">{selectedJob.pay}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-80">위치</span>
                            <span className="font-bold">{selectedJob.location}</span>
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

    // Job Listings Screen
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
                                                    <span className="text-xs">요청자: {job.requester}님</span>
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
                        <li>• 지원하시면 요청자가 곧 연락드립니다</li>
                        <li>• 가까운 거리의 일자리부터 추천됩니다</li>
                        <li>• 안전한 일자리만 엄선하여 제공합니다</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
