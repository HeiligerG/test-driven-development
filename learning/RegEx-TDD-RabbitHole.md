# Test-Driven Development (TDD) mit RegEx in TypeScript

## Grundlagen von TDD mit RegEx

Test-Driven Development ist ein Entwicklungsansatz, bei dem Tests vor dem eigentlichen Code geschrieben werden. Bei der Arbeit mit regulären Ausdrücken in TypeScript bietet TDD besondere Vorteile:

1. Klare Definition des erwarteten Verhaltens
2. Schnelles Feedback zur Korrektheit der RegEx
3. Vereinfachtes Refactoring
4. Dokumentation durch Tests

Der TDD-Zyklus für RegEx sieht typischerweise so aus:
1. **Red**: Schreibe einen fehlschlagenden Test für einen RegEx-Anwendungsfall
2. **Green**: Implementiere den einfachsten RegEx, der den Test bestehen lässt
3. **Refactor**: Optimiere den RegEx ohne die Funktionalität zu ändern

```typescript
// Beispiel für TDD-Zyklus mit RegEx
// 1. Red: Fehlschlagender Test
test('validate email format', () => {
  const emailRegex = /implement-me/;
  expect(emailRegex.test('user@example.com')).toBe(true);
  expect(emailRegex.test('invalid-email')).toBe(false);
});

// 2. Green: Implementierung des RegEx
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 3. Refactor: Optimierter RegEx mit besserer Validierung
const improvedEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

## Test-Framework Setup für RegEx-TDD

### Jest für TypeScript RegEx-Tests

Jest ist ein beliebtes Framework für TDD in TypeScript-Projekten. Setup für RegEx-Tests:

```typescript
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.0.4"
  }
}

// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts']
};
```

### Erstellen einer RegEx-Testdatei

```typescript
// regex.test.ts
import { validateEmail, extractDates, parsePhoneNumber } from './regex-utils';

describe('Email Validation', () => {
  const validEmails = [
    'test@example.com',
    'user.name@domain.co.uk',
    'user+tag@example.org'
  ];
  
  const invalidEmails = [
    'plaintext',
    'missing@domain',
    '@missinguser.com',
    'user@.com',
    'user@domain.'
  ];
  
  test('validates correct email formats', () => {
    validEmails.forEach(email => {
      expect(validateEmail(email)).toBe(true);
    });
  });
  
  test('rejects incorrect email formats', () => {
    invalidEmails.forEach(email => {
      expect(validateEmail(email)).toBe(false);
    });
  });
});
```

## TDD für RegEx-Grundfunktionen

### Implementierung nach TDD-Prinzipien

```typescript
// regex-utils.ts
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function extractDates(text: string): string[] {
  const dateRegex = /\b(\d{1,2})[-./](\d{1,2})[-./](\d{2,4})\b/g;
  return Array.from(text.matchAll(dateRegex), match => match[0]);
}

export function parsePhoneNumber(input: string): string | null {
  const phoneRegex = /^(\+\d{1,3})?[-.\s]?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  
  if (!phoneRegex.test(input)) {
    return null;
  }
  
  // Normalisiere Telefonnummer (entferne alles außer Ziffern und +)
  return input.replace(/[^0-9+]/g, '');
}
```

## TDD für komplexe RegEx-Muster

### Parameterisierte Tests für verschiedene Eingaben

```typescript
// password-validator.test.ts
import { isStrongPassword } from './password-validator';

describe('Password Strength Validator', () => {
  interface TestCase {
    password: string;
    shouldPass: boolean;
    description: string;
  }
  
  const testCases: TestCase[] = [
    { password: 'abc123', shouldPass: false, description: 'zu kurz' },
    { password: 'password123', shouldPass: false, description: 'keine Großbuchstaben' },
    { password: 'Password123', shouldPass: false, description: 'kein Sonderzeichen' },
    { password: 'Password!', shouldPass: false, description: 'keine Ziffer' },
    { password: 'PASSWORD123!', shouldPass: false, description: 'keine Kleinbuchstaben' },
    { password: 'Pa55w0rd!', shouldPass: true, description: 'erfüllt alle Kriterien' }
  ];
  
  test.each(testCases)('Passwort "$password" ist $description', ({ password, shouldPass }) => {
    expect(isStrongPassword(password)).toBe(shouldPass);
  });
});

