# Repository-Context-Packager

This is a command-line tool that analyzes a local Git repository and generates a single, formatted text file containing repository context.
This makes it easier to share your project with Large Language Models instead of copy-pasting files one by one, you can provide a single package that includes:

- Project location
- Git commit information
- Directory structure
- File contents (with syntax highlighting)
- Summary statistics

---

## ✨ Features

- Package entire repositories, specific directories, or individual files
- Display Git info (commit hash, branch, author, date)
- Show project structure as a tree
- Include file contents with syntax highlighting
- Provide summary statistics (total files, total lines)
- Save to a file (`--output`) or output to terminal (`stdout`) 
- Optional file filtering with `--include` patterns
- Automatically skips `node_modules` and hidden files

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/CynthiaFotso/repository-context-packager.git
cd repository-context-packager
npm install

Make the CLI available locally:
npm link # makes the CLI available globally as "repo-packager"

Now you can run the tool globally using:
repo-packager

--- 

## 🚀 Usage
Run the tool from anywhere inside your project:
Analyze the current directory
repo-packager .

Save output to a file
repo-packager . -o my-project-context.txt

Only include certain file types
repo-packager . --include "*.js,*.md"

--- 

## 📂 Example Output

# Repository Context

## File System Location
/Users/cynthia/OSD600/Repository-Context-Packager

## Git Info

- Commit: 7663b7917fc76abcdcf5391568a192a53aec529d
- Branch: main
- Author: Cynthia Fotso <cynthiafotso8@gmail.com>
- Date: 2025-09-10T19:20:40-04:00

## Structure

  bin
    cli.js
  LICENSE
  package-lock.json
  package.json
  README.md
  src
    index.js
    utils.js

## File Contents

### File: package.json

```json

{
  "name": "repository-context-packager",
  "version": "0.1.0",
  "type": "module",
  "description": "A CLI tool to package repository content for LLMs",
  "main": "src/index.js",
  "bin": {
  "repo-packager": "/bin/cli.js"
  },

  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node ./bin/cli.js"
  },
  "keywords": [],
  "author": "Cynthia Fotso",
  "license": "MIT",
  "dependencies": {
    "commander": "^14.0.0",
    "glob": "^11.0.3",
    "minimatch": "^10.0.3",
    "simple-git": "^3.28.0"
  }
}

## Summary

- Total files: 6

- Total lines: 275

---

📜 License

MIT License © 2025 Cynthia Fotso
