#!/usr/bin/env node

import { Command } from "commander";
import { packageRepo } from "../src/index.js";

const program = new Command();

program
  .name("repo-context-packager")
  .description("Package repository content for LLMs")
  .version("0.1.0")
  .argument("[paths...]", "Files or directories to analyze", ["."])
  .option("-o, --output <file>", "Write output to file instead of stdout")
  
  .option("--include <patterns>", "Comma-separated glob patterns for files to include")
  
  .parse(process.argv);

const options = program.opts();
const paths = program.args.length ? program.args : ["."];

packageRepo(paths, options);
