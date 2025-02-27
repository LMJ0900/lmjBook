'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/api/data';

interface UserData {
  id: string;
  email: string;
}
interface AuthState {
  user: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>; // 
}

export default function useAuth(): AuthState {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    setUser({
      id: authData.user.id,
      email: authData.user.email ?? "",});

    // ✅ 관리자 여부 확인
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('isAdmin')
      .eq('id', authData.user.id)
      .single();

    setIsAdmin(!userError && userData?.isAdmin);

    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);


  const refreshUser = async (): Promise<void> => {
    await fetchUser();
  };

  return { user, loading, isAdmin, refreshUser }; 
}
