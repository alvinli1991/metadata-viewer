'use client'

import clsx from 'clsx';
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import { DagMenuInfo, DagMenus } from "@/app/lib/data/dag/definition";
import { chooseMenu, selectActiveMenu, fetchMenus, clearMenus } from "@/app/lib/features/dag/menuSlice"
import { selectAlivePort } from "@/app/lib/features/dag/aliveSlice"
import { fetchDag, clearNode, clearDag } from "@/app/lib/features/dag/dagSlice"

export function DagMenu({ dagMenu }: { dagMenu?: DagMenus }) {
    const dispatch = useAppDispatch();
    const activeMenu = useAppSelector(selectActiveMenu);
    const port = useAppSelector(selectAlivePort);

    const onMenuSelected = (project: string, dag: DagMenuInfo) => {
        dispatch(chooseMenu({ project: project, dagId: dag.id }));
        dispatch(clearDag());
        dispatch(clearNode());
        dispatch(fetchDag({ port: port, project: project, fileName: dag.fileName, filePath: dag.filePath, dagType: dag.dagType }));
    };

    if (dagMenu === undefined || dagMenu.length === 0) {
        return (
            <div className="skeleton h-full w-full"></div>
        );
    }


    const menuItems = dagMenu
        .map((item) => {
            const subMenus = item.dags.map((dag) => {
                return (
                    <li key={dag.id}><a className={clsx(
                        "", {
                        "active": activeMenu?.id === dag.id,
                    })} onClick={() => onMenuSelected(item.project, dag)}>{dag.fileName}</a></li>
                );
            });

            return (
                <li key={item.project}>
                    <details open>
                        <summary className="">{item.project}</summary>
                        <ul className="">
                            {subMenus}
                        </ul>
                    </details>
                </li>
            );
        });

    return (
        <>
            <div className='flex space-x-4 bg-base-200 m-1 p-1'>
                <button className="flex-1 btn btn-primary" onClick={() => dispatch(fetchMenus({ port: port }))}>刷新菜单</button>
                <button className="flex-1 btn btn-secondary" onClick={() => {
                    dispatch(clearDag());
                    dispatch(clearNode());
                }}>清空DAG</button>
            </div>
            <ul className="menu bg-base-200 w-full max-h-full overflow-auto">
                {menuItems}
            </ul>
        </>
    );
}