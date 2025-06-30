import { describe, it, expect } from "vitest";
import { parseBoxSpacing } from "./parseBoxSpacing";

describe("parseBoxSpacing", () => {
  it("returns all zeros for undefined", () => {
    expect(parseBoxSpacing()).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
  });

  it("returns all sides equal for a single number", () => {
    expect(parseBoxSpacing(5)).toEqual({
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    });
  });

  it("handles empty array", () => {
    expect(parseBoxSpacing([])).toEqual({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    });
  });

  it("handles [a]", () => {
    expect(parseBoxSpacing([7])).toEqual({
      top: 7,
      right: 7,
      bottom: 7,
      left: 7
    });
  });

  it("handles [a, b]", () => {
    expect(parseBoxSpacing([1, 2])).toEqual({
      top: 1,
      right: 2,
      bottom: 1,
      left: 2
    });
  });

  it("handles [a, b, c]", () => {
    expect(parseBoxSpacing([1, 2, 3])).toEqual({
      top: 1,
      right: 2,
      bottom: 3,
      left: 2
    });
  });

  it("handles [a, b, c, d]", () => {
    expect(parseBoxSpacing([1, 2, 3, 4])).toEqual({
      top: 1,
      right: 2,
      bottom: 3,
      left: 4
    });
  });

  it("ignores extra values beyond four", () => {
    expect(parseBoxSpacing([1, 2, 3, 4, 5, 6])).toEqual({
      top: 1,
      right: 2,
      bottom: 3,
      left: 4
    });
  });

  it("defaults undefined values in array to 0", () => {
    expect(parseBoxSpacing([1, undefined, 3])).toEqual({
      top: 1,
      right: 0,
      bottom: 3,
      left: 0
    });
    expect(parseBoxSpacing([undefined, 2, undefined, 4])).toEqual({
      top: 0,
      right: 2,
      bottom: 0,
      left: 4
    });
  });
});
