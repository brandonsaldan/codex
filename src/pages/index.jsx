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
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <img
                        className="block h-8 w-auto lg:hidden"
                        src="https://cdn.discordapp.com/attachments/458182255375024132/1109295366714695770/logo.png"
                        alt="Your Company"
                      />
                      <img
                        className="hidden h-8 w-auto lg:block"
                        src="https://cdn.discordapp.com/attachments/458182255375024132/1109295366714695770/logo.png"
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
          </main>
        </div>
      </div>
    </>
  )
}
