# git 구조
<img src="https://github.com/user-attachments/assets/a5eab18a-130a-4b1e-b4d2-f8bcef3583bd" width="2000rem" height="1000rem">
혼자 작업을 진행하였기 때문에 main브랜치에 바로 커밋을 하며 작업하거나, Trunk-based 전략을 이용하여 git을 진행하여도 괜찮지만, 협업시라고 가정하여 </br>
모듈별로 브랜치를 따로 생성하여 합치는 깃 전략을 세워 보았습니다.</br> </br>

#### git 구조 설명

먼저 main 브랜치에서 Admin 브랜치를 생성하였고 Admin 브랜치에서 AdminPratice라는 브랜치를 생성하였습니다. 그 후 AdminPratice에서 Admin에 대한 전반적인 기능들을 구현하고 crud구현이라는 이름으로 커밋하였습니다.

그 후에 Admin 브랜치로 AdminPratice 브랜치의 내용을 merge하였고 AdminPratice브랜치는 삭제하였습니다. Admin 브랜치에서 Auth 브랜치를 생성하고 Auth 브랜치에서 pratice 브랜치를 생성하여 pratice 브랜치에서 
작업하였습니다.

pratice 브랜치에서 추가적인 기능을 완성하고 skill complite라는 메세지로 커밋하였습니다. 그 후 main에서 만든 test 브랜치에 main과 현재까지 한 작업(pratice 브랜치)를 merge하여 test를 진행하였습니다.

로컬에서 테스트를 진행한 후 test 브랜치에서 buildtest 브랜치를 생성하여 buildtest 브랜치에서 빌드를 위한 테스트를 추가로 진행하고 배포 환경에 맞게 코드를 수정하였습니다. 수정한 내용을 build성공이라는 메세지로 커밋하였습니다.
main 브랜치에서 buildtest의 내용을 merge하고 vercel을 이용하여 main 브랜치의 코드를 배포하였습니다 그 후 hotfix 브랜치를 생성하여 수정점이 있을때마다 hotfix브랜치에서 작업한 뒤 main에서 pull하는 방식으로 깃을 진행하였습니다.




# 해결과제

문제 상황 : 당신은 서점을 온라인 웹 애플리케이션을 개발하고 있습니다. 이 애플리케이션은 상점 주인이 책을 검색하고 상세 정보를 보고 편집하며, 각 책의 판매 수량을 확인할 수 있어야 합니다.

먼저 페이지 작업을 위한 구조를 간단하게 짜보았습니다.
* #### User
1. 로그인 및 회원가입 구현
2. user 아이콘 클릭 시 로그인 상태를 확인하여 발급 쿠키가 있을 시 마이페이지로 이동 없을 시에 로그인 페이지로 이동

* #### Admin(상점 주인)
1. admin 계정으로 로그인 시 admin페이지로 이동
2. 페이지 내에서 도서의 crud를 구현
3. admin 페이지 가드 생성 (일반유저와 비로그인 사용자 접속 제한)

* Model

  웹 페이지내에서 상세정보 수정이 구현되어야 하기 때문에 동적 페이지로 작업했습니다. nextJs를 이용하여 풀스택 애플리케이션을 구현하였고,
supabase를 이용하여 데이터를 관리하고 로그인 시 토큰 관리를 진행하였습니다.
# 구현한 기능
## 책 목록 페이지 구현
### Read
`app/admin/page.tsx`
```
const [page, setPage] = useState(1);
const itemsPerPage = 10;

useEffect(() => {
    async function fetchProducts() {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;
      const { data, error } = await supabase.from('books').select('*').range(start, end);
      if (error) console.error(error);
      else setBookData(data);
    }
    fetchProducts();
  }, [page]);
```
해당 코드는 상품을 supabase에서 불러오는 코드입니다. page값에 따라 가져올 데이터의 시작과 끝 인덱스를 설정합니다. (예시로 page값이 1인 경우 0\~9번까지의 데이터를 가져옵니다.) <br/>
비동기로 supabase에서 books 테이블에 모든 컬럼을 조회하고 start값에서 end 까지의 데이터를 가져옵니다.useEffect 훅을 사용하여 page의 상태가 변경 될 때마다 fetchProduct 함수를 실행하도록 설정하였습니다. <br/>
이를 통해 1페이지라면 0\~9번 데이터를 2페이지로 넘어갈 시 함수가 재실행되며 다시 읽고 10~19의 데이터를 불러올 수 있습니다.