// password-validator.ts
export function isStrongPassword(password: string): boolean {
  // Mindestens 8 Zeichen, 1 Großbuchstabe, 1 Kleinbuchstabe, 1 Ziffer, 1 Sonderzeichen
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
  return strongPasswordRegex.test(password);
}
```

### Test-Fixtures für RegEx-Tests

```typescript
// fixtures/test-data.ts
export const HTML_SAMPLE = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Page</title>
</head>
<body>
  <h1>Header</h1>
  <p>Paragraph with <a href="https://example.com">link</a>.</p>
  <img src="image.jpg" alt="Test Image">
</body>
</html>
`;

// html-parser.test.ts
import { HTML_SAMPLE } from './fixtures/test-data';
import { extractLinks, extractTags, extractAttributes } from './html-parser';

describe('HTML Parser', () => {
  test('extracts all links from HTML', () => {
    const links = extractLinks(HTML_SAMPLE);
    expect(links).toEqual(['https://example.com']);
  });
  
  test('extracts all HTML tags', () => {
    const tags = extractTags(HTML_SAMPLE);
    expect(tags).toContain('html');
    expect(tags).toContain('head');
    expect(tags).toContain('body');
    expect(tags).toContain('h1');
    expect(tags).toContain('p');
    expect(tags).toContain('a');
    expect(tags).toContain('img');
  });
  
  test('extracts attributes from a specific tag', () => {
    const imgAttributes = extractAttributes(HTML_SAMPLE, 'img');
    expect(imgAttributes).toContainEqual({ name: 'src', value: 'image.jpg' });
    expect(imgAttributes).toContainEqual({ name: 'alt', value: 'Test Image' });
  });
});

// html-parser.ts
export function extractLinks(html: string): string[] {
  const linkRegex = /href=["']([^"']+)["']/g;
  return Array.from(html.matchAll(linkRegex), match => match[1]);
}

export function extractTags(html: string): string[] {
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  const matches = Array.from(html.matchAll(tagRegex), match => match[1].toLowerCase());
  return [...new Set(matches)]; // Entferne Duplikate
}

export function extractAttributes(html: string, tag: string): { name: string; value: string }[] {
  const tagPattern = new RegExp(`<${tag}\\s+([^>]*)>`, 'gi');
  const attrPattern = /([a-z][a-z0-9-]*)=["']([^"']*)["']/gi;
  
  const attributes: { name: string; value: string }[] = [];
  const tagMatches = html.match(tagPattern);
  
  if (!tagMatches) return [];
  
  tagMatches.forEach(tagMatch => {
    let attrMatch;
    while ((attrMatch = attrPattern.exec(tagMatch)) !== null) {
      attributes.push({
        name: attrMatch[1],
        value: attrMatch[2]
      });
    }
  });
  
  return attributes;
}
```

## TDD für benannte Gruppen und Datenextraktion

### Tests für strukturierte Datenerkennung

```typescript
// data-extractor.test.ts
import { extractTransactionData, Transaction } from './data-extractor';

describe('Transaction Data Extractor', () => {
  test('extracts transaction data from text', () => {
    const text = `
      Transaktion: #12345
      Datum: 15.03.2023
      Betrag: €42,99
      Kunde: Max Mustermann
      Referenz: REF-2023-001
    `;
    
    const expected: Transaction = {
      id: '12345',
      date: '15.03.2023',
      amount: '42,99',
      customer: 'Max Mustermann',
      reference: 'REF-2023-001'
    };
    
    expect(extractTransactionData(text)).toEqual(expected);
  });
  
  test('returns null for invalid transaction text', () => {
    const invalidText = `
      Dies ist kein Transaktionstext
      Ohne strukturierte Daten
    `;
    
    expect(extractTransactionData(invalidText)).toBeNull();
  });
  
  test('handles partial transaction data', () => {
    const partialText = `
      Transaktion: #67890
      Datum: 20.04.2023
      Betrag: €99,95
    `;
    
    const expected: Partial<Transaction> = {
      id: '67890',
      date: '20.04.2023',
      amount: '99,95',
      customer: undefined,
      reference: undefined
    };
    
    expect(extractTransactionData(partialText)).toMatchObject(expected);
  });
});

// data-extractor.ts
export interface Transaction {
  id: string;
  date: string;
  amount: string;
  customer: string;
  reference: string;
}

export function extractTransactionData(text: string): Transaction | null {
  // Benannte Gruppen für strukturierte Datenextraktion
  const idRegex = /Transaktion:\s+#(?<id>\d+)/;
  const dateRegex = /Datum:\s+(?<date>\d{2}\.\d{2}\.\d{4})/;
  const amountRegex = /Betrag:\s+€(?<amount>[\d,.]+)/;
  const customerRegex = /Kunde:\s+(?<customer>.+)$/m;
  const referenceRegex = /Referenz:\s+(?<reference>[A-Z0-9-]+)/;
  
  const idMatch = text.match(idRegex);
  const dateMatch = text.match(dateRegex);
  const amountMatch = text.match(amountRegex);
  
  // Basisdaten müssen vorhanden sein
  if (!idMatch?.groups || !dateMatch?.groups || !amountMatch?.groups) {
    return null;
  }
  
  const customerMatch = text.match(customerRegex);
  const referenceMatch = text.match(referenceRegex);
  
  return {
    id: idMatch.groups.id,
    date: dateMatch.groups.date,
    amount: amountMatch.groups.amount,
    customer: customerMatch?.groups?.customer || '',
    reference: referenceMatch?.groups?.reference || ''
  };
}
```

