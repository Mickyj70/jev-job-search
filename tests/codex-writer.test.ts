import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import { existsSync, writeFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";

const fake = vi.hoisted(() => ({ exit: 0, empty: false, output: "", input: "", args: [] as string[], options: {} as Record<string, unknown> }));
vi.mock("node:child_process", () => ({
  spawn: (_command: string, args: string[], options: Record<string, unknown>) => {
    fake.args = args;
    fake.options = options;
    fake.output = args[args.indexOf("--output-last-message") + 1]!;
    const child = Object.assign(new EventEmitter(), { stdin: new PassThrough(), stdout: new PassThrough(), stderr: new PassThrough(), kill: vi.fn() });
    child.stdin.on("data", (data: Buffer) => { fake.input += data.toString(); });
    child.stdin.on("finish", () => {
      if (!fake.empty) writeFileSync(fake.output, '{"verdict":"ready","reason":"","answers":[]}');
      child.emit("close", fake.exit);
    });
    return child;
  },
}));
import { writerBackend, WRITER } from "../src/config.js";
import { askWriter, writerUsage } from "../src/answers/resolve.js";

const saved = process.env.WRITER_BACKEND;
afterEach(() => {
  if (saved === undefined) delete process.env.WRITER_BACKEND;
  else process.env.WRITER_BACKEND = saved;
  fake.exit = 0;
  fake.empty = false;
  fake.input = "";
});

it("selects Codex, passes facts only on stdin and removes its temporary output", async () => {
  process.env.WRITER_BACKEND = "codex";
  expect(writerBackend()).toBe("codex");
  const before = writerUsage.calls;
  expect(await askWriter("fictional candidate facts", "return JSON")).toContain('"ready"');
  expect(fake.input).toContain("fictional candidate facts");
  expect(fake.args.join(" ")).not.toContain("fictional candidate facts");
  expect(fake.args).toEqual(expect.arrayContaining(["exec", "--ephemeral", "--sandbox", "read-only", WRITER.codexModel]));
  expect(fake.options.cwd).not.toBe(process.cwd());
  expect(writerUsage.calls).toBe(before + 1);
  expect(existsSync(fake.output)).toBe(false);
});

it("rejects a failed process without exposing its output or falling back", async () => {
  process.env.WRITER_BACKEND = "codex";
  fake.exit = 1;
  await expect(askWriter("private facts", "return JSON")).rejects.toThrow("Codex writer exited with 1");
  expect(existsSync(fake.output)).toBe(false);
});

it("rejects missing final output and still cleans up", async () => {
  process.env.WRITER_BACKEND = "codex";
  fake.empty = true;
  await expect(askWriter("facts", "return JSON")).rejects.toThrow("did not return an answer");
  expect(existsSync(fake.output)).toBe(false);
});