## 상세 정보 페이지
`app/admin/books/[id]`
```
export default function BookDetail() {
  const [book, setBook] = useState<BookDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { id } = useParams(); 

  useEffect(() => {
    async function fetchBook() {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
      } else {
        setBook(data);
        setLoading(false);
      }
    }
    if (id) fetchBook();
  }, [id]);

  if (loading) return <p className="text-center">로딩 중...</p>;
  if (!book) return <p className="text-center">해당 상품을 찾을 수 없습니다.</p>;

  const handleUpdateBook = (updatedName: string, updatedAuthor: string, updatedStock: number, updatedSales: number, updatedDescription?: string) => {
    setBook((prevBook) => prevBook ? { ...prevBook, name: updatedName, author: updatedAuthor, stock: updatedStock, sales: updatedSales, description: updatedDescription } : null);
    setIsEditing(false);
  };
```
id값을 키값으로 지정하여 동적 라우팅을 구현하였습니다. <br/>
books table에서 id에 맞는 데이터를 선택하여 불러옵니다. 만약 error시에 에러를 출력하고 성공 시에 데이터를 불러옵니다 두개 다 마찬가지로 로딩을 상태값을 변경하여 로딩중인지를 표시하게 하였습니다.
이 페이지 내에서 책 정보 수정이 가능합니다 이전의 데이터를 받아서 보여주고 수정 업데이트 사항만 받아서 데이터를 변경합니다.

### Edit
`app/component/editBookdata.tsx`
```
export default function EditBookData({ bookId, name, author, stock, sales, description, onUpdate, showDescription = false }: EditBookDataProps) {
  const [newName, setNewName] = useState(name);
  const [newAuthor, setNewAuthor] = useState(author);
  const [newStock, setNewStock] = useState(stock);
  const [newSales, setNewSales] = useState(sales);
  const [newDescription, setNewDescription] = useState(description || "");

  const handleUpdate = async () => {
    const updateData: Partial<EditBookDataProps> = {
      name: newName,
      author: newAuthor,
      stock: newStock,
      sales: newSales,
    };
    if (showDescription) {
      updateData.description = newDescription; // ✅ 상세 페이지에서만 설명 수정 가능
    }
    const { error } = await supabase
      .from('books')
      .update(updateData)
      .eq('id', bookId);

    if (error) {
      console.error(error);
      alert('상품 정보 수정 실패!');
    } else {
      alert('상품 정보 수정 완료!');
      onUpdate(newName, newAuthor, newStock, newSales, newDescription); // ✅ 수정 후 부모(Home) 컴포넌트의 상태 업데이트
    }
  };
```
props로 책에 대한 데이터를 받고 추가로 수정 상태를 알려주는 변수와 설명 수정가능 여부를 받습니다(상세 페이지 내에서만 수정이 가능하게 설정하였습니다. admin 메인 페이지에서는 간단한 수정을 빠르게 하기 위해 descirbtion을 보여주지 않고 수정 또한 불가능합니다.) <br />
new변수이름(newName 등등)에 수정값을 저장하였습니다. 그 후 supabese에 저장된 값을 참고하여 수정하도록 코드를 작성하였습니다. error시에는 "상품 정보 수정 실패!" 메세지를 출력합니다.


