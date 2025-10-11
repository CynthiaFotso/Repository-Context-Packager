import simpleGit from "simple-git";
import path from "path";

export async function getGitInfo(repoPath) {
  try {
    const git = simpleGit(repoPath);
    const log = await git.log({ n: 1 });
    const branch = await git.revparse(["--abbrev-ref", "HEAD"]);

    if (log.latest) {
      return `- Commit: ${log.latest.hash}
- Branch: ${branch}
- Author: ${log.latest.author_name} <${log.latest.author_email}>
- Date: ${log.latest.date}`;
    }
  } catch {
    return "Not a git repository";
  }
}

export async function getRecentlyModifiedFiles(repoPath, days = 7) {
  const git = simpleGit(repoPath);
  
  // First, verify this is a git repository
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    throw new Error("Not a git repository");
  }

  // Calculate the date N days ago
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateString = startDate.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Get files modified since the cutoff date using raw git command
  const result = await git.raw(['log', `--since=${startDateString}`, '--pretty=format:%H']);
  const commitHashes = result.trim().split('\n').filter(hash => hash.trim() !== '');
  
  const recentFiles = new Set();
  
  // For each commit, get the list of changed files
  for (const commitHash of commitHashes) {
    try {
      const filesResult = await git.raw(['show', commitHash, '--name-only', '--pretty=format:']);
      const files = filesResult.split('\n').filter(file => file.trim() !== '');
      files.forEach(file => {
        if (file.trim()) {
          recentFiles.add(path.resolve(repoPath, file));
        }
      });
    } catch (err) {
      // If git show fails for a commit, continue with the next one
      continue;
    }
  }
   
  return Array.from(recentFiles);
}