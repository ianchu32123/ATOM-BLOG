import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker"; // 导入faker库
import { createContext } from "react";
import { useContext } from "react";

// 生成随机文章的函数
function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`, // 使用faker生成标题
    body: faker.hacker.phrase(), // 使用faker生成内容
  };
}

const PostContext = createContext();

// 主组件
function App() {
  const [posts, setPosts] = useState(
    () => Array.from({ length: 30 }, () => createRandomPost()) // 初始化30篇随机文章
  );
  const [searchQuery, setSearchQuery] = useState(""); // 搜索查询
  const [isFakeDark, setIsFakeDark] = useState(false); // 是否为假的暗黑模式

  // 派生状态。这些是实际显示的文章
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  // 添加文章的函数
  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  // 清空文章的函数
  function handleClearPosts() {
    setPosts([]);
  }

  // 当`isFakeDark`改变时，我们在HTML元素上切换`fake-dark-mode`类（请参见“元素”开发工具中的内容）。
  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode", isFakeDark);
    },
    [isFakeDark]
  );

  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
      }}
    >
      <section>
        {/* 切换假的暗黑模式按钮 */}
        <button
          onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
          className="btn-fake-dark-mode"
        >
          {isFakeDark ? "☀️" : "🌙"}
        </button>

        {/* 页面头部 */}
        <Header />

        {/* 页面主体 */}
        <Main />

        {/* 文章存档 */}
        <Archive />

        {/* 页面底部 */}
        <Footer />
      </section>
    </PostContext.Provider>
  );
}

// 页面头部组件
function Header() {
  const { onClearPosts } = useContext(PostContext);
  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        {/* 显示搜索结果 */}
        <Results />
        {/* 搜索文章 */}
        <SearchPosts />
        {/* 清空文章按钮 */}
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

// 搜索文章组件
function SearchPosts() {
  const { searchQuery, setSearchQuery } = useContext(PostContext);
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

// 显示搜索结果组件
function Results() {
  const { posts } = useContext(PostContext);
  return <p>🚀 {posts.length} atomic posts found</p>;
}

// 页面主体组件
function Main() {
  return (
    <main>
      {/* 添加文章的表单 */}
      <FormAddPost />
      {/* 文章列表 */}
      <Posts />
    </main>
  );
}

// 文章列表组件
function Posts() {
  return (
    <section>
      <List />
    </section>
  );
}

// 添加文章的表单组件
function FormAddPost() {
  const { onAddPost } = useContext(PostContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // 提交表单时的处理函数
  const handleSubmit = function (e) {
    e.preventDefault();
    if (!body || !title) return;
    onAddPost({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
      />
      <button>Add post</button>
    </form>
  );
}

// 文章列表组件
function List() {
  const { posts } = useContext(PostContext);
  return (
    <ul>
      {posts.map((post, i) => (
        <li key={i}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

// 文章存档组件
function Archive() {
  const { onAddPost } = useContext(PostContext);
  // 生成大量文章
  const [posts] = useState(() =>
    Array.from({ length: 10000 }, () => createRandomPost())
  );

  const [showArchive, setShowArchive] = useState(false);

  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>

      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button onClick={() => onAddPost(post)}>Add as new post</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;
