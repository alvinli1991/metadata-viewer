'use client'
import { selectAlivePort } from '@/app/lib/features/dag/aliveSlice';
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import { useEffect } from 'react';
import { clearDag, clearNode, selectDagStatus, setDagStatus } from "@/app/lib/features/dag/dagSlice";
import { fetchMenus, selectMenus } from '@/app/lib/features/dag/menuSlice';



export default function DagFetchErrorPage({
    className,
}: {
    className?: string;
}) {
    const port = useAppSelector(selectAlivePort);
    const dispatch = useAppDispatch();
    const dagStatus = useAppSelector(selectDagStatus)
    const menus = useAppSelector(selectMenus);

    useEffect(() => {
        if (dagStatus === "failed") {
            dispatch(clearDag());
            dispatch(clearNode());
        }
    }, [dagStatus]);

    let alert = <></>;
    if (dagStatus === "failed") {
        alert = (<div className="badge badge-error gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            无法连接
        </div>);
    } else if (dagStatus === "idle") {
        alert = (<div className="badge badge-warning gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            未检查
        </div>);
    } else if (dagStatus === "loading") {
        alert = (<div className="badge badge-info gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            检查中
        </div>);
    }

    return (
        <div className={`${className}`}>
            <div className="hero-content flex-col">
                <div className="card w-96 bg-primary text-primary-content">
                    <div className="card-body">
                        <h2 className="card-title">状态{alert}</h2>
                        <ul className='list-decimal list-inside text-left'>
                            <li>请检查IDEA的工程{menus[0].project ?? ""}是否开启并在前台</li>
                            <li>尝试重新获取当前开启工程的文件列表</li>
                        </ul>
                        <div className="card-actions justify-end">
                            <button className="btn " onClick={() => {
                                dispatch(fetchMenus({ port: port }));
                                dispatch(setDagStatus("idle"));
                            }}>获取</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}