'use client'
import Link from 'next/link'

export default function MetadataToolboxLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <section className='flex flex-row mt-1 h-full'>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav className='basis-1/8'>
        <ul className="menu bg-base-200 w-56">
          <li><Link href="/toolbox/metadata/city" className='active'>
            城市元信息
          </Link></li>
        </ul>
      </nav>
      <main className='flex-auto mx-4'>{children}</main>


    </section>
  )
}