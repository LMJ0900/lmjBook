'use client'
import classes from "@/style/mainHeader.module.css"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/components/hooks/useAuth"; // ✅ 커스텀 훅 가져오기
import SearchBar from "./searchBar";

function ImportIcon(){ // 아이콘을 가져오는 함수
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://kit.fontawesome.com/a74d5e1b24.js";
        script.crossOrigin = "anonymous";
        document.body.appendChild(script);
    }, []);
}

export default function MainHeader(){
    ImportIcon();
    const router = useRouter();
    const { user, loading, isAdmin } = useAuth(); // ✅ 관리자 여부 추가

    const handleUserClick = () => {
        if (loading) return; // ✅ 로딩 중일 때 클릭 방지
        if (!user) {
            router.push('/login'); // ✅ 로그인 안 되어 있으면 로그인 페이지 이동
        } else if (isAdmin) {
            router.push('/admin'); // ✅ 관리자면 어드민 페이지 이동
        } else {
            router.push('/mypage'); // ✅ 일반 유저는 마이페이지 이동
        }
    };

    const handleSearch = (query: string, type: string) => {
        if (!query) return; // 검색어가 없으면 실행 안 함
        router.push(`/search?query=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`);
    };

    return(
        <>
            <nav className={classes.header}>
                <div className={classes.home}>
                    <a href="./" className={classes.homeBtn}>
                        <i className="fa-solid fa-book-open"></i>
                        <h2>lmjBook</h2>
                    </a>
                </div>
                <form className="w-[50rem] flex items-center" action="">
                <SearchBar onSearch={handleSearch} />
                </form>
                <ul className={classes.icon}>
                    <li>
                        <button onClick={handleUserClick} disabled={loading}>
                            {loading ? "로딩 중..." : <i className="fa-solid fa-user"></i>}
                        </button>
                    </li>
                    <li>
                        <button>
                            <i className="fa-solid fa-bell"></i>
                        </button>
                    </li>
                </ul>
            </nav>
            <nav>
                <ul className={classes.subHeader}>
                    <li><a href="">베스트</a></li>
                    <li><a href="">신상품</a></li>
                    <li><a href="">책목록</a></li>
                    <li><a href="">공란</a></li>
                    <li><a href="">공란</a></li>
                </ul>
            </nav>
        </>
    );
}
