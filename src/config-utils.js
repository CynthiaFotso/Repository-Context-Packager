import { parse as parseToml } from "smol-toml";
import fs from "fs";
import path from "path";

export function loadConfig() {
  const configFileName = ".repo-packager-config.toml";
  const configPath = path.join(process.cwd(), configFileName);
  
  // If config file doesn't exist, return empty config
  if (!fs.existsSync(configPath)) {
    return {};
  }
  
  try {
    const configContent = fs.readFileSync(configPath, "utf-8");
    const config = parseToml(configContent);
    return config;
  } catch (error) {
    console.error(`Error parsing TOML config file '${configFileName}': ${error.message}`);
    process.exit(1);
  }
}