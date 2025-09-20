

const listBookmarks = (uniqueUrls, folderName, bookmarksPath) => {
  


 
  console.log(`# Bookmarks found: ${uniqueUrls.length}\n`);
  console.log(`# Folder: ${folderName}\n`);
  console.log(`# Bookmarks file: ${bookmarksPath}\n`);

  for (const u of uniqueUrls) {
    console.log(u);
  }




}

export default listBookmarks;