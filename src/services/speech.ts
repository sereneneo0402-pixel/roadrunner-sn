export class SpeechService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  static speak(
    text: string, 
    lang: string = 'en', 
    rate: number = 1.0, 
    onEnd?: () => void
  ): boolean {
    if (!this.synth) return false;

    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      
      // Map app language code to speech synthesis BCP-47 language tag
      const langMap: Record<string, string> = {
        'en': 'en-US',
        'zh-SG': 'zh-CN',
        'zh-TW': 'zh-TW',
        'ms': 'ms-MY',
        'ta': 'ta-IN',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'id': 'id-ID',
        'es': 'es-ES',
        'fr': 'fr-FR',
      };
      
      utterance.lang = langMap[lang] || 'en-US';
      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
      return true;
    } catch (e) {
      console.warn('Speech error:', e);
      return false;
    }
  }

  static stop(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Stop speech error:', e);
      }
    }
    this.currentUtterance = null;
  }

  static isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}
