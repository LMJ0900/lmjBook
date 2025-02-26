'use client';
import { useState } from 'react';

interface SortDropdownProps {
  onSortChange: (sortOrder: string) => void;
}

export default function SortDropdown({ onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('정렬 기준');

  const sortOptions = [
    { label: '최신 등록순', value: 'id_desc' },
    { label: '오래된 등록순', value: 'id_asc' },
    { label: '판매량 높은순', value: 'sales_desc' },
    { label: '판매량 낮은순', value: 'sales_asc' },
    { label: '재고 많은순', value: 'stock_desc' },
    { label: '재고 적은순', value: 'stock_asc' },
  ];

  const handleSelect = (option: { label: string; value: string }) => {
    setSelectedSort(option.label);
    setIsOpen(false);
    onSortChange(option.value); // ✅ 부모 컴포넌트로 정렬 기준 전달
  };

  return (
    <div className="relative inline-block text-left">
      <button
        className="px-4 py-2 bg-gray-300 text-black rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedSort}
      </button>
      {isOpen && (
        <ul className="absolute left-0 mt-2 bg-white border rounded-md shadow-lg w-48">
          {sortOptions.map((option) => (
            <li
              key={option.value}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
