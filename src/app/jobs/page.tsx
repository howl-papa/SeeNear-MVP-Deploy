"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Clock, Coins, CheckCircle2, Briefcase, Home, Leaf, Phone, PhoneOff, Bot, Smartphone, ShieldCheck, ShoppingBag, Mic, Square } from "lucide-react"
import { useStore } from "@/lib/store"
import { useVoiceRecorder } from "@/hooks/use-voice-recorder"

// Mock job listings
const JOB_LISTINGS = [
    {
        id: 1,
        title: "반려견 산책 도우미",
        category: "가정 지원",
        icon: Home,
        location: "걸어서 5분",
        time: "오후 3-4시",
        pay: "13,500원/시간",
        description: "저희 집 귀여운 말티즈(3살, 이름은 복실이에요!) 평일 오후에 30분~1시간 정도 근처 공원에서 산책시켜 주실 분을 찾아요. 순하고 사람을 정말 좋아하는 아이라 산책이 즐거우실 거예요 🐕",
        requester: "김주현",
        distance: "250m",
        message: "Plz walk my dog 30min around park. ASAP."
    },
    {
        id: 2,
        title: "반찬 만들기 도움",
        category: "가정 지원",
        icon: Home,
        location: "걸어서 8분",
        time: "오전 10-12시",
        pay: "17,000원/시간",
        description: "주말에 일주일 먹을 밑반찬 4-5가지 정도 같이 만들어요. 저희 집 주방에서 함께 요리하면서 담소도 나누고 즐겁게 준비하려고 해요. 재료는 제가 다 준비할게요. 요리 좋아하시는 분이면 더 좋겠어요!",
        requester: "박민수",
        distance: "400m",
        message: "Side dish help 10am. Busy weekend."
    },
    {
        id: 3,
        title: "분리수거 도움",
        category: "환경 관리",
        icon: Leaf,
        location: "걸어서 3분",
        time: "아침 9-10시",
        pay: "10,500원/시간",
        description: "매주 화요일 아침 분리수거 하는 날인데, 제가 허리가 안 좋아서 무거운 것 들기가 힘들어요. 집 앞 분리수거장까지 같이 가서 분리수거 도와주시면 정말 감사하겠습니다.",
        requester: "이정은",
        distance: "150m",
        message: "Trash help. Tue 9am. Doorbell plz."
    },
    {
        id: 4,
        title: "재료 손질 보조",
        category: "사업 보조",
        icon: Briefcase,
        location: "걸어서 12분",
        time: "오전 8-11시",
        pay: "13,000원/시간",
        description: "작은 반찬가게를 운영하고 있어요. 평일 아침 영업 준비하면서 채소 다듬고 양념 준비하는 일 도와주실 분 찾습니다. 칼질이나 요리 경험 있으신 분이면 더 좋지만, 없어도 괜찮아요. 친절하게 알려드릴게요!",
        requester: "최강록",
        distance: "600m",
        message: "Prep assist 8am start. Sharp knife req."
    },
    {
        id: 5,
        title: "초등학생 등하교 도우미",
        category: "가정 지원",
        icon: ShieldCheck,
        location: "걸어서 10분",
        time: "오후 1-3시",
        pay: "15,000원/시간",
        description: "초등학교 1학년 아이의 하교를 도와주실 분을 찾아요. 학교 정문에서 만나서 집까지 안전하게 같이 걸어와 주시면 됩니다. 아이를 예뻐해주시고 꼼꼼하게 챙겨주실 선생님 환영합니다!",
        requester: "한지혜",
        distance: "500m",
        message: "School pickup 1pm. Gate 1. Urgent."
    },
    {
        id: 6,
        title: "디지털 기기 사용 교육",
        category: "사업 보조",
        icon: Smartphone,
        location: "걸어서 15분",
        time: "오후 2-4시",
        pay: "15,000원/시간",
        description: "동네 작은 카페에서 키오스크 사용법이나 스마트폰 어플 사용이 서투른 손님들을 도와주실 분을 찾습니다. 스마트폰 사용에 능숙하고 친절하게 설명해 주실 수 있는 선생님이면 좋겠어요!",
        requester: "김성원",
        distance: "800m",
        message: "Teach kiosk usage to old ppl. $15k/hr."
    },
    {
        id: 7,
        title: "생활 심부름",
        category: "환경 관리",
        icon: ShoppingBag,
        location: "걸어서 4분",
        time: "오후 6-7시",
        pay: "12,000원/시간",
        description: "바쁜 직장인입니다. 퇴직 후 시간이 많으신 선생님의 도움을 빌리고 싶어요. 주로 공과금 수납, 소포 배송, 간단한 분리수거 등을 부탁드리고자 합니다.",
        requester: "이정호",
        distance: "200m",
        message: "Package, trash, bills. Deli ASAP."
    }
]

