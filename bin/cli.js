#!/usr/bin/env node

import { Command } from "commander";
import { packageRepo } from "../src/index.js";

const program = new Command();

program
  .name("Repository-Context-Packager")
  .description("Package repository content for LLMs")
  .version("Tool name: Repository-Context-Packager, Version: 0.1.0")
  .argument("<paths...>", "One or more files or directories to analyze")
  .option("-o, --output <file>", "Write output to file")
  
  .option("--include <patterns>", "Comma-separated glob patterns for files to include (e.g. \"*.js,*.md\")")
  
  .parse(process.argv);

const options = program.opts();
const paths = program.args.length ? program.args : ["."];

packageRepo(paths, options);
