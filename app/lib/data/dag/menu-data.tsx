import { DagType, DagMenus } from "@/app/lib/data/dag/definition";

export const dagMenus: DagMenus = [
    {
        "project": "playground",
        "dags": [
            {
                "id": "playground",
                "fileName": "playground.xml",
                "filePath": "",
                "dagType": DagType.xml
            }
        ]
    }
]