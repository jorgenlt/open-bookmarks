import { bold, green } from "yoctocolors";

const listBookmarks = (uniqueUrls, folderName, bookmarksPath) => {
  console.log(
    `\n${bold(green("Bookmarks found:"))} ${bold(uniqueUrls.length)}\n`
  );
  console.log(`${bold(green("Folder"))}: ${bold(folderName)}\n`);
  console.log(`${bold(green("Bookmarks file"))}: ${bold(bookmarksPath)}\n`);
  console.log(`${bold(green("Bookmarks URLs:"))}`);

  uniqueUrls.forEach((url, i) => {
    console.log(`${bold(i + 1)}. ${url}`);
  });
};

export default listBookmarks;
