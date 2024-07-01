export interface AutofillResponse {
  kind: "current" | "forecast";
  words: string[];
}
