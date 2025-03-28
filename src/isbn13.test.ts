import { isValid } from "./isbn13";

describe("isValid - ISBN-13", () => {
  test("valid ISBNs", () => {
    expect(isValid("9783866801929")).toBe(true);
    expect(isValid("9783161484100")).toBe(true);
    expect(isValid("9791234567896")).toBe(true);
  });

  test("invalid ISBNs means invalid Checksumm", () => {
    expect(isValid("9783866801928")).toBe(false);
    expect(isValid("9783161484101")).toBe(false);
    expect(isValid("9791234567890")).toBe(false);
  });

  test("invalid inputs", () => {
    expect(isValid("97831614841")).toBe(false);
    expect(isValid("9783161484100123")).toBe(false);
    expect(isValid("97831A1484100")).toBe(false);
  });

  test("ignores Bindestriche und Leerzeichen", () => {
    expect(isValid("978-3-16-148410-0")).toBe(true);
    expect(isValid(" 978 3866801929 ")).toBe(true);
  });
});
