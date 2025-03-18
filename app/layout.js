import "@/style/globals.css";
import UserWrapper from "@/components/userWrapper";
export const metadata = {
  title: "lmj book",
  description: "이민재의 서점 사이트입니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserWrapper>{children}</UserWrapper> {/*어드민에서 헤더 안보이게 관리 */}
      </body>
    </html>
  );
}
