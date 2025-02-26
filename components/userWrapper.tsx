"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/mainHeader";

export default function userWrapper({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false); // 클라이언트에서 실행됨을 감지
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true); // 클라이언트에서 실행될 때 true로 변경
  }, []);

  if (!isClient) {
    return null; // 서버에서는 아무것도 렌더링하지 않음 (Hydration 방지)
  }

  return (
    <>
      {!pathname.startsWith("/admin") && <Header />}
      {children}
    </>
  );
}
