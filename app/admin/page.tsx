'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/api/data';
import classes from '@/style/adminHome.module.css';
import PageBtn from '@/components/pageBtn';
import Button from '@/components/button';
import { useRouter } from 'next/navigation';
import EditBookData from './edit/page';

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
  const itemsPerPage = 10;
  const router = useRouter();

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
    <div className="bg-white">
      <h1 className="flex justify-center text-[3rem] mt-[3rem] text-black">상품 목록</h1>
      <div className="flex justify-center ml-[20rem]">
        <Button func={handleClick} color="bg-black">책 추가하기</Button>
      </div>
      <ul>
        {bookData.map((book) => (
          <li className={classes.container} key={book.id}>
            <img className={classes.image} src={book.image_url} alt={book.name} width={200} />
            <div className={classes.block}>
              <p>책 이름: {book.name}</p>
              <p>저자: {book.author}</p>
              <p>판매량: {book.sales}</p>
              <p>재고: {book.stock}</p>
            </div>
            <div className={classes.editContainer}>
            <Button color="bg-blue-500" func={() => setEditingbookId(book.id)}>수정하기</Button> {/* ✅ 수정 버튼 */}
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
              />
            )}
          </li>
        ))}
      </ul>
      <PageBtn page={page} setPage={setPage} />
    </div>
  );
}
