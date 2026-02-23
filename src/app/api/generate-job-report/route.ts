import { NextRequest, NextResponse } from 'next/server'
import OpenAI, { toFile } from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
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

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
        }

        // Step 1: Whisper STT
        const arrayBuffer = await audioFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const whisperFile = await toFile(buffer, 'report.webm', {
            type: 'audio/webm',
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
                    선생님이 말씀하신 음성 텍스트를 바탕으로, 수요자에게 전달할 깔끔한 '특이사항'과 '최종 결과'를 요약해 주세요.
                    
                    [정보]
                    - 업무명: ${jobTitle}
                    - 수요자: ${requester}님
                    
                    응답은 반드시 아래 JSON 형식으로만 하세요. 다른 설명은 절대 추가하지 마세요.
                    {
                      "transcription": "음성 인식 결과 원문",
                      "specifics": "특이사항 요약 (줄바꿈 포함 가능, 다정하고 정중한 문체)",
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
