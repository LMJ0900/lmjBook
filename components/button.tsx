'use client';
import { MouseEvent } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  color: string;
  func: (event: MouseEvent<HTMLButtonElement>) => void; // ✅ 이벤트를 전달받음
}

export default function Button({ children, color, func }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 ${color} text-white rounded-md`}
      onClick={(event) => {
        event.stopPropagation(); // ❌ 상세 페이지로 이벤트 전파 방지
        func(event); // ✅ 전달받은 함수 실행
      }}
    >
      {children}
    </button>
  );
}
