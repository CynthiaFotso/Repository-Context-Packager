import fs from "fs";
import path from "path";
import {
  getGitInfo,
  getRecentlyModifiedFiles,
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

  let repoPath = paths[0];
  if (fs.existsSync(repoPath)) {
    const stats = fs.statSync(repoPath);
    if (stats.isFile()) {
      repoPath = path.dirname(repoPath); // use parent folder if it's a file
    }
  }

  const gitInfo = await getGitInfo(repoPath);
  outputParts.push(gitInfo + "\n");

  // Handle recent changes filter
  let recentFiles = null;
  const recentDays = options.recent ? (isNaN(parseInt(options.recent)) ? 7 : parseInt(options.recent)) : null;
  
  if (options.recent) {
    try {
      recentFiles = await getRecentlyModifiedFiles(repoPath, recentDays);
      outputParts.push(`## Recent Changes Filter\n`);
      outputParts.push(`- Filtering files modified within the last ${recentDays} days\n`);
      outputParts.push(`- Found ${recentFiles.length} recently modified files\n\n`);
    } catch (err) {
      console.error(`Error: Cannot use --recent flag. This tool requires a Git repository.`);
      console.error(`Make sure you are running this command inside a Git repository.`);
      console.error(`Debug info: ${err.message}`);
      process.exit(1);
    }
  }


  // 3. Structure
  outputParts.push("## Structure\n```");

  const groupedByFolder = {};

  for (const p of paths) {
    if (fs.existsSync(p)) {
      const stats = fs.statSync(p);
      if (stats.isDirectory()) {
        // If it's a directory, show the full tree
        outputParts.push(buildTree(p, "  "));
      } else {
        // Group files by their parent folder
        const parent = path.basename(path.dirname(p));
        if (!groupedByFolder[parent]) {
          groupedByFolder[parent] = [];
        }
        groupedByFolder[parent].push(path.basename(p));
      }
    } else {
      console.error(`Path not found: ${p}`);
    }
  }

  // Print grouped files
  for (const folder in groupedByFolder) {
    outputParts.push(`${folder}/`);
    for (const file of groupedByFolder[folder]) {
      outputParts.push(`  ${file}`);
    }
  }

  outputParts.push("```\n");

  // 4. File contents
  const sectionTitle = options.recent 
    ? `## File Contents (Recent Changes - Last ${recentDays} Days)`
    : "## File Contents";
  outputParts.push(sectionTitle);
  
  let totalFiles = 0;
  let totalLines = 0;

  const includePatterns = options.include
    ? options.include.split(",").map((p) => p.trim())
    : null;

  const isRecentFile = (filePath) => {
    if (!recentFiles) return true; // If no recent filter, include all files
    const absolutePath = path.resolve(filePath);
    return recentFiles.some(recentPath => 
      path.resolve(recentPath) === absolutePath
    );
  };

  const processFile = (filePath) => {
    // Check if file should be included based on recent filter
    if (!isRecentFile(filePath)) {
      return;
    }
    
    if (!includePatterns || matchesIncludePatterns(filePath, includePatterns)) {
      const { text, lines } = readFileContents(filePath);
      if (text) {
        totalFiles++;
        totalLines += lines;

        const relPath = path.relative(process.cwd(), filePath);
        const ext = path.extname(filePath).slice(1) || "";
        const size = fs.statSync(filePath).size;
        outputParts.push(`\n### File: ${relPath} (${size} bytes)`);
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
  if (options.recent) {
    outputParts.push(`- Recent changes filter: Last ${recentDays} days\n`);
    outputParts.push(`- Total recent files processed: ${totalFiles}\n`);
    outputParts.push(`- Total lines in recent files: ${totalLines}\n`);
  } else {
    outputParts.push(`- Total files: ${totalFiles}\n`);
    outputParts.push(`- Total lines: ${totalLines}\n`);
  }

  const finalOutput = outputParts.join("\n");

  if (options.output) {
    fs.writeFileSync(options.output, finalOutput, "utf-8");
    console.log(`Output written to ${options.output}`);
  } else {
    process.stdout.write(finalOutput);
  }
}