"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, Heart, Map, ArrowRight, Smile } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-orange-50/50 flex flex-col font-sans">
      {/* Navigation / Logo Area */}
      <nav className="p-6 flex justify-between items-center max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Image src="/icon.svg" alt="SeeNear" width={32} height={32} className="rounded-lg" />
          <span className="text-xl font-bold text-stone-800 tracking-tight">SeeNear</span>
        </div>
        <div className="text-sm font-medium text-stone-500">
          Beta Service
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 max-w-md mx-auto w-full text-center">

        {/* Hero Image Area */}
        <div className="w-full relative rounded-3xl overflow-hidden mb-10 shadow-xl border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500 group bg-white">
          <Image
            src="/banner.png"
            alt="SeeNear Banner"
            width={600}
            height={450}
            className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
            priority
          />
        </div>

        {/* Typography */}
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-extrabold text-[#333333] leading-tight tracking-tight">
            가까운 이웃의<br />
            <span className="text-orange-500">따뜻한 도움</span>, SeeNear
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed max-w-xs mx-auto">
            믿을 수 있는 동네 선생님들이<br />
            당신의 소중한 일상을 도와드립니다.
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-4">
          {/* Demander Button (Primary) */}
          <Link href="/demander" className="group block w-full bg-orange-500 hover:bg-orange-600 text-white p-5 rounded-2xl shadow-lg shadow-orange-200 transition-all hover:-translate-y-1 active:scale-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium opacity-90">일손 찾기</div>
                  <div className="text-xl font-bold">도움이 필요해요</div>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 opacity-70 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Senior Button (Secondary) */}
          <Link href="/senior" className="group block w-full bg-white border-2 border-orange-100 hover:border-orange-300 text-stone-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 active:scale-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <Smile className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-stone-400">일자리 찾기</div>
                  <div className="text-xl font-bold text-stone-700">이웃을 돕고 싶어요</div>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-stone-300 group-hover:text-orange-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Map Control (Footer Link) */}
        <div className="mt-12 flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
          <Link href="/matching" className="flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-orange-500 hover:underline">
            <Map size={12} />
            <span>Map Simulation Control</span>
          </Link>
        </div>
        <div className="mt-12 flex items-center gap-2 opacity-50">
          <span>SeeNear MVP / DeV by Yongrak</span>
        </div>
      </main>
    </div>
  )
}
