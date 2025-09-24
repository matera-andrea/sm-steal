export default function NavEl(props: { title: string, href: string }) {
    return (<a aria-current="page"
        className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
        href={props.href}>{props.title}</a>)
}