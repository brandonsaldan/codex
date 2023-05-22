import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const modulesFolderPath = path.join(process.cwd(), 'public', 'modules');

  // Read the contents of the modules folder
  const subdirectories = fs.readdirSync(modulesFolderPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const snps = [];

  // Iterate over each subdirectory
  subdirectories.forEach((subdirectory) => {
    const jsonFolderPath = path.join(modulesFolderPath, subdirectory);

    // Read the contents of the JSON folder
    const files = fs.readdirSync(jsonFolderPath);

    // Iterate over each JSON file
    files.forEach((file) => {
      const filePath = path.join(jsonFolderPath, file);

      // Read the JSON file contents
      const jsonData = fs.readFileSync(filePath, 'utf8');

      // Parse the JSON data
      try {
        const scrapedData = JSON.parse(jsonData);

        // Extract the SNPs from the scraped data
        if (scrapedData.snps) {
          snps.push({
            category: subdirectory, // Set the subdirectory as the category
            title: file.split('.')[0], // Set the JSON file name as the title
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
