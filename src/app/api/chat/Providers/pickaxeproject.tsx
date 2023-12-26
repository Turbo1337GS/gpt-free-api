import { Text_Me_One } from "next/font/google";
import { Cookie, createCookieHeader, extractContent } from "../../Helper";
export async function* openprompt(data: any) {//openprompt
    console.log(`provider: pickaxeproject`)
    const temperature = data.temperature || 1;
    const max_tokens = data.max_tokens || 4096;

    if (temperature) {
        console.log(`openprompt -> limit temperature not working`);
    }
    const messages: any = data.messages;

    let response = await fetch('https://openprompt.co/api/chat2', {
        method: 'POST',
        headers: {
          'authority': 'openprompt.co',
          'accept': '*/*',
          'accept-language': 'pl-PL,pl;q=0.8',
          'content-type': 'application/json',
          'cookie': 'supabase-auth-token=VALUE COOKIE',
          'origin': 'https://openprompt.co',
          'referer': 'https://openprompt.co/ChatGPT',
          'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Linux"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'sec-gpc': '1',
          'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        body: JSON.stringify({
        messages,
          'model': ''
        })
      });





    
    if (response.status != 200) {
        console.log(`response status ${response.status} skiping provider...`);
        return;
      }
    

    if (!response.body) {
        throw new Error('Brak ciała odpowiedzi');
    }
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Konwersja Uint8Array na string.
            const text = decoder.decode(value, { stream: true });
            console.log(text);
            yield text as any; // Zwraca przetworzony tekst.
        }
    } catch (error) {
        console.error('Błąd podczas czytania strumienia:', error);
    }
}