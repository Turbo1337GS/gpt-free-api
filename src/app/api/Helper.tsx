export interface Cookie {
    name: string;
    value: string;
  }
  
export function createCookieHeader(cookies: Cookie[]): string {
    return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
  }
  interface ChatCompletionChunk {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        delta: {
            content: string;
        };
        finish_reason: string | null;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export function extractContent(stream: string): string | null {
  let combinedContent = '';
  try {
      const lines = stream.split('\n');

      for (const line of lines) {
          if (line.startsWith('data: ')) {
              const jsonPart = line.replace('data: ', '');
              const parsedInput: ChatCompletionChunk = JSON.parse(jsonPart);

              if (parsedInput.choices && parsedInput.choices.length > 0 && parsedInput.choices[0].delta) {
                  const content = parsedInput.choices[0].delta.content;
                  combinedContent += content;
              }
          }
      }

      return combinedContent || null;
  } catch (error) {
     // console.error(error);
      return null;
  }
}
type Message = {
    role: string;
    content: string;
};

type Messages = Message[];

export function formatPrompt(messages: Messages, addSpecialTokens: boolean = false): string {
    if (!addSpecialTokens && messages.length <= 1) {
        return messages[0].content;
    }

    const formatted = messages.map(message => 
        `${message.role.charAt(0).toUpperCase() + message.role.slice(1)}: ${message.content}`
    ).join('\n');

    return `${formatted}\nAssistant:`;
}