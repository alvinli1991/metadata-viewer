import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Toolbox main page</h1>
      <div>
        <Link href="/toolbox/metadata">
          元数据工具箱
        </Link>
      </div>
    </div>
  );
}