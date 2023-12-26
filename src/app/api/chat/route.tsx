import { NextResponse } from 'next/server';
import { OpenAIStream, StreamingTextResponse, streamToResponse } from 'ai';
import { main } from './Providers/init';
import { openchat } from './Providers/openchat';
import { json } from 'stream/consumers';
import { v4 as uuidv4 } from 'uuid';
export const runtime = 'edge';


export async function POST(req: Request) {
  const data = await req.json();
  const model = data.model;

  const responseGenerator = main(data);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        for await (const textChunk of responseGenerator) {
          const responseJson = {
            id: 'chatcmpl-' + uuidv4(),
            object: 'chat.completion',
            created: new Date().toISOString(),
            model: model,
            choices: [{
              index: 0,
              message: {
                role: 'assistant',
                content: textChunk,
              },
              finish_reason: 'stop',
            }],
            usage: {
              prompt_tokens: 0,
              completion_tokens: 0,
              total_tokens: 0,
            },
          };

          const jsonString = JSON.stringify(responseJson) + "\n";

          controller.enqueue(encoder.encode(jsonString));
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function GET(req: Request) {
  let models: any = [
    {
      model: "meta/llama-2-7b-chat",
      details: [
        {
          name: "Llama",
        }
      ]
    },
    {
      model: "meta/llama-2-13b-chat",
      details: [
        {
          name: "Llama",
        }
      ]
    },
    {
      model: "meta/llama-2-70b-chat",
      details: [
        {
          name: "Llama",
        }
      ]
    },
    {
      model: "yorickvp/llava-13b",
      details: [
        {
          name: "Llava",
        }
      ]
    },
    {
      model: "nateraw/salmonn",
      details: [
        {
          name: "Salmonn",
        }
      ]
    },
    // Oryginalny model
    {
      model: "OpenChat Aura",
    },
    {
      model: "OpenAI - gpt4",
      details: [
        {
          name: "gpt-4",
        }
      ]
    },
    {
      model: "OpenAI - gpt35turbo",
      details: [
        {
          name: "gpt-3.5-turbo",
        }
      ]
    }
    
  ];

  return new Response(JSON.stringify({ models: models }, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
