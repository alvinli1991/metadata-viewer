'use client'
import { City } from "@/app/lib/data/metadata/definition";
import { cities } from "@/app/lib/data/metadata/city";
import { ReactNode, useState } from "react";
import Search from "@/app/ui/search";

export default function CityPage() {

    const [query, setQuery] = useState('');

    function handleChange(newInput: string) {

        setQuery(newInput.toLocaleLowerCase());
    }

    const cityRows: Array<ReactNode> = cities
        .filter((city: City) => {
            if (query.length === 0) {
                return true;
            }
            return city.id.toString().startsWith(query) || city.city_name.startsWith(query) || city.pinyin.startsWith(query) || city.alpha.startsWith(query);
        })
        .map((city: City) => {
            return (
                <tr key={city.id}>
                    <td>{city.id}</td>
                    <td>{city.parent_id}</td>
                    <td>{city.city_level}</td>
                    <td>{city.city_name}</td>
                    <td>{city.pinyin}</td>
                    <td>{city.alpha}</td>
                </tr>
            );
        });


    return (
        <>
            <Search placeholder="城市id/城市名/拼音/首字母" onChange={handleChange} />
            <div className="overflow-x-auto h-4/5">
                {/* create a table with columns cityId,parentCityId,level,CityName,pinyin,alpha */}
                <table className="table table-auto table-pin-rows max-h-full my-2">
                    <thead>
                        <tr>
                            <th>城市id</th>
                            <th>上级城市id</th>
                            <th>城市级别</th>
                            <th>城市名</th>
                            <th>拼音</th>
                            <th>首字母</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {cityRows}
                    </tbody>
                </table>
            </div>
        </>
    );
}