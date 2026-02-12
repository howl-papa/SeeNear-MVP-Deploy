import { create } from 'zustand'

interface SeniorProfile {
    name: string
    summary: string
    voiceRaw: string
    badge: string
}

interface Store {
    seniorProfile: SeniorProfile | null
    setSeniorProfile: (profile: SeniorProfile) => void
}

export const useStore = create<Store>((set) => ({
    seniorProfile: null,
    setSeniorProfile: (profile) => set({ seniorProfile: { ...profile, name: "김철수" } })
}))
