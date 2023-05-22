import { useState, Fragment } from "react";
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'

export default function DropUpload() {
    const [file, setFile] = useState(null);

    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];

        setFile(i);
        }
    };

    const uploadToServer = async (event) => {        
        const body = new FormData();
        body.append("file", file);    
        const response = await fetch("/api/upload", {
        method: "POST",
        body
        });
        setIsOpen(true)
    };

    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
      setIsOpen(false)
    }

    const router = useRouter()

    const pageRedirect = () => {
        router.push('/results')
    }

    return (
    <>
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
            <div class="flex items-center justify-center w-full">
                <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition ease-in-out duration-150">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg aria-hidden="true" class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                        <p class="text-xs text-gray-500">JSON Only (For Now)</p>
                    </div>
                    <input onChange={uploadToClient} id="dropzone-file" type="file" class="hidden" />
                </label>
            </div>
            <button
                type="button"
                onClick={uploadToServer}
                className="mt-4 rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 transition ease-in-out duration-150"
            >
                Continue
            </button>
        </div>
    </>
    )
}