export const metadata = {
  title: "rgt Admin",
  description: "어드민 페이지입니다.",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