`app/admin/page.tsx`
```
const handleEditClick = (bookId: number) => {
    setEditingbookId((prevId) => (prevId === bookId ? null : bookId));
  };

 <div className={classes.editContainer}>
            <Button color="bg-blue-500" func={() => handleEditClick(book.id)}>
                    {editingbookId === book.id ? "닫기" : "수정하기"}
                  </Button>
              <Button color="bg-red-500" func={() => handleDelete(book.id)}>삭제하기</Button>
            </div>
            {/* 수정버튼 클릭 시 수정창 나오게 하기*/}
            {editingbookId === book.id && (
              <div
              className="p-4 border border-gray-300 rounded-md"
              onClick={(event) => event.stopPropagation()} // ✅ 이벤트 버블링 방지
            >
              <EditBookData
                bookId={book.id}
                name={book.name}
                author={book.author}
                stock={book.stock}
                sales={book.sales}
                onUpdate={(updatedName, updatedAuthor, updatedStock, updatedSales) =>
                  handleUpdateBook(book.id, updatedName, updatedAuthor, updatedStock, updatedSales)
                }
                showDescription={false}
              />
               </div>
            )}
```
button이 중복적으로 사용되기 때문에 Button 컴포넌트를 만들어서 버튼을 재사용하였고 handleEditClick 함수를 이용하여 수정중일때는 닫기로 버튼 이름을 바꿔주었습니다.
선택한 데이터의 값을 이전에 보여드렸던 editBookData 컴포넌트로 props로 전달하며 editBookData 컴포넌트에서 수정합니다. 이 경우 description을 보여주지 않기 때문에 showDescription={false}를 전달하여
main페이지에서는 description값은 변경이 불가하게 작업하였습니다.

## 책 추가/제거
### Create
`app/admin/create/page.tsx`
```
const handleAddBook = async () => {
    if (!name || !author || !image || description.trim() === '') {
      return alert('모든 필드를 입력해주세요.');
    }
  
    const filePath = `books/${Date.now()}-${image.name}`;
    const { error: imageError } = await supabase.storage.from('booksImages').upload(filePath, image);
  
    if (imageError) return alert('이미지 업로드 실패: ' + imageError.message);
  
    const { data } = supabase.storage.from('booksImages').getPublicUrl(filePath);
    if (!data) return alert('이미지 URL 가져오기 실패');
  
    const imageUrl = data.publicUrl;
  
    const { error } = await supabase.from('books').insert([
      {
        name,
        author,
        stock,
        sales,
        description,
        image_url: imageUrl,
      },
    ]);
  
    if (error) {
      console.error(error);
      return alert('상품 추가 실패: ' + error.message);
    }
  
    alert('상품 추가 완료!');
    router.push('/admin');
  };
return(
...
<input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-2 text-black" />
      <input type="text" placeholder="저자" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-2 border rounded mb-2 text-black" />
      <input type="number" placeholder="재고" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="w-full p-2 border rounded mb-2 text-black" />
      <input type="number" placeholder="판매량" value={sales} onChange={(e) => setSales(Number(e.target.value))} className="w-full p-2 border rounded mb-2 text-black" />
      <textarea placeholder="책 설명을 입력하세요" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-2 text-black" rows={3}/>
      <label className="block mb-2 font-semibold">📷 이미지 업로드</label>
      <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded mb-4" />
...
)
```
먼저 if문을 통해 모든 변수가 입력 되었는 지 체크하고 입력하지 않은 변수가 있을 시 함수에서 탈출하고 "모든 필드를 입력해주세요" 메세지를 출력하였습니다. <br/>
그 후 supabase의 books 테이블에 "현재 시간 밀리초(고유성) + 책 제목"을 이름으로 하여 이미지를 booksImage 버킷에 저장합니다. <br/>
업로드 실패시에 함수를 탈출하며 "이미지 업로드 실패"를 출력합니다. 그리고 bookImage 버킷에서 만든 이미지 url을 통해 이미지를 가져옵니다. 실패 시 "이미지 URL 가져오기 실패"를 출력합니다. <br />
그 후 input 태그에 입력한 값을 받아 supabase에 books 테이블에 저장합니다. 이때 만든 imageurl주소를 저장하여 나중에 버킷에서 이미지를 가져오는 것이 가능하게 합니다. <br />
에러 시에는 "상품 추가 실패: + error message"를 출력하고 성공 시 "상품 추가 완료!"를 출력 후 admin 페이지로 라우팅합니다.

