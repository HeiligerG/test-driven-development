# Reguläre Ausdrücke (RegEx) in TypeScript

## Grundlagen

Reguläre Ausdrücke sind spezielle Zeichenketten, die als Suchmuster für Text dienen. In TypeScript können sie auf verschiedene Arten erstellt und verwendet werden:

```typescript
// Literal-Notation mit Schrägstrichen
const pattern1 = /abc/;

// Konstruktor-Notation
const pattern2 = new RegExp('abc');

// Mit Flags
const patternWithFlags = /abc/gi;
```

Bei der Verwendung des RegExp-Konstruktors müssen Escape-Zeichen doppelt maskiert werden:

```typescript
// Literal-Notation
const backslashPattern1 = /\d+/;

// Konstruktor-Notation (Backslash muss escapt werden)
const backslashPattern2 = new RegExp('\\d+');
```

## RegEx-Flags in TypeScript

Flags modifizieren das Verhalten von regulären Ausdrücken:

| Flag | Bedeutung                                 | Beispiel        |
|------|-------------------------------------------|-----------------|
| g    | Global - Alle Übereinstimmungen finden    | `/abc/g`        |
| i    | Case-Insensitive - Groß-/Kleinschreibung ignorieren | `/abc/i` |
| m    | Multiline - ^ und $ passen auf Zeilenanfang/-ende | `/^abc/m` |
| s    | DotAll - Lässt . auch auf Zeilenumbrüche passen | `/a.c/s`   |
| u    | Unicode - Aktiviert Unicode-Features      | `/\u{1F60D}/u`  |
| y    | Sticky - Sucht nur ab lastIndex Position  | `/abc/y`        |

```typescript
// Beispiel für kombinierte Flags
const multiFlag = /typescript/gimu;
```

## Methoden für RegEx in TypeScript

### String-Methoden mit RegEx

```typescript
// test() - Prüft, ob ein Muster im String existiert
const text = "TypeScript lernen";
const hasScript = /script/i.test(text);  // true

// match() - Findet alle Übereinstimmungen
const matches = text.match(/[A-Z][a-z]+/g);  // ["Type", "Script"]

// matchAll() - Gibt Iterator mit allen Matches zurück
const matchIterator = text.matchAll(/[a-z]+/g);
for (const match of matchIterator) {
  console.log(match[0]);  // "ype", "cript", "lernen"
}

// search() - Gibt Position der ersten Übereinstimmung zurück
const position = text.search(/script/i);  // 4

// replace() - Ersetzt Übereinstimmungen
const replaced = text.replace(/script/i, "Writer");  // "TypeWriter lernen"

// replaceAll() - Ersetzt alle Übereinstimmungen (benötigt g-Flag)
const replacedAll = text.replaceAll(/[aeiou]/g, '*');  // "T*p*Scr*pt l*rn*n"

// split() - Teilt String an Übereinstimmungen
const parts = "a,b;c.d".split(/[,;.]/);  // ["a", "b", "c", "d"]
```

### RegExp-Methoden

```typescript
const regex = /[a-z]+/g;
const str = "TypeScript2023";

// test() - Prüft, ob Muster im String vorkommt
const hasMatch = regex.test(str);  // true

// exec() - Führt Suche aus und gibt detaillierte Info zurück
let match;
while ((match = regex.exec(str)) !== null) {
  console.log(`Gefunden: ${match[0]} an Position ${match.index}`);
}
```

## Musterelemente und Zeichenklassen

### Grundlegende Musterelemente

| Element | Beschreibung                          | Beispiel         |
|---------|---------------------------------------|------------------|
| `.`     | Beliebiges Zeichen außer Zeilenumbruch | `/a.c/` -> "abc", "adc" |
| `^`     | Anfang der Eingabe                    | `/^abc/` -> "abc..." |
| `$`     | Ende der Eingabe                      | `/abc$/` -> "...abc" |
| `*`     | 0 oder mehr Vorkommnisse              | `/ab*c/` -> "ac", "abc", "abbc" |
| `+`     | 1 oder mehr Vorkommnisse              | `/ab+c/` -> "abc", "abbc" |
| `?`     | 0 oder 1 Vorkommen                    | `/ab?c/` -> "ac", "abc" |
| `|`     | Alternation (ODER)                    | `/a|b/` -> "a", "b" |

### Zeichenklassen

| Klasse  | Beschreibung                          | Beispiel         |
|---------|---------------------------------------|------------------|
| `[abc]` | Einzelnes Zeichen aus der Menge       | `/[aeiou]/` -> "a", "e" |
| `[^abc]`| Zeichen außerhalb der Menge           | `/[^0-9]/` -> alles außer Ziffern |
| `[a-z]` | Zeichenbereich (von-bis)              | `/[a-z]/` -> Kleinbuchstaben |
| `\d`    | Ziffern [0-9]                         | `/\d+/` -> "123" |
| `\D`    | Nicht-Ziffern [^0-9]                  | `/\D+/` -> "abc" |
| `\w`    | Wortzeichen [A-Za-z0-9_]              | `/\w+/` -> "abc123" |
| `\W`    | Nicht-Wortzeichen                     | `/\W+/` -> "!@#" |
| `\s`    | Whitespace (Leerzeichen, Tab, etc.)   | `/\s+/` -> " \t\n" |
| `\S`    | Nicht-Whitespace                      | `/\S+/` -> "abc" |

