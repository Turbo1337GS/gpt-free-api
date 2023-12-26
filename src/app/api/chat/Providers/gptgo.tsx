import { extractContent, formatPrompt } from "../../Helper";

export async function* gptgo(data: any) {
    console.log(`provider: gptgo`);



    const temperature = data.temperature || 1;
    const max_tokens = data.max_tokens || 4096;



    if (temperature) console.log(`gptgo Does not support Temperature`);

    if (max_tokens) console.log(`gptgo Does not support max_tokens`);


    const formData = new URLSearchParams();
    formData.append("ask", data.messages);

    // Żądanie tokena
    const getTokenResponse = await fetch('https://gptgo.ai/get_token.php', {
        method: 'POST',
        headers: {
            'authority': 'gptgo.ai',
            'accept': '*/*',
            'accept-language': 'pl-PL,pl;q=0.6',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryNMfIqgmbzzlFpDDt',
            'origin': 'https://gptgo.ai',
            'referer': 'https://gptgo.ai/en',
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'sec-gpc': '1',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        body: `------WebKitFormBoundaryNMfIqgmbzzlFpDDt\r\nContent-Disposition: form-data; name="ask"\r\n\r\n ${formatPrompt(data.messages)} \r\n------WebKitFormBoundaryNMfIqgmbzzlFpDDt--\r\n`
    });

    if (!getTokenResponse.ok) {
        console.log(`response status ${getTokenResponse.status}, skipping provider...`);
        return;
    }
    const tokenResponseText = await getTokenResponse.text();
    let token = Buffer.from(tokenResponseText.slice(10, -20), 'base64').toString();




    let response = await fetch(`https://api.gptgo.ai/web.php?array_chat=${token}`, {
        headers: {
            'authority': 'api.gptgo.ai',
            'accept': 'text/event-stream',
            'accept-language': 'pl-PL,pl;q=0.6',
            'cache-control': 'no-cache',
            'origin': 'https://gptgo.ai',
            'referer': 'https://gptgo.ai/',
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'sec-gpc': '1',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });

    if (!response.ok) {
        console.log(`response status ${response.status}, skipping provider...`);
        return;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value, { stream: true });

            // Zakładając, że `extractContent` jest zaimplementowane zgodnie z Twoimi potrzebami
            const content = extractContent(text);
            if (content) {
                // console.log(content);
                yield content;
            }
        }
    } catch (error) {
        console.error("Błąd podczas czytania strumienia:", error);
    }
}
