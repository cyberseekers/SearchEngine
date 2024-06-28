export interface OrSearchNode {
  kind: "or";
  content: SearchNode[];
}

export interface AndSearchNode {
  kind: "and";
  content: SearchNode[];
}

export interface NotSearchNode {
  kind: "not";
  content: SearchNode;
}

export interface WordSearchNode {
  kind: "word";
  content: string;
}

export interface WordGroupSearchNode {
  kind: "wordGroup";
  content: WordSearchNode[];
}

export type SearchNode =
  | OrSearchNode
  | AndSearchNode
  | NotSearchNode
  | WordSearchNode
  | WordGroupSearchNode;
// eslint-disable-next-line @typescript-eslint/ban-types
export type SearchToken = "(" | ")" | "AND" | "OR" | "NOT" | (string & {});

const tokenize = (input: string): SearchToken[] => {
  const regex = /\s*(\(|\)|AND|OR|NOT|\w+)\s*/g;

  return input.match(regex).map((token) => token.trim());
};

const isWord = (token: SearchToken): token is string => {
  return (
    token !== "(" &&
    token !== ")" &&
    token !== "AND" &&
    token !== "OR" &&
    token !== "NOT"
  );
};

/**
 * Creates an {@link OrSearchNode} with the given content. Exported for testing.
 * Do not use this function directly.
 */
export const or = (content: SearchNode[]): OrSearchNode => ({
  kind: "or",
  content,
});

/**
 * Creates an {@link AndSearchNode} with the given content. Exported for testing.
 * Do not use this function directly.
 */
export const and = (content: SearchNode[]): AndSearchNode => ({
  kind: "and",
  content,
});

/**
 * Creates a {@link NotSearchNode} with the given content. Exported for testing.
 * Do not use this function directly.
 */
export const not = (content: SearchNode): NotSearchNode => ({
  kind: "not",
  content,
});

/**
 * Creates a {@link WordSearchNode} with the given content. Exported for testing.
 * Do not use this function directly.
 */
export const word = (content: string): WordSearchNode => ({
  kind: "word",
  content,
});

/**
 * Creates a {@link WordGroupSearchNode} with the given content. Exported for testing.
 * Do not use this function directly.
 */
export const wordGroup = (content: WordSearchNode[]): WordGroupSearchNode => ({
  kind: "wordGroup",
  content,
});

const parseTokens = (tokens: SearchToken[]): SearchNode | undefined => {
  let index = 0;

  const parseOr = (): SearchNode | undefined => {
    const nodes: SearchNode[] = [parseAnd()];

    while (index < tokens.length && tokens[index] === "OR") {
      index++;
      nodes.push(parseAnd());
    }

    return nodes.length === 1 ? nodes[0] : or(nodes);
  };

  const parseAnd = (): SearchNode | undefined => {
    const nodes: SearchNode[] = [parseFactor()];

    while (index < tokens.length && tokens[index] === "AND") {
      index++;
      nodes.push(parseFactor());
    }

    return nodes.length === 1 ? nodes[0] : and(nodes);
  };

  const parseFactor = (): SearchNode | undefined => {
    if (tokens[index] === "NOT") {
      index++;
      return not(parseFactor());
    }

    if (tokens[index] === "(") {
      index++;
      const node = parseOr();

      if (tokens[index] === ")") {
        index++;
      } else {
        throw new Error("Missing closing parenthesis");
      }

      return node;
    }

    return parseWords();
  };

  const parseWords = (): SearchNode | undefined => {
    const words: WordSearchNode[] = [];

    while (index < tokens.length && isWord(tokens[index])) {
      words.push(word(tokens[index++]));
    }

    return words.length === 1 ? words[0] : wordGroup(words);
  };

  return parseOr();
};

/**
 * Parses a search string into a tree of search nodes.
 *
 * You likely don't need to call this function directly. Instead, use
 * `createPrismaKeywordQueryObject` from the `search-query-helpers` module.
 */
export const parseSearchString = (input: string): SearchNode => {
  const tokens = tokenize(input);
  return parseTokens(tokens);
};
