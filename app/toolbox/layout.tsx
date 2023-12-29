'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link'

const queryClient = new QueryClient();

export default function ToolBoxLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <section className='h-screen' style={{ height: "calc(100vh - 5rem)" }}>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav className="navbar bg-base-100">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            主页
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            {/* <li>
              <details>
                <summary>
                  元信息
                </summary>
                <ul className="bg-base-100 rounded-box">
                  <li><Link href="/toolbox/metadata/city" >
                    城市元信息
                  </Link></li>
                </ul>
              </details>
            </li> */}
            {/* <li><Link href="/toolbox/metadata" >
              DAG
            </Link></li> */}
          </ul>
        </div>
      </nav>
      <div className='h-full'>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </div>
    </section>
  )
}