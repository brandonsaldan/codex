import { useEffect, useState } from 'react';
import SNPCard from './ui/SNPCard';
import axios from 'axios';
import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { openDatabase } from './DropUpload';
import ErrorMessage from './ui/ErrorMessage';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/20/solid';
import ExportButton from './ui/ExportButton';

export default function Compiler({ filterOption, setFilterOption }) {
  const { pathname } = useRouter();
  const [arr, setArr] = useState([]);
  const [dna, setDNA] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

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

                let filterCategory;

                switch (formattedCategory) {
                  case 'Ageing':
                  case 'Appearance':
                    filterCategory = 'Appearance';
                    break;
                  case 'Endurance':
                    filterCategory = 'Endurance';
                    break;
                  case 'Haplogroup':
                  case 'Neanderthal':
                    filterCategory = 'Haplogroup';
                    break;
                  case 'APOE':
                  case 'BCHE':
                  case 'CYP':
                  case 'DCDC2':
                  case 'Dopamine':
                  case 'DRD4':
                  case 'G6PD':
                  case 'GCH1':
                  case 'Gs':
                  case 'Health':
                  case 'HLA':
                  case 'Mendeliome':
                  case 'NAT2':
                    filterCategory = 'Health';
                    break;
                  case 'Cannabis':
                  case 'Coffee':
                  case 'Drugbank':
                  case 'Histamine':
                  case 'Medicine':
                  case 'Micronutrients':
                    filterCategory = 'Medicines';
                    break;
                  case 'Intelligence':
                  case 'Memory':
                    filterCategory = 'Mental';
                    break;
                  case 'Music':
                    filterCategory = 'Music';
                    break;
                  case 'Personality':
                    filterCategory = 'Personality';
                    break;
                  default:
                    // Handle any other category that doesn't match the specified cases
                    filterCategory = 'Other';
                    break;
                }
                
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
                    filterCategory: filterCategory,
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

  const filteredArr = arr.filter((item) => {
    if (filterOption === '') {
      return true;
    }
    return item.filterCategory === filterOption;
  }).filter((item) => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const searchableText = `${item.title} ${item.desc}`.toLowerCase();
    return searchTerms.every(term => searchableText.includes(term));
  });

  return (
    <>
    <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-x-4 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">

        {/* Separator */}
        <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form className="relative flex flex-1" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <MagnifyingGlassIcon
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              placeholder="Search..."
              type="search"
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="hidden items-center gap-x-4 lg:gap-x-6">
            <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          </div>
        </div>
      </div>
    </div>
    <div className="min-w-0 flex max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Your Results
      </h2>
      <div className="right-0 flex-shrink-0 ml-auto">
        <ExportButton />
      </div>
    </div>
    <div className="mt-4 grid grid-cols-1 gap-4 max-w-7xl px-4 sm:px-6 lg:px-8">
      {arr.length > 0 ? (
        filteredArr.length > 0 ? (
          filteredArr.map((item) => (
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
              filterCategory={item.filterCategory}
            />
          ))
        ) : (
          <div className="mx-auto mt-48">
            <XMarkIcon className="w-8 h-8 mx-auto text-gray-500" />
            <h1 className="text-lg font-semibold text-center">No SNPs Found</h1>
            <h2 className="text-sm text-center">Try changing the filter options.</h2>
          </div>
        )
      ) : (
        <div className="mx-auto mt-48">
          <Cog6ToothIcon className="w-8 h-8 mx-auto text-gray-500 animate-spin" />
          <h1 className="text-lg font-semibold text-center">Generating Report</h1>
          <h2 className="text-sm text-center">This may take a few minutes.</h2>
          <p className="text-sm text-center">Processed {count} SNPs.</p>
        </div>
      )}
    </div>
    </>
  );
}
