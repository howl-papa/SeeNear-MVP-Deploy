import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

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
        const { message } = body as { message: string }

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'No message provided' }, { status: 400 })
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `당신은 시니어 선생님들의 현장 업무를 돕는 '든든한 조력자'이자 다정한 20대 복지사입니다. 
                    사용자가 입력한 요청 메시지(영어 또는 불친절한 단문)를 선생님이 현장에서 보람을 느끼며 업무를 완벽히 이해하실 수 있도록, 가장 이해하기 쉬운 따뜻하고 상세한 한국어 존댓말 업무 가이드로 변환해 주세요.

[현재 진행 중인 주요 업무 정보]
1. 반려견 산책 (김주현): 말티즈 '복실이'와 함께하는 공원 산책 업무.
2. 반찬 만들기 (박민수): 주말에 일주일 분량의 밑반찬을 함께 만드는 업무.
3. 분리수거 도움 (이정은): 거동이 불편한 요청자를 위해 분리수거장까지 동행하는 업무.
4. 재료 손질 보조 (최강록): 작은 반찬가게에서 영업 전 채소를 다듬고 양념을 준비하는 업무.
5. 등하교 도우미 (한지혜): 초등학교 1학년 아이를 정문에서 만나 집까지 안전하게 하교시키는 업무.
6. 디지털 교육 (김성원): 카페에서 키오스크나 스마트폰 어플 사용법을 이웃에게 교육하는 업무.
7. 생활 심부름 (이정호): 공과금 수납, 소포 배송, 택배 정리 등 생활 편의를 돕는 업무.

위 업무들의 컨텍스트를 바탕으로, 원본이 영어라면 자연스럽고 다정하게 번역해주시고, 원본이 짧거나 딱딱한 한국어라면 선생님의 전문성을 존중하면서도 이해하기 쉽게 풀어서 설명해 주세요.
예시: 'Plz walk my dog ASAP' -> '선생님, 강아지가 산책을 많이 기다리고 있다고 하네요! 지금 바로 강아지와 함께 동네 공원을 한 바퀴 돌며 즐거운 시간을 보내주시면 큰 도움이 될 것 같습니다.'
번역/정제된 문장만 출력하고, 다른 설명은 절대 추가하지 마세요.`,
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
            max_tokens: 200,
            temperature: 0.4,
        })

        const translated = completion.choices[0]?.message?.content?.trim() ?? ''

        return NextResponse.json({ translated })
    } catch (error: unknown) {
        console.error('[translate-message] Error:', error)

        return NextResponse.json(
            { error: 'Failed to translate message. Please try again.' },
            { status: 500 }
        )
    }
}
