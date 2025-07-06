/**
 * Represents the structured analysis of a user's request, combining
 * high-level vibe with specific technical requirements.
 */
export interface VaporizerAnalysis {
  vibe: {
    context?: string;
    mood?: string;
    scenario?: string;
  };
  technical: {
    heatingMethod?: 'CONDUCTION' | 'CONVECTION' | 'HYBRID';
    preferences?: ('Portability' | 'Vapor quality' | 'Ease of use' | 'Discreetness' | 'Value')[];
  };
}

/**
 * Represents a message in a chat completion request.
 */
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
