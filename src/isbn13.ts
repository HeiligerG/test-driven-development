export function isValid(isbn: string): boolean {
  const digits = isbn.replace(/[\s-]/g, ""); // mit RegEx -> Reguar expresion

  if (!/^\d{13}$/.test(digits)) return false; // ebenfals mit RegEx

  const sum = digits
    .split("")
    .map(Number)
    .reduce((acc, digit, i) => acc + digit * (i % 2 === 0 ? 1 : 3), 0); //kurz aber perfekt, glaube ich

  return sum % 10 === 0;
}