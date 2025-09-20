const listFlatFolders = (bookmarksPath, folders) => {
  console.log(`Bookmark folders (${bookmarksPath}):\n`);
  for (const f of folders) {
    console.log(f);
  }
};

export default listFlatFolders;
