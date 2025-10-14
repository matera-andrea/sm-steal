import type { Metadata } from "next";
import AdminNav from "../components/admin/AdminNav";
import Link from "next/link";
import AdminNavEl from "../components/admin/AdminNavEl";
import { text } from "stream/consumers";

export const metadata: Metadata = {
  title: "ADMIN | sm.steal",
  description: "Manage here your stock",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigation = [
    { text: "Ritorna al sito", href: "/" },
    { text: "Modelli", href: "/admin/items" },
    { text: "Brand", href: "/admin/brands" },
  ];

  return (
    <div className="w-dvw h-dvh bg-gray-200 flex">
      <div className="w-64 bg-white flex-shrink-0">
        <div className="p-2 h-full w-full flex flex-col bg-white dark:bg-gray-900 border-r border-r-gray-200">
          <a href="#">
            <div className="flex justify-center lg:justify-start items-center gap-2 py-2 px-0 md:px-2 lg:px-4 cursor-pointer ">
              <svg
                width="36"
                height="36"
                viewBox="0 0 903 1000"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M814.39 736.55L751.05 699.74L750.81 617.11L814.15 653.92L814.39 736.55Z"
                  fill="#00717E"
                ></path>
                <path
                  d="M520.46 997.94L457.12 961.13L456.86 869.58L520.2 906.39L520.46 997.94Z"
                  fill="#00717E"
                ></path>
                <path
                  d="M520.2 906.39L456.86 869.58L751.05 699.74L814.39 736.55L520.2 906.39Z"
                  fill="#00B6CA"
                ></path>
                <path
                  d="M608.06 681.21L544.72 644.4L838.91 474.55L902.25 511.36L608.06 681.21Z"
                  fill="#00B6CA"
                ></path>
                <path
                  d="M519.97 823.77L456.63 786.96L455.87 521.56L519.22 558.37L519.97 823.77Z"
                  fill="#00717E"
                ></path>
                <path
                  d="M519.22 558.37L455.87 521.56L838.41 300.7L901.75 337.51L519.22 558.37Z"
                  fill="#00B6CA"
                ></path>
                <path
                  d="M901.75 337.51L902.01 429.05L607.83 598.9L608.06 681.21L902.25 511.36L903 777.08L520.46 997.94L520.2 906.39L814.39 736.55L814.15 653.92L519.97 823.77L519.22 558.37L901.75 337.51Z"
                  fill="#00A3B6"
                ></path>
                <path
                  d="M75.75 554.2L139.09 517.4L138.34 784.69L75 821.5L75.75 554.2Z"
                  fill="#1D49C5"
                ></path>
                <path
                  d="M1.25 338.65L64.59 301.84L149.22 350.7L85.88 387.51L1.25 338.65Z"
                  fill="#2152DC"
                ></path>
                <path
                  d="M85.88 387.51L149.22 350.7L255.26 668.51L191.92 705.32L85.88 387.51Z"
                  fill="#2459EF"
                ></path>
                <path
                  d="M308.29 688.46L371.63 651.65L254.74 851.89L191.4 888.7L308.29 688.46Z"
                  fill="#1D49C5"
                ></path>
                <path
                  d="M383.77 559.5L447.11 522.69L445.87 962.24L382.53 999.05L383.77 559.5Z"
                  fill="#1D49C5"
                ></path>
                <path
                  d="M299.15 510.64L362.49 473.83L447.11 522.69L383.77 559.5L299.15 510.64Z"
                  fill="#2152DC"
                ></path>
                <path
                  d="M383.77 559.5L382.53 999.05L307.53 955.76L308.29 688.46L191.4 888.7L75.75 554.2L75 821.5L0 778.2L1.25 338.65L85.88 387.51L191.92 705.32L299.15 510.64L383.77 559.5Z"
                  fill="#143389"
                ></path>
                <path
                  d="M832.32 218.54L832.12 291.8L752.97 337.8L753.18 264.54L832.32 218.54Z"
                  fill="#007DC5"
                ></path>
                <path
                  d="M753.18 264.54L752.97 337.8L370.44 116.94L370.65 43.68L753.18 264.54Z"
                  fill="#005789"
                ></path>
                <path
                  d="M449.8 -2.31L832.32 218.54L753.18 264.54L370.65 43.68L449.8 -2.31Z"
                  fill="#008CDC"
                ></path>
                <path
                  d="M387.82 136.05L387.62 209.31L237.03 296.82L237.23 223.56L387.82 136.05Z"
                  fill="#007DC5"
                ></path>
                <path
                  d="M514.52 300.89L514.31 374.15L421.06 320.31L421.27 247.05L514.52 300.89Z"
                  fill="#005789"
                ></path>
                <path
                  d="M452.27 439.4L452.06 512.66L69.54 291.81L69.74 218.55L452.27 439.4Z"
                  fill="#005789"
                ></path>
                <path
                  d="M602.86 351.89L531.42 393.41L452.27 439.4L452.06 512.66L531.21 466.67L602.65 425.15L681.8 379.15L682.01 305.89L602.86 351.89Z"
                  fill="#007DC5"
                ></path>
                <path
                  d="M421.27 247.05L500.41 201.05L682.01 305.89L602.86 351.89L531.42 393.41L452.27 439.4L69.74 218.55L299.48 85.04L387.82 136.05L237.23 223.56L443.08 342.4L514.52 300.89L421.27 247.05Z"
                  fill="#008CDC"
                ></path>
              </svg>
            </div>
          </a>

          <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden flex-grow pt-2 justify-between">
            <div className="flex flex-col  space-y-1 mx-1 lg:mt-1 ">
              <div className="px-5 pt-4 hidden lg:block">
                <div className="flex flex-row items-center">
                  <div className="text-xs font-bold tracking-wide text-gray-600">
                    Menu
                  </div>
                </div>
              </div>
              {navigation.map((item) => (
                <AdminNavEl key={item.href} text={item.text} href={item.href} />
              ))}
            </div>
            <div className="flex flex-col  space-y-1 mx-1 lg:mt-1 ">
              <a
                className="flex flex-row items-center  justify-center lg:justify-start rounded-md h-12 focus:outline-none pr-3.5  lg:pr-6 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer "
                href="/app/settings"
              >
                <span className="inline-flex justify-center items-center ml-3.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.25rem"
                    height="1.25rem"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.408 0-1.779.152a2 2 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.62 1.62 0 0 1-.796 1.353a1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.03 2.03 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453c-.47.807-.704 1.21-.757 1.605c-.07.526.074 1.058.4 1.479c.148.192.357.353.68.555c.477.297.783.803.783 1.361s-.306 1.064-.782 1.36c-.324.203-.533.364-.682.556a2 2 0 0 0-.399 1.479c.053.394.287.798.757 1.605s.704 1.21 1.022 1.453c.424.323.96.465 1.49.396c.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353c.015.38.051.64.145.863c.204.49.596.88 1.09 1.083c.37.152.84.152 1.779.152s1.409 0 1.779-.152a2 2 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863c.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308c.53.07 1.066-.073 1.49-.396c.318-.242.553-.646 1.022-1.453c.47-.807.704-1.21.757-1.605a2 2 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555c-.477-.297-.783-.803-.783-1.361s.306-1.064.782-1.36c.324-.203.533-.364.682-.556a2 2 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605s-.704-1.21-1.022-1.453a2.03 2.03 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008a1.62 1.62 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2 2 0 0 0-1.09-1.083"
                      clipRule="evenodd"
                      opacity=".5"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M15.523 12c0 1.657-1.354 3-3.023 3s-3.023-1.343-3.023-3S10.83 9 12.5 9s3.023 1.343 3.023 3"
                    ></path>
                  </svg>
                </span>
                <span className="ml-0 lg:ml-2 text-sm tracking-wide truncate capitalize hidden lg:block">
                  Settings
                </span>
              </a>
            </div>
          </div>
          <div className="px-1">
            <div className="flex flex-row items-center  justify-center lg:justify-start rounded-md h-12 focus:outline-none pr-3.5  lg:pr-6 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer text-red-400 hover:text-red-600">
              <span className="inline-flex justify-center items-center ml-3.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.25rem"
                  height="1.25rem"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M15 2h-1c-2.828 0-4.243 0-5.121.879C8 3.757 8 5.172 8 8v8c0 2.828 0 4.243.879 5.121C9.757 22 11.172 22 14 22h1c2.828 0 4.243 0 5.121-.879C21 20.243 21 18.828 21 16V8c0-2.828 0-4.243-.879-5.121C19.243 2 17.828 2 15 2"
                    opacity=".6"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M8 8c0-1.538 0-2.657.141-3.5H8c-2.357 0-3.536 0-4.268.732S3 7.143 3 9.5v5c0 2.357 0 3.535.732 4.268S5.643 19.5 8 19.5h.141C8 18.657 8 17.538 8 16z"
                    opacity=".4"
                  ></path>
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M4.47 11.47a.75.75 0 0 0 0 1.06l2 2a.75.75 0 0 0 1.06-1.06l-.72-.72H14a.75.75 0 0 0 0-1.5H6.81l.72-.72a.75.75 0 1 0-1.06-1.06z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate capitalize hidden lg:block">
                Logout
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Area contenuto principale */}
      <div className="flex-1 overflow-auto">
        {/* Qui vanno i tuoi componenti */}
        {children}
      </div>
    </div>
  );
}
