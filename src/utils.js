import simpleGit from "simple-git";

import { minimatch } from "minimatch";

import fs from "fs";
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

export async function getRecentlyModifiedFiles(repoPath, days) {
  try {
    const git = simpleGit(repoPath);
    
    // Calculate the date N days ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateString = startDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Get files modified since the start date
    const log = await git.log({
      since: startDateString,
      format: { hash: '%H', date: '%ai', message: '%s', author_name: '%an' }
    });
    
    const recentFiles = new Set();
    
    // For each commit, get the list of changed files
    for (const commit of log.all) {
      try {
        const show = await git.show([commit.hash, '--name-only', '--pretty=format:']);
        const files = show.split('\n').filter(file => file.trim() !== '');
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
  } catch (err) {
    // If git operations fail, fall back to file system timestamps
  }
}

export function matchesIncludePatterns(filePath, patterns) {
  return patterns.some(pattern => minimatch(filePath, pattern, { matchBase: true }));
}

export function buildTree(dirPath, prefix = "") {
  let output = "";
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".git" ||
      entry.name.startsWith(".")
    ) {
      continue;
    }

    const name = entry.isDirectory() ? `${entry.name}/` : entry.name;
    output += `${prefix}${name}\n`;
    if (entry.isDirectory()) {
      output += buildTree(path.join(dirPath, entry.name), `${prefix}  `);
    }
  }
  return output;
}

export function traverseDir(dirPath, callback) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (
      entry.name === "node_modules" ||
      entry.name === ".git" ||
      entry.name.startsWith(".")
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      traverseDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

export function readFileContents(filePath) {
  
    try {
    const stats = fs.statSync(filePath);
    const MAX_SIZE = 16 * 1024;

    if (stats.size > MAX_SIZE) {
      // Read only the first 16KB
      const buffer = Buffer.alloc(MAX_SIZE);
      const fd = fs.openSync(filePath, "r");
      fs.readSync(fd, buffer, 0, MAX_SIZE, 0);
      fs.closeSync(fd);

      const content = buffer.toString("utf-8");
      const lines = content.split("\n").length;

      return {
        text: content + `\n\n File truncated: only first 16KB of ${stats.size} bytes included.\n`,
        lines,
      };
    } else {
      // Normal full read
      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n").length;
      return { text: content, lines };
    }
  } catch (err) {
    return { text: "", lines: 0 };
  }
}