export type LLMProvider = 'gemini';

export type MessageRole = 'system' | 'user' | 'assistant' | 'function';

export interface Message {
    role: MessageRole;
    content: string;
    name?: string;
}

export interface LLMResponse {
    content: string;
    provider: LLMProvider;
}