## TDD für RegEx mit Look-ahead und Look-behind

### Validierung komplexer Muster mit Lookaround

```typescript
// code-validator.test.ts
import { validateProductCode } from './code-validator';

describe('Product Code Validator', () => {
  test('validates correct product codes', () => {
    // Gültige Codes: 3 Buchstaben, gefolgt von - und 5 Ziffern, endet nicht mit 0
    const validCodes = ['ABC-12345', 'XYZ-98761', 'PRD-54321'];
    
    validCodes.forEach(code => {
      expect(validateProductCode(code)).toBe(true);
    });
  });
  
  test('rejects invalid product codes', () => {
    // Ungültige Codes
    const invalidCodes = [
      'AB-12345',    // zu wenig Buchstaben
      'ABCD-12345',  // zu viele Buchstaben
      'ABC-1234',    // zu wenig Ziffern
      'ABC-123456',  // zu viele Ziffern
      'ABC12345',    // fehlendes -
      '123-ABC45',   // falsche Reihenfolge
      'ABC-12340',   // endet mit 0
    ];
    
    invalidCodes.forEach(code => {
      expect(validateProductCode(code)).toBe(false);
    });
  });
});

// code-validator.ts
export function validateProductCode(code: string): boolean {
  // Verwendet positive lookahead für "endet nicht mit 0"
  const productCodeRegex = /^[A-Z]{3}-(?=\d{4}[1-9]$)\d{5}$/;
  return productCodeRegex.test(code);
}
```

## TDD für RegEx mit globalen vs. nicht-globalen Suchen

### Tests für unterschiedliche Suchstrategien

```typescript
// search-strategies.test.ts
import { findFirstMatch, findAllMatches, findFullMatches } from './search-strategies';

describe('RegEx Search Strategies', () => {
  const testString = 'Der Preis beträgt 42€, der Rabatt 5€ und die Versandkosten 3.99€.';
  
  test('finds first price only', () => {
    const result = findFirstMatch(testString);
    expect(result).toEqual(['42']);
  });
  
  test('finds all prices', () => {
    const result = findAllMatches(testString);
    expect(result).toEqual(['42', '5', '3.99']);
  });
  
  test('finds full price expressions with currency', () => {
    const result = findFullMatches(testString);
    expect(result).toEqual(['42€', '5€', '3.99€']);
  });
});

// search-strategies.ts
export function findFirstMatch(text: string): string[] {
  const priceRegex = /(\d+(?:\.\d+)?)/; // Nicht-global
  const match = text.match(priceRegex);
  return match ? [match[1]] : [];
}

export function findAllMatches(text: string): string[] {
  const priceRegex = /(\d+(?:\.\d+)?)/g; // Global
  return Array.from(text.matchAll(priceRegex), m => m[1]);
}

export function findFullMatches(text: string): string[] {
  const priceRegex = /(\d+(?:\.\d+)?€)/g; // Global mit Währungszeichen
  return text.match(priceRegex) || [];
}
```

## TDD für dynamische RegEx-Erstellung

### Tests für parametrisierte RegEx-Funktionen

