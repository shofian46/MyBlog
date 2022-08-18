import Link from "next/link"

export default function Header() {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img className="w-44 object-contain cursor-pointer" src="https://links.papareact.com/yvf" alt="" />
        </Link>
        <div className="hidden md:inline-flex items-center space-x-5">
          <h3 className="cursor-pointer font-normal">About</h3>
          <h3 className="cursor-pointer font-normal">Contact</h3>
          <h3 className="text-white bg-green-600 px-4 py-1 rounded-full cursor-pointer hover:bg-green-500 font-normal">Follow</h3>
        </div>
      </div>
      <div className="flex items-center space-x-5 text-green-600">
        <h3 className="cursor-pointer font-normal">
          Sign in
        </h3>
        <h3 className="border px-4 py-1 border-green-600 rounded-full hover:bg-green-600 hover:text-white font-semibold cursor-pointer">
          Get Started
        </h3>
      </div>
    </header>
  );
}