'use client'
import classes from "@/style/mainHeader.module.css"
import { useEffect } from "react";
import SearchBar from "./searchBar";

function ImportIcon(){ //아이콘을 가져오는 함수
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://kit.fontawesome.com/a74d5e1b24.js";
        script.crossOrigin = "anonymous";
        document.body.appendChild(script);
    }, []);
}
export default function MainHeader(){
    ImportIcon()
    return(
        <>
            <nav className={classes.header}>
                <div className={classes.home}>
                    <a href="#" className={classes.homeBtn}>
                        <i className="fa-solid fa-book-open"></i>
                        <h2>rgtBook</h2>
                    </a>
                </div>
                <form className="w-[50rem] flex items-center" action="">
                    <SearchBar></SearchBar>
                </form>
                <ul className={classes.icon}>
                    <li>
                        <a href="#">
                            <i className="fa-solid fa-user"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fa-solid fa-bell"></i>
                        </a>
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