```typescript
// dynamic-regex.test.ts
import { createRangeValidator, createPatternMatcher } from './dynamic-regex';

describe('Dynamic RegEx Creation', () => {
  describe('Range Validator', () => {
    test('validates numbers in range', () => {
      const validateRange = createRangeValidator(1, 100);
      
      expect(validateRange('0')).toBe(false);
      expect(validateRange('1')).toBe(true);
      expect(validateRange('50')).toBe(true);
      expect(validateRange('100')).toBe(true);
      expect(validateRange('101')).toBe(false);
    });
    
    test('handles negative ranges', () => {
      const validateRange = createRangeValidator(-10, 10);
      
      expect(validateRange('-11')).toBe(false);
      expect(validateRange('-10')).toBe(true);
      expect(validateRange('0')).toBe(true);
      expect(validateRange('10')).toBe(true);
      expect(validateRange('11')).toBe(false);
    });
  });
  
  describe('Pattern Matcher', () => {
    test('creates custom word boundary pattern', () => {
      const findWords = createPatternMatcher(['test', 'example', 'pattern'], true);
      
      expect(findWords('This is a test')).toBe(true);
      expect(findWords('An example text')).toBe(true);
      expect(findWords('Regular pattern')).toBe(true);
      expect(findWords('Contest')).toBe(false); // 'test' nur als ganzes Wort
      expect(findWords('Examples')).toBe(false); // 'example' nur als ganzes Wort
    });
    
    test('creates pattern without word boundaries', () => {
      const findSubstrings = createPatternMatcher(['test', 'example', 'pattern'], false);
      
      expect(findSubstrings('This is a test')).toBe(true);
      expect(findSubstrings('Contest')).toBe(true); // 'test' als Teilstring
      expect(findSubstrings('Examples')).toBe(true); // 'example' als Teilstring
    });
  });
});

// dynamic-regex.ts
export function createRangeValidator(min: number, max: number): (value: string) => boolean {
  // Erstellt dynamisch einen RegEx für Zahlenbereichsvalidierung
  return (value: string): boolean => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return false;
    return num >= min && num <= max;
  };
}

export function createPatternMatcher(words: string[], wholeWords: boolean): (text: string) => boolean {
  // Escaped alle Sonderzeichen in den Wörtern
  const escapedWords = words.map(word => 
    word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  
  // Erstellt RegEx mit oder ohne Wortgrenzen
  const pattern = wholeWords
    ? new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'i')
    : new RegExp(`(${escapedWords.join('|')})`, 'i');
  
  return (text: string): boolean => pattern.test(text);
}
```

## TDD für RegEx-Performance

### Tests für Performanceoptimierungen

