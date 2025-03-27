import { play } from "./rock-paper-scissors";

describe( "play Rock, Paper, Scissor", () => {
    test("returns 0 if the same", () => {
        expect(play("rock", "rock"));
        expect(play("paper", "paper"));
        expect(play("scissors", "scissors"));
    });
    test("returns 1 if player 1 has won", () => {
        expect(play("rock", "scissors"));
        expect(play("paper", "rock"));
        expect(play("scissors", "paper"))
    });
    test("returns 2 if player 2 has won", () => {
        expect(play("scissors", "rock"));
        expect(play("rock", "paper"));
        expect(play("paper", "scissors"))
    });
    test("ignores case and spaces", () => {
        expect(play("  Rock", "SCISSORS ")).toBe(1);
        expect(play(" Paper", " paper ")).toBe(0);
        expect(play("SCISSORS", "rock")).toBe(2);
      });
    
      test("throws an invalid input", () => {
        expect(() => play("lizard", "rock")).toThrow("Invalid move: lizard");
        expect(() => play("rock", "spock")).toThrow("Invalid move: spock");
      });
});