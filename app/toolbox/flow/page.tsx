'use client'

import { useAppDispatch, useAppSelector } from '@/app/lib/hooks';
import { fetchAlive, selectAlive, selectAlivePort, selectAliveStatus } from "@/app/lib/features/dag/aliveSlice";
import DagFlowPage from "@/app/ui/dag/component/dagFlowPage";
import AliveCheckAndConfigPage from "@/app/ui/dag/component/aliveConfig";
import { useEffect } from 'react';
import { subEdges, subNodes } from '@/app/lib/data/dag/nodes-edges';
import AllLayoutDag from '@/app/ui/dag/allLayoutDag';



export default function DagPage() {
    const port = useAppSelector(selectAlivePort);
    const alive = useAppSelector(selectAlive);
    const aliveStatus = useAppSelector(selectAliveStatus);
    const dispatch = useAppDispatch();
    // useEffect(() => {
    //     if (!alive && aliveStatus === "idle") {
    //         dispatch(fetchAlive({ port: port }));
    //     }
    // }, [alive, aliveStatus, port]);

    if (alive) {
        return (
            <DagFlowPage />
        )
    } else {
        return (
            <AliveCheckAndConfigPage />
        )
    }
}