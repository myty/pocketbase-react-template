import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import pb, { useAuthStore } from "../pocketbase";
import React, { PropsWithChildren } from "react";
import { AuthStoreStatuses } from "../pocketbase/auth-store/hook-factory";
import { LoginForm } from "../LoginForm";
import { AuthProvider, AuthProviders } from "../pocketbase/auth-store/types";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];

const userNavigation = [
  { key: "profile", name: "Your Profile", href: "#" },
  { key: "settings", name: "Settings", href: "#" },
  { key: "logout", name: "Sign out", href: "#" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { authStore, loginWithProvider, login, logout, status } =
    useAuthStore();

  const user = {
    ...authStore.model,
    imageUrl: authStore.model?.avatar
      ? pb.files.getUrl(
          authStore.model as Record<string, unknown>,
          authStore.model.avatar,
          { thumb: "40x40" }
        )
      : undefined,
  };

  const handleMenuClick = (key: string) => () => {
    if (key === "logout") {
      logout();
    }
  };

  const handleLogin = (
    provider: AuthProvider,
    email?: string,
    password?: string
  ) => {
    if (provider !== AuthProviders.Email) {
      loginWithProvider(provider);
      return;
    }

    if (email && password) {
      login(email, password);
    }
  };

  if (status === AuthStoreStatuses.Authenticating) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-y-8">
          <div className="w-20 h-20 bg-blue-800 rounded-full animate-ping"></div>
          <div className="text-lg font-semibold">Authenticating...</div>
        </div>
      </div>
    );
  }

  if (status === AuthStoreStatuses.Unauthenticated) {
    return <LoginForm onSubmit={handleLogin} />;
  }

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 h-8"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="flex items-baseline ml-10 space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  {authStore.isValid && (
                    <div className="hidden md:block">
                      <div className="flex items-center ml-4 md:ml-6">
                        <button
                          type="button"
                          className="relative p-1 text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="w-6 h-6" aria-hidden="true" />
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <MenuButton className="relative flex items-center max-w-xs text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              <img
                                className="w-8 h-8 rounded-full"
                                src={user.imageUrl}
                                alt=""
                              />
                            </MenuButton>
                          </div>
                          <Transition
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <MenuItems className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {userNavigation.map((item) => (
                                <MenuItem key={item.name}>
                                  {({ focus }) => (
                                    <a
                                      href={item.href}
                                      onClick={handleMenuClick(item.key)}
                                      className={classNames(
                                        focus ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      {item.name}
                                    </a>
                                  )}
                                </MenuItem>
                              ))}
                            </MenuItems>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  )}
                  <div className="flex -mr-2 md:hidden">
                    {/* Mobile menu button */}
                    <DisclosureButton className="relative inline-flex items-center justify-center p-2 text-gray-400 bg-gray-800 rounded-md hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block w-6 h-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block w-6 h-6"
                          aria-hidden="true"
                        />
                      )}
                    </DisclosureButton>
                  </div>
                </div>
              </div>

              <DisclosurePanel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navigation.map((item) => (
                    <DisclosureButton
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </DisclosureButton>
                  ))}
                </div>
                {authStore.isValid && (
                  <div className="pt-4 pb-3 border-t border-gray-700">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium leading-none text-white">
                          {user.name}
                        </div>
                        <div className="text-sm font-medium leading-none text-gray-400">
                          {user.email}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="relative flex-shrink-0 p-1 ml-auto text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="w-6 h-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="px-2 mt-3 space-y-1">
                      {userNavigation.map((item) => (
                        <DisclosureButton
                          key={item.name}
                          as="a"
                          href={item.href}
                          onClick={handleMenuClick(item.key)}
                          className="block px-3 py-2 text-base font-medium text-gray-400 rounded-md hover:bg-gray-700 hover:text-white"
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </div>
                  </div>
                )}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome, {authStore.model?.name}!
            </h1>
          </div>
        </header>
        <main>
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};
