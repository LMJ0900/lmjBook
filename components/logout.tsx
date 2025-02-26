'use client';
import { supabase } from '@/lib/api/data';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('로그아웃 실패: ' + error.message);
      return;
    }
    alert('로그아웃 되었습니다.');
    router.push('/login'); // ✅ 로그인 페이지로 이동
  };

  return (
    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md">
      로그아웃
    </button>
  );
}