### Quantifizierer

| Quantifizierer | Beschreibung                          | Beispiel         |
|----------------|---------------------------------------|------------------|
| `{n}`          | Genau n Vorkommnisse                  | `/a{3}/` -> "aaa" |
| `{n,}`         | Mindestens n Vorkommnisse             | `/a{2,}/` -> "aa", "aaa" |
| `{n,m}`        | Zwischen n und m Vorkommnisse         | `/a{1,3}/` -> "a", "aa", "aaa" |
| `*`            | 0 oder mehr (Kurzform für {0,})       | `/a*/` -> "", "a", "aa" |
| `+`            | 1 oder mehr (Kurzform für {1,})       | `/a+/` -> "a", "aa" |
| `?`            | 0 oder 1 (Kurzform für {0,1})         | `/a?/` -> "", "a" |

### Gierige vs. nicht-gierige Quantifizierer

Standardmäßig sind Quantifizierer "gierig" (greedy) und versuchen, so viel wie möglich zu erfassen:

```typescript
const greedyPattern = /<.*>/;
const text = "<tag>Inhalt</tag>";
text.match(greedyPattern)[0];  // "<tag>Inhalt</tag>"
```

Mit dem `?` nach dem Quantifizierer wird er "nicht-gierig" (lazy/non-greedy):

```typescript
const lazyPattern = /<.*?>/;
const text = "<tag>Inhalt</tag>";
text.match(lazyPattern)[0];  // "<tag>"
```

## Erfassungsgruppen (Capturing Groups)

Gruppen fassen Teile eines regulären Ausdrucks zusammen und "erfassen" den übereinstimmenden Text:

```typescript
const pattern = /(\d{2})-(\d{2})-(\d{4})/;
const date = "25-12-2023";
const match = date.match(pattern);

// match[0] enthält den gesamten Match: "25-12-2023"
// match[1] enthält die erste Gruppe: "25" (Tag)
// match[2] enthält die zweite Gruppe: "12" (Monat)
// match[3] enthält die dritte Gruppe: "2023" (Jahr)
```

### Benannte Gruppen

Ab ES2018 (unterstützt in TypeScript) können Gruppen Namen haben:

```typescript
const pattern = /(?<day>\d{2})-(?<month>\d{2})-(?<year>\d{4})/;
const date = "25-12-2023";
const match = date.match(pattern);

// Zugriff über Gruppenindex
console.log(match[1]);  // "25"

// Oder über den Gruppennamen
console.log(match.groups.day);    // "25"
console.log(match.groups.month);  // "12"
console.log(match.groups.year);   // "2023"
```

### Nicht-erfassende Gruppen

Mit `(?:...)` wird eine Gruppe erstellt, die nicht erfasst wird:

```typescript
const pattern = /(?:\d{2})-(\d{2})-(\d{4})/;
const date = "25-12-2023";
const match = date.match(pattern);

// match[0] enthält den gesamten Match: "25-12-2023"
// match[1] enthält die zweite Gruppe: "12" (erste zählende Gruppe)
// match[2] enthält die dritte Gruppe: "2023" (zweite zählende Gruppe)
```

## Lookahead und Lookbehind

### Positiver Lookahead

Prüft, ob ein Muster folgt, ohne es zu erfassen:

```typescript
const pattern = /\d+(?=€)/g;
const text = "Artikel kostet 42€ oder 50$";
text.match(pattern);  // ["42"]
```

### Negativer Lookahead

Prüft, ob ein Muster NICHT folgt:

```typescript
const pattern = /\d+(?!€)/g;
const text = "Artikel kostet 42€ oder 50$";
text.match(pattern);  // ["50"]
```

### Positiver Lookbehind

Prüft, ob ein Muster vorausgeht (nur in neueren Browsern und Node.js):

```typescript
const pattern = /(?<=\$)\d+/g;
const text = "Preis: $100 oder €50";
text.match(pattern);  // ["100"]
```

### Negativer Lookbehind

Prüft, ob ein Muster NICHT vorausgeht:

```typescript
const pattern = /(?<!\$)\d+/g;
const text = "Preis: $100 oder €50";
text.match(pattern);  // ["50"]
```

## TypeScript-spezifische RegEx-Nutzung

### Typisierte Extraktion von Matches

```typescript
interface MatchResult {
  date: string;
  amount: string;
}

function extractTransactionInfo(text: string): MatchResult | null {
  const pattern = /(?<date>\d{2}\.\d{2}\.\d{4}): €(?<amount>\d+\.\d{2})/;
  const match = text.match(pattern);
  
  if (!match || !match.groups) {
    return null;
  }
  
  return {
    date: match.groups.date,
    amount: match.groups.amount
  };
}

const transaction = "Transaktion vom 15.03.2023: €42.99 erhalten";
const result = extractTransactionInfo(transaction);
console.log(result);  // { date: "15.03.2023", amount: "42.99" }
```

