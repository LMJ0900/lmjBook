'use client';
import { useState } from 'react';
import { supabase } from '@/lib/api/data';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // 로그인 성공 후 사용자 정보 가져오기
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('isAdmin')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      alert('관리자 여부 확인 실패');
      return;
    }

    if (userData?.isAdmin) {
      alert('관리자로 로그인 성공!');
      router.push('/admin'); // ✅ 관리자 페이지로 이동
    } else {
      alert('일반 유저로 로그인되었습니다.');
      router.push('./'); // ✅ 일반 유저는 대시보드로 이동
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">로그인</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded">
        로그인
      </button>
      <a href="/signUp">회원가입</a>
    </div>
  );
}