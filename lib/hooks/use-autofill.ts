import { useState } from "react";
import { AutofillResponse } from "../types/autofill";
import { useQuery } from "@tanstack/react-query";

const fetchAutofill = async (
  word: string,
  kind: "current" | "forecast",
  maxResults: number
): Promise<AutofillResponse> => {
  const searchParameters = new URLSearchParams();
  searchParameters.set("word", word);
  searchParameters.set("kind", kind);
  searchParameters.set("maxResults", maxResults.toString());

  return fetch(`/api/autofill?${searchParameters.toString()}`).then((res) =>
    res.json()
  );
};

export const useAutofill = (maxResults = 5) => {
  const [word, setWord] = useState("");
  const [kind, setKind] = useState<"current" | "forecast">("current");

  const query = useQuery({
    queryKey: ["autofill", word, kind, maxResults],
    queryFn: () => fetchAutofill(word, kind, maxResults),
  });

  return {
    word,
    setWord,
    kind,
    setKind,
    ...query,
  };
};
