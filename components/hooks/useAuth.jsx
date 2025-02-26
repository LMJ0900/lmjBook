'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/api/data';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태
  const [isAdmin, setIsAdmin] = useState(false) //관리자 여부


 useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(authData.user);

      // ✅ 관리자 여부 확인
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('isAdmin')
        .eq('id', authData.user.id)
        .single();

      if (!userError && userData?.isAdmin) {
        setIsAdmin(true);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, loading, isAdmin }; // ✅ isAdmin 값 반환
}