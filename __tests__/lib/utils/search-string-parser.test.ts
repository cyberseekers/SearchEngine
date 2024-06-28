import { expect, test } from "vitest";
import {
  and,
  not,
  or,
  parseSearchString,
  word,
  wordGroup,
} from "../../../lib/utils/search-string-parser";

test("correctly parses search strings", () => {
  const searchString = "foo AND bar OR baz one two AND NOT qux";

  const actual = parseSearchString(searchString);
  const expected = or([
    and([word("foo"), word("bar")]),
    and([wordGroup([word("baz"), word("one"), word("two")]), not(word("qux"))]),
  ]);

  expect(actual).toEqual(expected);
});

test("correctly parses search strings with parentheses", () => {
  const searchString = "foo AND (bar OR baz one two AND NOT qux)";

  const actual = parseSearchString(searchString);
  const expected = and([
    word("foo"),
    or([
      word("bar"),
      and([
        wordGroup([word("baz"), word("one"), word("two")]),
        not(word("qux")),
      ]),
    ]),
  ]);

  expect(actual).toEqual(expected);
});
