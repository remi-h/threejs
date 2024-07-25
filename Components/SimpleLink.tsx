import Link from "next/link";

type LinkProps = {
    url: string;
    name: string;
};
const SimpleLink = ({ url, name }: LinkProps) => {
    return (
        <Link href={url}>
            <div className="px-3 py-1 border border-black inline hover:bg-black hover:text-white duration-300">{name}</div>
        </Link>
    );
}

export default SimpleLink;