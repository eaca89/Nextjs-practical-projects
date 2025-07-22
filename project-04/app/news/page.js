import Link from "next/link";

export default function NewsPage() {
  const dummyNews = [
    { id: "1", title: "Breaking New One" },
    { id: "2", title: "Latest Update Two" },
    { id: "3", title: "Third News Item" },
  ];

  return (
    <>
      <h1>News Page</h1>
      <ul>
        {dummyNews.map((news) => (
          <li key={news.id}>
            <Link href={`/news/${news.id}`}>{news.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
