'use client'

interface PageBtnProps {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
  }

export default function pageBtn({page, setPage}: PageBtnProps){
    return(<>
        {/* 페이지네이션 버튼 */}
       <div className="flex justify-center gap-4 mt-4">
       <button
         className="px-4 py-2 bg-gray-300 rounded-md"
         disabled={page === 1} // 첫 번째 페이지일 때 비활성화
         onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
       >
         이전 페이지
       </button>
       <span className="text-black text-lg">{page}</span>
       <button
         className="px-4 py-2 bg-blue-500 text-white rounded-md"
         onClick={() => setPage((prev) => prev + 1)}
       >
         다음 페이지
       </button>
     </div>
     </>
    )
}