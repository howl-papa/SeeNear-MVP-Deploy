import { create } from 'zustand'

export interface RecommendedJob {
    id: number
    title: string
    location: string
    pay: string
    reason: string
}

interface SeniorProfile {
    name: string
    summary: string
    voiceRaw: string
    badge: string
    recommendReason?: string
    recommendedJobs?: RecommendedJob[]
}

export interface SeniorAuthInfo {
    name: string
    birthYear: string
    centerName: string
}

interface Store {
    seniorProfile: SeniorProfile | null
    seniorAuthInfo: SeniorAuthInfo | null
    demanderRequest: string
    checkedLabels: string[]
    setSeniorProfile: (profile: SeniorProfile) => void
    setSeniorAuthInfo: (info: SeniorAuthInfo | null) => void
    setDemanderRequest: (request: string) => void
    setCheckedLabels: (labels: string[]) => void
}

export const useStore = create<Store>((set) => ({
    seniorProfile: null,
    seniorAuthInfo: null,
    demanderRequest: '',
    checkedLabels: [],
    setSeniorProfile: (profile) => set({ seniorProfile: { ...profile, name: profile.name || '선생님' } }),
    setSeniorAuthInfo: (info) => set({ seniorAuthInfo: info }),
    setDemanderRequest: (request) => set({ demanderRequest: request }),
    setCheckedLabels: (labels) => set({ checkedLabels: labels })
}))
