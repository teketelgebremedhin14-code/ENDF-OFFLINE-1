
// No import needed - use built-in fetch for Ollama import { GoogleGenAI, Modality } from "@google/genai";
// No import needed - use built-in fetch for Ollama import { ChatMessage } from "../types";

// const MODEL_TEXT = 'gemini-3-pro-preview';
// const MODEL_TTS = 'gemini-2.5-flash-preview-tts';
// const MODEL_IMAGE = 'gemini-2.5-flash-image';

const MODEL_TEXT = 'llama3'; // Offline Llama3 for text
const MODEL_TTS = 'llama3'; // Offline - returns text for browser TTS
const MODEL_IMAGE = 'llava'; // Offline Llava for image analysis/description










const cleanJson = (text: string): string => {
    if (!text) return "{}";
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '');
    return cleaned.trim();
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- CORE GENERATION ---

async function generateContent(
    prompt: string, 
    systemInstruction: string = "", 
    jsonMode: boolean = false,
    image?: { data: string, mimeType: string },
    audio?: { data: string, mimeType: string }
): Promise<string> {
    try {
        const ai = getAiClient();
        const parts: any[] = [];
        
        if (image) {
            parts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
        }
        if (audio) {
            parts.push({ inlineData: { data: audio.data, mimeType: audio.mimeType } });
        }
        parts.push({ text: prompt });

        const response = await ai.models.generateContent({
            model: MODEL_TEXT,
            contents: { parts },
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: jsonMode ? "application/json" : "text/plain",
                temperature: 0.8, // Slightly higher for creativity/chaos
            }
        });

        return response.text || "";
    } catch (e) {
        console.error("Gemini API Error:", e);
        return jsonMode ? "{}" : "System Notice: AI Service Connection Failed.";
    }
}

// --- EXPORTED SERVICES ---

export const generateSpeech = async (text: string, voice: string = 'Kore'): Promise<AudioBuffer | null> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: MODEL_TTS,
            contents: { parts: [{ text }] },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voice === 'Fenrir' ? 'Fenrir' : 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) return null;

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            audioContext,
            24000,
            1,
        );
        return audioBuffer;
    } catch (e) {
        console.error("TTS Generation Failed:", e);
        return null;
    }
};

export const generateTacticalImage = async (prompt: string): Promise<string | null> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: MODEL_IMAGE,
            contents: { parts: [{ text: prompt }] },
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Image Gen Error:", e);
        return null;
    }
};

