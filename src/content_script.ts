import { jsPDF } from "jspdf";
import { Message } from "./types";

chrome.runtime.onMessage.addListener(async (msg: Message, sender, sendResponse) => {
  const previousPageButton = document.evaluate(`//button[@aria-label="ページアップ"]`, document).iterateNext()! as HTMLButtonElement;
  const nextPageButton = document.evaluate(`//button[@aria-label="ページ下"]`, document).iterateNext()! as HTMLButtonElement;

  const pageNavi = document.evaluate(`//button[@aria-label="ページ下"]/preceding-sibling::*/text()`, document).iterateNext()!.textContent;
  let currentPage = Number(pageNavi!.split("/")[0]) - 1;
  const pageLength = Number(pageNavi!.split("/")[1]);

  for (let i = 0; i < currentPage; i++) {
    await previousPageButton.click();
    currentPage--;
  }

  const doc = new jsPDF();
  const height = doc.internal.pageSize.getHeight();
  const width = doc.internal.pageSize.getWidth();

  for (let i = 0; i < pageLength; i++) {
    const img = document.evaluate(`//*[@id="fvsdk-container"]//div[contains(@class, "_pdfViewport_")]//li[@data-index=${currentPage}]//img`, document).iterateNext()!;

    if (currentPage > 0) {
      doc.addPage();
    }

    doc.addImage({imageData: img as HTMLImageElement, height, width, x: 0, y: 0});

    nextPageButton.click();
    currentPage++;
  }

  doc.save(msg.fileName);

  sendResponse({});
});
