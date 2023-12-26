export async function* openchat(data: any) {
    console.log(`provider: openchat`)
    const temperature = data.temperature || 1;
    const max_tokens = data.max_tokens || 4096;
    const messages: any = data.messages;
    let response = await fetch('https://openchat.team/api/chat', {
        method: 'POST',
        headers: {
            'authority': 'openchat.team',
            'accept': '*/*',
            'accept-language': 'pl-PL,pl;q=0.7',
            'content-type': 'application/json',
            'origin': 'https://openchat.team',
            'referer': 'https://openchat.team/pl',
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
            'model': {
                'id': 'openchat_v3.2_mistral',
                'name': 'OpenChat Aura',
                'maxLength': 24576,
                'tokenLimit': max_tokens
            },
            messages,
            'key': '',
            'prompt': ' ',
            'temperature': temperature
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
            
            // Konwersja Uint8Array na string.
            const text = decoder.decode(value, { stream: true });
            console.log(text);
            yield text as any; // Zwraca przetworzony tekst.
        }
    } catch (error) {
        console.error('Błąd podczas czytania strumienia:', error);
    }
}