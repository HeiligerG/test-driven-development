import { formatDuration } from "./duration";

describe("formatDuration", () => {
    test("returns 0s for 0", () => {
      expect(formatDuration(0)).toBe("0s");
    });

    test("formats only seconds", () => {
        expect(formatDuration(33)).toBe("33s");
    });

    test("formats minutes and seconds", () => {
        expect(formatDuration(123)).toBe("2m3s");
        expect(formatDuration(500)).toBe("8m20s");
    });

    test("formats houres", () => {
        expect(formatDuration(3600)).toBe("1h");
      });
    
      test("formats houres, minutes, and seconds", () => {
        expect(formatDuration(3999)).toBe("1h6m39s");
      });
    
      test("throws error for negative input", () => {
        expect(() => formatDuration(-10)).toThrow("Duration must be positive");
      });
    
      test("rounds float seconds correct", () => {
        expect(formatDuration(59.6)).toBe("1m");
        expect(formatDuration(59.4)).toBe("59s");
      });
});