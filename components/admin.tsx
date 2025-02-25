import AdminGuard from '@/components/adminGuard';

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="p-6">
        <h1 className="text-3xl font-bold">관리자 페이지</h1>
        <p>이곳은 관리자만 접근할 수 있습니다.</p>
      </div>
    </AdminGuard>
  );
}