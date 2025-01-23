/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Button } from 'antd'
import { useRef, useState } from 'react'
import { restTransport } from '../../helpers/api'
import { apiUrl } from '../../../helpers'

export default function Page() {
  const [isRecording, setIsRecording] = useState(false)
  const [isRecording1, setIsRecording1] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const axios = restTransport();

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      audioChunks.current.push(event.data)
    }

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' })
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.webm')

      await axios.post(`${apiUrl}/lesson/upload-audio`, formData)

      const audioURL = URL.createObjectURL(audioBlob)
      setAudioURL(audioURL)
      audioChunks.current = []
    }

    mediaRecorder.start()
    mediaRecorderRef.current = mediaRecorder
    setIsRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  return (
    <div>
      <Button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      <Button onClick={isRecording1 ? stopRecording : startRecording}>
        {isRecording1 ? 'Stop Recording' : 'Start Recording'}
      </Button>
      {audioURL && <audio controls src={audioURL}></audio>}
    </div>
  )
}
