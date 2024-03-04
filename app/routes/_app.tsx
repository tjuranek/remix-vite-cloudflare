import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  Link,
  Outlet,
  json,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { withAuth } from "~/services/auth/utils";
import { Routes } from "~/constants/routes";

export const loader = withAuth(({ user, organization }) => {
  return json({ user, organization });
});

const nav = [
  {
    match: "/analytics",
    name: "Analytics",
    to: Routes.Analytics,
  },
  {
    match: "/dashboard",
    name: "Dashboard",
    to: Routes.Dashboard,
  },
  {
    match: "/leads",
    name: "Leads",
    to: Routes.Leads,
  },
  {
    match: "/taskboard",
    name: "Taskboard",
    to: Routes.Taskboard,
  },
];

export default function App() {
  const { user, organization } = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <>
      <Disclosure as="nav" className="bg-white shadow">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                      alt="Your Company"
                    />
                  </div>

                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {nav.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className={clsx(
                          "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-900",
                          location.pathname.includes(item.match)
                            ? "border-indigo-500"
                            : "border-transparent"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="group block flex-shrink-0">
                        <div className="flex items-center">
                          <div>
                            <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white">
                              {user.firstName?.[0]}
                              {user.lastName?.[0]}
                            </div>
                          </div>
                          <div className="ml-3 text-left">
                            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                              {`${user.firstName} ${user.lastName}`}
                            </p>
                            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                              {organization.name}
                            </p>
                          </div>
                        </div>
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={Routes.Logout}
                              className={clsx(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Log Out
                            </Link>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-4 pt-2">
                {nav.map((item) => (
                  <Link key={item.name} to={item.to}>
                    <Disclosure.Button
                      as="div"
                      className={clsx(
                        "block border-l-4 py-2 pl-3 pr-4 text-base font-medium",
                        location.pathname.includes(item.match)
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                          : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                      )}
                    >
                      {item.name}
                    </Disclosure.Button>
                  </Link>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </>
  );
}
