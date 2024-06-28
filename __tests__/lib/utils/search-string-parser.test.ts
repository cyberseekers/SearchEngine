import { expect, test } from "vitest";
import {
  and,
  not,
  or,
  parseSearchString,
  wordGroup,
} from "../../../lib/utils/search-string-parser";

test("correctly parses search strings", () => {
  const searchString = "foo AND bar OR baz one two AND NOT qux";

  const [actual] = parseSearchString(searchString);
  const expected = or([
    and([wordGroup(["foo"]), wordGroup(["bar"])]),
    and([wordGroup(["baz", "one", "two"]), not(wordGroup(["qux"]))]),
  ]);

  expect(actual).toEqual(expected);
});

test("returns the list of words in the search string", () => {
  const searchString = "foo AND bar OR baz one two AND NOT qux";

  const [, words] = parseSearchString(searchString);

  expect(words).toEqual(["foo", "bar", "baz", "one", "two", "qux"]);
});

test("correctly parses search strings with parentheses", () => {
  const searchString = "foo AND (bar OR baz one two AND NOT qux)";

  const [actual] = parseSearchString(searchString);
  const expected = and([
    wordGroup(["foo"]),
    or([
      wordGroup(["bar"]),
      and([wordGroup(["baz", "one", "two"]), not(wordGroup(["qux"]))]),
    ]),
  ]);

  expect(actual).toEqual(expected);
});
