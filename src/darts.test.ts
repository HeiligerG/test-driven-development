import { calcPoints, possibleCheckout } from "./darts";

describe("calculate correct hits", () => {
    test("correct hit if calculated correct", () => {
        expect(calcPoints("3 20 1 17 2 4")).toBe(81);
        expect(calcPoints("2 15 1 18 3 19")).toBe(105);
        expect(calcPoints("3 20 1 5")).toBe(65);
    });
});
describe("check a possible checkout", () => {
    test("checkout if double out possible", () => {
        expect(possibleCheckout(477)).toBe("Double 12")
        expect(possibleCheckout(451)).toBe("Double 25");
    });
    test("no checkout if no double out possible", () => {
        expect(possibleCheckout(480)).toBe("No Checkout");
        expect(possibleCheckout(441)).toBe("No Checkout");
    });
});