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
- Display file sizes in file headers
- Optional line number display in file contents

---

## Prerequisites

- **Node.js** version 18 or higher
- **npm** (comes with Node.js)
- **Git** installed and available in your system PATH

---

## Installation

### For Users
Install globally via npm:
```
npm install -g repo-context-packager
```

This makes the `repo-packager` command available system-wide.

### For Developers
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

# Package with line numbers in a file content
repo-packager bin/cli.js --line-numbers
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

## Configuration File

You can create a `.repo-packager-config.toml` file in your project root to set default options. This eliminates the need to specify the same command line arguments repeatedly.

**⚠️ Dependencies for TOML Config Feature**:

- **If you're setting up the project for the first time**: The TOML dependency is already included in `package.json`, so just run:
  ```bash
  npm install
  ```

- **If you already have the project installed but are missing the TOML dependency**: Install it separately:
  ```bash
  npm install smol-toml
  ```

- **If you get an error like `Cannot find package 'smol-toml'`**: Run `npm install` to ensure all dependencies are properly installed.

### Creating a Config File

Create a file named `.repo-packager-config.toml` in your project root:

```toml
# Example configuration file for Repository Context Packager

output = "repo-context.txt"
include = "*.js,*.md,*.json"
recent = 7
line_numbers = true
```

### Config Options

- `output`: Default output file path
- `include`: Comma-separated glob patterns for files to include  
- `recent`: Only include files modified within the last N days
- `line_numbers`: Include line numbers in file content output (true/false)

### Usage with Config File

When a config file exists, the tool will use those values as defaults:

```bash
# Uses config file defaults
repo-packager .

# CLI arguments override config file values
repo-packager . --output "custom-output.txt" --include "*.ts"
```

### Things to consider while using it

- Config files are automatically ignored by git (added to `.gitignore`)
- Missing config files are silently ignored
- Invalid TOML syntax will show an error message and exit
- CLI arguments always take precedence over config file values

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

1: {
2:   "name": "repository-context-packager",
3:   "version": "0.1.0",
4:   "type": "module",
5:   "description": "A CLI tool to package repository content for LLMs",
6:   "main": "src/index.js",
7:   "bin": {
8:     "repo-packager": "/bin/cli.js"
9:   },

10:   "scripts": {
11:     "test": "echo \"Error: no test specified\" && exit 1",
12:     "start": "node ./bin/cli.js"
13:   },
14:   "keywords": [],
15:   "author": "Cynthia Fotso",
16:   "license": "MIT",
17:   "dependencies": {
18:     "commander": "^14.0.0",
19:     "glob": "^11.0.3",
20:     "minimatch": "^10.0.3",
21:     "simple-git": "^3.28.0"
22:   }
23: }

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

## Other Implemented Features
1. File Size Display: File headers now include file sizes in bytes.
```
### File: src/main.js (247 bytes)
```javascript
const helper = require('./utils/helper');
```

2. Line Number Display: Use `--line-numbers` or `-l` flag to include line numbers in file content output.
```
### File: src/main.js
```javascript
1: const helper = require('./utils/helper');
2: 
3: function main() {
4:   console.log('Hello World');
5: }
```

---

##  License

MIT License © 2025 Cynthia Fotso
