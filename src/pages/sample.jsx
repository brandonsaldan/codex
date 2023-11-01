/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  ExclamationCircleIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon as OutlineUsersIcon,
  XMarkIcon,
  EyeIcon as OutlineEyeIcon,
  FireIcon as OutlineFireIcon,
  HeartIcon as OutlineHeartIcon,
  BeakerIcon as OutlineBeakerIcon,
  BoltIcon as OutlineBoltIcon,
  MusicalNoteIcon as OutlineMusicalNoteIcon,
  FaceSmileIcon as OutlineFaceSmileIcon
} from '@heroicons/react/24/outline'
import {
  UsersIcon as SolidUsersIcon,
  EyeIcon as SolidEyeIcon,
  FireIcon as SolidFireIcon,
  HeartIcon as SolidHeartIcon,
  BeakerIcon as SolidBeakerIcon,
  BoltIcon as SolidBoltIcon,
  MusicalNoteIcon as SolidMusicalNoteIcon,
  FaceSmileIcon as SolidFaceSmileIcon
} from '@heroicons/react/24/solid'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import SampleCompiler from '../components/SampleCompiler'
import ExportButton from '../components/ui/ExportButton'

const filters = [
  { id: 1, name: 'Appearance', href: '#', logo: OutlineEyeIcon, solidLogo: SolidEyeIcon, current: false },
  { id: 2, name: 'Endurance', href: '#', logo: OutlineFireIcon, solidLogo: SolidFireIcon, current: false },
  { id: 3, name: 'Haplogroup', href: '#', logo: OutlineUsersIcon, solidLogo: SolidUsersIcon, current: false },
  { id: 4, name: 'Health', href: '#', logo: OutlineHeartIcon, solidLogo: SolidHeartIcon, current: false },
  { id: 5, name: 'Medicines', href: '#', logo: OutlineBeakerIcon, solidLogo: SolidBeakerIcon, current: false },
  { id: 6, name: 'Mental', href: '#', logo: OutlineBoltIcon, solidLogo: SolidBoltIcon, current: false },
  { id: 7, name: 'Music', href: '#', logo: OutlineMusicalNoteIcon, solidLogo: SolidMusicalNoteIcon, current: false },
  { id: 8, name: 'Personality', href: '#', logo: OutlineFaceSmileIcon, solidLogo: SolidFaceSmileIcon, current: false },
]
const userNavigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Results() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filterOption, setFilterOption] = useState('')
  const [appliedFilters, setAppliedFilters] = useState(false)

  const handleFilterSelect = (option) => {
    setFilterOption(option);
    setAppliedFilters(true);
  }

  const resetFilters = () => {
    setFilterOption('');
    setAppliedFilters(false);
  };

  const ResetButton = () => {
    if (appliedFilters === true) {
      return (
        <div className="group" onClick={resetFilters}>
          <a href="#" className="group gap-x-3 rounded-md p-2 text-sm leading-6 transition ease-in-out duration-150 text-gray-700 border-200 group-hover:text-[#ff4882] flex font-semibold">
            <span className="transition ease-in-out duration-150 text-gray-400 border-gray-200 group-hover:text-[#ff4882] flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium">
              <XMarkIcon className="h-6 w-6 text-gray-400 group-hover:text-[#ff4882]" aria-hidden="true" />
            </span>
            <span className="truncate">Reset Filters</span>
          </a>
        </div>
      )
    }
  }

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-6 w-auto"
                        src="images/logo.png"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">Filters</div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {filters.map((filter) => (
                              <li key={filter.name}>
                                <a
                                  href={filter.href}
                                  onClick={() => handleFilterSelect( filter.name )}
                                  className={classNames(
                                    filter.current
                                      ? 'bg-gray-50 text-indigo-600'
                                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <span
                                    className={classNames(
                                      filter.current
                                        ? 'text-indigo-600 border-indigo-600'
                                        : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                      'flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium'
                                    )}
                                  >
                                    <filter.logo />
                                  </span>
                                  <span className="truncate">{filter.name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-6 w-auto"
                src="images/logo.png"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <div className="text-sm font-semibold leading-6 text-gray-700">Filters</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {filters.map((filter) => (
                      <li key={filter.name}>
                        <div className="group">
                        <a
                          href={filter.href}
                          onClick={() => handleFilterSelect( filter.name )}
                          className={filter.logo === OutlineEyeIcon ? 'group gap-x-3 rounded-md p-2 text-sm leading-6 transition ease-in-out duration-150 text-gray-700 border-200 group-hover:text-[#2e76e6] flex font-semibold' : filter.logo === OutlineFireIcon ? 'group gap-x-3 rounded-md p-2 text-sm leading-6 transition ease-in-out duration-150 text-gray-700 border-200 group-hover:text-[#ff2770] flex font-semibold' : filter.logo === OutlineUsersIcon ? 'group gap-x-3 rounded-md p-2 text-sm leading-6 transition ease-in-out duration-150 text-gray-700 border-200 group-hover:text-[#00d9ff] flex font-semibold' : filter.logo === OutlineHeartIcon ? 'group gap-x-3 rounded-md p-2 text-sm leading-6 transition ease-in-out duration-150 text-gray-700 border-200 group-hover:text-[#ff2770] flex font-semibold' : filter.logo === OutlineBeakerIcon ? 'group gap-x-3 rounded-md p-2 text-sm leading-6 transition ease-in-out duration-150 text-gray-700 border-200 group-hover:text-[#00a9a5] flex font-semibold' : filter.logo === OutlineBoltIcon ? 'group gap-x-3 rounded-md p-2 text-sm leading-6 transition ease-in-out duration-150 text-gray-700 border-200 group-hover:text-[#ffae03] flex font-semibold' : filter.logo === OutlineMusicalNoteIcon ? 'group gap-x-3 rounded-md p-2 text-sm leading-6 transition ease-in-out duration-150 text-gray-700 border-200 group-hover:text-[#011627] flex font-semibold' : filter.logo === OutlineFaceSmileIcon ? 'group gap-x-3 rounded-md p-2 text-sm leading-6 transition ease-in-out duration-150 text-gray-700 border-200 group-hover:text-[#725ac1] flex font-semibold' : ''}
      
                        >
                          <span
                            className={filter.logo === OutlineEyeIcon ? 'transition ease-in-out duration-150 text-gray-400 border-gray-200 group-hover:text-[#2e76e6] flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium' : filter.logo === OutlineFireIcon ? 'transition ease-in-out duration-150 text-gray-400 border-gray-200 group-hover:text-[#ff2770] flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium' : filter.logo === OutlineUsersIcon ? 'transition ease-in-out duration-150 text-gray-400 border-gray-200 group-hover:text-[#00d9ff] flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium' : filter.logo === OutlineHeartIcon ? 'transition ease-in-out duration-150 text-gray-400 border-gray-200 group-hover:text-[#ff2770] flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium' : filter.logo === OutlineBeakerIcon ? 'transition ease-in-out duration-150 text-gray-400 border-gray-gray-200 group-hover:text-[#00a9a5] flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium' : filter.logo === OutlineBoltIcon ? 'transition ease-in-out duration-150 text-gray-400 border-gray-gray-200 group-hover:text-[#ffae03] flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium' : filter.logo === OutlineMusicalNoteIcon ? 'transition ease-in-out duration-150 text-gray-400 border-gray-gray-200 group-hover:text-[#011627] flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium' : filter.logo === OutlineFaceSmileIcon ? 'transition ease-in-out duration-150 text-gray-400 border-gray-200 group-hover:text-[#725ac1] flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium' : ''}
                          >
                            <filter.logo className="block group-hover:hidden transition ease-in-out duration-700" />
                            <filter.solidLogo className="hidden group-hover:block transition ease-in-out duration-700" />
                          </span>
                          <span className="truncate">{filter.name}</span>
                        </a>
                        </div>
                      </li>
                    ))}
                    <ResetButton />
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <main>
            <div className="mx-auto">
              <SampleCompiler filterOption={filterOption} setFilterOption={setFilterOption} />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}