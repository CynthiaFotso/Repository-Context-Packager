# Repository-Context-Packager

This is a command-line tool that analyzes a local Git repository and generates a single, formatted text file containing repository context.
This makes it easier to share your project with Large Language Models instead of copy-pasting files one by one, you can provide a single package that includes:

- Project location
- Git commit information
- Directory structure
- File contents (with syntax highlighting)
- Summary statistics

---

## Features

- Package entire repositories, specific directories, or individual files
- Display Git info (commit hash, branch, author, date)
- Show project structure as a tree
- Include file contents with syntax highlighting
- Provide summary statistics (total files, total lines)
- Save to a file (`--output`) 
- Optional file filtering with `--include` patterns
- Automatically skips `node_modules` and hidden files

---

## Prerequisites

- **Node.js** version 18 or higher
- **npm** (comes with Node.js)
- **Git** installed and available in your system PATH

---

## Installation
Follow the below instructions step-by-step.

Clone the repository and install globally with dependencies:
```
git clone https://github.com/CynthiaFotso/Repository-Context-Packager.git
cd Repository-Context-Packager
npm install
npm link (#This allows you to run repo-packager from anywhere in your terminal. This step is optional; you can also run the tool using node ./bin/cli.js)
```

Now you can run the tool globally in your terminal with the command:
```
repo-packager
```

---

## Usage
Run the tool from anywhere inside your project:
```
# Package the current directory
repo-packager .

# Package specific files
repo-packager src/index.js src/utils.js

# Package with output file
repo-packager . -o my-project-context.txt

# Package only JavaScript files
repo-packager . --include "*.js"
```

For the basic command line interface,
```
# To print the tool name and version
repo-packager --version
repo-packager -V

# To print usage information
repo-packager --help
repo-packager -h
```

---

## Example Output
```
# Repository Context

## File System Location
/Users/username/Documents/Repository-Context-Packager

## Git Info

- Commit: 7663b7917fc76abcdcf5391568a192a53aec529d
- Branch: main
- Author: Cynthia Fotso <cynthia@me.com>
- Date: 2025-09-10T19:20:40-04:00

## Structure

  bin/
    cli.js
  LICENSE
  package-lock.json
  package.json
  README.md
  src/
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
```

---
## Optional Features

In this project, the optional features that were implemented are: 

1. Output to File:
```
repo-packager . -o output.txt
repo-packager . --output context-package.md
```
2. File Filtering by Extension:
```
# Only include JavaScript files
repo-packager . --include "*.js"

# Include multiple extensions
repo-packager . --include "*.js,*.md"
```
3. Gitignore Integration: Automatically exclude files and directories listed in `.gitignore`

---

##  License

MIT License © 2025 Cynthia Fotso
