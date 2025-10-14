import Link from "next/link";

interface AdminNavElProps {
  text: string;
  href: string;
}
export default function AdminNavEl(props: AdminNavElProps) {
  return (
    <Link
      className="flex flex-row items-center  justify-center lg:justify-start rounded-md h-12 focus:outline-none pr-3.5  lg:pr-6 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer "
      href={props.href}
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
            d="M10.894 22h2.212c3.447 0 5.17 0 6.345-1.012s1.419-2.705 1.906-6.093l.279-1.937c.38-2.637.57-3.956.029-5.083s-1.691-1.813-3.992-3.183l-1.385-.825C14.2 2.622 13.154 2 12 2s-2.199.622-4.288 1.867l-1.385.825c-2.3 1.37-3.451 2.056-3.992 3.183s-.35 2.446.03 5.083l.278 1.937c.487 3.388.731 5.081 1.906 6.093S7.447 22 10.894 22"
            opacity=".5"
          ></path>
          <path
            fill="currentColor"
            d="M9.447 15.397a.75.75 0 0 0-.894 1.205A5.77 5.77 0 0 0 12 17.75a5.77 5.77 0 0 0 3.447-1.148a.75.75 0 0 0-.894-1.205A4.27 4.27 0 0 1 12 16.25a4.27 4.27 0 0 1-2.553-.853"
          ></path>
        </svg>
      </span>
      <span className="ml-0 lg:ml-2 text-sm tracking-wide truncate hidden lg:block">
        {props.text}
      </span>
    </Link>
  );
}
