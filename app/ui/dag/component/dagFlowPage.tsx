'use client'
import LayoutDag from "@/app/ui/dag/layoutDag";
import { getLayoutAlgorithm, LayoutAlgorithm } from "@/app/ui/dag/layout/nodeLayout"
import { DagMenu } from "@/app/ui/dag/component/menu";
import { DetailForm } from "@/app/ui/dag/component/detail";
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import { fetchMenus, selectMenus, selectMenusStatus } from "@/app/lib/features/dag/menuSlice"
import { useEffect } from "react";
import { selectAlivePort } from "@/app/lib/features/dag/aliveSlice";
import { selectDagStatus } from "@/app/lib/features/dag/dagSlice";
import DagFetchErrorPage from "@/app/ui/dag/error";



export default function DagFlowPage() {
    const dispatch = useAppDispatch();

    const menus = useAppSelector(selectMenus)
    const menuStatus = useAppSelector(selectMenusStatus)
    const port = useAppSelector(selectAlivePort);
    const dagStatus = useAppSelector(selectDagStatus)

    useEffect(() => {
        if (menuStatus === "idle") {
            dispatch(fetchMenus({ port: port }));
        }
    }, [menuStatus, dispatch, port]);

    let mainContent = <></>;
    if (dagStatus === "failed") {
        mainContent = <DagFetchErrorPage className="col-span-8 bg-base-200 text-center" />
    } else {
        mainContent = <LayoutDag className="col-span-8 bg-white text-center"
            layoutFn={getLayoutAlgorithm(LayoutAlgorithm.DAGRE)}
        />
    }


    return (
        <div className="grid grid-cols-12 gap-1 h-full bg-base-200" >
            <div className="col-span-2" style={{ height: "calc(100vh - 10rem)" }}>
                <DagMenu dagMenu={menus} />
            </div>
            {mainContent}
            <div className="col-span-2 bg-base-100" style={{ height: "calc(100vh - 2rem)" }}>
                <DetailForm />
            </div>
        </div>
    );
}