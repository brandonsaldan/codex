// You probably won't need to edit or use this file. It is used to validate SNPs from the SNPedia database and is only ran when new modules are added.

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const modulesFolderPath = path.join(process.cwd(), 'public', 'modules');
  const entriesFilePath = path.join(process.cwd(), 'public', 'error_snps.txt');

  const entriesToRemove = fs.readFileSync(entriesFilePath, 'utf8').split('\n').map((entry) => entry.trim());

  const subdirectories = fs.readdirSync(modulesFolderPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const snps = [];

  subdirectories.forEach((subdirectory) => {
    const jsonFolderPath = path.join(modulesFolderPath, subdirectory);

    const files = fs.readdirSync(jsonFolderPath);

    files.forEach((file) => {
      const filePath = path.join(jsonFolderPath, file);

      const jsonData = fs.readFileSync(filePath, 'utf8');

      try {
        const scrapedData = JSON.parse(jsonData);

        if (scrapedData.snps) {
          const updatedSNPs = scrapedData.snps.filter((snp) => !entriesToRemove.includes(snp));

          scrapedData.snps = updatedSNPs;

          fs.writeFileSync(filePath, JSON.stringify(scrapedData, null, 2), 'utf8');

          snps.push({
            category: subdirectory,
            title: file.split('.')[0],
            snps: updatedSNPs,
          });

          console.log(`Removed ${entriesToRemove.length} entries from ${file}`);
          console.log(`Total SNPs found: ${snps.length}`);
        }
      } catch (error) {
        console.error('Error parsing or updating JSON file:', error);
      }
    });
  });

  res.status(200).json({ snps });
}
