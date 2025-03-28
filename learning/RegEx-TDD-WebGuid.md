# TDD mit RegEx in TypeScript - Cheat Sheet

## TDD-Zyklus für RegEx

| Phase | Beschreibung | Beispiel |
|-------|-------------|----------|
| **Red** | Test schreiben, der fehlschlägt | `test('email ist gültig', () => { expect(isValidEmail('test@example.com')).toBe(true); });` |
| **Green** | Einfachste RegEx implementieren | `const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);` |
| **Refactor** | RegEx verbessern | `const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);` |

## Jest Setup für RegEx-Tests

```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts']
};

// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

## Struktur eines RegEx-Tests

```typescript
// email-validator.test.ts
import { validateEmail } from './email-validator';

describe('Email Validator', () => {
  test('validates correct emails', () => {
    const validEmails = ['test@example.com', 'user.name@domain.co.uk'];
    validEmails.forEach(email => {
      expect(validateEmail(email)).toBe(true);
    });
  });
  
  test('rejects invalid emails', () => {
    const invalidEmails = ['plaintext', 'missing@domain', 'user@.com'];
    invalidEmails.forEach(email => {
      expect(validateEmail(email)).toBe(false);
    });
  });
});
```

## Parameterisierte Tests für RegEx

```typescript
// password-validator.test.ts
interface TestCase {
  input: string;
  expected: boolean;
  description: string;
}

const testCases: TestCase[] = [
  { input: 'short', expected: false, description: 'zu kurz' },
  { input: 'password123', expected: false, description: 'keine Großbuchstaben' },
  { input: 'Password!', expected: false, description: 'keine Ziffer' },
  { input: 'Pa55w0rd!', expected: true, description: 'erfüllt alle Kriterien' }
];

test.each(testCases)('Passwort "$input" ist $description', ({ input, expected }) => {
  expect(isStrongPassword(input)).toBe(expected);
});
```

## RegEx-Grundelemente für TDD

| Element | Bedeutung | Im TDD-Kontext |
|---------|-----------|----------------|
| `^`, `$` | Anfang/Ende | Wichtig für exakte Muster in Tests |
| `\d`, `\w`, `\s` | Ziffern, Wortzeichen, Leerzeichen | Häufig in Validierungs-Tests |
| `+`, `*`, `?` | 1+, 0+, 0/1 Vorkommnisse | In Tests explizit Grenzen prüfen |
| `{n,m}` | n bis m Vorkommnisse | Testfälle für Grenzwerte (n-1, n, m, m+1) |
| `[]` | Zeichenklasse | Tests für jede relevante Zeichenkategorie |
| `()` | Erfassungsgruppe | Tests für extrahierte Gruppen |
| `(?<name>)` | Benannte Gruppe | Tests für typisierte Extraktion |

## Testschablonen für häufige RegEx-Muster

### E-Mail-Validierung

```typescript
test('validates email format', () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Gültige E-Mails
  expect(emailRegex.test('user@example.com')).toBe(true);
  expect(emailRegex.test('first.last@domain.co.uk')).toBe(true);
  expect(emailRegex.test('user+tag@gmail.com')).toBe(true);
  
  // Ungültige E-Mails
  expect(emailRegex.test('plaintext')).toBe(false);
  expect(emailRegex.test('missing@domain')).toBe(false);
  expect(emailRegex.test('@missinguser.com')).toBe(false);
  expect(emailRegex.test('user@domain.')).toBe(false);
});
```

### Passwort-Stärke

```typescript
test('validates password strength', () => {
  // Min. 8 Zeichen, 1 Großbuchstabe, 1 Kleinbuchstabe, 1 Ziffer, 1 Sonderzeichen
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
  
  // Zu kurz
  expect(strongPasswordRegex.test('Pw1!')).toBe(false);
  
  // Fehlender Großbuchstabe
  expect(strongPasswordRegex.test('password123!')).toBe(false);
  
  // Fehlende Ziffer
  expect(strongPasswordRegex.test('Password!')).toBe(false);
  
  // Fehlendes Sonderzeichen
  expect(strongPasswordRegex.test('Password123')).toBe(false);
  
  // Erfüllt alle Kriterien
  expect(strongPasswordRegex.test('Password123!')).toBe(true);
});
```

### Datumsformatvalidierung

```typescript
test('validates date format (DD.MM.YYYY)', () => {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
  
  // Gültige Datumsformate
  expect(dateRegex.test('01.01.2023')).toBe(true);
  expect(dateRegex.test('31.12.2023')).toBe(true);
  expect(dateRegex.test('15.07.2023')).toBe(true);
  
  // Ungültige Datumsformate
  expect(dateRegex.test('32.12.2023')).toBe(false); // Ungültiger Tag
  expect(dateRegex.test('15.13.2023')).toBe(false); // Ungültiger Monat
  expect(dateRegex.test('1.1.2023')).toBe(false);   // Fehlende führende Nullen
  expect(dateRegex.test('01/01/2023')).toBe(false); // Falsches Trennzeichen
});
```

## Tests für RegEx-Extraktionen

```typescript
test('extracts data with capturing groups', () => {
  const datePattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  const match = '15.03.2023'.match(datePattern);
  
  expect(match).not.toBeNull();
  if (match) {
    expect(match[0]).toBe('15.03.2023'); // Vollständiger Match
    expect(match[1]).toBe('15');         // Tag
    expect(match[2]).toBe('03');         // Monat
    expect(match[3]).toBe('2023');       // Jahr
  }
});

