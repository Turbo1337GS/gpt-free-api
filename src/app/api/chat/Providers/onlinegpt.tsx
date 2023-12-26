export async function* onlinegpt(data: any) {
  console.log(`provider: onlinegpt`);
  const temperature = data.temperature || 1;
  const max_tokens = data.max_tokens || 4096;
  const messages: any = data.messages;
  /*\ */

  const generateRandomString = (length: number) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  function extractLastDataValue(responseText: string): string | null {
    try {
        // Rozdzielanie tekstów po nowych liniach i filtrowanie pustych elementów
        const lines = responseText.split('\n').filter(line => line.trim() !== '');

        // Szukanie ostatniego elementu zawierającego "data:"
        const lastDataLine = lines.reverse().find(line => line.startsWith('data:'));

        if (lastDataLine) {
            // Parsowanie JSON
            const parsedLine = JSON.parse(lastDataLine.substring(5)); // Usunięcie "data:" z linii
            if (parsedLine && parsedLine.data) {
                return parsedLine.data;
            }
        }
    } catch (error) {
        console.error('Błąd podczas przetwarzania odpowiedzi:', error);
    }
    return null;
}
  // Generowanie losowych session i chatId
  const session = generateRandomString(12);
  const chatId = generateRandomString(12);

  // Używanie ostatniej wiadomości z messages
  const newMessage =
    messages.length > 0
      ? messages[messages.length - 1]["content"]
      : " ";

  let response = await fetch(
    "https://onlinegpt.org/chatgpt/wp-json/mwai-ui/v1/chats/submit",
    {
      method: "POST",
      headers: {
        authority: "onlinegpt.org",
        accept: "text/event-stream",
        "accept-language": "pl-PL,pl;q=0.9",
        "content-type": "application/json",
        cookie: "COOKIE",
        origin: "https://onlinegpt.org",
        referer: "https://onlinegpt.org/chatgpt/chat/",
        "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        botId: "default",
        customId: null,
        session: session,
        chatId: chatId,
        contextId: 9,
        messages: messages,
        newMessage: newMessage,
        newImageId: null,
        stream: true,
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

      // Konwersja Uint8Array na string.
      const text = decoder.decode(value, { stream: true });
      const content = extractLastDataValue(text);
      if (content) 
      {

        
          yield content;
    }
      yield text as any; // Zwraca przetworzony tekst.
    }
  } catch (error) {
    console.error("Błąd podczas czytania strumienia:", error);
  }
}
