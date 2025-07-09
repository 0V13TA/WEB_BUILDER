import { describe, it, expect } from "vitest";
import * as colorUtils from "../parseFunctions/colorUtils";

describe("Color Utils", () => {
  it("should expand hex color #RGB to #RRGGBB", () => {
    expect(colorUtils.expandHex("#123")).toBe("112233");
  });

  it("should expand hex color #RGBA to #RRGGBBAA", () => {
    expect(colorUtils.expandHex("#1234")).toBe("11223344");
  });

  it("should return the same hex color for #RRGGBB", () => {
    expect(colorUtils.expandHex("#112233")).toBe("112233");
  });

  it("should return the same hex color for #RRGGBBAA", () => {
    expect(colorUtils.expandHex("#11223344")).toBe("11223344");
  });
});

describe("isValidHex", () => {
  it("should return true for valid hex colors", () => {
    expect(colorUtils.isValidHex("#123")).toBe(true);
    expect(colorUtils.isValidHex("#1234")).toBe(true);
    expect(colorUtils.isValidHex("#112233")).toBe(true);
    expect(colorUtils.isValidHex("#11223344")).toBe(true);
  });

  it("should return false for invalid hex colors", () => {
    expect(colorUtils.isValidHex("#12G")).toBe(false);
    expect(colorUtils.isValidHex("#12345")).toBe(false);
    expect(colorUtils.isValidHex("123456")).toBe(false);
  });
});

describe("hexToRgba", () => {
  it("should convert #RRGGBB to RGBA", () => {
    expect(colorUtils.hexToRgba("#112233")).toEqual([17, 34, 51, 1]);
  });

  it("should convert #RRGGBBAA to RGBA", () => {
    expect(colorUtils.hexToRgba("#11223344")).toEqual([
      17, 34, 51, 0.26666666666666666
    ]);
  });

  it("should convert #RGB to RGBA", () => {
    expect(colorUtils.hexToRgba("#123")).toEqual([17, 34, 51, 1]);
  });

  it("should convert #RGBA to RGBA", () => {
    expect(colorUtils.hexToRgba("#1234")).toEqual([
      17, 34, 51, 0.26666666666666666
    ]);
  });
});

describe("rgbaToHex", () => {
  it("should convert RGBA to hex #RRGGBB", () => {
    expect(colorUtils.rgbaToHex([17, 34, 51, 1])).toBe("#112233");
  });

  it("should convert RGBA to hex #RRGGBBAA", () => {
    expect(colorUtils.rgbaToHex([17, 34, 51, 0.26666666666666666])).toBe(
      "#11223344"
    );
  });

  it("should convert RGBA with alpha < 1 to hex #RRGGBBAA", () => {
    expect(colorUtils.rgbaToHex([17, 34, 51, 0.5])).toBe("#11223380");
  });
});

describe("rgbaToHsl", () => {
  it("should convert RGBA to HSL", () => {
    expect(colorUtils.rgbaToHsl([17, 34, 51, 1])).toEqual([210, 50, 13, 1]);
  });

  it("should convert RGBA with alpha < 1 to HSL", () => {
    expect(colorUtils.rgbaToHsl([17, 34, 51, 0.5])).toEqual([210, 50, 13, 0.5]);
  });
});

describe("hslToRgba", () => {
  it("should convert HSL to RGBA", () => {
    expect(colorUtils.hslaToRgba([210, 50, 15, 1])).toEqual([19, 38, 57, 1]);
    expect(colorUtils.hslaToRgba([210, 50, 15, 0.5])).toEqual([
      19, 38, 57, 0.5
    ]);
  });
});

describe("hexToHsl", () => {
  it("should convert hex to HSL", () => {
    expect(colorUtils.hexToHsla("#112233")).toEqual([210, 50, 13, 1]);
    expect(colorUtils.hexToHsla("#11223344")).toEqual([
      210, 50, 13, 0.26666666666666666
    ]);
  });
});

describe("hslaToHex", () => {
  it("should convert HSL to hex #RRGGBB", () => {
    expect(colorUtils.hslaToHex([210, 50, 15, 1])).toBe("#132639");
  });

  it("should convert HSL to hex #RRGGBBAA", () => {
    expect(colorUtils.hslaToHex([210, 50, 15, 0.26666666666666666])).toBe(
      "#13263944"
    );
  });
});
