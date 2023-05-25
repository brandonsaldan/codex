import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid'

const statuses = {
  Good: 'text-green-700 bg-green-50 ring-green-600/20',
  Unassigned: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Bad: 'text-red-700 bg-red-50 ring-red-600/10',
}

const images = {
    Ageing: '/images/icons/appearance-icon.png',
    APOE: '/images/icons/health-icon.png',
    Appearance: '/images/icons/appearance-icon.png',
    BCHE: '/images/icons/health-icon.png',
    Cannabis: '/images/icons/medicine-icon.png',
    Coffee: '/images/icons/medicine-icon.png',
    CYP: '/images/icons/health-icon.png',
    DCDC2: '/images/icons/health-icon.png',
    Dopamine: '/images/icons/health-icon.png',
    DRD4: '/images/icons/health-icon.png',
    Drugbank: '/images/icons/medicine-icon.png',
    Endurance: '/images/icons/endurance-icon.png',
    G6PD: '/images/icons/health-icon.png',
    GCH1: '/images/icons/health-icon.png',
    Gs: '/images/icons/health-icon.png',
    Haplogroup: '/images/icons/haplogroup-icon.png',
    Health: '/images/icons/health-icon.png',
    Histamine: '/images/icons/medicine-icon.png',
    HLA: '/images/icons/health-icon.png',
    Intelligence: '/images/icons/mental-icon.png',
    Medicine: '/images/icons/medicine-icon.png',
    Memory: '/images/icons/mental-icon.png',
    Mendeliome: '/images/icons/health-icon.png',
    Micronutrients: '/images/icons/medicine-icon.png',
    Music: '/images/icons/music-icon.png',
    NAT2: '/images/icons/health-icon.png',
    Neanderthal: '/images/icons/haplogroup-icon.png',
    Personality: '/images/icons/personality-icon.png',
    
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SNPCard({ title, snp, allele, desc, mag, rep, snplink, category }) {
    return (
        <li className="overflow-hidden rounded-xl border border-gray-200">
        <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
            <img
              src={images[category]}
              className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
            />
            <div className="block">
                <div className="flex">
                    <div className="text-md font-semibold leading-6 text-gray-900">{title}</div>
                    <div
                        className={classNames(
                            statuses[rep],
                            'hidden sm:block ml-3 rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset'
                        )}
                        >
                        {rep}
                    </div>
                </div>
                <div className="text-sm font-medium leading-6 text-gray-900">{snp}{allele}</div>
                <div
                    className={classNames(
                        statuses[rep],
                        'block sm:hidden w-12 text-center rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset'
                    )}
                    >
                    {rep}
                </div>
            </div>
            <Menu as="div" className="relative ml-auto">
            <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Open options</span>
                <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
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
                <Menu.Items className="absolute right-0 z-10 mt-0.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <Menu.Item>
                    {({ active }) => (
                    <a
                        href={snplink}
                        className={classNames(
                        active ? 'bg-gray-50' : '',
                        'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                    >
                        View on SNPedia
                    </a>
                    )}
                </Menu.Item>
                </Menu.Items>
            </Transition>
            </Menu>
        </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">{desc}</dt>
                    <dd className="text-gray-700 font-semibold">
                        {mag}
                    </dd>
                </div>
            </dl>
        </li>
    )
}