```typescript
// performance.test.ts
import { 
  findEmailsSimple, 
  findEmailsOptimized,
  validateUrlSimple,
  validateUrlOptimized
} from './performance';

describe('RegEx Performance Optimization', () => {
  const sampleText = `Lorem ipsum dolor sit amet, max@example.com consectetur
  adipiscing elit, test.user@company.co.uk sed do eiusmod tempor
  incididunt ut labore et dolore magna aliqua. info+spam@test.org`;
  
  const longText = sampleText.repeat(1000);
  
  test('compare email extraction performance', () => {
    // Erwartetes Ergebnis
    const expectedEmails = ['max@example.com', 'test.user@company.co.uk', 'info+spam@test.org'];
    
    // Funktionalitätstest
    expect(findEmailsSimple(sampleText).sort()).toEqual(expectedEmails.sort());
    expect(findEmailsOptimized(sampleText).sort()).toEqual(expectedEmails.sort());
    
    // Performance-Test
    const startSimple = performance.now();
    findEmailsSimple(longText);
    const endSimple = performance.now();
    
    const startOptimized = performance.now();
    findEmailsOptimized(longText);
    const endOptimized = performance.now();
    
    // Protokolliere Laufzeiten (keine strikte Assertion, da Umgebungsabhängig)
    console.log(`Simple: ${endSimple - startSimple}ms, Optimized: ${endOptimized - startOptimized}ms`);
    
    // In den meisten Fällen sollte die optimierte Version schneller sein
    // expect(endOptimized - startOptimized).toBeLessThan(endSimple - startSimple);
  });
  
  test('compare URL validation performance', () => {
    const validUrls = [
      'https://example.com',
      'http://test.org/path',
      'https://sub.domain.co.uk/path?query=value#fragment'
    ];
    
    const invalidUrls = [
      'not-a-url',
      'http:/missing-slash.com',
      'https://invalid-.com'
    ];
    
    // Funktionalitätstest
    validUrls.forEach(url => {
      expect(validateUrlSimple(url)).toBe(true);
      expect(validateUrlOptimized(url)).toBe(true);
    });
    
    invalidUrls.forEach(url => {
      expect(validateUrlSimple(url)).toBe(false);
      expect(validateUrlOptimized(url)).toBe(false);
    });
    
    // Performance-Test
    const urlsToTest = validUrls.concat(invalidUrls).concat(Array(10000).fill('https://perftest.com'));
    
    const startSimple = performance.now();
    urlsToTest.forEach(url => validateUrlSimple(url));
    const endSimple = performance.now();
    
    const startOptimized = performance.now();
    urlsToTest.forEach(url => validateUrlOptimized(url));
    const endOptimized = performance.now();
    
    console.log(`URL Simple: ${endSimple - startSimple}ms, URL Optimized: ${endOptimized - startOptimized}ms`);
  });
});

// performance.ts
// Nicht optimierte E-Mail-Suche (potentiell katastrophales Backtracking)
export function findEmailsSimple(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return text.match(emailRegex) || [];
}

// Optimierte E-Mail-Suche mit begrenzter Rückschau
export function findEmailsOptimized(text: string): string[] {
  // Begrenze mögliche Tekenstellen vor @ und verwende Anker
  const emailRegex = /\b[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}\b/g;
  return text.match(emailRegex) || [];
}

// Einfache URL-Validierung (potenziell langsam)
export function validateUrlSimple(url: string): boolean {
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return urlRegex.test(url);
}

// Optimierte URL-Validierung
export function validateUrlOptimized(url: string): boolean {
  // Frühzeitige Prüfungen ohne RegEx
  if (!url.includes('.')) return false;
  if (url.startsWith('http') && !url.startsWith('http://') && !url.startsWith('https://')) return false;
  
  // Optimierter RegEx ohne verschachtelte Quantifizierer
  const urlRegex = /^(https?:\/\/)?[\da-z][\da-z\.-]*\.([a-z\.]{2,6})(\/[\w\.-]*)*\/?$/;
  return urlRegex.test(url);
}
```

## TDD für RegEx mit Fehlerbehandlung

### Tests für robuste Fehlerbehandlung

