import { bold, green } from "yoctocolors";

const folderChildren = (node) =>
  Array.isArray(node.children)
    ? node.children.filter(
        (c) => c && typeof c === "object" && c.type === "folder"
      )
    : [];

const printFoldersTree = (node, prefix = "") => {
  // prints only the children lines for `node` (caller should print node.name)
  const children = folderChildren(node);
  children.forEach((child, idx) => {
    const isLast = idx === children.length - 1;
    const pointer = isLast ? "└── " : "├── ";
    console.log(prefix + pointer + child.name);
    const extension = prefix + (isLast ? "    " : "│   ");
    printFoldersTree(child, extension);
  });
};

const listFolders = (bookmarksPath, root) => {
  console.log(`${bold(green("Bookmark folders"))} (${bookmarksPath}):\n`);
  if (root && typeof root === "object") {
    if (root.roots && typeof root.roots === "object") {
      for (const key of Object.keys(root.roots)) {
        const node = root.roots[key];
        if (!node) continue;
        const label = node.name || key;
        console.log(label); // print the root label once
        printFoldersTree(node, ""); // print its folder children with tree pointers
      }
    } else {
      const label = root.name || "Bookmarks";
      console.log(bold(green(label)));
      printFoldersTree(root, "");
    }
  }
};

export default listFolders;
