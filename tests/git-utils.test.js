import { jest } from '@jest/globals';
import { getGitInfo } from '../src/git-utils.js';

const mockSimpleGit = jest.fn(() => ({
  log: jest.fn(),
  revparse: jest.fn(),
}));

jest.unstable_mockModule('simple-git', () => ({
  default: mockSimpleGit,
}));

const { default: simpleGit } = await import('simple-git');

describe('getGitInfo', () => {
  let mockGit;

  beforeEach(() => {
    mockGit = {
      log: jest.fn(),
      revparse: jest.fn(),
    };
    mockSimpleGit.mockReturnValue(mockGit);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return "Not a git repository" if no latest commit', async () => {
    mockGit.log.mockResolvedValue({ latest: null });
    mockGit.revparse.mockResolvedValue('main');

    const result = await getGitInfo('/path/to/repo');
    expect(result).toBe('Not a git repository');
  });

  test('should return "Not a git repository" on Git error', async () => {
    mockGit.log.mockRejectedValue(new Error('Git error'));

    const result = await getGitInfo('/path/to/repo');
    expect(result).toBe('Not a git repository');
  });
});