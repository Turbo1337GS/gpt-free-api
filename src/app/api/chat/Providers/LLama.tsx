function formatMessage(messages: any[], systemPrompt: any) {
    const formattedUserMessages = messages.map((msg: { role: any; content: any; }) => `${msg.role}: ${msg.content}`).join('\\n');
    return `<s>[INST] <<SYS>>\\n${systemPrompt}\\n<</SYS>>\\n\\n${formattedUserMessages}[/INST]\\n`;
}


export async function* llama(data: any) { // https://www.llama2.ai/
    console.log(`provider: llama2.ai`)
    const temperature = data.temperature || 1;
    const max_tokens = data.max_tokens || 4096;
    const model = data.model;
    const systemPrompt = data.messages.find((msg: { role: string; }) => msg.role === "system")?.content || "You are a helpful assistant.";
    const formattedPrompt = formatMessage(data.messages, systemPrompt);
    const modelsToCheck = [
        "meta/llama-2-7b-chat",
        "meta/llama-2-13b-chat",
        "meta/llama-2-70b-chat",
        "yorickvp/llava-13b",
        "nateraw/salmonn"
    ];

    const isModelIncluded = typeof model === 'string' && modelsToCheck.some(modelToCheck => model.includes(modelToCheck));
    if (!isModelIncluded)
        return;



    const url = data.messages[0].content[1].image_url.url || null;


    let response = await fetch('https://www.llama2.ai/api', {
        "method": "POST",
        "headers": {
            "authority": "www.llama2.ai",
            "accept": "*/*",
            "accept-language": "pl-PL,pl;q=0.9",
            "content-type": "text/plain;charset=UTF-8",
            "origin": "https://www.llama2.ai",
            "referer": "https://www.llama2.ai/",
            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Brave\";v=\"120\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        "body": JSON.stringify({
            "prompt": formattedPrompt,
            "model": model,
            "systemPrompt": systemPrompt,
            "temperature": temperature,
            "topP": 0.9,
            "maxTokens": max_tokens,
            "image": url,
            "audio": null
        })
    });

    if (response.status != 200) {
        console.log(`response status ${response.status} skiping provider...`);
        return;
      }
    
    if (!response.body) {
        throw new Error('Brak ciała odpowiedzi');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value, { stream: true });
            console.log(text);
            yield text as any;
        }
    } catch (error) {
        console.error('Błąd podczas czytania strumienia:', error);
    }
}