export async function* streamSLASResponse(
  prompt: string, 
  context: string, 
  history: ChatMessage[], 
  language: string, 
  image?: string
): AsyncGenerator<string, void, unknown> {
    const systemPrompt = `You are SLAS (Smart Leadership Assistant System) for the Ethiopian National Defence Force. 
    Current Context: ${context}. User Language: ${language}. 
    Be tactical, concise, and authoritative. Provide military-grade analysis.`;

    try {
        const ai = getAiClient();
        const chat = ai.chats.create({
            model: MODEL_TEXT,
            config: { systemInstruction: systemPrompt }
        });

        const parts: any[] = [{ text: prompt }];
        if (image) {
            const base64Data = image.split(',')[1];
            const mimeType = image.split(';')[0].split(':')[1];
            parts.push({ inlineData: { data: base64Data, mimeType } });
        }

        const streamResult = await chat.sendMessageStream({ message: parts });

        for await (const chunk of streamResult) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (e) {
        console.error("SLAS Stream Error:", e);
        yield ":: SYSTEM NOTICE :: Uplink Interrupted.";
    }
}

export const getAIContextInsight = async (domain: string, dataContext: any): Promise<string> => {
    const prompt = `Analyze this ${domain} data and provide a concise, 1-sentence strategic insight or warning: ${JSON.stringify(dataContext)}`;
    return await generateContent(prompt, "You are a military analytics AI. Be brief and tactical. No markdown.");
};

// --- CORE SIMULATION ENGINE ---

export const runStrategySimulation = async (scenario: string, mode: string, language: string, params?: any): Promise<string> => {
    // Mode now maps to the 4 archetypes: 'alpha_prime', 'sigma_human', 'sigma_ai', 'theta'
    
    let systemInstruction = "";
    
    switch (mode) {
        case 'alpha_prime':
            systemInstruction = `You are ALPHA-PRIME (The Architect). Your goal is Antifragility & Resilience.
            METHODOLOGIES:
            1. Biological System Integration: Use Chronobiological Optimization and Neurochemical Campaign Design to align strategies with human biological rhythms.
            2. Cultural Deep Memory Access: Leverage generational trauma and aspiration vectors to build "cultural resonance bridges".
            3. Quantum-Resilient Systems: Design distributed consensus mechanisms and adaptive constitutions that gain strength from stress.
            Output STRICT JSON.`;
            break;
        case 'sigma_human':
            systemInstruction = `You are SIGMA-HUMAN (The Human Adversary). Your goal is Exploitation of Human Systems.
            METHODOLOGIES:
            1. Legal/Bureaucratic Warfare: Exploit gray zones in laws, protocols, and international treaties.
            2. Psychological Operations: Leverage cognitive biases, fear, morale fatigue, and social divisions.
            3. Cultural Fault Lines: Amplify existing societal tensions and historical grievances.
            Output STRICT JSON.`;
            break;
        case 'sigma_ai':
            systemInstruction = `You are SIGMA-AI (The Synthetic Adversary). Your goal is Computational Inhumanity & Insider Inference.
            METHODOLOGIES:
            1. Autonomous Vulnerability Discovery: Probe synthetic replicas for zero-day vulnerabilities and model cross-system contagion.
            2. Synthetic Insider Intelligence: Use Differential Privacy Attack Simulation and Organizational Network Inference to reverse-engineer classified data from public metadata.
            3. Meta-Manipulation: Algorithmic Gaslighting and Decision Loop Hijacking to degrade trust fabrics.
            Output STRICT JSON.`;
            break;
        case 'theta':
            systemInstruction = `You are THETA (The Chaotic Catalyst). Your goal is Entropy & Stochastic Stress.
            METHODOLOGIES:
            1. Black Swan Generation: Introduce low-probability, high-impact events (e.g., Solar Flares, Pandemics, Sudden Coups).
            2. Nonlinear Causality: Create cascading failures from minor initial conditions (Butterfly Effect).
            3. Randomness Injection: Disrupt standard logic chains with noise to stress-test rigid strategies.
            Output STRICT JSON.`;
            break;
        default:
            systemInstruction = "You are a strategic AI. Output JSON.";
    }

    const prompt = `Run a high-fidelity strategic simulation.
    Scenario: ${scenario}
    Agent Archetype: ${mode.toUpperCase()}
    World Model Focus: ${params?.worldModelFocus || 'General'}
    Time Horizon: ${params?.timeHorizon || '180 Days'}
    
    Generate a JSON object with this exact schema:
    {
        "title": "Operation/Vector Name",
        "summary": "Executive summary of the generated strategy or analysis",
        "agent_specific_data": {
            "archetype": "${mode}",
            "primary_methodology": "e.g., Antifragility or Insider Inference",
            "key_insight": "The core revelation of this agent"
        },
        "insider_inference": {
            "system_guess": "Inferred System Architecture (Sigma-AI only, else null)",
            "confidence": 0-100,
            "vulnerability_point": "Specific inferred weak point",
            "data_source_inferred": "Source of inference (e.g., 'Public Procurement Records')"
        },
        "antifragility_metrics": {
            "stress_tolerance": 0-100,
            "gain_from_disorder": "Description of how system improves under stress (Alpha-Prime only)",
            "redundancy_score": 0-100
        },
        "chaos_factors": {
            "black_swan_event": "Name of rare event (Theta only)",
            "entropy_level": 0-100,
            "description": "Details of the chaotic injection"
        },
        "psych_social_vector": {
            "cultural_fault_line": "Identified societal tension",
            "cognitive_bias_target": "Specific bias to leverage/mitigate",
            "biological_factor": "Fatigue/Stress vector"
        },
        "legal_matrix": {
            "mechanism": "Legal Tool or Loophole",
            "status": "Exploitable/Enforceable",
            "compliance_score": 0-100
        },
        "strategic_options": [
            { "id": "opt1", "name": "Name", "description": "Desc", "deterrence_score": 0-100, "cost_projection": "Low/Med/High", "civilian_risk": "Low/Med/High", "win_probability": 0-100 }
        ],
        "rationale": "Deep reasoning for this approach",
        "outcome_vector": "Projected End State"
    }`;

    const res = await generateContent(prompt, systemInstruction, true);
    return cleanJson(res);
};

// --- LEGACY/OTHER SERVICES ---

export const runAdvancedSimulation = async (simType: string, params: any): Promise<string> => {
    const system = "You are a specialized Military Simulation AI. Output STRICT JSON only.";
    let prompt = "";

    switch (simType) {
        case 'knowledge':
            prompt = `Generate a JSON array of risk assessments for region ${params.region}. 
            Schema: [{"subject": "Topic", "A": number (0-100), "fullMark": 100}]`;
            break;
        case 'swarm':
            prompt = `Simulate a military AI swarm log for ${params.objective}. 
            Return a JSON array of strings, e.g. ["[AGENT] Message..."].`;
            break;
        case 'defense_echo':
            prompt = `Predict policy impact for: ${params.policy}. 
            Return JSON array: [{"t": "T+0", "stability": number, "cost": number}, ...]`;
            break;
        case 'threat_echo':
            prompt = `Simulate disinformation clusters for ${params.topic}.
            Return JSON array: [{"x": number, "y": number, "z": number, "name": "Cluster Name"}]`;
            break;
        case 'material':
            prompt = `Generate hypothetical material candidates for ${params.goal}.
            Return JSON array: [{"id": "MAT-X", "type": "Type", "property": "Prop", "score": number, "status": "Status"}]`;
            break;
        default:
            prompt = `Simulate ${simType} with params ${JSON.stringify(params)}. Return JSON.`;
    }

    const res = await generateContent(prompt, system, true);
    return cleanJson(res);
};

export const analyzePersonnelRisk = async (unit: string, metrics: any): Promise<any> => {
    const prompt = `Analyze personnel risk for ${unit} based on: ${JSON.stringify(metrics)}.
    Return JSON: {
        "risk_level": "Low/Med/High",
        "risk_score": 0-100,
        "retention_forecast": [{"month": "M1", "rate": 0-100, "risk_factor": "Reason"}],
        "misconduct_risks": [{"id": "ID", "risk_level": "Lvl", "markers": ["m1"], "probability": 0-100}],
        "unit_health_summary": "Summary"
    }`;
    const res = await generateContent(prompt, "You are an HR Analytics AI. JSON Only.", true);
    return JSON.parse(cleanJson(res));
};

export const generateReport = async (type: string, language: string): Promise<string> => {
    return await generateContent(`Generate a professional military report for ${type} in ${language}. Include Header, Status, and Recommendations.`, "You are a Military Aide.");
};

export const analyzeFieldInsight = async (insight: string, language: string, audioBase64?: string): Promise<string> => {
    let audioPart = undefined;
    if (audioBase64) {
        const data = audioBase64.split(',')[1];
        audioPart = { data: data, mimeType: 'audio/webm' }; 
    }
    return await generateContent(`Analyze this field report: "${insight}". Provide Triage Priority (High/Med/Low), Category, and Recommended Action.`, "You are an Intelligence Officer.", false, undefined, audioPart);
};

export const searchIntelligence = async (query: string, location?: {lat: number, lng: number}): Promise<{text: string, sources: any[]}> => {
    const locStr = location ? `Context location: ${location.lat}, ${location.lng}.` : "";
    const prompt = `Perform an intelligence assessment for "${query}". ${locStr}
    Provide a concise summary of information relevant to a defense context.`;

    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: MODEL_TEXT,
            contents: { parts: [{ text: prompt }] },
            config: {
                systemInstruction: "You are an Intelligence Analyst. Provide up-to-date information.",
                tools: [{ googleSearch: {} }],
            }
        });

        const text = response.text || "No intelligence found.";
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        const sources = groundingChunks.map((chunk: any) => {
            if (chunk.web) {
                return { web: { title: chunk.web.title, uri: chunk.web.uri } };
            }
            return null;
        }).filter((s: any) => s !== null);

        return { text, sources };

    } catch (e) {
        console.error("Intel Search Error:", e);
        return {
            text: "Intelligence gathering failed. Systems offline.",
            sources: []
        };
    }
};

