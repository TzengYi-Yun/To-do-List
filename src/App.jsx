import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. 狀態管理
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('pro-todo-list');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  // 2. 持久化儲存
  useEffect(() => {
    localStorage.setItem('pro-todo-list', JSON.stringify(todos));
  }, [todos]);

  // 3. 邏輯處理函式
  const handleAddTodo = () => {
    if (inputValue.trim() === '') return;
    const newTodo = { id: Date.now(), text: inputValue.trim(), completed: false };
    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // 4. 計算衍生資料 (Derived State)
  const completedCount = todos.filter(t => t.completed).length;
  const progress = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

  // 根據篩選條件過濾顯示的清單
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div style={styles.background}>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>🚀 Task Master Pro</h2>

        {/* 進度條部分 */}
        <div style={styles.progressContainer}>
          <div style={styles.progressText}>
            <span>完成進度</span>
            <span>{progress}%</span>
          </div>
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBarFill, width: `${progress}%` }} />
          </div>
        </div>
        
        {/* 輸入區域 */}
        <div style={styles.inputContainer}>
          <input 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="今天要做什麼？"
            style={styles.input}
          />
          <button onClick={handleAddTodo} style={styles.addButton}>新增</button>
        </div>

        {/* 篩選控制列 */}
        <div style={styles.filterBar}>
          <div style={styles.filterButtons}>
            {['all', 'active', 'completed'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  ...styles.filterBtn,
                  color: filter === f ? '#4e73df' : '#888',
                  borderBottom: filter === f ? '2px solid #4e73df' : '2px solid transparent'
                }}
              >
                {f === 'all' ? '全部' : f === 'active' ? '進行中' : '已完成'}
              </button>
            ))}
          </div>
          <button onClick={clearCompleted} style={styles.clearBtn}>清除已完成</button>
        </div>

        {/* 任務清單 */}
        <ul style={styles.list}>
          {filteredTodos.map((todo) => (
            <li key={todo.id} style={styles.listItem}>
              <div 
                onClick={() => toggleComplete(todo.id)}
                style={{
                  ...styles.todoText,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#bbb' : '#333'
                }}
              >
                <input type="checkbox" checked={todo.completed} readOnly style={styles.checkbox} />
                {todo.text}
              </div>
              <button onClick={() => handleDelete(todo.id)} style={styles.deleteButton}>✕</button>
            </li>
          ))}
        </ul>

        {filteredTodos.length === 0 && (
          <p style={styles.emptyMsg}>目前沒有符合條件的任務 ☕</p>
        )}
      </div>
    </div>
  );
}

// 樣式表
const styles = {
  background: { minHeight: '100vh', padding: '40px 20px', backgroundColor: '#f0f2f5', fontFamily: 'system-ui' },
  wrapper: { maxWidth: '500px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#1a1a1a' },
  progressContainer: { marginBottom: '25px' },
  progressText: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666', marginBottom: '8px' },
  progressBarBg: { height: '8px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#4e73df', transition: 'width 0.4s ease' },
  inputContainer: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' },
  addButton: { padding: '0 20px', backgroundColor: '#4e73df', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  filterBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f0f0f0' },
  filterButtons: { display: 'flex', gap: '15px' },
  filterBtn: { border: 'none', background: 'none', padding: '8px 0', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  clearBtn: { border: 'none', background: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '12px' },
  list: { listStyle: 'none', padding: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f9f9f9' },
  todoText: { flex: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
  checkbox: { cursor: 'pointer', width: '18px', height: '18px' },
  deleteButton: { color: '#ccc', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' },
  emptyMsg: { textAlign: 'center', color: '#aaa', marginTop: '30px' }
};

export default App;