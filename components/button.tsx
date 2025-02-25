export default function button({ children, color, func }: { children: React.ReactNode; color: string; func?: () => void;}){
    return(
        <button onClick={func} className={`px-4 py-2 ${color} text-white rounded-md`}>{children}</button>
    )
}