#!/usr/bin/env node

import { Command } from "commander";
import { packageRepo } from "../src/index.js";
import { loadConfig } from "../src/utils.js";

const program = new Command();

// Load config file options
const config = loadConfig();

program
  .name("Repository-Context-Packager")
  .description("Package repository content for LLMs")
  .version("Tool name: Repository-Context-Packager, Version: 0.1.0")
  .argument("<paths...>", "One or more files or directories to analyze")
  .option("-o, --output <file>", "Write output to file", config.output)
  .option("-i, --include <patterns>", "Comma-separated glob patterns for files to include (e.g. \"*.js,*.md\")", config.include)
  .option("-r, --recent [days]", "Only include files modified within the last N days (default: 7)", config.recent ? String(config.recent) : undefined)
  .option("-l, --line-numbers", "Include line numbers in the file content output", config.line_numbers)
  
  .parse(process.argv);

const options = program.opts();
const paths = program.args.length ? program.args : ["."];

packageRepo(paths, options);
