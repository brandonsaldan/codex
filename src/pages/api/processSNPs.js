// You probably won't need to edit or use this file. It is used to validate SNPs from the SNPedia database and is only ran when new modules are added.

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const modulesFolderPath = path.join(process.cwd(), 'public', 'modules');

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
          snps.push({
            category: subdirectory,
            title: file.split('.')[0],
            snps: scrapedData.snps,
          });

          console.log(`Found ${scrapedData.snps.length} SNPs in ${file}`);
          console.log(`Total SNPs found: ${snps.length}`);
        }
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    });
  });

  res.status(200).json({ snps });
}
