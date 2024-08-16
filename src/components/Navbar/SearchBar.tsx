import {useState} from "react";
import {useNavigate, useSearchParams} from 'react-router-dom';
import {SearchIcon} from "./icons";
import {useTranslation} from "react-i18next";

const SearchBar = () => {
    const [searchParams] = useSearchParams();

    const search = searchParams.get('search')
const {t} = useTranslation();
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchText, setSearchText] = useState(search ? search : '');
    const navigate = useNavigate();

    const handelFormSubmit = (e: any) => {
        e.preventDefault()
        if(searchText) {
            navigate('/?search=' + searchText);
        }else {
             navigate('/');
        }
    };

    return (
        <form
            onSubmit={handelFormSubmit}
            className="h-10 my-2 overflow-hidden flex justify-end border rounded-full focus-within:border-sky-700 focus-within:shadow-inner"
        >
            <div className="flex">
                <div
                    className={`${
                        searchFocused ? "block" : "hidden"
                    } flex items-center ml-2`}
                >
                    <SearchIcon/>
                </div>
                <input
                    className="px-2 lg:w-[500px] md:w-[350] focus:outline-none dark:bg-black"
                    value={searchText}
                    type="text"
                    placeholder={t('search')}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    onChange={({target}) => setSearchText(target.value)}
                />
            </div>
            <button
                className=" w-16 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 flex items-center justify-around cursor-pointer"
                type="submit"
            >
                <SearchIcon/>
            </button>
        </form>
    );
};

export default SearchBar;
