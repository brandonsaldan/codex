import { useState, Fragment } from "react";
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'


export default function DropUpload() {
    const [file, setFile] = useState(null);
    let [isProcessing, setIsProcessing] = useState(false)
    let [isOpen, setIsOpen] = useState(false)
    let [isError, setIsError] = useState(false)
    var dna = require('dna2json');

    const uploadToClient = (event) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const fileSize = file.size; // Size of the file in bytes
    
        // Check the available space in localStorage
        const availableSpace = 5 * 1024 * 1024 - unescape(encodeURIComponent(JSON.stringify(localStorage))).length;
    
        console.log(availableSpace.toString());
        console.log(fileSize.toString());

        if (availableSpace.toString() < fileSize.toString() * 2) {
          setIsError(true)
          return;
        } else {
          const reader = new FileReader();
          reader.onload = function (e) {
            const fileContent = e.target.result;
            localStorage.setItem('uploadedFileContent', fileContent);
            setFile(event.target.files[0]);
          };
          reader.readAsText(file);
        }
      }
    };

    const uploadToLocalStorage = async (event) => {    
      setIsProcessing(true)
      dna.parse(data, function (err, snps) {
        if (err) {
          console.log(err);
        } else {
          localStorage.setItem('snpsData', JSON.stringify(snps));
          console.log(snps)
        }
      });
      setIsProcessing(false)
      setIsOpen(true);
    };

    function closeModal() {
      setIsOpen(false)
    }

    const router = useRouter()

    const pageRedirect = () => {
        router.push('/results')
    }

    const pageReturn = () => {
      setIsError(false)
  }

    const sampleRedirect = () => {
      router.push('/sample')
  }

    return (
    <>
        <Transition appear show={isError} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-xl bg-white p-12 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="hidden sm:flex text-xl font-semibold leading-6 text-gray-900"
                    >
                      Alert
                    </Dialog.Title>
                    <div className="mt-2 grid grid-cols-1">
                        <p className="mb-4 text-sm text-gray-500">To ensure that all processing of your data is done locally, GeneCodex uses your browser's localStorage property.</p>
                        <p className="mb-4 text-sm text-gray-500">Unfortunately, most browsers automatically limit the amount of storage allocated to localStorage. Your file is too large for your browser's current limit.</p>
                        <p className="mb-4 text-sm text-gray-500">Luckily, this can be easily fixed by manually setting the storage allocation. We recommend setting it to at least twice the size of your file. You can revert to your browser's default limit after your report is generated.</p>
                        <p className="mb-4 text-sm text-gray-500">To learn how to do this for your browser, click <a className="text-blue-500 hover:text-blue-700 transition ease-in-out duration-150" href="https://github.com/brandonsaldan/codex">here</a>.</p>
                        <button
                            type="button"
                            onClick={pageReturn}
                            disabled={!file}
                            className="mt-4 rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 transition ease-in-out duration-150"
                        >
                            Return
                        </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-xl bg-white p-12 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="hidden sm:flex text-xl font-semibold leading-6 text-gray-900"
                    >
                      Disclaimer
                    </Dialog.Title>
                    <div className="mt-2 grid grid-cols-1 gap-4 ml-4">
                        <li>
                            The information contained in this report is for educational and research purposes only.
                        </li>
                        <li>
                            The information used to generate this report is based on SNPedia and is not guaranteed to be entirely accurate.
                        </li>
                        <li>
                            This report is not to be used for medical purposes or in lieu of medical advice.
                        </li>
                        <li>
                            This report will be processed on your device and will not be stored on our servers, however, your device may connect to SNPedia to retrieve information about your SNPs.
                        </li>
                        <li>
                            This program is under development and may not provide complete results. You may have an SNP that is not included in this report.
                        </li>
                        <li>
                            By continuing, you accept the risk of learning that you may be at high risk of a debilitating disease.
                        </li>
                        <button
                            type="button"
                            onClick={pageRedirect}
                            disabled={!file}
                            className="mt-4 rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 transition ease-in-out duration-150"
                        >
                            Continue
                        </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        <div>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition ease-in-out duration-150">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">23andMe, AncestryDNA, or FamilyTreeDNA raw data .txt files</p>
                    </div>
                    <input onChange={uploadToClient} accept=".txt" id="dropzone-file" type="file" className="hidden" />
                </label>
            </div>
            <button
                type="button"
                onClick={uploadToLocalStorage}
                disabled={isProcessing}
                className="mt-4 rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 transition ease-in-out duration-150"
            >
                {isProcessing ? "Processing..." : "Continue"}
            </button>
            <button
                type="button"
                onClick={sampleRedirect}
                className="ml-4 mt-4 rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 transition ease-in-out duration-150"
            >
                View Sample Report
            </button>
        </div>
    </>
    )
}