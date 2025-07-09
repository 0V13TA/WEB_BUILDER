import { describe, it, expect, vi } from "vitest";
import parseUnit from "../parseFunctions/parseUnits";

const mockCanvas = {
  width: 800,
  height: 600
} as HTMLCanvasElement;

describe("parseUnit", () => {
  it("should return numbers as-is", () => {
    expect(parseUnit(100)).toBe(100);
  });

  it("should parse px units correctly", () => {
    expect(parseUnit("50px")).toBe(50);
  });

  it("should parse % units correctly with relativeTo", () => {
    expect(parseUnit("25%", 200)).toBe(50);
  });

  it("should warn if % unit is used without relativeTo", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parseUnit("30%")).toBe(0);
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it("should parse vh units correctly with canvas", () => {
    expect(parseUnit("50vh", undefined, mockCanvas)).toBe(300);
  });

  it("should warn if vh unit is used without canvas", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parseUnit("50vh")).toBe(0);
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it("should parse vw units correctly with canvas", () => {
    expect(parseUnit("25vw", undefined, mockCanvas)).toBe(200);
  });

  it("should warn if vw unit is used without canvas", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parseUnit("75vw")).toBe(0);
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it("should fallback to numeric pixel interpretation for unknown units", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parseUnit("42xyz")).toBe(42);
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it("should fallback for unit-less strings", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parseUnit("123")).toBe(123);
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it("should trim whitespace and still work", () => {
    expect(parseUnit(" 100px ")).toBe(100);
    expect(parseUnit(" 50% ", 200)).toBe(100);
  });
});
