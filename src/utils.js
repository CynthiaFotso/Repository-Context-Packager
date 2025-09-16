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
        text: content + `\n\n⚠️ File truncated: only first 16KB of ${stats.size} bytes included.\n`,
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