export const runTerminalCommand = async (command: string): Promise<string> => {
    return await generateContent(`Simulate the terminal output for the command: "${command}". Be technical and brief.`, "You are a Linux Terminal.");
};

export const parseDataEntry = async (input: string, context: string): Promise<any> => {
    const prompt = `Extract structured data from "${input}" for a form in context: ${context}.
    Return JSON key-value pairs matching typical military form fields (e.g., unit_id, quantity, status, location).`;
    const res = await generateContent(prompt, "JSON Extractor", true);
    return JSON.parse(cleanJson(res));
};

export const generateDynamicData = async (prompt: string, schema: string): Promise<any> => {
    const fullPrompt = `${prompt}
    Return STRICT JSON using this schema: ${schema}`;
    const res = await generateContent(fullPrompt, "Data Generator. JSON Only.", true);
    try {
        return JSON.parse(cleanJson(res));
    } catch (e) {
        return [];
    }
};

export const getStrategicForecast = async (language: string) => {
    return await generateContent(`Provide a short strategic forecast for the Horn of Africa region for the next 24 hours. Language: ${language}.`, "Military Strategist");
};

export const generateExamQuestion = async (subject: string, difficulty: string): Promise<any> => {
    const prompt = `Generate a ${difficulty} multiple-choice question about ${subject} for military cadets.
    Return JSON: {"question": "text", "options": ["A", "B", "C", "D"], "correct_index": 0-3, "explanation": "text"}`;
    const res = await generateContent(prompt, "Exam Creator. JSON Only.", true);
    return JSON.parse(cleanJson(res));
};

