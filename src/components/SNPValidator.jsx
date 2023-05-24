// You probably won't need to edit or use this file. It is used to validate SNPs from the SNPedia database and is only ran when new modules are added.

import { useEffect } from 'react';
import axios from 'axios';

export default function SNPValidator() {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/processSNPs');
        const snpsFromJsonFiles = response.data.snps;
        const successSNPs = [];
        const errorSNPs = [];
        let url1;

        for (const snpsObj of snpsFromJsonFiles) {
          for (const snp of snpsObj.snps) {
            url1 =
              'https://bots.snpedia.com/api.php?origin=*&action=query&prop=revisions&rvprop=content&format=xml&titles=' +
              snp +
              '&rvsection=0';
            try {
              const response = await axios.get(url1);
              var parser = new DOMParser();
              var xmlDoc = parser.parseFromString(response.data, 'text/xml');

                if (xmlDoc.getElementsByTagName('rev')[0].childNodes[0].nodeValue.includes('geno1' || 'geno2' || 'geno3' || 'geno4')) {
                    successSNPs.push(snp);
                    }
                else {
                    errorSNPs.push(snp);
              }
            } catch (error) {
              console.error('Error occurred while fetching data:', error);
            }
          }
        }

        const textFileContent = successSNPs.join('\n');
        const blob = new Blob([textFileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'success_snps.txt');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        const errorTextFileContent = errorSNPs.join('\n');
        const errorBlob = new Blob([errorTextFileContent], { type: 'text/plain' });
        const errorUrl = URL.createObjectURL(errorBlob);
        const errorLink = document.createElement('a');
        errorLink.href = errorUrl;
        errorLink.setAttribute('download', 'error_snps.txt');
        document.body.appendChild(errorLink);
        errorLink.click();
        document.body.removeChild(errorLink);
        URL.revokeObjectURL(errorUrl);
      } catch (error) {
        console.error('Error occurred while fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return null;
}
