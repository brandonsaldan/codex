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
import Compiler from '../components/Compiler'
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
const sortBy = [
  { id: 1, name: 'Alphabetical', href: '#', initial: 'A', current: false },
  { id: 2, name: 'Magnitude', href: '#', initial: 'M', current: false },
  { id: 3, name: 'Good', href: '#', initial: 'G', current: false },
  { id: 4, name: 'Bad', href: '#', initial: 'B', current: false },
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
  const [show, setShow] = useState(false)

  function ShowNotification() {
    setShow(true)
  }

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end mt-14">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <ExclamationCircleIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm text-gray-500">Sorting results is currently not supported and is under development.</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShow(false)
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
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
                                  onClick={ShowNotification}
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
                        <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">Sort</div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {sortBy.map((sort) => (
                              <li key={sort.name}>
                                <a
                                  href={sort.href}
                                  onClick={ShowNotification}
                                  className={classNames(
                                    sort.current
                                      ? 'bg-gray-50 text-indigo-600'
                                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <span
                                    className={classNames(
                                      sort.current
                                        ? 'text-indigo-600 border-indigo-600'
                                        : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                                    )}
                                  >
                                    {sort.initial}
                                  </span>
                                  <span className="truncate">{sort.name}</span>
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
                          onClick={ShowNotification}
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
                  </ul>
                </li>
                <li>
                  <div className="text-sm font-semibold leading-6 text-gray-700">Sort</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {sortBy.map((sort) => (
                      <li key={sort.name}>
                        <a
                          href={sort.href}
                          onClick={ShowNotification}
                          className={classNames(
                            sort.current
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <span
                            className={classNames(
                              sort.current
                                ? 'text-indigo-600 border-indigo-600'
                                : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 transition ease-in-out duration-150',
                              'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                            )}
                          >
                            {sort.initial}
                          </span>
                          <span className="truncate">{sort.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8 border-b border-gray-200 bg-white">
            <div className="flex h-16 items-center gap-x-4 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

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
                  />
                </form>
                <div className="hidden items-center gap-x-4 lg:gap-x-6">
                  <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Separator */}
                  <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-6 w-8 rounded-full bg-gray-50"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                      <span className="hidden lg:flex lg:items-center">
                        <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                          Tom Cook
                        </span>
                        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? 'bg-gray-50' : '',
                                  'block px-3 py-1 text-sm leading-6 text-gray-900'
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <main className="py-4">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="min-w-0 flex">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Your Results
                    </h2>
                    <div className="right-0 flex-shrink-0 ml-auto">
                      <ExportButton />
                    </div>
                </div>
                <Compiler />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}