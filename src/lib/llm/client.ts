import { Message, LLMResponse, LLMProvider } from './types';
import { GeminiClient } from './gemini';

export interface LLMClient {
    createChatCompletion(messages: Message[], systemPrompt?: string): Promise<LLMResponse>;
}

const clients: Record<LLMProvider, LLMClient> = {
    'gemini': new GeminiClient()
    
};

export function getLLMClient(provider: LLMProvider): LLMClient {
    const client = clients[provider];
    if (!client) {
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }
    return client;
}
