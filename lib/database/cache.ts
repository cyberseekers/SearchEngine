import { kv } from "@vercel/kv";
import { AutofillResponse } from "../types/autofill";

const getAutofillCacheKey = (kind: "current" | "forecast", word: string) => {
  return `autofill:${kind}:${word}`;
};

export const getCachedAutofillResult = async (
  kind: "current" | "forecast",
  word: string
): Promise<AutofillResponse | null> => {
  const key = getAutofillCacheKey(kind, word);
  return kv.get<AutofillResponse>(key);
};

export const setCachedAutofillResult = async (
  kind: "current" | "forecast",
  word: string,
  result: AutofillResponse
): Promise<void> => {
  const key = getAutofillCacheKey(kind, word);
  await kv.set(key, result, {
    ex: 60 * 60 * 24 * 7, // 1 week (in seconds)
  });
};