### RegEx mit TypeScript Generics

```typescript
function matchAll<T extends Record<string, string>>(
  text: string, 
  pattern: RegExp
): T[] {
  if (!pattern.global) {
    pattern = new RegExp(pattern, pattern.flags + 'g');
  }
  
  const results: T[] = [];
  let match;
  
  while ((match = pattern.exec(text)) !== null) {
    if (match.groups) {
      results.push(match.groups as T);
    }
  }
  
  return results;
}

interface EmailMatch {
  user: string;
  domain: string;
}

const emails = "Kontakte: alice@example.com und bob@gmail.com";
const emailPattern = /(?<user>[a-z.]+)@(?<domain>[a-z.]+\.[a-z]+)/gi;

const matches = matchAll<EmailMatch>(emails, emailPattern);
console.log(matches);
// [
//   { user: "alice", domain: "example.com" },
//   { user: "bob", domain: "gmail.com" }
// ]
```

## Häufige Anwendungsfälle

### E-Mail-Validierung

```typescript
function isValidEmail(email: string): boolean {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
}

console.log(isValidEmail("user@example.com"));  // true
console.log(isValidEmail("invalid-email"));     // false
```

### Passwort-Validierung

```typescript
function isStrongPassword(password: string): boolean {
  // Mindestens 8 Zeichen, 1 Großbuchstabe, 1 Kleinbuchstabe, 1 Ziffer, 1 Sonderzeichen
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
  return pattern.test(password);
}

console.log(isStrongPassword("Weakpw1!"));      // true
console.log(isStrongPassword("weakpassword"));  // false
```

### URL-Extraktion

```typescript
function extractUrls(text: string): string[] {
  const pattern = /https?:\/\/[^\s]+/g;
  return text.match(pattern) || [];
}

const content = "Besuche https://www.example.com und http://typescript.org für mehr Info.";
console.log(extractUrls(content));  // ["https://www.example.com", "http://typescript.org"]
```

### Datum-Parsing

```typescript
function parseDate(dateStr: string): Date | null {
  const pattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  const match = dateStr.match(pattern);
  
  if (!match) {
    return null;
  }
  
  const [_, day, month, year] = match;
  return new Date(`${year}-${month}-${day}`);
}

console.log(parseDate("25.12.2023"));  // 2023-12-25T00:00:00.000Z
```

## Performance-Überlegungen

### Vermeidung von Katastrophalem Backtracking

Schlecht geschriebene reguläre Ausdrücke können zu exponentiellem Laufzeitverhalten führen:

```typescript
// Problematisches Muster (verschachtelte Quantifizierer)
const badPattern = /^(a+)+$/;
badPattern.test("aaaaaaaaaaaaaaaaaaaaaaa!"); // Extrem langsam!

// Besseres Muster
const goodPattern = /^a+$/;
goodPattern.test("aaaaaaaaaaaaaaaaaaaaaaa!"); // Schnell
```

### Vorkompilierung von RegEx

Bei wiederholter Verwendung sollten reguläre Ausdrücke vorkompiliert werden:

```typescript
// Schlecht: RegEx wird bei jedem Aufruf neu erstellt
function badCheck(input: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(input);
}

// Gut: RegEx wird einmal erstellt und wiederverwendet
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
function goodCheck(input: string): boolean {
  return DATE_PATTERN.test(input);
}
```

## Debugging von RegEx

### Verwendung von RegEx-Testern

Online-Tools wie regex101.com sind hilfreich zum Testen und Debuggen:

```typescript
// Code zum Testen in regex101.com
const pattern = /(\w+)\s(\w+)/;
const str = "John Doe";
const match = str.match(pattern);
console.log(match);
```

### Schrittweise Erweiterung

Bei komplexen Mustern ist es hilfreich, schrittweise vorzugehen:

```typescript
// Start mit einfachem Muster
let pattern = /\d+/;
console.log("Test123".match(pattern)); // ["123"]

// Schrittweise erweitern
pattern = /\d{2,4}/;
console.log("Test123".match(pattern)); // ["123"]

pattern = /\d{2,4}-\d{2}/;
console.log("Test123-45".match(pattern)); // ["123-45"]
```

## Zusammenfassung

Reguläre Ausdrücke in TypeScript bieten ein mächtiges Werkzeug für Textverarbeitung, Validierung und Extraktion von Informationen. Mit der richtigen Kenntnis der Syntax und Methoden lassen sich komplexe Textoperationen effizient umsetzen.

Die Kombination aus TypeScript's statischer Typisierung und regulären Ausdrücken ermöglicht typsichere Extraktion von Daten und vereinfacht die Verarbeitung von Textinformationen in strukturierten Anwendungen.