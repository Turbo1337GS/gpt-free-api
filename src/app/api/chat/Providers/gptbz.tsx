import { East_Sea_Dokdo, Text_Me_One } from "next/font/google";
import { Cookie, createCookieHeader, extractContent } from "../../Helper";


export async function* gptbz(data: any) {

    console.log(`provider: gptbz`);

    const model = data.model;

    const temperature = data.temperature || 1;
    const max_tokens = data.max_tokens || 4096;



    if (temperature) console.log(`gpt.bz Does not support Temperature`);

    if (max_tokens) console.log(`gpt.bz Does not support max_tokens`);

    
    const modelsToCheck = ["gpt-3.5-turbo", "gpt-4"];

    const isModelIncluded =
        typeof model === "string" &&
        modelsToCheck.some((modelToCheck) => model.includes(modelToCheck));
    if (!isModelIncluded) {
        return;
    }



    const messages: any = data.messages;
    let response = await fetch(
        "https://chat.gpt.bz/api/openai/v1/chat/completions?conversation_id=lXyL5GtbTymG9Z8V28Pz7",
        {
            method: "POST",
            headers: {
                authority: "chat.gpt.bz",
                accept: "text/event-stream",
                "accept-language": "pl-PL,pl;q=0.9",
                authorization:
                    "COOKIES",
                "content-type": "application/json",
                origin: "https://chat.gpt.bz",
                referer: "https://chat.gpt.bz/",
                "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Linux"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                "user-agent":
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "x-requested-with": "XMLHttpRequest",
            },
            body: JSON.stringify({
                messages,
                stream: true,
                model: model,
            }),
        }
    );

    if (response.status != 200) {
        console.log(`response status ${response.status} skiping provider...`);
        return;
    }

    if (!response.body) {
        throw new Error("Brak ciała odpowiedzi");
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
  
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value, { stream: true });
            const content = extractContent(text);
            if (content) 
            {
                console.log(content)
                yield content;}
        }
    } catch (error) {
        console.error("Błąd podczas czytania strumienia:", error);
    }
}