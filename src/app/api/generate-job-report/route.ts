import { NextRequest, NextResponse } from 'next/server'
import OpenAI, { toFile } from 'openai'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    const apiKey = process.env.OPENAI_API_KEY ?? ''
    if (!apiKey || !/^[\x00-\x7F]+$/.test(apiKey)) {
        return NextResponse.json(
            { error: 'OpenAI API key is missing or invalid' },
            { status: 500 }
        )
    }

    try {
        const formData = await request.formData()
        const audioFile = formData.get('audio') as File | null
        const jobTitle = formData.get('jobTitle') as string || '알 수 없는 업무'
        const requester = formData.get('requester') as string || '고객'
        const jobDescription = formData.get('jobDescription') as string || ''

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
        }

        // Step 1: Whisper STT
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

        const whisperFile = await toFile(buffer, `report.${extension}`, {
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

        // Step 2: GPT-4o-mini - Summarize into report format
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `당신은 시니어의 업무 리포트를 정리하는 전문 매니저입니다. 
                    선생님이 말씀하신 음성 텍스트를 바탕으로, 해당 업무의 원래 요청 내용과 매칭하여 깔끔한 '특이사항'과 '최종 결과'를 요약해 주세요.
                    
                    [업무 정보]
                    - 업무명: ${jobTitle}
                    - 수요자: ${requester}님
                    - 원래 요청 내용: ${jobDescription}
                    
                    [가이드라인]
                    1. 음성 텍스트에서 언급된 내용을 최우선으로 반영하되, 원래 요청된 업무 내용을 참고하여 '특이사항'을 전문적으로 매칭하세요.
                    2. 예를 들어 '산책 잘 했어요'라고만 했다면, 반려견 산책 업무임을 인지하여 '배변 활동 확인', '공원 산책 완료' 등 구체적인 표현으로 보완해 주세요.
                    3. 결과("specifics")는 다정하고 정중한 한국어 존댓말(해요체)로 작성하세요.

                    응답은 반드시 아래 JSON 형식으로만 하세요. 다른 설명은 절대 추가하지 마세요.
                    {
                      "transcription": "음성 인식 결과 원문",
                      "specifics": "특이사항 요약 (줄바꿈 포함 가능, 최대 3개의 불렛 포인트 형식이 좋습니다)",
                      "status": "정상 완료 / 이슈 발생 / 진행 중"
                    }`
                },
                {
                    role: 'user',
                    content: `선생님의 보고 내용: "${transcript}"`
                }
            ],
            response_format: { type: 'json_object' }
        })

        const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
        return NextResponse.json(result)

    } catch (error) {
        console.error('[generate-job-report] Error:', error)
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
    }
}
