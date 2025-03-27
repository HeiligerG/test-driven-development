export function play(player1: string, player2: string): number {
  const normalize = (move: string) => move.trim().toLowerCase();
    // könnte ich noch mit einem Set([""]) verbessern (Schneller zugriff auf eindeutige Werte)
  const validMoves = ["rock", "paper", "scissors"];

  const m1 = normalize(player1);
  const m2 = normalize(player2);
  // ohne includes sondern mit has() damit zugriff auf das Set
  if (!validMoves.includes(m1)) throw new Error(`Invalid move: ${player1}`);
  if (!validMoves.includes(m2)) throw new Error(`Invalid move: ${player2}`);

  if (m1 === m2) return 0;

  const winMap: Record<string, string> = {
    rock: "scissors",
    scissors: "paper",
    paper: "rock"
  };

  return winMap[m1] === m2 ? 1 : 2;
}
