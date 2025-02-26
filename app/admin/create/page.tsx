'use client';
import { useState } from 'react';
import { supabase } from '@/lib/api/data';
import { useRouter } from 'next/navigation';
import Button from '@/components/button'; // ✅ 버튼 컴포넌트 재사용
import Image from 'next/image';
export default function AddBook() {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [stock, setStock] = useState(0);
  const [sales, setSales] = useState(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleAddBook = async () => {
    if (!name || !author || !image || description.trim() === '') {
      return alert('모든 필드를 입력해주세요.');
    }
  
    const filePath = `books/${Date.now()}-${image.name}`;
    const { error: imageError } = await supabase.storage.from('booksImages').upload(filePath, image);
  
    if (imageError) return alert('이미지 업로드 실패: ' + imageError.message);
  
    const { data } = supabase.storage.from('booksImages').getPublicUrl(filePath);
    if (!data) return alert('이미지 URL 가져오기 실패');
  
    const imageUrl = data.publicUrl;
  
    const { error } = await supabase.from('books').insert([
      {
        name,
        author,
        stock,
        sales,
        description,
        image_url: imageUrl,
      },
    ]);
  
    if (error) {
      console.error(error);
      return alert('상품 추가 실패: ' + error.message);
    }
  
    alert('상품 추가 완료!');
    router.push('/admin');
  };
  

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">📚 상품 추가</h2>

      {previewImage && (
        <div className="flex justify-center mb-4">
          <Image  width={1000} height={1000} src={previewImage || '/default-placeholder.png'} alt="Preview" className="w-40 h-40 rounded-lg shadow-md" onError={(e) => e.currentTarget.src = '/default-placeholder.png'} />
        </div>
      )}

      <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-2 text-black" />
      <input type="text" placeholder="저자" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-2 border rounded mb-2 text-black" />
      <input type="number" placeholder="재고" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="w-full p-2 border rounded mb-2 text-black" />
      <input type="number" placeholder="판매량" value={sales} onChange={(e) => setSales(Number(e.target.value))} className="w-full p-2 border rounded mb-2 text-black" />
      <textarea placeholder="책 설명을 입력하세요" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-2 text-black" rows={3}/>
      <label className="block mb-2 font-semibold">📷 이미지 업로드</label>
      <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded mb-4" />

      <div className="flex justify-between gap-4">
        {/* 뒤로가기 버튼 */}
        <Button func={() => router.back()} color="bg-gray-500">뒤로 가기</Button>

        {/* 추가하기 버튼 */}
        <Button func={handleAddBook} color="bg-blue-500">추가하기</Button>
      </div>
    </div>
  );
}
