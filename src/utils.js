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

    output += `${prefix}${entry.name}\n`;
    if (entry.isDirectory()) {
      output += buildTree(`${dirPath}/${entry.name}`, `${prefix}  `);
    }
  }
  return output;
}

export function traverseDir(dirPath, callback) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      traverseDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

export function readFileContents(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n").length;
    return { text: content, lines };
  } catch {
    return { text: "", lines: 0 };
  }
}