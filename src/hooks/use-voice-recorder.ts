"use client"

import { useState, useEffect, useRef } from 'react'

export function useVoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [permissionError, setPermissionError] = useState(false)
    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = true
            recognitionRef.current.interimResults = true
            recognitionRef.current.lang = 'ko-KR'

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = ""
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript
                    } else {
                        finalTranscript += event.results[i][0].transcript
                    }
                }
                setTranscript(prev => prev + finalTranscript)
            }

            recognitionRef.current.onerror = (event: any) => {
                if (event.error === 'no-speech') {
                    return
                }

                if (event.error === 'not-allowed' || event.error === 'permission-denied' || event.error === 'service-not-allowed') {
                    console.warn("Speech recognition permission denied or service unavailable. Falling back to manual mode.")
                    setPermissionError(true)
                } else {
                    console.error("Speech recognition error", event.error)
                    setPermissionError(true)
                }
                setIsRecording(false)
            }

            recognitionRef.current.onend = () => {
                setIsRecording(false)
            }
        }
    }, [])

    const startRecording = () => {
        setPermissionError(false)
        if (recognitionRef.current) {
            try {
                setTranscript("")
                recognitionRef.current.start()
                setIsRecording(true)
            } catch (e) {
                console.error("Start error", e)
            }
        } else {
            alert("이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용해주세요.")
        }
    }

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            setIsRecording(false)
        }
    }

    return { isRecording, transcript, startRecording, stopRecording, permissionError }
}
