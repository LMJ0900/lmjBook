import { useEffect, useState } from "react";
import classes from "@/style/searchBar.module.css";

export default function SearchBar({ onSearch }: { onSearch: (query: string, type: string) => void }) {
    const [searchType, setSearchType] = useState("통합검색");
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);


    const searchOptions = ["통합검색", "제목", "저자"];
    

     const handleSearch = () => {
        if (searchQuery.trim() === "") {
            onSearch("",''); // ✅ 검색어가 비어있으면 전체 조회 실행
        } else {
            onSearch(searchQuery, searchType);
        }
    };
    useEffect(() => {
        if (searchQuery.trim() === "") {
            onSearch("", '');
        }
    }, [searchQuery]); 

    return (
        <div className={classes.searchBar}>
            {/* 검색 유형 드롭다운 */}
            <div className={classes.dropdown}>
                <button className={classes.dropdownBtn} type="button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {searchType} <span className="arrow">▼</span>
                </button>
                {dropdownOpen && (
                    <ul className={classes.dropdownMenu}>
                        {searchOptions.map((option, index) => (
                            <li key={index} className={classes.dropdownItem}
                                onClick={() => {
                                    setSearchType(option);
                                    setDropdownOpen(false);
                                }}>
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 구분선 */}
            <span className={classes.divider}>|</span>

            {/* 검색 입력 필드 */}
            <input
                type="text"
                className={classes.searchInput}
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            {/* 검색 아이콘 버튼 */}
            <button className={classes.searchBtn} onClick={handleSearch}>
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
    );
}
