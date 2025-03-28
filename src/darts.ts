export function calcPoints(hits: string): number {
  const splitted = hits.split(/[\s-]/).map(Number);

  let points = 0;
  for (let i = 0; i < splitted.length - 1; i += 2) {
    const multiplier = splitted[i];
    const sector = splitted[i + 1];

/*     switch (true) {
      case multiplier > 1 || multiplier > 3: {
        continue
      }
    } */
   
    if (multiplier < 1 || multiplier > 3) continue;
    if (sector < 0 || sector > 25) continue;

    points += multiplier * sector;
  }
    return points;
}

export function possibleCheckout(x: number): string {
  console.log(x);
  throw new Error("not implemented yet");
}