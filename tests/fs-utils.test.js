import { matchesIncludePatterns, readFileContents } from '../src/fs-utils.js';
import fs from 'fs';
import { jest } from '@jest/globals';

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

describe('readFileContents', () => {
  let realFs;

  beforeAll(() => {
    realFs = { ...fs };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return full content and line count for small files', () => {
    const mockContent = 'line1\nline2\nline3';
    jest.spyOn(fs, 'statSync').mockReturnValue({ size: 100 });
    jest.spyOn(fs, 'readFileSync').mockReturnValue(mockContent);

    const result = readFileContents('/path/to/file.txt');
    expect(result.text).toBe(mockContent);
    expect(result.lines).toBe(3);
  });

  test('should truncate large files and append warning', () => {
    const mockContent = 'a'.repeat(16 * 1024);
    jest.spyOn(fs, 'statSync').mockReturnValue({ size: 20 * 1024 });
    jest.spyOn(fs, 'openSync').mockReturnValue(1);
    jest.spyOn(fs, 'readSync').mockImplementation((fd, buffer) => buffer.fill('a'));
    jest.spyOn(fs, 'closeSync').mockImplementation(() => {});

    const result = readFileContents('/path/to/large-file.txt');
    expect(result.text).toContain('File truncated');
    expect(result.lines).toBeGreaterThan(0);
  });

  test('should return empty on error', () => {
    jest.spyOn(fs, 'statSync').mockImplementation(() => { throw new Error('File not found'); });

    const result = readFileContents('/path/to/missing.txt');
    expect(result.text).toBe('');
    expect(result.lines).toBe(0);
  });

  test('returns file content when file is successfully read', () => {
    const mockContent = 'Hello, world!';
    jest.spyOn(fs, 'statSync').mockReturnValue({ size: mockContent.length });
    jest.spyOn(fs, 'readFileSync').mockReturnValue(mockContent);

    const result = readFileContents('/path/to/success.txt');
    expect(result.text).toBe(mockContent);
    expect(result.lines).toBe(1);
  });
});
