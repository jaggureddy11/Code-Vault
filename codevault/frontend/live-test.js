import { GoogleGenAI } from '@google/genai';

async function testLiveAPI() {
    console.log("Testing Live Connect...");
    const ai = new GoogleGenAI({ apiKey: 'AIzaSyCfxdCIS_tbLQK-KXNTSuFWPwSnVXvtrWQ' });
    
    // Check if live API is exposed on the client
    if (ai.live) {
        console.log("ai.live exists", Object.keys(ai.live));
        try {
            const session = await ai.live.connect({ model: "gemini-2.0-flash-exp-live" });
            console.log("Connected!", session);
        } catch (e) {
            console.error(e.message);
        }
    } else {
        console.log("ai.live does NOT exist in this version of the SDK");
    }
}
testLiveAPI().catch(console.error);
