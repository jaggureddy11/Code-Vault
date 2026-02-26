export class LiveAudioContext {
  private context: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private workletNode: ScriptProcessorNode | null = null;
  private onAudioData: (base64: string) => void;
  private isRecording = false;

  constructor(onAudioData: (base64: string) => void) {
    this.onAudioData = onAudioData;
  }

  async initAndStart() {
    if (this.isRecording) return;
    this.isRecording = true;

    // Use 16000 or 24000 which Gemini supports natively
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 16000,
    });

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = this.context.createMediaStreamSource(this.stream);

    // Using ScriptProcessorNode for wide browser compatibility
    this.workletNode = this.context.createScriptProcessor(4096, 1, 1);
    this.workletNode.onaudioprocess = (e) => {
      if (!this.isRecording) return;
      const inputData = e.inputBuffer.getChannelData(0);
      const outputData = new Int16Array(inputData.length);

      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        outputData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      // Convert Int16Array to base64
      let binary = '';
      const bytes = new Uint8Array(outputData.buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      this.onAudioData(window.btoa(binary));
    };

    source.connect(this.workletNode);
    // Needed in some browsers to actually trigger onaudioprocess
    this.workletNode.connect(this.context.destination);
  }

  stop() {
    this.isRecording = false;
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    if (this.workletNode) {
      this.workletNode.disconnect();
    }
    if (this.context && this.context.state !== 'closed') {
      this.context.close();
    }
  }

  playAudio(base64: string) {
    if (!this.context) return;
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 0x8000;
    }

    const audioBuffer = this.context.createBuffer(1, float32.length, 16000);
    audioBuffer.getChannelData(0).set(float32);

    const source = this.context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.context.destination);
    source.start(0);
  }
}
