import { loadConfig } from "../src/config-utils";
import fs from "fs";
import path from "path";
import { jest } from '@jest/globals';

const CONFIG_NAME = ".repo-packager-config.toml";
const CONFIG_PATH = path.join(process.cwd(), CONFIG_NAME);

afterEach(() => {
  if (fs.existsSync(CONFIG_PATH)) {
    fs.unlinkSync(CONFIG_PATH);
  }
});

describe("loadConfig", () => {
  test("returns empty object when config file does not exist", () => {
    if (fs.existsSync(CONFIG_PATH)) fs.unlinkSync(CONFIG_PATH);
    const result = loadConfig();
    expect(result).toEqual({});
  });

  test("returns parsed config when TOML file exists", () => {
    const tomlContent = `
      output = "output.md"
      include = "*.js,*.md"
      recent = 5
    `;
    fs.writeFileSync(CONFIG_PATH, tomlContent);
    const result = loadConfig();
    expect(result.output).toBe("output.md");
    expect(result.include).toBe("*.js,*.md");
    expect(result.recent).toBe(5);
  });

  test("exits process when TOML parsing fails", () => {
    fs.writeFileSync(CONFIG_PATH, "output == invalid");
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
    loadConfig();
    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
  });
});
