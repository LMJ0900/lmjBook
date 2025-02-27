'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/api/data';
import classes from '@/style/adminHome.module.css';
import PageBtn from '@/components/pageBtn';
import Button from '@/components/button';
import { useRouter } from 'next/navigation';
import EditBookData from '../../components/editBookdata';
import AdminGuard from '@/components/adminGuard';
import SearchBar from '@/components/searchBar';
import SortDropdown from '@/components/sortDropdown';
import Image from 'next/image';
import LogoutButton from '@/components/logout';

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
  const [loading, setLoading] = useState(true);
  const [editingbookId, setEditingbookId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('id_desc'); // ✅ 기본 정렬: 최신순
  const [searchType, setSearchType] = useState('통합검색');
  const itemsPerPage = 10;
  const router = useRouter();

  // ✅ 검색 기능 적용
  const handleSearch = async (query: string, type: string) => {
    setSearchQuery(query);
    setSearchType(type);
    setPage(1); // 검색 시 1페이지로 이동
    window.scrollTo(0, 0);
  };

  // ✅ 정렬 변경 시 1페이지로 이동 및 맨 위로 이동
  const handleSortChange = (order: string) => {
    setSortOrder(order);
    setPage(1);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      let queryBuilder = supabase.from('books').select('*');

      if (searchQuery.trim() !== '') {
        if (searchType === '통합검색') {
          queryBuilder = queryBuilder.or(`name.ilike.%${searchQuery}%, author.ilike.%${searchQuery}%`);
        } else if (searchType === '제목') {
          queryBuilder = queryBuilder.ilike('name', `%${searchQuery}%`);
        } else if (searchType === '저자') {
          queryBuilder = queryBuilder.ilike('author', `%${searchQuery}%`);
        }
      }

      // ✅ Supabase에서 직접 정렬 적용
      if (sortOrder) {
        const [column, direction] = sortOrder.split('_');
        queryBuilder = queryBuilder.order(column, { ascending: direction === 'asc' });
      }

      // ✅ 페이지네이션 적용
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;
      queryBuilder = queryBuilder.range(start, end);

      const { data, error } = await queryBuilder;
      if (error) console.error(error);
      else setBookData(data);

      setLoading(false);
    }
    fetchProducts();
  }, [searchQuery, searchType, page, sortOrder]); // ✅ 검색, 정렬, 페이지 변경 시 실행

  // ✅ 삭제 함수 추가
  const handleDelete = async (bookId: number) => {
    setLoading(true);
    const { error } = await supabase.from('books').delete().eq('id', bookId);
    if (error) {
      console.error(error);
      alert('삭제 실패!');
    } else {
      alert('상품 삭제 완료!');
      setBookData((prevData) => prevData.filter((book) => book.id !== bookId));
    }
    setLoading(false);
  };

  const handleEditClick = (bookId: number) => {
    setEditingbookId((prevId) => (prevId === bookId ? null : bookId));
  };

  const handleClick = () => {
    router.push('/admin/create');
  };

  return (
    <AdminGuard>
      <div className="bg-white">
        <h1 className="flex justify-center text-[3rem] pt-[2rem] text-black">📚 상품 목록</h1>
        <div className="flex justify-center pb-[3rem]">
          <div className="w-[30rem] mr-[2rem]">
            <SearchBar onSearch={handleSearch} />
          </div>
          <SortDropdown onSortChange={handleSortChange} />
          <Button func={handleClick} color="bg-black">
            책 추가하기
          </Button>
          <LogoutButton />
        </div>

        {loading ? (
          <p className="text-center text-xl font-bold text-gray-600">⏳ 로딩 중...</p>
        ) : (
          <ul>
            {bookData.map((book) => (
              <li className={classes.container} key={book.id}>
                <button
                  className="flex mb-[1rem] bg-pink-200 w-[100vw]"
                  onClick={() => router.push(`/admin/books/${book.id}`)}
                >
                  <Image
                    className={classes.image}
                    src={book.image_url || `/default-placeholder.png`}
                    alt={book.name}
                    width={200}
                    height={800}
                    onError={(e) => (e.currentTarget.src = '/default-placeholder.png')}
                  />
                  <div className={classes.block}>
                    <p>📖 책 이름: {book.name}</p>
                    <p>✍ 저자: {book.author}</p>
                    <p>📈 판매량: {book.sales}</p>
                    <p>📦 재고: {book.stock}</p>
                  </div>
                  <div className={classes.editContainer}>
                    <Button color="bg-blue-500" func={() => handleEditClick(book.id)}>
                      {editingbookId === book.id ? '닫기' : '수정하기'}
                    </Button>
                    <Button color="bg-red-500" func={() => handleDelete(book.id)}>
                      삭제하기
                    </Button>
                  </div>
                  {editingbookId === book.id && (
                    <div
                      className="p-4 border border-gray-300 rounded-md"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <EditBookData
                        bookId={book.id}
                        name={book.name}
                        author={book.author}
                        stock={book.stock}
                        sales={book.sales}
                        onUpdate={(updatedName, updatedAuthor, updatedStock, updatedSales) =>
                          setBookData((prevData) =>
                            prevData.map((book) =>
                              book.id === book.id
                                ? { ...book, stock: updatedStock, sales: updatedSales }
                                : book
                            )
                          )
                        }
                        showDescription={false}
                      />
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
        <PageBtn page={page} setPage={setPage} />
      </div>
    </AdminGuard>
  );
}