```typescript
// error-handling.test.ts
import { safeExtract, parseUserInput } from './error-handling';

describe('RegEx Error Handling', () => {
  test('safely extracts values even with invalid inputs', () => {
    // Gültige Eingabe
    expect(safeExtract('Price: $42.99', /Price:\s*\$(\d+\.\d+)/)).toEqual(['42.99']);
    
    // Ungültige Eingaben
    expect(safeExtract('No price here', /Price:\s*\$(\d+\.\d+)/)).toEqual([]);
    expect(safeExtract(null, /test/)).toEqual([]);
    expect(safeExtract(undefined, /test/)).toEqual([]);
  });
  
  test('handles varying user inputs safely', () => {
    // Gültige Eingaben
    expect(parseUserInput('Name: John')).toEqual({ type: 'name', value: 'John' });
    expect(parseUserInput('Email: john@example.com')).toEqual({ type: 'email', value: 'john@example.com' });
    expect(parseUserInput('Phone: 123-456-7890')).toEqual({ type: 'phone', value: '123-456-7890' });
    
    // Ungültige Eingaben
    expect(parseUserInput('Random text')).toEqual({ type: 'unknown', value: 'Random text' });
    expect(parseUserInput('')).toEqual({ type: 'empty', value: '' });
    
    // Potentiell problematische Eingaben
    const veryLongInput = 'Name: ' + 'A'.repeat(10000);
    expect(() => parseUserInput(veryLongInput)).not.toThrow();
  });
});

// error-handling.ts
export function safeExtract(input: string | null | undefined, pattern: RegExp): string[] {
  if (!input) return [];
  
  try {
    const matches = input.match(pattern);
    if (!matches || matches.length < 2) return [];
    
    return matches.slice(1);
  } catch (error) {
    console.error('Error in RegEx extraction:', error);
    return [];
  }
}

export interface ParsedInput {
  type: 'name' | 'email' | 'phone' | 'unknown' | 'empty';
  value: string;
}

export function parseUserInput(input: string): ParsedInput {
  if (!input) return { type: 'empty', value: '' };
  
  try {
    // Rate des Eingabetyps mit begrenzter Verarbeitungszeit (timeout-Schutz)
    const nameMatch = /^Name:\s+(.+)$/.exec(input);
    if (nameMatch) {
      return { type: 'name', value: nameMatch[1].substring(0, 100) }; // Begrenze Länge
    }
    
    const emailMatch = /^Email:\s+(.+@.+\..+)$/.exec(input);
    if (emailMatch) {
      return { type: 'email', value: emailMatch[1].substring(0, 100) };
    }
    
    const phoneMatch = /^Phone:\s+(.+)$/.exec(input);
    if (phoneMatch) {
      return { type: 'phone', value: phoneMatch[1].substring(0, 20) };
    }
    
    return { type: 'unknown', value: input.substring(0, 200) }; // Begrenzte Länge für Unbekanntes
  } catch (error) {
    console.error('Error parsing user input:', error);
    return { type: 'unknown', value: 'Error processing input' };
  }
}

// validator-service.ts
interface UserData {
  name: string;
  email: string;
  phone: string;
  zipCode: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateUserData(userData: UserData): ValidationResult {
  const repository = new RegexRepository();
  const errors: Record<string, string> = {};
  
  // Email-Validierung
  if (!repository.getEmailPattern().test(userData.email)) {
    errors.email = 'Ungültiges E-Mail-Format';
  }
  
  // Telefon-Validierung
  if (!repository.getPhonePattern().test(userData.phone)) {
    errors.phone = 'Ungültiges Telefonformat (xxx-xxx-xxxx erwartet)';
  }
  
  // PLZ-Validierung
  if (!repository.getZipCodePattern().test(userData.zipCode)) {
    errors.zipCode = 'Ungültige PLZ';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
```

## TDD mit Mocking für RegEx-Abhängigkeiten

### Tests mit gemockten externen Abhängigkeiten

```typescript
// validator-service.test.ts
import { validateUserData } from './validator-service';
import { RegexRepository } from './regex-repository';

// Mock der RegEx-Repository-Klasse
jest.mock('./regex-repository');
const MockedRegexRepository = RegexRepository as jest.MockedClass<typeof RegexRepository>;

describe('User Data Validator Service', () => {
  beforeEach(() => {
    // Zurücksetzen des Mocks vor jedem Test
    MockedRegexRepository.mockClear();
    
    // Standard-Mock-Implementierungen
    MockedRegexRepository.prototype.getEmailPattern.mockReturnValue(/^.+@.+\..+$/);
    MockedRegexRepository.prototype.getPhonePattern.mockReturnValue(/^\d{3}-\d{3}-\d{4}$/);
    MockedRegexRepository.prototype.getZipCodePattern.mockReturnValue(/^\d{5}(-\d{4})?$/);
  });
  
  test('validates user data using repository patterns', () => {
    const validUser = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      zipCode: '12345'
    };
    
    const result = validateUserData(validUser);
    
    // Überprüfe Validierungsergebnis
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    
    // Überprüfe, ob Repository-Methoden aufgerufen wurden
    expect(MockedRegexRepository.prototype.getEmailPattern).toHaveBeenCalled();
    expect(MockedRegexRepository.prototype.getPhonePattern).toHaveBeenCalled();
    expect(MockedRegexRepository.prototype.getZipCodePattern).toHaveBeenCalled();
  });
  
  test('returns validation errors for invalid data', () => {
    const invalidUser = {
      name: 'John Doe',
      email: 'invalid-email',
      phone: '12345',
      zipCode: 'abc'
    };
    
    const result = validateUserData(invalidUser);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('phone');
    expect(result.errors).toHaveProperty('zipCode');
  });
  
  test('handles custom regex patterns from repository', () => {
    // Override standard-Mock mit spezifischeren Patterns
    MockedRegexRepository.prototype.getEmailPattern.mockReturnValue(/^[a-z]+@example\.com$/);
    
    const user1 = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '123-456-7890',
      zipCode: '12345'
    };
    
    const user2 = {
      name: 'Another User',
      email: 'user@gmail.com', // nicht im Override-Pattern enthalten
      phone: '123-456-7890',
      zipCode: '12345'
    };
    
    expect(validateUserData(user1).isValid).toBe(true);
    expect(validateUserData(user2).isValid).toBe(false);
    expect(validateUserData(user2).errors).toHaveProperty('email');
  });
});

// regex-repository.ts
export class RegexRepository {
  getEmailPattern(): RegExp {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  }
  
  getPhonePattern(): RegExp {
    return /^\d{3}-\d{3}-\d{4}$/;
  }
  
  getZipCodePattern(): RegExp {
    return /^\d{5}(-\d{4})?$/;
  }
}
```

