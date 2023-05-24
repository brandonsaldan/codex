import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import DropUpload from '../components/DropUpload'

export default function Home() {
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-white shadow-sm">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <img
                        className="block h-6 w-auto lg:hidden"
                        src="images/logo.png"
                        alt="Your Company"
                      />
                      <img
                        className="hidden h-6 w-auto lg:block"
                        src="images/logo.png"
                        alt="Your Company"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Disclosure>

        <div className="py-10">
          <header>
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">GeneCodex</h1>
            </div>
          </header>
          <main>
            <div className="mt-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
              <DropUpload />
            </div>
            <div className="mt-10 mx-auto max-w-4xl sm:px-6 lg:px-8 text-center">
              <p className="text-sm text-gray-500">All processing is done in-browser. Your files are not saved.</p>
              <p className="text-sm text-gray-500">Built by <a className="text-blue-500 hover:text-blue-700 transition ease-in-out duration-150" href="https://twitter.com/brandonsaldan">Brandon Saldan</a>. View source on <a className="text-blue-500 hover:text-blue-700 transition ease-in-out duration-150" href="https://github.com/brandonsaldan/codex">GitHub</a>.</p>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