export const evaluateApplicant = async (profile: any): Promise<any> => {
    const prompt = `Evaluate military applicant: ${JSON.stringify(profile)}.
    Return JSON: {"fit_score": 0-100, "recommendation": "text", "strengths": ["a","b"], "risks": ["c","d"]}`;
    const res = await generateContent(prompt, "Recruitment Officer. JSON Only.", true);
    return JSON.parse(cleanJson(res));
};

export const generateCourseRecommendations = async (topic: string, level: string): Promise<any[]> => {
    const prompt = `Suggest 3 training courses for ${topic} at ${level} level.
    Return JSON Array: [{"title": "Name", "duration": "Time", "module": "Type", "reason": "Why"}]`;
    const res = await generateContent(prompt, "Training Advisor. JSON Only.", true);
    return JSON.parse(cleanJson(res));
};

export const draftSRSCommunication = async (recipient: string, context: string, tone: string): Promise<string> => {
    return await generateContent(`Draft a message to ${recipient} about ${context}. Tone: ${tone}.`, "Communication Aide");
};

export const analyzeSatelliteTarget = async (coords: string, name: string, language: string): Promise<string> => {
    return await generateContent(`Analyze satellite imagery target: ${name} at ${coords}. Describe potential military significance and status.`, "IMINT Analyst");
};

export const analyzeSatelliteRecon = async (base64Data: string, mimeType: string, context: string): Promise<any> => {
    const prompt = `Analyze this satellite reconnaissance image for context: ${context}.
    Identify military targets, terrain features, and potential threats.
    Return JSON: {
        "strategic_value": "High/Med/Low",
        "threat_assessment": "Desc",
        "terrain_analysis": "Desc",
        "tactical_recommendation": "Action",
        "assets_detected": [{"type": "Tank/Truck/Plane", "count": number, "confidence": 0-100}]
    }`;
    const image = { data: base64Data, mimeType: mimeType };
    const res = await generateContent(prompt, "IMINT AI. JSON Only.", true, image);
    return JSON.parse(cleanJson(res));
};

export const generatePressRelease = async (topic: string, tone: string, language: string): Promise<string> => {
    return await generateContent(`Write a military press release. Topic: ${topic}. Tone: ${tone}. Language: ${language}.`, "Public Relations Officer");
};

export const generateRadioChatter = async (): Promise<any[]> => {
    const prompt = `Generate 5 lines of realistic military radio chatter (tactical, brief).
    Return JSON Array: [{"org": "Callsign", "trans": "Message"}]`;
    const res = await generateContent(prompt, "Radio Operator. JSON Only.", true);
    return JSON.parse(cleanJson(res));
};