// Baseline report data mapping for each job
const MOCK_REPORTS: Record<number, { specifics: string, status: string }> = {
    1: { specifics: "• 반려견 배변 활동 정상 완료\n• 산책 코스 이행 완료", status: "정상 완료" },
    2: { specifics: "• 요청하신 반찬 5종 준비 완료\n• 주방 뒷정리 완료", status: "정상 완료" },
    3: { specifics: "• 대형 폐기물 및 일반 쓰레기 배출 완료", status: "정상 완료" },
    4: { specifics: "• 오전 야채 손질 보조 완료\n• 영업 준비 지원 완료", status: "정상 완료" },
    5: { specifics: "• 학교 정문에서 아이 영접 완료\n• 자택까지 안전하게 동행", status: "정상 완료" },
    6: { specifics: "• 키오스크 사용 교육 3회 진행\n• 스마트폰 어플 사용 보조 완료", status: "정상 완료" },
    7: { specifics: "• 택배 수량 확인 및 공과금 수납 완료", status: "정상 완료" }
}

// Helper to determine gender emoji (very simple mock logic for demo)
const getRequesterEmoji = (name: string) => {
    // Female names in mock data
    const femaleNames = ['김주현', '이정은', '한지혜', '김영희']
    return femaleNames.includes(name) ? '👩🏻' : '👨🏻'
}

const CATEGORIES = ["전체", "가정 지원", "환경 관리", "사업 보조"]

