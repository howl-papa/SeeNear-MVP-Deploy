import { NextRequest, NextResponse } from 'next/server'
import OpenAI, { toFile } from 'openai'

interface AnalysisResult {
    name: string
    summary: string
    recommendReason: string
    recommendedJobs: Array<{
        id: number
        title: string
        location: string
        pay: string
        reason: string
    }>
}

const FALLBACK_RESULT: AnalysisResult = {
    name: '선생님',
    summary: '다양한 생활 경험 보유, 성실하고 친화력 있음',
    recommendReason: '말씀하신 경험을 바탕으로',
    recommendedJobs: [
        { id: 1, title: '반려견 산책 도우미', location: '걸어서 5분', pay: '15,000원/시간', reason: '생활 경험이 풍부하셔서' },
        { id: 2, title: '장보기 대행', location: '걸어서 7분', pay: '13,000원/시간', reason: '꼼꼼하고 성실하셔서' },
        { id: 3, title: '말벗 도우미', location: '걸어서 3분', pay: '12,000원/시간', reason: '사람 만나는 걸 좋아하셔서' },
    ]
}

/**
 * GPT-4o-mini를 사용해 음성 텍스트에서 경력 요약 + 추천 일자리를 JSON으로 반환
 */
async function analyzeWithGPT(openai: OpenAI, transcript: string, labels: string[] = []): Promise<AnalysisResult> {
    const contextStr = labels.length > 0 ? `선택된 역량/상태: ${labels.join(', ')}` : ''

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: `도착한 음성 데이터와 사전에 선택된 시니어의 특성(체크리스트)을 바탕으로, 시니어의 일상적 경험을 SeeNear의 비즈니스 가치로 연결하는 전문 복지사입니다.

[분석 및 매칭 가이드라인]
1. 당신은 시니어 선생님의 파편화된 경험(암묵지)을 분석하여 아래 [3대 핵심 타겟 업무] 중 가장 적합한 1가지를 주력 분야로 선정해야 합니다.
2. 선정된 분야에 맞춰, 수요자가 신뢰할 수 있도록 선생님의 능력을 강조하는 1~2줄의 매력적인 프로필 요약문("summary")을 작성하세요.
3. 추천 일자리("recommendedJobs")는 반드시 아래 3가지 카테고리 내의 구체적인 업무들로 구성하세요.

[SeeNear 3대 핵심 타겟 업무]
- [타겟 1] 바쁜 3040 맞벌이 가정 지원 (주요 업무: 하교 지도, 간단한 반찬 준비, 택배 정리)
- [타겟 2] 1인 가구 및 직장인 생활 편의 (주요 업무: 분리수거 대행, 반려견 산책, 약 배달)
- [타겟 3] 지역 소상공인 업무 보조 (주요 업무: 식당 오픈 준비/채소 손질, 전단지 배부, 매장 청결 관리)

[응답 형식: JSON]
{
  "name": "성함 (텍스트에서 추출, 없으면 '선생님')",
  "summary": "타겟 업무에 맞춰 선생님의 숙련도를 강조한 요약문 (예: '30년 요리 경력으로 맞벌이 가정의 건강한 식탁을 책임지는 든든한 조력자')",
  "recommendReason": "주요 타겟 업무와의 매칭 이유. 이 구절은 '{성함} 선생님은' 뒤에 바로 이어지므로, 자연스럽게 문장이 연결되도록 '~기 때문입니다' 또는 '~하신 만큼 ~에 적합합니다' 형식을 사용하세요. (예: '풍부한 가사 경험과 꼼꼼한 성격이 맞벌이 가정의 일상 지원에 꼭 필요하기 때문입니다')",
  "recommendedJobs": [
    { "id": 1, "title": "일자리명 (위 3대 업무 중 하나)", "location": "걸어서 N분", "pay": "금액원/시간", "reason": "추천 이유 (최대한 간결하게)" },
    { "id": 2, "title": "일자리명", "location": "걸어서 N분", "pay": "금액원/시간", "reason": "추천 이유" },
    { "id": 3, "title": "일자리명", "location": "걸어서 N분", "pay": "금액원/시간", "reason": "추천 이유" }
  ]
}

[규칙]
- 일자리는 정확히 3개.
- 시급은 12,000~20,000원 범위.
- **추천 사유(recommendReason)는 절대 '선생님은' 또는 '[성함] 선생님은'으로 시작하지 마세요.** (이미 UI에서 해당 문구가 앞에 붙습니다) 바로 핵심 근거부터 서술하세요. (예: '다양한 가사 지원 경험이...' 로 시작)
- 모든 설명은 다정하고 정중한 한국어 존댓말로 작성하세요.`,
            },
            {
                role: 'user',
                content: `[사용자 체크리스트 특성]
${contextStr}

[음성 인식 답변 전달]
"${transcript}"`,
            },
        ],
        max_tokens: 600,
        temperature: 0.5,
        response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content?.trim() ?? '{}'
    try {
        const parsed = JSON.parse(raw) as AnalysisResult
        if (!parsed.summary || !Array.isArray(parsed.recommendedJobs)) {
            return FALLBACK_RESULT
        }
        return parsed
    } catch {
        return FALLBACK_RESULT
    }
}


