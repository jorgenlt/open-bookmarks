Script to open bookmarks from Vivaldi in chosen browser

```bash
Usage:
  open-bookmarks [flags] "Bookmark Folder Name"

Flags (choose one browser option; default is Vivaldi):
  --vivaldi-private       Open in Vivaldi incognito/private window
  --private               Open in Vivaldi incognito/private window
  --chrome                Open in Google Chrome (normal)
  --chrome-private        Open in Google Chrome incognito window
  --firefox               Open in Firefox (normal)
  --firefox-private       Open in Firefox private window

Other:
  --list                  List the URLs in a specific folder (do not launch a browser)
  --list-all              List all bookmarks (all folders combined)
  --list-folders          Show all bookmark folders as a hierarchy
  --flat-folders          Show all bookmark folders as a flat sorted list

Examples:
  open-bookmarks "Work"                          # open folder "Work" in Vivaldi
  open-bookmarks --chrome "Bookmarks/ToRead"     # open in Chrome
  open-bookmarks --firefox-private "Temp" /path/to/Bookmarks
  open-bookmarks --list "Work"                   # list URLs in folder "Work"
  open-bookmarks --list-all                      # list all bookmarks
  open-bookmarks --list-folders                  # list all bookmark folders (hierarchy)
  open-bookmarks --list-folders-flat             # list all bookmark folders (flat)

Notes:
  - Bookmarks are read from Vivaldi's Bookmarks JSON by default:
      ~/.config/vivaldi/Default/Bookmarks
  - You may set env vars VIVALDI_BIN, CHROME_BIN, FIREFOX_BIN to override binary names.
```
