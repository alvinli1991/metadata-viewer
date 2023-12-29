'use client'
import { selectAlivePort, fetchAlive, setPort, selectAliveStatus } from '@/app/lib/features/dag/aliveSlice';
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';

export default function AliveCheckAndConfigPage() {
    const port = useAppSelector(selectAlivePort);
    const aliveStatus = useAppSelector(selectAliveStatus);
    const dispatch = useAppDispatch();
    let alert = <></>;
    if (aliveStatus === "failed") {
        alert = (<div className="badge badge-error gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            错误
        </div>);
    } else if (aliveStatus === "idle") {
        alert = (<div className="badge badge-warning gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            未检查
        </div>);
    } else if (aliveStatus === "loading") {
        alert = (<div className="badge badge-info gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            检查中
        </div>);
    }

    return (
        <div className="hero min-h-screen bg-base-200">

            <div className="hero-content flex-col">

                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">初始化</h1>
                </div>

                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">

                    <div className="card-body">
                        <h2 className="card-title">步骤说明</h2>

                        <ol className='list-decimal list-outside space-y-4'>
                            <li>安装<a className="link text-secondary" href='https://github.com/alvinli1991/metadata-toolkit-plugin' target="_blank">IDEA plugin</a>插件</li>
                            <li>配置 IDEA 通知 里提到的端口号
                                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                                    <div className="card-body">

                                        <div className="form-control space-y-2">
                                            <label className="label">
                                                <span className="label-text">端口号 </span>{alert}
                                            </label>

                                            <input type="number" value={port} className="input input-bordered" onChange={(e) => {
                                                dispatch(setPort(e.target.value));
                                            }} required />
                                        </div>
                                        <div className="form-control mt-6">
                                            <button className="btn btn-primary" onClick={() => dispatch(fetchAlive({ port: port }))}>检测连通性</button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}