export default function JobsPage() {
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState("전체")
    const [appliedJobs, setAppliedJobs] = useState<number[]>([])
    const [callStatus, setCallStatus] = useState<'none' | 'calling' | 'accepted' | 'working' | 'reporting_call' | 'reporting' | 'completed'>('none')
    const [selectedJob, setSelectedJob] = useState<typeof JOB_LISTINGS[0] | null>(null)
    const demanderRequest = useStore(state => state.demanderRequest)

    // Demo state for AI Work-Mate (always declared, only used when callStatus === 'working')
    const [demoStep, setDemoStep] = useState<'waiting' | 'message' | 'analyzing' | 'translated'>('waiting')
    const [hasSpoken, setHasSpoken] = useState(false)
    const [reportSpoken, setReportSpoken] = useState(false)
    const [showComplete, setShowComplete] = useState(false)

    // AI Work-Mate: 번역 및 가이드 결과
    const [translatedMessage, setTranslatedMessage] = useState('')

    // Voice Reporting Voice Recorder
    const { isRecording, audioBlob, startRecording, stopRecording } = useVoiceRecorder()
    const [reportData, setReportData] = useState<{
        transcription: string
        specifics: string
        status: string
    } | null>(null)
    const [isGeneratingReport, setIsGeneratingReport] = useState(false)

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

    // Reset demo state when entering working status
    useEffect(() => {
        if (callStatus === 'working') {
            setDemoStep('waiting')
            setHasSpoken(false)
            setShowComplete(false)
        }
    }, [callStatus])

    // TTS function for AI Work-Mate — 동적 번역 결과 사용
    const speakMessage = (text?: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(
                text ?? translatedMessage
            )
            utterance.lang = 'ko-KR'
            utterance.rate = 0.85
            utterance.pitch = 1.0
            utterance.volume = 1.0
            window.speechSynthesis.speak(utterance)
        }
    }

    // Automated scenario for AI Work-Mate demo
    useEffect(() => {
        if (callStatus !== 'working') return

        const ORIGINAL_MESSAGE = selectedJob?.message || demanderRequest || "도움이 필요합니다."
        const timers: NodeJS.Timeout[] = []

        // Step 1: Show message after 1.5s
        timers.push(setTimeout(() => {
            setDemoStep('message')
        }, 1500))

        // Step 2: Start analyzing after 3s + call refiner API
        timers.push(setTimeout(() => {
            setDemoStep('analyzing')

            fetch('/api/translate-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: ORIGINAL_MESSAGE }),
            })
                .then(res => res.ok ? res.json() : Promise.reject(res.status))
                .then(data => {
                    if (data.translated) {
                        setTranslatedMessage(data.translated)

                        // Transition to translated step and speak
                        // Give a small delay (0.5s) to ensure the analyzing animation was seen
                        const tGuide = setTimeout(() => {
                            setDemoStep('translated')
                            speakMessage(data.translated)
                            setHasSpoken(true)

                            // Step 4: Show complete button after audio starts (approx 3s later)
                            const tComplete = setTimeout(() => {
                                setShowComplete(true)
                            }, 3000)
                            timers.push(tComplete)
                        }, 1000)
                        timers.push(tGuide)
                    }
                })
                .catch(err => {
                    console.error('[translate-message] API failed:', err)
                    setTranslatedMessage('선생님, 요청하신 내용을 확인 중입니다. 잠시만 기다려 주세요.')
                    setDemoStep('translated')
                })
        }, 3500))

        return () => timers.forEach(timer => clearTimeout(timer))
    }, [callStatus, demanderRequest, selectedJob])

    // Generate Report Logic
    useEffect(() => {
        if (audioBlob && callStatus === 'reporting') {
            handleGenerateReport(audioBlob)
        }
    }, [audioBlob])

    const handleGenerateReport = async (blob: Blob) => {
        if (!selectedJob) return
        setIsGeneratingReport(true)

        const formData = new FormData()
        formData.append('audio', blob)
        formData.append('jobTitle', selectedJob.title)
        formData.append('requester', selectedJob.requester)

        try {
            const res = await fetch('/api/generate-job-report', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            setReportData(data)
            setCallStatus('completed')
        } catch (error) {
            console.error('Report generation failed:', error)
            // Fallback to mock based on job
            const mock = MOCK_REPORTS[selectedJob.id] || MOCK_REPORTS[1]
            setReportData({
                transcription: "보고 내용을 인식하지 못했습니다.",
                specifics: mock.specifics,
                status: mock.status
            })
            setCallStatus('completed')
        } finally {
            setIsGeneratingReport(false)
        }
    }

    // Incoming Call from AI Manager
    useEffect(() => {
        if (callStatus === 'reporting_call') {
            try {
                if (typeof window !== 'undefined' && window.speechSynthesis) {
                    const utterance = new SpeechSynthesisUtterance("AI 업무 매니저에게 전화가 왔습니다.")
                    utterance.lang = 'ko-KR'
                    window.speechSynthesis.speak(utterance)
                }
            } catch (error) {
                console.error('Speech synthesis not supported:', error)
            }
        }
    }, [callStatus])

    // Reporting Phase - AI Interaction
    useEffect(() => {
        if (callStatus === 'reporting') {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                // Cancel previous speech
                window.speechSynthesis.cancel()

                const utterance = new SpeechSynthesisUtterance("수고하셨습니다. 오늘 특이사항이 있으셨나요? 말씀해주세요.")
                utterance.lang = 'ko-KR'
                // Wait a bit before speaking to allow UI transition
                setTimeout(() => {
                    window.speechSynthesis.speak(utterance)
                }, 500)
            }
        }
    }, [callStatus])

    // TTS function for work completion report
    const speakReport = () => {
        if ('speechSynthesis' in window && selectedJob) {
            window.speechSynthesis.cancel()

            const specifics = reportData?.specifics || MOCK_REPORTS[selectedJob.id].specifics
            const status = reportData?.status || MOCK_REPORTS[selectedJob.id].status

            const reportText = `업무 리포트를 생성했습니다. ${selectedJob.requester}님과 함께 ${selectedJob.title} 업무를 ${status}했습니다. 특이사항은 다음과 같습니다. ${specifics}. 수고하셨습니다!`

            const utterance = new SpeechSynthesisUtterance(reportText)
            utterance.lang = 'ko-KR'
            utterance.rate = 0.9
            utterance.pitch = 1.0
            utterance.volume = 1.0
            window.speechSynthesis.speak(utterance)
        }
    }

    // Auto-speak report when work is completed
    useEffect(() => {
        if (callStatus === 'completed' && !reportSpoken) {
            // Wait 1 second before speaking
            const timer = setTimeout(() => {
                speakReport()
                setReportSpoken(true)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [callStatus, reportSpoken])

    // Incoming Call Screen
    if (callStatus === 'calling' && selectedJob) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in">
                    <div className="w-32 h-32 bg-white rounded-full mx-auto flex items-center justify-center shadow-2xl animate-pulse">
                        <span className="text-6xl">{getRequesterEmoji(selectedJob.requester)}</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">{selectedJob.requester} 선생님</h1>
                        <p className="text-xl text-white/90">전화가 왔습니다</p>
                        <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
                            <MapPin size={16} />
                            <span>{selectedJob.location}</span>
                        </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-white text-center max-w-[85%] mx-auto">
                        <p className="text-lg leading-relaxed font-medium">
                            "{selectedJob.description}"
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
            <div className="min-h-screen bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in">
                    <div className="flex justify-center">
                        <CheckCircle2 size={100} className="text-white drop-shadow-2xl" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">일자리 확정!</h1>
                        <p className="text-xl text-white/90">{selectedJob.requester}님과 연결되었습니다</p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-white text-left mb-4">
                        <p className="font-medium">
                            "{selectedJob.description}"
                        </p>
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
                            <span className="font-bold text-amber-200">{selectedJob.pay}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-80">위치</span>
                            <span className="font-bold">{selectedJob.location}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => setCallStatus('working')}
                            className="w-full bg-white text-orange-600 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all active:scale-95"
                        >
                            💼 일 시작하기
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full bg-white/20 border-2 border-white text-white py-3 rounded-2xl font-semibold transition-all active:scale-95"
                        >
                            뒤로 가기
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Working state - AI Work-Mate Communication (Dramatic Demo)
    if (callStatus === 'working' && selectedJob) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
                <div className="max-w-2xl mx-auto space-y-6 pt-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-stone-800">업무 진행 중</h1>
                        <p className="text-stone-600"> SeeNear AI와 함께 일하고 있습니다.</p>
                    </div>

                    {/* Meeting Info Card */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
                        <h2 className="font-bold text-stone-800 mb-3">만남 정보</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-stone-500">장소</span>
                                <span className="font-semibold text-stone-800">{selectedJob.location}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-stone-500">시간</span>
                                <span className="font-semibold text-stone-800">{selectedJob.time}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-stone-500">시급</span>
                                <span className="font-semibold text-amber-600">{selectedJob.pay}</span>
                            </div>
                        </div>
                    </div>

                    {/* Message Arrival Animation */}
                    {demoStep !== 'waiting' && (
                        <div className="animate-in slide-in-from-top fade-in duration-500">
                            <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-orange-400">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-stone-500 font-medium">요청 메시지 도착</span>
                                </div>
                                <p className="text-sm text-stone-600 italic">
                                    "{selectedJob?.message || demanderRequest || "도움이 필요합니다."}"
                                </p>
                            </div>
                        </div>
                    )}

                    {/* AI Analyzing Animation */}
                    {demoStep === 'analyzing' && (
                        <div className="animate-in slide-in-from-bottom fade-in duration-500">
                            <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-6 border-2 border-orange-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center animate-pulse">
                                        <Bot size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-orange-900">SeeNear AI가 메시지를 분석 중입니다...</p>
                                        <p className="text-xs text-orange-700">선생님이 이해하기 쉽게 번역하고 있어요</p>
                                    </div>
                                </div>
                                {/* Loading bar */}
                                <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Translation Card (Dramatic Reveal) */}
                    {demoStep === 'translated' && (
                        <div className="animate-in zoom-in fade-in duration-700">
                            <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-orange-300">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-orange-100">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center animate-bounce">
                                        <Bot size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-orange-900">AI Work-Mate</h3>
                                        <p className="text-xs text-orange-600">선생님 가이드</p>
                                    </div>
                                    <span className="ml-auto bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                                        AI 업무 가이드
                                    </span>
                                </div>

                                {/* Translated Message - Large and Clear (동적 API 결과) */}
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 mb-6 border-2 border-orange-200">
                                    <p className="text-2xl font-bold text-stone-900 leading-relaxed text-center whitespace-pre-line">
                                        {translatedMessage}
                                    </p>
                                </div>

                                {/* Replay Button - Very Large */}
                                <button
                                    onClick={() => speakMessage()}
                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-6 rounded-2xl font-bold text-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <span className="text-4xl">🔊</span>
                                    다시 듣기
                                </button>

                                <p className="text-center text-xs text-stone-500 mt-3">
                                    음성으로 다시 들으시려면 위 버튼을 눌러주세요
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                        {showComplete ? (
                            <button
                                onClick={() => setCallStatus('reporting_call')}
                                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 animate-in fade-in zoom-in duration-500"
                            >
                                ✅ 업무 완료
                            </button>
                        ) : (
                            <div className="w-full bg-orange-100 border-2 border-orange-200 text-orange-700 py-4 rounded-2xl font-bold text-lg text-center animate-pulse">
                                🔄 업무 진행 중...
                            </div>
                        )}
                        <button
                            onClick={() => setCallStatus('accepted')}
                            className="w-full bg-white border-2 border-stone-200 text-stone-700 py-3 rounded-2xl font-semibold transition-all active:scale-95"
                        >
                            뒤로 가기
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Reporting Call - Incoming Call from AI
    if (callStatus === 'reporting_call') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in">
                    <div className="w-32 h-32 bg-white rounded-full mx-auto flex items-center justify-center shadow-2xl animate-pulse">
                        <Bot size={64} className="text-blue-600" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-white drop-shadow-lg">AI 업무 매니저</h1>
                        <p className="text-xl text-white/90">업무 리포트 작성을 위해 전화했습니다</p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-white">
                        <p className="text-lg leading-relaxed">
                            "안녕하세요! 오늘 업무는 어떠셨나요? 잠시 통화 가능하신가요?"
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center pt-4">
                        <button
                            onClick={() => setCallStatus('working')}
                            className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95"
                        >
                            <PhoneOff size={32} className="text-white" />
                        </button>
                        <button
                            onClick={() => setCallStatus('reporting')}
                            className="w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 animate-bounce"
                        >
                            <Phone size={32} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Reporting Phase - AI Listening
    if (callStatus === 'reporting') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-12 animate-in fade-in">
                    <div className="space-y-4">
                        <div className={`w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg ${isRecording ? 'animate-pulse scale-110 shadow-orange-200' : ''}`}>
                            <Bot size={40} className="text-orange-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                            {isGeneratingReport ? '보고서를 생성 중입니다...' : isRecording ? 'AI가 듣고 있습니다...' : '전화가 연결되었습니다'}
                        </h2>
                        <p className="text-white/80 italic">"오늘 특이사항이 있으셨나요?"</p>
                    </div>

                    {/* Voice Visualizer Animation */}
                    <div className="flex items-center justify-center gap-2 h-16">
                        {isRecording ? (
                            [...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-3 bg-white rounded-full animate-bounce"
                                    style={{
                                        height: '100%',
                                        animationDelay: `${i * 0.1}s`,
                                        animationDuration: '0.6s'
                                    }}
                                />
                            ))
                        ) : (
                            <div className="w-16 h-2 bg-white/20 rounded-full" />
                        )}
                    </div>

                    <div className="space-y-4">
                        {!isGeneratingReport && (
                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 shadow-2xl transition-all active:scale-95 mx-auto ${isRecording ? 'bg-red-500 text-white' : 'bg-white text-orange-500'
                                    }`}
                            >
                                {isRecording ? (
                                    <>
                                        <Square size={32} fill="currentColor" />
                                        <span className="font-bold">보고 종료</span>
                                    </>
                                ) : (
                                    <>
                                        <Mic size={32} />
                                        <span className="font-bold">보고 시작</span>
                                    </>
                                )}
                            </button>
                        )}

                        {isGeneratingReport && (
                            <div className="flex justify-center flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                <p className="text-white font-medium">AI 매니저가 리포트를 정리 중입니다</p>
                            </div>
                        )}
                    </div>

                    {!isRecording && !isGeneratingReport && (
                        <button
                            onClick={() => setCallStatus('completed')}
                            className="bg-white/20 hover:bg-white/30 text-white/80 hover:text-white px-6 py-3 rounded-full text-sm transition-colors border border-white/30"
                        >
                            건너뛰기 (테스트용)
                        </button>
                    )}
                </div>
            </div>
        )
    }

    // Work Completed - Voice Report Screen
    if (callStatus === 'completed' && selectedJob) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
                <div className="max-w-2xl mx-auto space-y-6 pt-6">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                                <CheckCircle2 size={60} className="text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-stone-800">업무 완료!</h1>
                        <p className="text-lg text-stone-600">AI Work-Mate가 업무 리포트를 생성했습니다</p>
                    </div>

                    {/* AI Report Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-2xl border-2 border-orange-200">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-orange-100">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                                <Bot size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-orange-900">업무 리포트</h3>
                                <p className="text-xs text-orange-600">SeeNear AI로 자동 생성됨</p>
                            </div>
                            <span className="ml-auto bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                                ✓ 완료
                            </span>
                        </div>

                        {/* Report Content */}
                        <div className="space-y-4 mb-6">
                            <div className="bg-orange-50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-orange-900">일자리</span>
                                    <span className="text-sm text-orange-700">{selectedJob.title}</span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-orange-900">수요자</span>
                                    <span className="text-sm text-orange-700">{selectedJob.requester}님</span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-orange-900">근무 시간</span>
                                    <span className="text-sm text-orange-700">{selectedJob.time}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-orange-900">시급</span>
                                    <span className="text-sm font-bold text-amber-600">{selectedJob.pay}</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border-2 border-orange-200">
                                <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                                    <span className="text-xl">📋</span>
                                    특이사항
                                </h4>
                                <p className="text-orange-800 leading-relaxed whitespace-pre-line">
                                    {reportData?.specifics || (selectedJob ? MOCK_REPORTS[selectedJob.id].specifics : '특이사항 없음')}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
                                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                    <span className="text-xl">✅</span>
                                    수행 결과
                                </h4>
                                <p className="text-xl font-bold text-amber-900 text-center">
                                    {reportData?.status || (selectedJob ? MOCK_REPORTS[selectedJob.id].status : '완료')}
                                </p>
                            </div>

                            {reportData?.transcription && (
                                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                                    <p className="text-[10px] text-stone-400 font-mono">음성인식 결과: {reportData.transcription}</p>
                                </div>
                            )}
                        </div>

                        {/* Replay Button */}
                        <button
                            onClick={speakReport}
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-6 rounded-2xl font-bold text-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 mb-3"
                        >
                            <span className="text-4xl">🔊</span>
                            리포트 다시 듣기
                        </button>

                        <p className="text-center text-xs text-stone-500">
                            음성으로 다시 들으시려면 위 버튼을 눌러주세요
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/')}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95"
                        >
                            홈으로 돌아가기
                        </button>
                        <button
                            onClick={() => setCallStatus('working')}
                            className="w-full bg-white border-2 border-stone-200 text-stone-700 py-3 rounded-2xl font-semibold transition-all active:scale-95"
                        >
                            뒤로 가기
                        </button>
                    </div>
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