## Integration von RegEx in TypeScript-Typsystem

### Typsichere RegEx-Nutzung mit generischen Typen

```typescript
// typed-regex.test.ts
import { createTypedRegex, TypedRegexResult } from './typed-regex';

describe('Typed RegEx', () => {
  interface DateMatch {
    day: string;
    month: string;
    year: string;
  }
  
  const dateRegex = createTypedRegex<DateMatch>(
    /(?<day>\d{2})\.(?<month>\d{2})\.(?<year>\d{4})/
  );
  
  test('extracts typed data from matches', () => {
    const result = dateRegex.exec('Datum: 15.03.2023');
    
    expect(result).not.toBeNull();
    if (result) {
      expect(result.groups.day).toBe('15');
      expect(result.groups.month).toBe('03');
      expect(result.groups.year).toBe('2023');
      
      // Typsicherheit: TypeScript sollte diese Eigenschaft nicht kennen
      // @ts-expect-error
      expect(result.groups.unknown).toBeUndefined();
    }
  });
  
  test('provides type-safe array of all matches', () => {
    const multiDateText = 'Termine: 01.01.2023, 15.03.2023 und 30.12.2023';
    const results = dateRegex.matchAll(multiDateText);
    
    expect(results.length).toBe(3);
    
    results.forEach(match => {
      expect(match.groups).toHaveProperty('day');
      expect(match.groups).toHaveProperty('month');
      expect(match.groups).toHaveProperty('year');
      
      // Überprüfe Formatierung
      expect(match.groups.day).toMatch(/^\d{2}$/);
      expect(match.groups.month).toMatch(/^\d{2}$/);
      expect(match.groups.year).toMatch(/^\d{4}$/);
    });
  });
});

// typed-regex.ts
export interface TypedRegexResult<T> {
  index: number;
  input: string;
  groups: T;
}

export interface TypedRegex<T> {
  exec(input: string): TypedRegexResult<T> | null;
  test(input: string): boolean;
  matchAll(input: string): TypedRegexResult<T>[];
}

export function createTypedRegex<T>(pattern: RegExp): TypedRegex<T> {
  // Stelle sicher, dass das Pattern 'g' Flag für matchAll hat
  const globalPattern = pattern.global 
    ? pattern 
    : new RegExp(pattern.source, pattern.flags + 'g');
  
  return {
    exec(input: string): TypedRegexResult<T> | null {
      const result = pattern.exec(input);
      if (!result || !result.groups) return null;
      
      return {
        index: result.index,
        input: result.input,
        groups: result.groups as unknown as T
      };
    },
    
    test(input: string): boolean {
      return pattern.test(input);
    },
    
    matchAll(input: string): TypedRegexResult<T>[] {
      const results: TypedRegexResult<T>[] = [];
      let match;
      
      while ((match = globalPattern.exec(input)) !== null) {
        if (match.groups) {
          results.push({
            index: match.index,
            input: match.input,
            groups: match.groups as unknown as T
          });
        }
      }
      
      return results;
    }
  };
}
```

## TDD für RegEx in React-Komponenten

### UI-Komponententests mit RegEx-Validierung

