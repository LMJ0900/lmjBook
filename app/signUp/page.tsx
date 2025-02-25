'use client';
import { useState } from 'react';
import { supabase } from '@/lib/api/data';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // ✅ 회원가입 후, 유저 ID 가져오기
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      alert('회원가입 후 이메일을 확인하고 로그인하세요.');
      return;
    }

    // ✅ `users` 테이블에 유저 정보 추가
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: userData.user.id, // 올바른 유저 ID 사용
        email: userData.user.email,
        isAdmin: false, // 기본적으로 일반 유저
      },
    ]);

    if (insertError) {
      alert('유저 데이터 저장 실패: ' + insertError.message);
      return;
    }

    alert('회원가입 성공! 로그인하세요.');
    router.push('/login');
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-2 text-black"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-2 text-black"
      />
      <button onClick={handleSignup} className="w-full bg-green-500 text-white p-2 rounded">
        회원가입
      </button>
    </div>
  );
}
