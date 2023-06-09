import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { saveAs } from 'file-saver';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { openDatabase } from '../DropUpload';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ExportButton() {
  const handleExport = async (format) => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(['GeneticData'], 'readonly');
      const objectStore = transaction.objectStore('GeneticData');
      const getRequest = objectStore.get('generatedReportData');

      getRequest.onsuccess = function (event) {
        const storedData = getRequest.result;
        if (storedData) {
          const content = storedData.content;
          console.log('Content:', content);

          switch (format) {
            case 'pdf':
              generatePdf(content);
              break;
            case 'csv':
              generateCsv(content);
              break;
            case 'xml':
              generateXml(content);
              break;
            case 'json':
              generateJson(content);
              break;
            default:
              console.log('Invalid format selected');
          }
        }
      };

      getRequest.onerror = function (event) {
        console.log('Error retrieving data from database');
      };
    } catch (error) {
      console.log('Error opening the database:', error);
    }
  };

  const generatePdf = async (content) => {
    try {

      const marginRight = 70;
      const marginBottom = 70;
      
      const disclaimerPdfUrl = '/uploads/sample/disclaimer-page.pdf';
      const disclaimerPdfBytes = await fetch(disclaimerPdfUrl).then((res) => res.arrayBuffer());
      const disclaimerPdfDoc = await PDFDocument.load(disclaimerPdfBytes);
  
      const resultsPdfUrl = '/uploads/sample/results-page.pdf';
      const resultsPdfBytes = await fetch(resultsPdfUrl).then((res) => res.arrayBuffer());
      const resultsPdfDoc = await PDFDocument.load(resultsPdfBytes);
      const resultsPage = resultsPdfDoc.getPages()[0];
  
      const pdfDoc = await PDFDocument.create();
  
      const timesNewRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const fontSize = 11;
  
      const disclaimerPage = disclaimerPdfDoc.getPages()[0];
      const copiedDisclaimerPage = await pdfDoc.copyPages(disclaimerPdfDoc, [0]);
      const page = pdfDoc.addPage(copiedDisclaimerPage[0]);
  
      page.setFont(timesNewRomanFont);
      page.setFontSize(fontSize);
  
      const data = JSON.parse(content);
  
      const numPages = Math.ceil(data.length / 7);
  
      for (let i = 0; i < numPages; i++) {
        const copiedResultsPage = await pdfDoc.copyPages(resultsPdfDoc, [0]);
        const page = pdfDoc.addPage(copiedResultsPage[0]);
  
        const startIdx = i * 7;
        const endIdx = Math.min((i + 1) * 7, data.length);
  
        for (let j = startIdx; j < endIdx; j++) {
          const item = data[j];
          const groupGap = 30;
          const lineHeight = 1;
          const marginTop = 70;
          const marginLeft = 70;
          const marginRight = 70;
          const startY = page.getHeight() - (j - startIdx + 1) * 40 - marginTop - (groupGap * (j - startIdx));
          const xPos = marginLeft;
          const maxWidth = page.getWidth() - marginLeft - marginRight;
  
          const snpLine = "SNP: " + item.snp;
          const alleleLine = "Allele: " + item.allele;
          const magLine = "Magnitude: " + item.mag;
          const repLine = "Repute: " + item.rep;
          const descLine = "Summary: " + item.desc;
  
          const lines = breakTextIntoLines(snpLine, timesNewRomanFont, fontSize, maxWidth);
          drawTextLines(page, lines, xPos, startY, timesNewRomanFont, fontSize, lineHeight);
  
          const alleleLines = breakTextIntoLines(alleleLine, timesNewRomanFont, fontSize, maxWidth);
          drawTextLines(page, alleleLines, xPos, startY - fontSize * lineHeight, timesNewRomanFont, fontSize, lineHeight);
  
          const magLines = breakTextIntoLines(magLine, timesNewRomanFont, fontSize, maxWidth);
          drawTextLines(page, magLines, xPos, startY - fontSize * 2 * lineHeight, timesNewRomanFont, fontSize, lineHeight);
  
          const repLines = breakTextIntoLines(repLine, timesNewRomanFont, fontSize, maxWidth);
          drawTextLines(page, repLines, xPos, startY - fontSize * 3 * lineHeight, timesNewRomanFont, fontSize, lineHeight);
  
          const descLines = breakTextIntoLines(descLine, timesNewRomanFont, fontSize, maxWidth);
          drawTextLines(page, descLines, xPos, startY - fontSize * 4 * lineHeight, timesNewRomanFont, fontSize, lineHeight);
  
          const firstPage = pdfDoc.getPages()[0];
          const options = { month: 'long', day: 'numeric', year: 'numeric' };
          const currentDate = new Date().toLocaleDateString(undefined, options);
          const dateWidth = timesNewRomanFont.widthOfTextAtSize(`${currentDate}`, fontSize);
          const gap = 4;
          const dateX = firstPage.getWidth() - marginRight - dateWidth;
          const dateY = firstPage.getHeight() - marginTop - gap;
          firstPage.drawText(`${currentDate}`, { x: dateX, y: dateY, font: timesNewRomanFont, size: fontSize });
        }
      }
  
      const addPageNumbers = async () => {
        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  
        for (let i = 0; i < pages.length; i++) {
          const fontSize = 11;
          const page = pages[i];
          const pageNum = i + 1;
          const pageWidth = page.getWidth();
          const pageHeight = page.getHeight();
          const text = `${pageNum}`;
          const textWidth = font.widthOfTextAtSize(text, fontSize);
          const x = pageWidth - marginRight - textWidth;
          const y = marginBottom;
  
          page.drawText(text, { x, y, font, size: fontSize });
        }
      };
  
      await addPageNumbers();
  
      const pdfBytes = await pdfDoc.save();
  
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'report.pdf');
    } catch (error) {
      console.log('Error generating PDF:', error);
    }
  };
  
  const breakTextIntoLines = (text, font, size, maxWidth) => {
    const lines = [];
    let currentLine = '';
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const width = font.widthOfTextAtSize(word, size);
      if (width > maxWidth) {
        const characters = word.split('');
        for (let j = 0; j < characters.length; j++) {
          const character = characters[j];
          const characterWidth = font.widthOfTextAtSize(character, size);
          if (characterWidth > maxWidth) {
            if (currentLine !== '') {
              lines.push(currentLine);
              currentLine = '';
            }
            const characters = character.split('');
            for (let k = 0; k < characters.length; k++) {
              const char = characters[k];
              lines.push(char);
            }
          } else if (font.widthOfTextAtSize(currentLine + character, size) <= maxWidth) {
            currentLine += character;
          } else {
            lines.push(currentLine);
            currentLine = character;
          }
        }
      } else if (font.widthOfTextAtSize(currentLine + ' ' + word, size) <= maxWidth) {
        currentLine += (currentLine === '' ? '' : ' ') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine !== '') {
      lines.push(currentLine);
    }
    return lines;
  };
  
  const drawTextLines = (page, lines, x, y, font, size, lineHeight) => {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      page.drawText(line, { x, y: y - (size * lineHeight * i), font, size });
    }
  };

  const generateCsv = (content) => {
    const data = JSON.parse(content);
  
    let csvContent = '';
  
    csvContent += 'SNP,Allele,Magnitude,Repute,Summary\n';
  
    for (const item of data) {
      csvContent += `${item.snp},${item.allele},${item.mag},${item.rep},"${item.desc}"\n`;
    }
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'report.csv');
  };

  const generateXml = (content) => {
    const data = JSON.parse(content);
  
    const xml = document.createElement('root');
  
    for (const item of data) {
      const itemElement = document.createElement('item');
  
      const snpElement = document.createElement('snp');
      snpElement.textContent = item.snp;
      itemElement.appendChild(snpElement);
  
      const alleleElement = document.createElement('allele');
      alleleElement.textContent = item.allele;
      itemElement.appendChild(alleleElement);
  
      const magElement = document.createElement('magnitude');
      magElement.textContent = item.mag;
      itemElement.appendChild(magElement);
  
      const repElement = document.createElement('repute');
      repElement.textContent = item.rep;
      itemElement.appendChild(repElement);
  
      const descElement = document.createElement('summary');
      descElement.textContent = item.desc;
      itemElement.appendChild(descElement);
  
      xml.appendChild(itemElement);
    }
  
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xml);
  
    const blob = new Blob([xmlString], { type: 'text/xml;charset=utf-8;' });
    saveAs(blob, 'report.xml');
  };

  const generateJson = (content) => {
    const data = JSON.parse(content);
  
    const jsonString = JSON.stringify(data, null, 2);
  
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    saveAs(blob, 'report.json');
  };

  return (
    <Menu as="div" className="mt-1 relative inline-block text-left z-10 hidden sm:block">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Export
          <ChevronDownIcon className="mt-0.5 -mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                  onClick={() => handleExport('pdf')}
                >
                  PDF
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                  onClick={() => handleExport('csv')}
                >
                  CSV
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                  onClick={() => handleExport('xml')}
                >
                  XML
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                  onClick={() => handleExport('json')}
                >
                  JSON
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
