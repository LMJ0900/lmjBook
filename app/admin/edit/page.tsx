'use client';
import { useState } from 'react';
import { supabase } from '@/lib/api/data';

interface EditBookDataProps {
  bookId: number;
  name: string;
  author: string;
  stock: number;
  sales: number;
  description?: string;
  onUpdate: (updatedName: string, updatedAuthor: string, updatedStock: number, updatedSales: number, updatedDescription?: string) => void;
  showDescription?: boolean;
}

export default function EditBookData({ bookId, name, author, stock, sales, description, onUpdate, showDescription = false }: EditBookDataProps) {
  const [newName, setNewName] = useState(name);
  const [newAuthor, setNewAuthor] = useState(author);
  const [newStock, setNewStock] = useState(stock);
  const [newSales, setNewSales] = useState(sales);
  const [newDescription, setNewDescription] = useState(description || "");

  const handleUpdate = async () => {
    const updateData: any = { name: newName, author: newAuthor, stock: newStock, sales: newSales };
    if (showDescription) {
      updateData.description = newDescription; // ✅ 상세 페이지에서만 설명 수정 가능
    }
    const { error } = await supabase
      .from('books')
      .update({ name: newName, author: newAuthor, stock: newStock, sales: newSales })
      .eq('id', bookId);

    if (error) {
      console.error(error);
      alert('상품 정보 수정 실패!');
    } else {
      alert('상품 정보 수정 완료!');
      onUpdate(newName, newAuthor, newStock, newSales); // ✅ 수정 후 부모(Home) 컴포넌트의 상태 업데이트
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h2 className="text-lg font-semibold mb-2">상품 수정</h2>
      <input
        type="text"
        placeholder="책 제목"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="block w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        placeholder="저자"
        value={newAuthor}
        onChange={(e) => setNewAuthor(e.target.value)}
        className="block w-full p-2 border rounded mb-2"
      />
      <input
        type="number"
        placeholder="판매량"
        value={newSales}
        onChange={(e) => setNewSales(Number(e.target.value))}
        className="block w-full p-2 border rounded mb-2"
      />
      <input
        type="number"
        placeholder="재고"
        value={newStock}
        onChange={(e) => setNewStock(Number(e.target.value))}
        className="block w-full p-2 border rounded mb-2"
      />
       {/* ✅ 상세 페이지에서만 설명 수정 가능 */}
       {showDescription && (
        <textarea
          placeholder="책 설명"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="block w-full p-2 border rounded mb-2"
        />
      )}
      <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        수정 완료
      </button>
    </div>
  );
}
