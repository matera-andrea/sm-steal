import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function DeveloperPage() {
  return (
    <main className="bg-white min-h-screen text-black p-6 md:p-12 flex flex-col justify-between font-mono selection:bg-amber-400 selection:text-black">
      {/* --- TOP: BREADCRUMB --- */}
      <header className="flex justify-between items-start border-b border-black pb-4">
        <div className="text-xs uppercase tracking-widest text-gray-400">
          SM.STEAL / CREDITS
        </div>
      </header>

      {/* --- CENTER: RAW DATA --- */}
      <section className="flex-1 flex flex-col justify-center max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
          {/* BLOCK 1: IDENTITY */}
          <div>
            <span className="block text-[10px] uppercase text-gray-400 mb-2">
              Lead Engineer
            </span>
            <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter leading-none">
              Andrea Matera
            </h1>
          </div>

          {/* BLOCK 2: PROJECT */}
          <div>
            <span className="block text-[10px] uppercase text-gray-400 mb-2">
              Project
            </span>
            <p className="text-xl uppercase leading-tight font-medium">
              Custom E-commerce-Like Architecture <br />
              Full Stack Implementation
            </p>
          </div>

          {/* BLOCK 3: STACK (LIST) */}
          <div className="md:col-span-2 border-t border-dashed border-gray-300 pt-8 mt-4">
            <span className="block text-[10px] uppercase text-gray-400 mb-4">
              Tech Specs
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-bold uppercase">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-normal">
                  Core
                </span>
                Next.js
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-normal">
                  DB
                </span>
                Prisma ORM
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-normal">
                  Style
                </span>
                Tailwind CSS
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-normal">
                  Storage
                </span>
                Cloudflare R2
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- BOTTOM: CONTACT & EXIT --- */}
      <footer className="border-t border-black pt-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <span className="block text-[10px] uppercase text-gray-400">
            Contact
          </span>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <a
              href="https://github.com/matera-andrea" // IL TUO GITHUB
              target="_blank"
              className="group flex items-center gap-1 text-sm font-bold uppercase hover:bg-black hover:text-white transition-colors px-1 -ml-1"
            >
              Github{" "}
              <ArrowUpRight
                size={14}
                className="opacity-50 group-hover:opacity-100"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/andrea-felice-matera-b75202226/"
              target="_blank"
              className="group flex items-center gap-1 text-sm font-bold uppercase hover:bg-[#0077b5] hover:text-white transition-colors px-1 -ml-1"
            >
              LinkedIn{" "}
              <ArrowUpRight
                size={14}
                className="opacity-50 group-hover:opacity-100"
              />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
