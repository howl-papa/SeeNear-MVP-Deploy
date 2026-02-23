"use client"

import { useState, useRef } from 'react'

export function useVoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false)
    const [permissionError, setPermissionError] = useState(false)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])

    const startRecording = async () => {
        setPermissionError(false)
        setAudioBlob(null)
        chunksRef.current = []

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

            // 브라우저 호환성 고려: wav 우선, 지원 안 되면 기본값 사용
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : MediaRecorder.isTypeSupported('audio/mp4')
                    ? 'audio/mp4'
                    : ''

            const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
            mediaRecorderRef.current = recorder

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data)
                }
            }

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, {
                    type: mimeType || 'audio/webm',
                })
                setAudioBlob(blob)
                // 스트림 해제
                stream.getTracks().forEach((track) => track.stop())
            }

            recorder.start(250) // 250ms 단위로 청크 수집
            setIsRecording(true)
        } catch (err) {
            console.error('MediaRecorder error:', err)
            setPermissionError(true)
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
    }

    return { isRecording, audioBlob, startRecording, stopRecording, permissionError }
}