### Delete
`app/admin/page.tsx`
```
 const handleDelete = async (bookId: number) => {
    const { error } = await supabase.from('books').delete().eq('id', bookId);
    if (error) {
      console.error(error);
      alert('삭제 실패!');
    } else {
      alert('상품 삭제 완료!');
      setBookData((prevData) => prevData.filter((book) => book.id !== bookId)); 
    }
  };
```
제거함수 코드입니다. bookId를 통해 데이터를 검색하고 books 테이블에서 해당 데이터를 제거합니다. 에러 시 "삭제 실패" 메세지를 출력하고 성공 시 "상품 삭제 완료!" 메세지를 출력합니다 <br/>
성공 시 filter메서드를 이용하여 선택한 데이터와 다른 id값을 가진 데이터만 새롭게 배열로 만들어 출력합니다. (ui에 삭제된 책 반영)

## Admin Guard
`supabase의 sql editor에 입력한 sql문`
```
UPDATE users SET "isAdmin" = true WHERE email = '지정할 계정 이메일';
```
`app/component/adminGuard`
```
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
        router.push('/'); // // ✅ 일반 사용자는 홈으로 이동
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
```
먼저 회원가입 된 계정 중 관리자 계정을 supabase 사이트에서 sql문을 입력하여 지정하였습니다. <br/>
checkAdmin 함수를 비동기로 만들어 supabese에서 유저 정보를 가져와서 비로그인 시에는 로그인 창으로 라우팅하고 유저 계정의 경우 "관리자 계정이 아닙니다" 메세지를 출력한 뒤 홈으로 라우팅합니다.<br/>
Admin 계정일 시 isAdmin 상태를 true로 변경하여 AdminGuard 컴포넌트로 감싼 내용들을 보여줍니다. ui 깜빡임 방지를 위해 비동기 작업동안 isAdmin이 false인 경우 "관리자 인증중.." 화면을 보여줍니다.

## Search
`app/admin/page.tsx`
```
export default function Home() {
...
const handleSearch = async (query: string, type: string) => {
    setSearchQuery(query);
    setSearchType(type);
  };
...
return(...
<SearchBar onSearch={handleSearch} />
...)
}
```

`app/component/searchBar.tsx`
```
export default function SearchBar({ onSearch }: { onSearch: (query: string, type: string) => void }) {
    const [searchType, setSearchType] = useState("통합검색");
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);


    const searchOptions = ["통합검색", "제목", "저자"];
    

     const handleSearch = () => {
        if (searchQuery.trim() === "") {
            onSearch("",''); // ✅ 검색어가 비어있으면 전체 조회 실행
        } else {
            onSearch(searchQuery, searchType);
        }
    };
    useEffect(() => {
        if (searchQuery.trim() === "") {
            onSearch("", '');
        }
    }, [searchQuery]);
return (
        <div className={classes.searchBar}>
            {/* 검색 유형 드롭다운 */}
            <div className={classes.dropdown}>
                <button className={classes.dropdownBtn} type="button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {searchType} <span className="arrow">▼</span>
                </button>
                {dropdownOpen && (
                    <ul className={classes.dropdownMenu}>
                        {searchOptions.map((option, index) => (
                            <li key={index} className={classes.dropdownItem}
                                onClick={() => {
                                    setSearchType(option);
                                    setDropdownOpen(false);
                                }}>
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 구분선 */}
            <span className={classes.divider}>|</span>

            {/* 검색 입력 필드 */}
            <input
                type="text"
                className={classes.searchInput}
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            {/* 검색 아이콘 버튼 */}
            <button className={classes.searchBtn} onClick={handleSearch}>
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
    );
}
```
searchType 상태 초기값을 '통합검색'으로 지정하여 필터 초기값을 통합검색으로 지정하였고 클릭 시 dropdownOpen 상태가 false에서 true로 변경되면서 searchOptions에 있는 검색 필터를 드롭다운으로 보여주며
옵션 선택시에 searchType을 false로 바꿔 드롭다운 메뉴를 닫아줍니다. <br/>
input 창에 입력한 텍스트를 searchQuery에 저장하고 사용자가 엔터키를 누르면 handleSearch 함수를 실행합니다. handleSearch 함수에서 만약 검색어가 비어있으면 전체 조회를 실시하였고<br/>
아닐 시에는 부모 컴포넌트의 handleSerch를 호출하여 searchQuery(검색어) searchType(ex : 통합검색)을 전달합니다.<br/>
그 후 부모 컴포넌트에서 받은 검색어와 검색 유형을 supabase에서 데이터를 가져와 화면에 표시합니다.

