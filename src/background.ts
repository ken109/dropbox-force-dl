import { Message, MessageResponse } from "./types";

chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  try {
    await chrome.tabs.sendMessage<Message, MessageResponse>(tab.id!, {fileName: tab.title!});

    await chrome.downloads.download({url: tab.title!});
  } catch (error) {
    console.log(error);
  }
});
