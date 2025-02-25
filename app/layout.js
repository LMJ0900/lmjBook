import "@/style/globals.css";
import Header from "@/components/mainHeader"
export const metadata = {
  title: "rgt book",
  description: "과제제출 서점 사이트입니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header></Header>
        {children}
      </body>
    </html>
  );
}
