'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/api/data';
import Button from '@/components/button';
import EditBookData from '../../../../components/editBookdata';
import Image from 'next/image';
interface BookDataType {
  id: number;
  name: string;
  author: string;
  stock: number;
  sales: number;
  description? : string;
  image_url: string;
}

export default function BookDetail() {
  const [book, setBook] = useState<BookDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { id } = useParams(); 

  useEffect(() => {
    async function fetchBook() {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
      } else {
        setBook(data);
        setLoading(false);
      }
    }
    if (id) fetchBook();
  }, [id]);

  if (loading) return <p className="text-center">로딩 중...</p>;
  if (!book) return <p className="text-center">해당 상품을 찾을 수 없습니다.</p>;

  const handleUpdateBook = (updatedName: string, updatedAuthor: string, updatedStock: number, updatedSales: number, updatedDescription?: string) => {
    setBook((prevBook) => prevBook ? { ...prevBook, name: updatedName, author: updatedAuthor, stock: updatedStock, sales: updatedSales, description: updatedDescription } : null);
    setIsEditing(false);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
    {!isEditing ? (
      <div>
        <h1 className="text-3xl font-bold mb-4 text-black">{book.name}</h1>
        <Image src={book.image_url || '/default-placeholder.png'} alt={book.name}  className="w-80 h-auto mx-auto mb-4" width={1000} height={1000}  onError={(e) => e.currentTarget.src = '/default-placeholder.png'}/>
        <p className='text-black'><strong>책 소개:</strong> {book.description}</p>
        <p className='text-black'><strong>저자:</strong> {book.author}</p>
        <p className='text-black'><strong>판매량:</strong> {book.sales}</p>
        <p className='text-black'><strong>재고:</strong> {book.stock}</p>
        <div className="mt-6 flex gap-4">
        <Button func={() => router.push('/admin')} color="bg-gray-500">뒤로 가기</Button> {/* ✅ 뒤로 가기 버튼 */}
          <Button func={() => setIsEditing(true)} color="bg-blue-500">수정하기</Button>
        </div>
      </div>
    ) : (
      <EditBookData
      bookId={book.id}
      name={book.name}
      author={book.author}
      stock={book.stock}
      sales={book.sales}
      description={book.description}
      onUpdate={handleUpdateBook}
      showDescription={true}
      />
    )}
  </div>
  ) ;
}
