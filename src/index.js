import fs from "fs";
import path from "path";
import {
  getGitInfo,
  matchesIncludePatterns,
  buildTree,
  traverseDir,
  readFileContents,
} from "./utils.js";

export async function packageRepo(paths, options) {
  const outputParts = [];

  // 1. File system location
  outputParts.push("# Repository Context\n");
  outputParts.push("## File System Location\n");
  outputParts.push(paths.map((p) => path.resolve(p)).join("\n") + "\n");

  // 2. Git info
  outputParts.push("## Git Info\n");
  const gitInfo = await getGitInfo(paths[0]);
  outputParts.push(gitInfo + "\n");

  // 3. Structure
  outputParts.push("## Structure\n```\n");
  for (const p of paths) {
    if (fs.existsSync(p)) {
      outputParts.push(buildTree(p, "  "));
    } else {
      console.error(`Path not found: ${p}`);
    }
  }
  outputParts.push("```\n");

  // 4. File contents
  outputParts.push("## File Contents\n");
  let totalFiles = 0;
  let totalLines = 0;

  const includePatterns = options.include
    ? options.include.split(",").map((p) => p.trim())
    : null;

  const processFile = (filePath) => {
    if (!includePatterns || matchesIncludePatterns(filePath, includePatterns)) {
      const { text, lines } = readFileContents(filePath);
      if (text) {
        totalFiles++;
        totalLines += lines;

        const relPath = path.relative(process.cwd(), filePath);
        const ext = path.extname(filePath).slice(1) || "";
        outputParts.push(`\n### File: ${relPath}\n`);
        outputParts.push("```" + ext + "\n");
        outputParts.push(text);
        outputParts.push("\n```\n");
      }
    }
  };

  for (const p of paths) {
    if (fs.existsSync(p)) {
      const stats = fs.statSync(p);
      if (stats.isFile()) {
        processFile(p);
      } else {
        traverseDir(p, (filePath) => {
          if (
            filePath.includes("node_modules") ||
            path.basename(filePath) === "package-lock.json" ||
            path.basename(filePath).startsWith(".") ||
            filePath.includes(path.join(".git", ""))
          ) {
            return;
          }
          processFile(filePath);
        });
      }
    }
  }

  // 5. Summary
  outputParts.push("\n## Summary\n");
  outputParts.push(`- Total files: ${totalFiles}\n`);
  outputParts.push(`- Total lines: ${totalLines}\n`);

  const finalOutput = outputParts.join("\n");

  if (options.output) {
    fs.writeFileSync(options.output, finalOutput, "utf-8");
    console.log(`Output written to ${options.output}`);
  } else {
    process.stdout.write(finalOutput);
  }
}