```typescript
// form-validation.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SignupForm } from './form-validation';

describe('SignupForm Component', () => {
  test('validates email on blur', () => {
    render(<SignupForm />);
    
    // Finde Eingabefeld
    const emailInput = screen.getByLabelText(/email/i);
    
    // Ungültige E-Mail eingeben und Fokus verlassen
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    // Erwarte Fehlermeldung
    expect(screen.getByText(/ungültige e-mail/i)).toBeInTheDocument();
    
    // Gültige E-Mail eingeben und Fokus verlassen
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.blur(emailInput);
    
    // Erwarte keine Fehlermeldung
    expect(screen.queryByText(/ungültige e-mail/i)).not.toBeInTheDocument();
  });
  
  test('validates password strength on blur', () => {
    render(<SignupForm />);
    
    const passwordInput = screen.getByLabelText(/passwort/i);
    
    // Zu schwaches Passwort
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.blur(passwordInput);
    
    // Überprüfe verschiedene Fehlermeldungen
    expect(screen.getByText(/mindestens 8 zeichen/i)).toBeInTheDocument();
    
    // Passwort mit ausreichender Länge, aber ohne Großbuchstaben
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.blur(passwordInput);
    
    expect(screen.queryByText(/mindestens 8 zeichen/i)).not.toBeInTheDocument();
    expect(screen.getByText(/großbuchstaben/i)).toBeInTheDocument();
    
    // Starkes Passwort
    fireEvent.change(passwordInput, { target: { value: 'StrongPw123!' } });
    fireEvent.blur(passwordInput);
    
    expect(screen.queryByText(/großbuchstaben/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sonderzeichen/i)).not.toBeInTheDocument();
  });
  
  test('submits form with valid data', () => {
    const mockSubmit = jest.fn();
    render(<SignupForm onSubmit={mockSubmit} />);
    
    // Gültige Daten eingeben
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/passwort/i), { target: { value: 'StrongPw123!' } });
    
    // Formular absenden
    fireEvent.click(screen.getByRole('button', { name: /registrieren/i }));
    
    // Überprüfe, ob Submit aufgerufen wurde
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'StrongPw123!'
    });
  });
  
  test('prevents submission with invalid data', () => {
    const mockSubmit = jest.fn();
    render(<SignupForm onSubmit={mockSubmit} />);
    
    // Ungültige E-Mail eingeben
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/passwort/i), { target: { value: 'StrongPw123!' } });
    
    // Formular absenden
    fireEvent.click(screen.getByRole('button', { name: /registrieren/i }));
    
    // Submit sollte nicht aufgerufen werden
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/ungültige e-mail/i)).toBeInTheDocument();
  });
});

// form-validation.tsx
import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

interface SignupFormProps {
  onSubmit?: (data: FormData) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  
  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) ? undefined : 'Ungültige E-Mail-Adresse';
  };
  
  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) {
      return 'Passwort muss mindestens 8 Zeichen lang sein';
    }
    
    if (!/[A-Z]/.test(password)) {
      return 'Passwort muss mindestens einen Großbuchstaben enthalten';
    }
    
    if (!/\d/.test(password)) {
      return 'Passwort muss mindestens eine Ziffer enthalten';
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'Passwort muss mindestens ein Sonderzeichen enthalten';
    }
    
    return undefined;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error;
    
    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validiere alle Felder
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    const newErrors = {
      email: emailError,
      password: passwordError
    };
    
    setErrors(newErrors);
    
    // Prüfe, ob Fehler vorhanden sind
    const hasErrors = Object.values(newErrors).some(error => error !== undefined);
    
    if (!hasErrors && onSubmit) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="email">E-Mail</label>
        <input
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.email && <div className="error">{errors.email}</div>}
      </div>
      
      <div>
        <label htmlFor="password">Passwort</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.password && <div className="error">{errors.password}</div>}
      </div>
      
      <button type="submit">Registrieren</button>
    </form>
  );
};
```

## Zusammenfassung: TDD für RegEx in TypeScript

Durch die Anwendung von TDD für reguläre Ausdrücke in TypeScript können wir:

1. **Präzise Muster definieren**: Tests helfen, die genauen Anforderungen an RegEx zu verstehen
2. **Regressionsfehler vermeiden**: Tests fangen Änderungen auf, die bestehende Muster brechen könnten
3. **Performance optimieren**: Vergleichstests zeigen Performance-Unterschiede zwischen verschiedenen RegEx-Implementierungen
4. **Typsicherheit gewährleisten**: TypeScript und RegEx kombinieren, um typsichere Datenextraktion zu ermöglichen
5. **Edge Cases behandeln**: Tests für Grenzfälle und Fehlerbehandlung machen RegEx-Nutzung robuster

Der TDD-Ansatz führt zu besser lesbaren, wartbaren und zuverlässigeren regulären Ausdrücken, was besonders in TypeScript-Projekten wertvoll ist, wo statische Typisierung und Korrektheit wichtige Ziele sind.