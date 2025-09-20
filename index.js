#!/usr/bin/env node
"use strict";

import fs from "fs";
import path from "path";
import os from "os";
import { spawn } from "child_process";
import showHelpAndExit from "./common/showHelpAndExit.js";
import listBookmarks from "./common/listBookmarks.js";
import listFlatFolders from "./common/listFlatFolders.js";
import listFolders from "./common/listFolders.js";

// --------- Parse flags & positional args ---------
const raw = process.argv.slice(2);
if (raw.length === 0) showHelpAndExit();

let browserOption = "vivaldi"; // default
let privateMode = false;
let listMode = false;
let listFoldersMode = false;
let flatFoldersMode = false;
const scriptName = path.basename(process.argv[1] || "node index.js");
const positionals = [];

for (const a of raw) {
  switch (a) {
    case "--help":
    case "-h":
      showHelpAndExit(scriptName);
      break;
    case "--vivaldi-private":
    case "--private":
      browserOption = "vivaldi";
      privateMode = true;
      break;
    case "--chrome":
      browserOption = "chrome";
      privateMode = false;
      break;
    case "--chrome-private":
      browserOption = "chrome";
      privateMode = true;
      break;
    case "--firefox":
      browserOption = "firefox";
      privateMode = false;
      break;
    case "--firefox-private":
      browserOption = "firefox";
      privateMode = true;
      break;
    case "--list":
      listMode = true;
      break;
    case "--list-folders":
      listFoldersMode = true;
      break;
    case "--list-folders-flat":
      flatFoldersMode = true;
      break;
    default:
      if (a.startsWith("-")) {
        console.error(`Unknown option: ${a}`);
        showHelpAndExit(2);
      } else {
        positionals.push(a);
      }
  }
}

// --------- Positional args (folder and optional bookmarks path) ---------
const folderName = positionals[0];
const bookmarksPath =
  positionals[1] ||
  path.join(os.homedir(), ".config", "vivaldi", "Default", "Bookmarks");

if (!fs.existsSync(bookmarksPath)) {
  console.error(`Bookmarks file not found: ${bookmarksPath}`);
  process.exit(5);
}

// --------- Read and parse bookmarks ---------
let root;
try {
  root = JSON.parse(fs.readFileSync(bookmarksPath, "utf8"));
} catch (e) {
  console.error("Failed to parse bookmarks JSON:", e.message);
  process.exit(1);
}

// --------- Helpers ---------
const collectAllUrls = (node, acc) => {
  if (!node || typeof node !== "object") return;
  if (node.type === "url" && typeof node.url === "string") acc.push(node.url);
  const children = Array.isArray(node.children) ? node.children : [];
  for (const child of children) collectAllUrls(child, acc);
};

const walk = (node, acc) => {
  if (!node || typeof node !== "object") return;
  if (node.type === "folder" && node.name === folderName) {
    collectAllUrls(node, acc);
  }
  const children = Array.isArray(node.children) ? node.children : [];
  for (const child of children) walk(child, acc);
};

const collectFoldersFlat = (node, acc) => {
  if (!node || typeof node !== "object") return;
  if (node.type === "folder" && node.name) acc.push(node.name);
  const children = Array.isArray(node.children) ? node.children : [];
  for (const child of children) collectFoldersFlat(child, acc);
};

if (listFoldersMode) {
  listFolders(bookmarksPath, root);
  process.exit(0);
}

if (flatFoldersMode) {
  let folders = [];
  if (root && typeof root === "object") {
    if (root.roots && typeof root.roots === "object") {
      for (const key of Object.keys(root.roots)) {
        collectFoldersFlat(root.roots[key], folders);
      }
    } else {
      collectFoldersFlat(root, folders);
    }
  }
  folders = Array.from(new Set(folders)).sort();
  listFlatFolders(bookmarksPath, folders);
  process.exit(0);
}

let urls = [];
if (root && typeof root === "object") {
  if (root.roots && typeof root.roots === "object") {
    for (const key of Object.keys(root.roots)) {
      walk(root.roots[key], urls);
    }
  } else {
    walk(root, urls);
  }
}

const uniqueUrls = Array.from(new Set(urls));

if (uniqueUrls.length === 0) {
  console.error(
    `No bookmarks found in folder "${folderName}" (searched: ${bookmarksPath}).`
  );
  process.exit(6);
}

// --------- If --list was given, print the URLs and exit ---------
if (listMode) {
  listBookmarks(uniqueUrls, folderName, bookmarksPath);
  process.exit(0);
}

// --------- Build browser command and args ---------
let bin;
let args = [];

switch (browserOption) {
  case "vivaldi":
    bin = process.env.VIVALDI_BIN || "vivaldi";
    if (privateMode) args.push("--incognito");
    args.push("--new-window");
    args.push(...uniqueUrls);
    break;

  case "chrome":
    // Accept multiple possible chrome binary names via env var or common names fallback
    bin = process.env.CHROME_BIN || "google-chrome";
    if (privateMode) args.push("--incognito");
    args.push("--new-window");
    args.push(...uniqueUrls);
    break;

  case "firefox":
    bin = process.env.FIREFOX_BIN || "firefox";
    if (privateMode) {
      // -private-window opens a private window (accepts URLs)
      args.push("-private-window");
    } else {
      args.push("--new-window");
    }
    args.push(...uniqueUrls);
    break;

  default:
    console.error("Unsupported browser option:", browserOption);
    process.exit(3);
}

// --------- Spawn the browser detached so the script can exit ---------
try {
  const child = spawn(bin, args, { detached: true, stdio: "ignore" });
  child.on("error", (err) => {
    console.error(
      `Failed to start ${browserOption} (${bin}). Is it installed and in PATH? (${err.message})`
    );
    console.error(
      "If your binary has a different name, set the environment variable (e.g. CHROME_BIN)."
    );
    process.exit(4);
  });
  child.unref();
} catch (err) {
  console.error(`Failed to spawn browser: ${err.message}`);
  process.exit(4);
}
