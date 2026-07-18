import Form from "next/form";
import SearchFormReset from "@/components/SearchFormReset";
import { Search } from "lucide-react";

const SearchForm = ({ query }: { query?: string }) => {
    return (
        <Form action="/" scroll={false} className="max-w-2xl mx-auto w-full min-h-[56px] bg-white border border-zinc-200 rounded-xl text-base mt-8 px-4 flex flex-row items-center gap-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <Search className="size-5 text-zinc-400" />
            
            <input
                name="query"
                defaultValue={query}
                className="flex-1 font-medium placeholder:text-zinc-400 placeholder:font-normal w-full h-auto outline-none bg-transparent text-zinc-900"
                placeholder="Search startups by name or category..."
            />

            <div className="flex items-center gap-2">
                {query && <SearchFormReset />}

                <button type="submit" className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                    Search
                </button>
            </div>
        </Form>
    )
}

export default SearchForm
