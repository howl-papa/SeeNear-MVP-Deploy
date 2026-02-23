import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
    // API 키 유효성 사전 검사
    const apiKey = process.env.OPENAI_API_KEY ?? ''
    if (!apiKey || !/^[\x00-\x7F]+$/.test(apiKey)) {
        return NextResponse.json(
            { error: '.env.local의 OPENAI_API_KEY에 실제 API 키를 입력해 주세요.' },
            { status: 500 }
        )
    }

    try {
        const body = await request.json()
        const { demanderRequest } = body as { demanderRequest: string }

        if (!demanderRequest) {
            return NextResponse.json({ error: 'No request provided' }, { status: 400 })
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `당신은 시니어 일자리 매칭 시스템의 AI 매니저입니다. 요청자의 요구사항을 분석하여, 이에 가장 적합한 가상의 시니어 후보자를 매칭하고 그 결과를 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요.

{
  "seniorName": "시니어 성함 (예: '김철수 선생님')",
  "distance": "걸어서 N분",
  "seniorMessage": "시니어가 요청자에게 보내는 따뜻하고 신뢰감 있는 첫 메시지 (요청 내용에 맞춰 의역)",
  "matchingLogs": [
    "🔍 후보자 분석 중...",
    "📍 위치 기반 매칭 시작",
    "✅ 최적 후보 발견: [이름]",
    "📞 연결 시도 중..."
  ]
}

규칙:
- seniorMessage는 요청자의 구체적인 요구사항(예: 강아지 산책, 아이 하교 등)을 해결해줄 수 있다는 자신감을 포함해야 함
- matchingLogs는 정확히 4개의 단계로 구성하되, 요청 내용에 따라 조금씩 변주 가능`,
                },
                {
                    role: 'user',
                    content: `요청자의 도움 요청 내용:\n\n"${demanderRequest}"`,
                },
            ],
            max_tokens: 400,
            temperature: 0.7,
            response_format: { type: 'json_object' },
        })

        const raw = completion.choices[0]?.message?.content?.trim() ?? '{}'
        const result = JSON.parse(raw)

        return NextResponse.json(result)
    } catch (error: unknown) {
        console.error('[match-senior] Error:', error)
        return NextResponse.json(
            {
                seniorName: '김철수 선생님',
                distance: '걸어서 5분',
                seniorMessage: '안녕하세요! 요청하신 내용을 돕기 위해 제가 바로 달려가겠습니다. 30년 경력으로 꼼꼼하게 도와드릴게요.',
                matchingLogs: [
                    "🔍 후보자 분석 중...",
                    "📍 위치 기반 매칭 시작",
                    "✅ 최적 후보 발견: 김철수 선생님",
                    "📞 연결 시도 중..."
                ]
            },
            { status: 200 } // Fallback to mock on error to keep demo working
        )
    }
}
