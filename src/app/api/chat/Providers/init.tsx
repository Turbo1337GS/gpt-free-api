import { channel } from "diagnostics_channel";
import { openchat } from "./openchat";
import { llama } from "./LLama";
import { openprompt } from "./openprompt";
import { gptbz } from "./gptbz";
import { gptgo } from "./gptgo";
import { onlinegpt } from "./onlinegpt";

export async function* main(data: any) {
  const model = data.model;
  if (!model) {
    throw new Error("Model is empty!");
  }

  let responseGenerator;

  if (model === "text-davinci-003") {
    responseGenerator = onlinegpt(data);
    for await (const response of responseGenerator) {
      if (response === "Sorry. You have reached the daily limit.") {
        break;
      }
    }
  }


  if (model === "text-davinci-003") {
    responseGenerator = openprompt(data);
  }
  if (model === "gpt-3.5-turbo") responseGenerator = gptgo(data);
  if (model === "OpenChat Aura") responseGenerator = openchat(data);
  if (model === "gpt-3.5-turbo") responseGenerator = openprompt(data);
  if (model === "gpt-4" || "gpt-3.5-turbo") responseGenerator = gptbz(data);

  const modelsToCheck = [
    "meta/llama-2-7b-chat",
    "meta/llama-2-13b-chat",
    "meta/llama-2-70b-chat",
    "yorickvp/llava-13b",
    "nateraw/salmonn",
  ];

  const isModelIncluded =
    typeof model === "string" &&
    modelsToCheck.some((modelToCheck) => model.includes(modelToCheck));
  if (isModelIncluded) {
    responseGenerator = llama(data);
  }

  if (!responseGenerator) {
    console.error("No found provider for ", model);
    let err: any = [
      {
        error: "No found provider for " + model,
      },
    ];
    yield err;
    return;
  }
  try {
    for await (const value of responseGenerator) {
      yield value;
    }
  } catch (error) {
    console.error("Błąd podczas generowania odpowiedzi:", error);
    throw error;
  }
}
