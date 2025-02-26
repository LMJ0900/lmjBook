'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/api/data';
import classes from '@/style/adminHome.module.css';
import PageBtn from '@/components/pageBtn';
import Button from '@/components/button';
import { useRouter } from 'next/navigation';
import EditBookData from './edit/page';
import AdminGuard from '@/components/adminGuard';
import SearchBar from '@/components/searchBar'
import SortDropdown from '@/components/sortDropdown';
interface BookDataType {
  id: number;
  name: string;
  author: string;
  stock: number;
  sales: number;
  image_url: string;
}

export default function Home() {
  const [bookData, setBookData] = useState<BookDataType[]>([]);
  const [page, setPage] = useState(1);
  const [editingbookId, setEditingbookId] = useState<number | null>(null); // ✅ 수정 중인 상품 ID
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // ✅ 정렬 상태 추가
  const [searchType, setSearchType] = useState("통합검색"); // ✅ 검색 타입 추가
  const itemsPerPage = 10;
  const router = useRouter();
  
   // ✅ 검색 기능 적용
   const handleSearch = async (query: string, type: string) => {
    setSearchQuery(query);
    setSearchType(type);
  };

  useEffect(() => {
    async function fetchProducts() {
      let queryBuilder = supabase.from('books').select('*');
      if (searchQuery.trim() === ""){
        queryBuilder = queryBuilder;
      }
      // ✅ 검색 조건 추가
      if (searchQuery) {
        if (searchType === "통합검색") {
          queryBuilder = queryBuilder.or(`name.ilike.%${searchQuery}%, author.ilike.%${searchQuery}%`);
        } else if (searchType === "제목") {
          queryBuilder = queryBuilder.ilike('name', `%${searchQuery}%`);
        } else if (searchType === "저자") {
          queryBuilder = queryBuilder.ilike('author', `%${searchQuery}%`);
        }
      }

      // ✅ 페이지네이션 적용
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;
      queryBuilder = queryBuilder.range(start, end);

      const { data, error } = await queryBuilder;
      if (error) console.error(error);
      else setBookData(data);
    }
    fetchProducts();
  }, [page, searchQuery, searchType]); // ✅ 검색할 때마다 실행
  useEffect(() => {
    if (sortOrder) {
      const sortedData = [...bookData].sort((a, b) => {
        switch (sortOrder) {
          case 'sales_desc':
            return b.sales - a.sales;
          case 'sales_asc':
            return a.sales - b.sales;
          case 'stock_desc':
            return b.stock - a.stock;
          case 'stock_asc':
            return a.stock - b.stock;
            case 'id_desc':
            return b.id - a.id;
          case 'id_asc':
            return a.id - b.id;
          default:
            return 0;
        }
      });
      setBookData(sortedData);
    }
  }, [sortOrder]);


  // ✅ 삭제 함수 추가
  const handleDelete = async (bookId: number) => {
    const { error } = await supabase.from('books').delete().eq('id', bookId);
    if (error) {
      console.error(error);
      alert('삭제 실패!');
    } else {
      alert('상품 삭제 완료!');
      setBookData((prevData) => prevData.filter((book) => book.id !== bookId)); // ✅ 삭제된 상품 UI에서 제거
    }
  };
  const handleEditClick = (bookId: number) => {
    setEditingbookId((prevId) => (prevId === bookId ? null : bookId));
  };

  const handleClick = () => {
    router.push('/admin/create');
  };

  useEffect(() => {
    async function fetchProducts() {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;

      const { data, error } = await supabase.from('books').select('*').range(start, end);
      if (error) console.error(error);
      else setBookData(data);
    }
    fetchProducts();
  }, [page]);
  const handleUpdateBook = (id: number, updatedName: string, updatedAuthor: string, updatedStock: number, updatedSales: number) => {
    setBookData((prevData) =>
      prevData.map((book) =>
        book.id === id ? { ...book, stock: updatedStock, sales: updatedSales } : book
      )
    );
    setEditingbookId(null); // ✅ 수정 완료 후 수정 모드 종료
  };

  return (
    <AdminGuard>
    <div className="bg-white">
      <h1 className="flex justify-center text-[3rem] pt-[2rem] text-black">상품 목록</h1>
      <div className="flex justify-center pb-[3rem]">
        <div className='w-[30rem] mr-[2rem]'>
        <SearchBar onSearch={handleSearch} />
        </div>
        <SortDropdown onSortChange={setSortOrder} />
        <Button func={handleClick} color="bg-black">책 추가하기</Button>
      </div>
      <ul>
        {bookData.map((book) => (
          <li className={classes.container} key={book.id}>
            <button className="flex mb-[1rem] bg-pink-200 w-[100vw]" onClick={() => router.push(`/admin/books/${book.id}`)}>
            <img className={classes.image} src={book.image_url} alt={book.name} width={200} />
            <div className={classes.block}>
              <p>책 이름: {book.name}</p>
              <p>저자: {book.author}</p>
              <p>판매량: {book.sales}</p>
              <p>재고: {book.stock}</p>
            </div>
            <div className={classes.editContainer}>
            <Button color="bg-blue-500" func={() => handleEditClick(book.id)}>
                    {editingbookId === book.id ? "닫기" : "수정하기"}
                  </Button>
              <Button color="bg-red-500" func={() => handleDelete(book.id)}>삭제하기</Button> {/* ✅ 삭제 버튼 */}
            </div>
            {/* 수정버튼 클릭 시 수정창 나오게 하기*/}
            {editingbookId === book.id && (
              <EditBookData
                bookId={book.id}
                name={book.name}
                author={book.author}
                stock={book.stock}
                sales={book.sales}
                onUpdate={(updatedName, updatedAuthor, updatedStock, updatedSales) =>
                  handleUpdateBook(book.id, updatedName, updatedAuthor, updatedStock, updatedSales)
                }
                showDescription={false}
              />
            )}
            </button>
          </li>
        ))}
      </ul>
      <PageBtn page={page} setPage={setPage} />
    </div>
    </AdminGuard>
  );
}
