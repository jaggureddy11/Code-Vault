const WebSocket = require('ws');
const fs = require('fs');

const url = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=AIzaSyCfxdCIS_tbLQK-KXNTSuFWPwSnVXvtrWQ';
const ws = new WebSocket(url);

ws.on('open', () => {
    console.log("Connected");
    ws.send(JSON.stringify({
        setup: {
            model: "models/gemini-2.0-flash-exp",
        }
    }));
    
    // send dummy audio
    const dummyAudio = Buffer.alloc(16000 * 2); // 1 sec of silence Int16 PCM
    ws.send(JSON.stringify({
        realtimeInput: { mediaChunks: [{ mimeType: "audio/pcm;rate=16000", data: dummyAudio.toString('base64') }] }
    }));
    
    // Wait for response text?
    ws.send(JSON.stringify({
        clientContent: { turns: [{ role: 'user', parts: [{ text: "Hello! Are you there?" }] }], turnComplete: true }
    }));
});
ws.on('message', m => {
    const data = JSON.parse(m.toString());
    console.log('Got msg keys:', Object.keys(data));
    if (data.serverContent?.modelTurn) {
        console.log('Got model output parts');
    }
});
ws.on('error', console.error);
ws.on('close', (c, r) => console.log('Closed', c, r.toString()));
