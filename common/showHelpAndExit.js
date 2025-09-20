const showHelpAndExit = (scriptName) => {
  console.log(`
Usage:
  ${scriptName} [flags] "Bookmark Folder Name"

Flags (choose one browser option; default is Vivaldi):
  --vivaldi-private       Open in Vivaldi incognito/private window
  --private               Open in Vivaldi incognito/private window
  --chrome                Open in Google Chrome (normal)
  --chrome-private        Open in Google Chrome incognito window
  --firefox               Open in Firefox (normal)
  --firefox-private       Open in Firefox private window

Other:
  --list                  List the URLs that would be opened (do not launch a browser)
  --list-folders          Show all bookmark folders as a hierarchy
  --flat-folders          Show all bookmark folders as a flat sorted list

Examples:
  ${scriptName} "Work"                          # open folder "Work" in Vivaldi
  ${scriptName} --chrome "Bookmarks/ToRead"     # open in Chrome
  ${scriptName} --firefox-private "Temp" /path/to/Bookmarks
  ${scriptName} --list "Work"                   # list URLs in folder "Work"
  ${scriptName} --list-folders                  # list all bookmark folders (hierarchy)
  ${scriptName} --flat-folders                  # list all bookmark folders (flat)

Notes:
  - Bookmarks are read from Vivaldi's Bookmarks JSON by default:
      ~/.config/vivaldi/Default/Bookmarks
  - You may set env vars VIVALDI_BIN, CHROME_BIN, FIREFOX_BIN to override binary names.
`);
  process.exit(0);
};

export default showHelpAndExit;
