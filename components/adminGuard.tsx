'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/api/data';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData?.user) {
        router.push('/login'); // ✅ 로그인되지 않은 경우 로그인 페이지로 이동
        return;
      }

      // 관리자 여부 확인
      const { data, error: adminError } = await supabase
        .from('users')
        .select('isAdmin')
        .eq('id', userData.user.id)
        .single();

      if (adminError || !data?.isAdmin) {
        alert('관리자 계정이 아닙니다.');
        router.push('/'); // ✅ 일반 사용자는 홈으로 이동
        return;
      }

      setIsAdmin(true);
    }

    checkAdmin();
  }, []);

  if (!isAdmin) {
    return <p>관리자 인증 중...</p>;
  }

  return <>{children}</>;
}