test('extracts data with named capturing groups', () => {
  const datePattern = /(?<day>\d{2})\.(?<month>\d{2})\.(?<year>\d{4})/;
  const match = '15.03.2023'.match(datePattern);
  
  expect(match).not.toBeNull();
  if (match && match.groups) {
    expect(match.groups.day).toBe('15');
    expect(match.groups.month).toBe('03');
    expect(match.groups.year).toBe('2023');
  }
});
```

## Typsichere RegEx in TypeScript

```typescript
// Typsichere Extraktion mit benannten Gruppen
interface DateMatch {
  day: string;
  month: string;
  year: string;
}

function extractDate(text: string): DateMatch | null {
  const pattern = /(?<day>\d{2})\.(?<month>\d{2})\.(?<year>\d{4})/;
  const match = text.match(pattern);
  
  if (!match || !match.groups) {
    return null;
  }
  
  return match.groups as DateMatch;
}

test('extracts typed date data', () => {
  const result = extractDate('Datum: 15.03.2023');
  
  expect(result).not.toBeNull();
  if (result) {
    expect(result.day).toBe('15');
    expect(result.month).toBe('03');
    expect(result.year).toBe('2023');
  }
});
```

## Test-Fixtures für RegEx

```typescript
// Test-Fixture für HTML-Inhalte
const HTML_FIXTURE = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Page</title>
</head>
<body>
  <h1>Header</h1>
  <p>Text mit <a href="https://example.com">Link</a>.</p>
</body>
</html>
`;

test('extracts all links from HTML', () => {
  const linkPattern = /href=["']([^"']+)["']/g;
  const links: string[] = [];
  let match;
  
  while ((match = linkPattern.exec(HTML_FIXTURE)) !== null) {
    links.push(match[1]);
  }
  
  expect(links).toEqual(['https://example.com']);
});
```

## Tests für RegEx-Performance

```typescript
test('compares performance of different regex patterns', () => {
  const simplePattern = /\d+\.\d+\.\d+/g;
  const optimizedPattern = /\b\d{1,2}\.\d{1,2}\.\d{4}\b/g;
  
  const testText = 'Dates: 01.01.2023, 15.03.2023 and many more...'.repeat(1000);
  
  // Funktionalitätstest
  expect(testText.match(simplePattern)?.length).toBe(testText.match(optimizedPattern)?.length);
  
  // Performance-Test
  const startSimple = performance.now();
  testText.match(simplePattern);
  const endSimple = performance.now();
  
  const startOpt