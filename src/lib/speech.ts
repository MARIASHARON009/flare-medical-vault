// Speech Recognition and Synthesis utilities

export class SpeechService {
  private recognition: any = null
  private synthesis: SpeechSynthesis | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = false
        this.recognition.interimResults = false
      }

      // Initialize Speech Synthesis
      this.synthesis = window.speechSynthesis
    }
  }

  // Voice Input (Speech to Text)
  startListening(
    onResult: (transcript: string) => void,
    onError?: (error: string) => void,
    language: string = 'en-US'
  ): () => void {
    if (!this.recognition) {
      onError?.('Speech recognition not supported in this browser')
      return () => {}
    }

    this.recognition.lang = language
    
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
    }

    this.recognition.onerror = (event: any) => {
      onError?.(event.error)
    }

    this.recognition.start()

    return () => {
      if (this.recognition) {
        this.recognition.stop()
      }
    }
  }

  // Voice Output (Text to Speech)
  speak(
    text: string,
    language: string = 'en-US',
    onEnd?: () => void
  ): () => void {
    if (!this.synthesis) {
      console.error('Speech synthesis not supported')
      return () => {}
    }

    // Cancel any ongoing speech
    this.synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language
    utterance.rate = 0.9
    utterance.pitch = 1

    if (onEnd) {
      utterance.onend = onEnd
    }

    this.synthesis.speak(utterance)

    return () => {
      if (this.synthesis) {
        this.synthesis.cancel()
      }
    }
  }

  // Get available voices
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return []
    return this.synthesis.getVoices()
  }
}

// Language code mapping
export const languageToSpeechCode: Record<string, string> = {
  'en': 'en-US',
  'ta': 'ta-IN',
  'hi': 'hi-IN'
}

export const speechService = new SpeechService()
