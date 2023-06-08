import { useEffect, useState } from 'react';
import SNPCard from './ui/SNPCard';
import axios from 'axios';
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { openDatabase } from './DropUpload';
import ErrorMessage from './ui/ErrorMessage';

export default function Compiler() {
  const { pathname } = useRouter();
  const [arr, setArr] = useState([]);
  const [dna, setDNA] = useState({});

  useEffect(() => {
    if (pathname === '/results') {
      const readDataFromDB = async () => {
        try {
          const db = await openDatabase();
          const transaction = db.transaction(['GeneticData'], 'readonly');
          const objectStore = transaction.objectStore('GeneticData');
          const getRequest = objectStore.get('snpsData');

          getRequest.onsuccess = function (event) {
            const storedDNA = getRequest.result;
            if (storedDNA) {
              const content = storedDNA.content;
              setDNA(JSON.parse(content));
            }
          };

          getRequest.onerror = function (event) {
            console.log('Error retrieving data from database');
            return (
              <ErrorMessage title="IndexedDB Error" desc="GeneCodex could not retrieve your file from your browser's Indexed Database. Please try again." />
            )
          };
        } catch (error) {
          console.log('Error opening the database:', error);
          return (
            <ErrorMessage title="IndexedDB Error" desc="GeneCodex could not open your browser's Indexed Database. Please try again." />
          )
        }
      };

      readDataFromDB();
    }
  }, [pathname]);

  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/fetchData');
        const snpsFromJsonFiles = response.data.snps;

        var newArr = [];

        for (const [key, value] of Object.entries(dna)) {
          var snp = key;
          var allele = value.genotype;
          var formattedAllele = '(' + allele[0] + ';' + allele[1] + ')';
          var frontendURL = 'https://www.snpedia.com/index.php/' + snp + formattedAllele;
          

          // Check if the SNP exists in the scraped data
          if (snpsFromJsonFiles.some((item) => item.snps.includes(snp))) {
            setCount(prevCount => prevCount + 1)
            var url =
              'https://bots.snpedia.com/api.php?origin=*&action=query&prop=revisions&rvprop=content&format=xml&titles=' +
              snp +
              formattedAllele +
              '&rvsection=0';

            try {
              const response = await axios.get(url);
              var parser = new DOMParser();
              var xmlDoc = parser.parseFromString(response.data, 'text/xml');

              var revNode = xmlDoc.getElementsByTagName('rev')[0];
              if (revNode && revNode.childNodes.length > 0) {
                var text = revNode.childNodes[0].nodeValue;
                var magnitude = text
                  .split('magnitude')[1]
                  .split('=')[1]
                  .split('|')[0]
                  .trim();
                var repute = text
                  .split('repute')[1]
                  .split('=')[1]
                  .split('|')[0]
                  .trim();
                if (repute.length < 1) {
                  repute = 'Unassigned';
                }
                var summary = text
                  .split('summary')[1]
                  .split('=')[1]
                  .split('|')[0]
                  .trim()
                  .split('}}')[0]
                  .trim();

                // Capitalize the first letter of the summary
                summary = summary.charAt(0).toUpperCase() + summary.slice(1);

                var snpTitle = snpsFromJsonFiles.find((item) => item.snps.includes(snp)).title;

                var formattedTitle = snpTitle.replace(/^snps_/i, '').replace(/_/g, ' ');

                var words = formattedTitle.split(' ');

                var capitalizedWords = words.map(word => {
                  if (word.toLowerCase() === "alzheimer's") {
                    return "Alzheimer's";
                  } else {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                  }
                });

                // Join the words back together with spaces
                formattedTitle = capitalizedWords.join(' ');

                // Get the category of the SNP
                var category = snpsFromJsonFiles.find((item) => item.snps.includes(snp)).category;
                var formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

                var obj = newArr.find((item) => item.snp === snp);
                if (obj) {
                  obj.mag = magnitude;
                  obj.rep = repute;
                  obj.desc = summary;
                } else {
                  newArr.push({
                    title: formattedTitle,
                    snp: snp,
                    allele: formattedAllele,
                    url: frontendURL,
                    mag: magnitude,
                    rep: repute,
                    desc: summary,
                    category: formattedCategory,
                  });
                }
              } else {
                console.log('Invalid XML structure for SNP:', snp);
              }
            } catch (error) {
              console.error('Error occurred while making the API request:', error);
            }
          }
        }

        // Sort the newArr array by magnitude in descending order
        newArr.sort((a, b) => b.mag - a.mag);

        setArr(newArr);

        const db = await openDatabase();
        const transaction = db.transaction(['GeneticData'], 'readwrite');
        const objectStore = transaction.objectStore('GeneticData');
        const putRequest = objectStore.put({
          id: 'generatedReportData',
          content: JSON.stringify(newArr),
        });

        putRequest.onsuccess = function (event) {
          console.log('Data successfully added to IndexedDB');
        };

        putRequest.onerror = function (event) {
          console.log('Error adding data to IndexedDB');
        }
      } catch (error) {
        console.error('Error occurred while fetching data:', error);
      }
    };

    fetchData();
  }, [dna]);

  return (
    <div className="mt-4 grid grid-cols-1 gap-4">
      {arr.length > 0 ? (
        arr.map((item) => (
          <SNPCard
            key={item.snp}
            title={item.title}
            snp={item.snp}
            allele={item.allele}
            desc={item.desc}
            mag={item.mag}
            rep={item.rep}
            snplink={item.url}
            category={item.category}
          />
        ))
      ) : (
        <div className="mx-auto mt-48">
          <Cog6ToothIcon className="w-8 h-8 mx-auto text-gray-500 animate-spin" />
          <h1 className="text-lg font-semibold text-center">Generating Report</h1>
          <h2 className="text-sm text-center">This may take a few minutes.</h2>
          <p className="text-sm text-center">Processed {count} SNPs.</p>
        </div>
      )}
    </div>
  );
}