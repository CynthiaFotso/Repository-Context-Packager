import { matchesIncludePatterns } from '../src/fs-utils.js';

describe('matchesIncludePatterns', () => {
  test('should return true for matching patterns', () => {
    const filePath = 'src/index.js';
    const patterns = ['*.js', '*.md'];
    expect(matchesIncludePatterns(filePath, patterns)).toBe(true);
  });

  test('should return false for non-matching patterns', () => {
    const filePath = 'src/index.js';
    const patterns = ['*.md', '*.json'];
    expect(matchesIncludePatterns(filePath, patterns)).toBe(false);
  });

  test('should handle empty patterns array', () => {
    const filePath = 'src/index.js';
    const patterns = [];
    expect(matchesIncludePatterns(filePath, patterns)).toBe(false);
  });

  test('should return true for wildcard match with directory', () => {
    const filePath = 'src/utils/helper.js';
    const patterns = ['src/**/*.js'];
    expect(matchesIncludePatterns(filePath, patterns)).toBe(true);
  });

  test('should throw TypeError for null patterns', () => {
    const filePath = 'src/index.js';
    expect(() => matchesIncludePatterns(filePath, null)).toThrow(TypeError);
  });

  test('should throw TypeError for undefined patterns', () => {
    const filePath = 'src/index.js';
    expect(() => matchesIncludePatterns(filePath, undefined)).toThrow(TypeError);
  });

  test('should return false for empty filePath string', () => {
    const patterns = ['*.js'];
    expect(matchesIncludePatterns('', patterns)).toBe(false);
  });
});