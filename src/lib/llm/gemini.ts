import { Message, LLMResponse } from './types';
import { LLMClient } from './client';
import { GoogleGenAI } from '@google/genai';
import { geminiApiKey } from 'src/config';

const MODEL_NAME = 'gemini-2.0-flash';

export class GeminiClient implements LLMClient {
    private client: GoogleGenAI;

    constructor() {
        const apiKey = geminiApiKey;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is not set. Please add it to your .env file.');
        }
        this.client = new GoogleGenAI({
            apiKey: apiKey
        });
    }

    public async createChatCompletion(messages: Message[]): Promise<LLMResponse> {
        try {
            // Combine system prompt and user message into a single prompt
            const systemMsg = messages.find(msg => msg.role === 'system');
            const userMsg = messages.find(msg => msg.role === 'user');
            
            if (!userMsg) {
                throw new Error('User message is required');
            }

            const fullPrompt = `${systemMsg ? systemMsg.content + '\n\n' : ''}${userMsg.content}`;

            const response = await this.client.models.generateContent({
                model: MODEL_NAME,
                contents: fullPrompt
            });

            if (!response || !response.candidates?.[0]?.content?.parts?.[0]?.text) {
                throw new Error('Invalid response from Gemini');
            }

            const result = response.candidates[0].content.parts[0].text;

            return {
                content: result,
                provider: 'gemini'
            };
        } catch (error) {
            console.error('Error in GeminiClient.createChatCompletion:', error);
            throw error;
        }
    }
}
