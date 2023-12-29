'use client';
import { ArrowRightIcon } from '@heroicons/react/24/outline'

import Link from 'next/link'
import { useAppDispatch } from '@/app/lib/hooks';
import { resetAliveStatus } from '@/app/lib/features/dag/aliveSlice';

export default function Home() {
  const dispatch = useAppDispatch();

  return (
    <>
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
                <ul className="p-2 bg-base-100 rounded-t-none">
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
      <main className="grid grid-cols-5 gap-2 min-h-screen items-center justify-center  content-center p-24">
        <div className="card col-start-2 bg-primary text-primary-content shadow-xl">
          <div className="card-body">
            <h2 className="card-title">城市信息</h2>
            <p>搜索城市id、城市名</p>
            <div className="card-actions justify-end">
              <Link
                href="/toolbox/metadata/city"
                className='hover:-translate-y-1 hover:scale-110 duration-300'
              >
                <button className="btn">
                  <span>进入</span> <ArrowRightIcon className="w-5 md:w-6 " />
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="card  col-start-4 bg-primary text-primary-content shadow-xl">
          <div className="card-body">
            <h2 className="card-title">DAG</h2>
            <p>业务链路可视化</p>
            <div className="card-actions justify-end">
              <Link
                href="/toolbox/flow"
                className='hover:-translate-y-1 hover:scale-110 duration-300'
              >
                <button className="btn" onClick={() => { dispatch(resetAliveStatus()) }}>
                  <span>进入</span> <ArrowRightIcon className="w-5 md:w-6 " />
                </button>
              </Link>

            </div>
          </div>
        </div>

      </main>
    </>

  )
}
