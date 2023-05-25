import { useEffect, useState } from 'react';
import SNPCard from './ui/SNPCard';
import axios from 'axios';
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'

export default function Compiler() {
  const { pathname } = useRouter();
  const [arr, setArr] = useState([]);
  const [dna, setDNA] = useState({});

  useEffect(() => {
    if (pathname === '/results') {
      const storedDNA = localStorage.getItem('snpsData');
      if (storedDNA) {
        setDNA(JSON.parse(storedDNA));
      }
    }
  }, [pathname]);

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

                // Remove "snps_" and replace underscores with spaces
                var formattedTitle = snpTitle.replace(/^snps_/i, '').replace(/_/g, ' ');

                // Get the category of the SNP
                var category = snpsFromJsonFiles.find((item) => item.snps.includes(snp)).category;
                var formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

                // Capitalize the first letter of each word
                formattedTitle = formattedTitle.replace(/\b\w/g, (c) => c.toUpperCase());

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
        </div>
      )}
    </div>
  );
}
