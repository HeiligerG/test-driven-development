import { calcPoints, possibleCheckout } from "./darts";

describe("calculate points", () => {
    test("add points if", () => {
        expect(calcPoints).toBeLessThan(501);
    });
    test("dont add points if", () => {
        expect(calcPoints).toBeGreaterThanOrEqual(501);
    });
    test("dont add points if negative", () => {
        expect(calcPoints).toBe(-200);
    });
});
describe("check for possible checkout", () => {
    test("is a checkout if equal to 501", () => {
        expect(possibleCheckout).toBe(501)
    });
    test("is not a checkout if less then 501", () => {
        expect(possibleCheckout).toBe(500);
        expect(possibleCheckout).toBe(400);
        expect(possibleCheckout).toBe(20);
    });
    test("is not a checkout if grater then 501", () => {
        expect(possibleCheckout).toBe(502)
    });
});