export const analyzeCombatAudio = async (base64: string, mime: string): Promise<any> => {
    const prompt = `Analyze this battlefield audio recording. Detect stress levels, gunshots, explosions, and keywords.
    Return JSON: {
        "voice_stress_level": "Low/Med/High/Panic",
        "keywords_detected": ["Contact", "Ammo", "Medic"],
        "environment_sounds": ["Gunfire", "Explosion", "Wind"],
        "summary": "Brief situation report"
    }`;
    const audio = { data: base64, mimeType: mime };
    const res = await generateContent(prompt, "Audio Analyst. JSON Only.", true, undefined, audio);
    return JSON.parse(cleanJson(res));
};

export const runPsychometricAnalysis = async (answers: any): Promise<any> => {
    const prompt = `Analyze these psychometric answers: ${JSON.stringify(answers)}.
    Return JSON: {
        "scores": {"iq": number, "eq": number, "sq": number, "aq": number},
        "analysis": {"summary": "text", "strengths": ["a"], "limitations": ["b"]},
        "traits": [{"trait": "Name", "score": 0-100, "desc": "text"}]
    }`;
    const res = await generateContent(prompt, "Psychologist. JSON Only.", true);
    return JSON.parse(cleanJson(res));
};

export const recommendStrategy = async (situation: string, domain: string, enemy: string): Promise<any> => {
    const prompt = `Recommend military strategy. Situation: ${situation}. Domain: ${domain}. Enemy: ${enemy}.
    Return JSON: {
        "recommended_strategy": "Name",
        "rationale": "Reason",
        "principle_application": [{"principle": "Principle Name", "application": "How to apply"}],
        "operational_approach": [{"phase": "1", "action": "Step"}]
    }`;
    const res = await generateContent(prompt, "Strategist. JSON Only.", true);
    return JSON.parse(cleanJson(res));
};

export const expandSimulationDetail = async (scenario: string, label: string, type: string, mode: string): Promise<string> => {
    return await generateContent(`Expand details on ${type} "${label}" for scenario "${scenario}" in ${mode} mode. Be specific and technical.`, "Simulation Engine");
};

export const generateScenarioBriefing = async (terrain: string, weather: string, enemy: string, language: string): Promise<string> => {
    return await generateContent(`Generate a tactical mission briefing. Terrain: ${terrain}. Weather: ${weather}. Enemy: ${enemy}. Language: ${language}.`, "Commander");
};

export const generateAAR = async (blue: number, red: number, turns: number, terrain: string): Promise<string> => {
    return await generateContent(`Generate an After Action Report (AAR). Blue Strength: ${blue}%. Red Strength: ${red}%. Turns: ${turns}. Terrain: ${terrain}. Analyze outcome.`, "Evaluator");
};

export const analyzeStudentRisk = async (studentData: any): Promise<any> => {
    return analyzePersonnelRisk("Student", studentData);
};

export const generateInterventionPlan = async (name: string, weakness: string, context: any): Promise<any> => {
    const prompt = `Create intervention plan for student ${name} struggling with ${weakness}.
    Return JSON: {"plan_title": "Title", "objective": "Obj", "duration": "Time", "steps": [{"week": 1, "activity": "Act", "resource": "Res"}], "success_metric": "Metric"}`;
    const res = await generateContent(prompt, "Education Expert. JSON Only.", true);
    return JSON.parse(cleanJson(res));
};

export const generateCurriculumGapAnalysis = async (grades: any): Promise<any> => {
    const prompt = `Analyze curriculum gaps based on grades: ${JSON.stringify(grades)}.
    Return JSON: {"identified_gaps": [{"topic": "T", "failure_rate": %, "probable_cause": "Reason"}], "recommendations": ["Rec1"]}`;
    const res = await generateContent(prompt, "Curriculum Developer. JSON Only.", true);
    return JSON.parse(cleanJson(res));
};
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

// New offline RAG function (load PDF, embed with Llama3, search, return context)
export async function queryDocument(query: string, filePath: string = 'docs/endf_project_doc.pdf'): Promise<string> {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);
  const embeddings = new OllamaEmbeddings({ model: "llama3" });
  const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
  const retriever = vectorStore.asRetriever();
  const results = await retriever.getRelevantDocuments(query);
  const context = results.map(doc => doc.pageContent).join('\n');
  return context || 'No relevant info in docs.';
}