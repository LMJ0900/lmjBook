import { useState } from "react";
import classes from "@/style/searchBar.module.css"
export default function SearchBar() {
    const [searchType, setSearchType] = useState("통합검색");
    const [searchQuery, setSearchQuery] = useState("");

    const searchOptions = ["통합검색", "제목", "저자"];
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
            />

            {/* 검색 아이콘 버튼 */}
            <button className={classes.searchBtn}>
            <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
    );
}