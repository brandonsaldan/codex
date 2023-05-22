import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const jsonFolderPath = path.join(process.cwd(), 'public', 'modules', 'health');

  // Read the contents of the JSON folder
  fs.readdir(jsonFolderPath, (err, files) => {
    if (err) {
      console.error('Error reading JSON folder:', err);
      res.status(500).json({ error: 'Error reading JSON folder' });
      return;
    }

    const snps = [];

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

    res.status(200).json({ snps });
  });
}
