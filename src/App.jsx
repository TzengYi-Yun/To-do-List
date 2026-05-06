import { useState, useEffect } from 'react';
import './App.css'; // 引入剛剛建立的 CSS

function App() {
  // --- 邏輯保持不變 ---
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('my-todo-list');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('my-todo-list', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (inputValue.trim() === '') return;
    // 這次我們存物件，加上 timestamp 當作 key
    const newTodo = { id: Date.now(), text: inputValue.trim() };
    setTodos([newTodo, ...todos]); // 新增的排在最上面
    setInputValue('');
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddTodo();
  };

  // --- UI 渲染部分 ---
  return (
    <div style={styles.background}>
      <div style={styles.wrapper}>
        <header style={styles.header}>
          <h1 style={styles.title}>Task Master</h1>
          <p style={styles.subtitle}>你的高效待辦清單</p>
        </header>

        <div style={styles.inputContainer}>
          <input 
            type="text"
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="✍️ 新增一項挑戰..."
            style={styles.input}
          />
          <button onClick={handleAddTodo} style={styles.addButton}>
            新增
          </button>
        </div>

        <div style={styles.listContainer}>
          {todos.length > 0 ? (
            <ul style={styles.list}>
              {todos.map((todo) => (
                <li key={todo.id} style={styles.listItem}>
                  <span style={styles.todoText}>{todo.text}</span>
                  <button 
                    onClick={() => handleDelete(todo.id)} 
                    style={styles.deleteButton}
                    title="刪除項目"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div style={styles.emptyState}>
              ☕ 全都完成了！休息一下吧。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 現代感樣式定義 (CSS-in-JS) ---
const styles = {
  background: {
    minHeight: '100vh',
    padding: '40px 20px',
    boxSizing: 'border-box',
  },
  wrapper: {
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)', // 柔和陰影
    padding: '30px',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #eee',
    paddingBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    color: '#333',
    fontWeight: '700',
  },
  subtitle: {
    margin: '5px 0 0 0',
    color: '#888',
    fontSize: '14px',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
  },
  input: {
    flex: 1,
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  // 注意：行內樣式不支援 :focus，一般會配合 CSS 檔案或 library
  addButton: {
    padding: '0 20px',
    backgroundColor: '#4e73df', // 現代藍色
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  listContainer: {
    marginTop: '10px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: '8px',
    marginBottom: '10px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    // 模仿 hover 效果可以在外部 CSS 寫
  },
  todoText: {
    fontSize: '16px',
    color: '#444',
    wordBreak: 'break-all', // 防止長文字撐破介面
  },
  deleteButton: {
    backgroundColor: 'transparent',
    color: '#ff6b6b',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0 5px',
    marginLeft: '10px',
    lineHeight: 1,
  },
  emptyState: {
    textAlign: 'center',
    color: '#aaa',
    padding: '40px 0',
    fontStyle: 'italic',
  }
};

export default App;