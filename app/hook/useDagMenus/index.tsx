import { useQuery } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";

const useDagToolAlive = ({ port = 63343 }: { port?: number }) => {
    const url = `http://127.0.0.1:${port}/api.dag`

    return useQuery({
        queryKey: ['toolAlive'],
        queryFn: () =>
            axios.get(url, {
                params: {
                    func: 'ALIVE',
                }

            }).then((res) => res.status === HttpStatusCode.Ok),
    })
};

const useDags = ({ port = 63343 }: { port?: number }) => {
    const url = `http://127.0.0.1:${port}/api.dag`
    return useQuery({
        queryKey: ['dags'],
        queryFn: () =>
            axios.get(url, {
                params: {
                    func: 'GET_DAG_FILE_META',
                }

            })
                .then((res) => res.data),
    })
}

const useDag = ({ fileName, filePath, dagType, port = 63343 }: { fileName: string, filePath: string, dagType: string, port?: number }) => {
    const url = `http://127.0.0.1:${port}/api.dag`
    return useQuery({
        queryKey: ['dag'],
        queryFn: () =>
            axios.get(url, {
                params: {
                    func: 'GET_DAG_META',
                    file_name: fileName,
                    file_path: filePath,
                    dag_type: dagType,
                }
            })
                .then((res) => res.data),
    })
}

export { useDags, useDag }