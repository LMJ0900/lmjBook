'use client';
import { useState } from 'react';
import { supabase } from '@/lib/api/data';

export default function AddBook() {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [stock, setStock] = useState(0);
  const [sales, setSales] = useState(0);
  const [image, setImage] = useState<File | null>(null);

  const handleAddBook = async () => {
    if (!name || !author || !image) return alert('모든 필드를 입력해주세요.');


    ///이미지 파일 업로드
    const filePath = `books/${Date.now()}-${image.name}`;
    const { data: imageData, error: imageError } = await supabase
      .storage
      .from('booksImages')
      .upload(filePath, image);
    if (imageError) return alert('이미지 업로드 실패: ' + imageError.message);
     // 2️⃣ 업로드된 이미지의 URL 가져오기
     const { data: publicURL } = supabase
     .storage
     .from('booksImages')
     .getPublicUrl(filePath);

   if (!publicURL.publicUrl) return alert('이미지 URL 가져오기 실패');

   // 3️⃣ 데이터베이스에 상품 정보 저장
   const { error } = await supabase.from('books').insert([
     {
       name,
       author,
       stock,
       sales,
       image_url: publicURL.publicUrl, // 이미지 URL을 DB에 저장
     },
   ]);

   if (error) console.error(error);
   else alert('상품 추가 완료!');
 };
  return (
    <div>
      <h2>상품 추가</h2>
      <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="저자" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <input type="number" placeholder="재고" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
      <input type="number" placeholder="판매량" value={sales} onChange={(e) => setSales(Number(e.target.value))} />
      <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <button onClick={handleAddBook}>추가</button>
    </div>
  );
}