export async function POST(request: NextRequest) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    // API 키 유효성 사전 검사 — 한글 플레이스홀더가 남아있으면 명확한 에러 반환
    const apiKey = process.env.OPENAI_API_KEY ?? ''
    if (!apiKey || !/^[\x00-\x7F]+$/.test(apiKey)) {
        return NextResponse.json(
            { error: '.env.local의 OPENAI_API_KEY에 실제 API 키를 입력해 주세요. (현재 값에 한글이 포함되어 있거나 비어 있습니다)' },
            { status: 500 }
        )
    }

    try {
        const formData = await request.formData()

        // Context labels from checklist
        const labelsRaw = formData.get('labels') as string | null
        const labels = labelsRaw ? JSON.parse(labelsRaw) : []

        // 경로 A: 데모용 fallback_text (오디오 없이 텍스트 직접 전달)
        const fallbackText = formData.get('fallback_text') as string | null
        if (fallbackText) {
            const result = await analyzeWithGPT(openai, fallbackText, labels)
            return NextResponse.json({ transcript: fallbackText, ...result })
        }

        // 경로 B: 실제 오디오 파일 → Whisper STT → GPT 요약
        const audioFile = formData.get('audio') as File | null
        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
        }

        // Step 1: Whisper STT — 오디오 Blob → 텍스트 변환
        const arrayBuffer = await audioFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Normalize MIME type and extension for Whisper compatibility
        // Some browsers send 'audio/webm;codecs=opus'. Whisper needs 'audio/webm' or just the extension.
        const rawType = audioFile.type || ''
        const fileName = audioFile.name || ''

        // Base MIME type (remove codecs)
        let baseMimeType = rawType.split(';')[0].trim() || 'audio/webm'

        // Extension detection logic
        let extension = 'webm'
        if (baseMimeType.includes('mp4') || fileName.endsWith('.mp4') || fileName.endsWith('.m4a')) {
            extension = 'mp4'
            baseMimeType = 'audio/mp4'
        } else if (baseMimeType.includes('ogg') || fileName.endsWith('.ogg')) {
            extension = 'ogg'
            baseMimeType = 'audio/ogg'
        } else if (baseMimeType.includes('wav') || fileName.endsWith('.wav')) {
            extension = 'wav'
            baseMimeType = 'audio/wav'
        } else if (baseMimeType.includes('mpeg') || fileName.endsWith('.mp3')) {
            extension = 'mp3'
            baseMimeType = 'audio/mpeg'
        } else {
            // Default to webm if unknown but common for MediaRecorder
            extension = 'webm'
            baseMimeType = 'audio/webm'
        }

        const whisperFile = await toFile(buffer, `audio.${extension}`, {
            type: baseMimeType,
        })

        const transcription = await openai.audio.transcriptions.create({
            file: whisperFile,
            model: 'whisper-1',
            language: 'ko',
        })

        const transcript = transcription.text?.trim()
        if (!transcript) {
            return NextResponse.json({ error: 'Could not transcribe audio' }, { status: 422 })
        }

        // Step 2: GPT-4o-mini — 텍스트 → 경력 분석 + 일자리 추천
        const result = await analyzeWithGPT(openai, transcript, labels)

        return NextResponse.json({ transcript, ...result })
    } catch (error: unknown) {
        console.error('[analyze-voice] Error:', error)

        if (error instanceof Error && error.message.includes('API key')) {
            return NextResponse.json(
                { error: 'OpenAI API key is not configured' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to analyze voice. Please try again.' },
            { status: 500 }
        )
    }
}

