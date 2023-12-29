export type City = {
    id: number,
    parent_id: number | null,
    city_level: number,
    city_name: string,
    pinyin: string,
    alpha: string
}

export type Channel = {
    id: number,
    name: string,
    dim: boolean
}