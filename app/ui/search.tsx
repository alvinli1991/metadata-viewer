'use client'
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder, onChange }: { placeholder: string, onChange: (newInput: string) => void }) {

    const handleSearch = useDebouncedCallback((term) => {
        onChange(term);
    }, 300);

    return (
        <div className="flex flex-row">
            <input type="text" placeholder={placeholder} className="input input-bordered input-primary w-full"
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
            />
        </div>
    );
}