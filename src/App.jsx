import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // ---------------------------------------------------------
  // 1. 狀態管理 (States)
  // ---------------------------------------------------------
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('ultimate-todo-list');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [selectedTag, setSelectedTag] = useState('工作');
  const [filter, setFilter] = useState('all');

  // ---------------------------------------------------------
  // 2. 副作用處理 (Persistence)
  // ---------------------------------------------------------
  useEffect(() => {
    localStorage.setItem('ultimate-todo-list', JSON.stringify(todos));
  }, [todos]);

  // ---------------------------------------------------------
  // 3. 核心邏輯 (Handlers)
  // ---------------------------------------------------------
  const handleAddTodo = () => {
    if (inputValue.trim() === '') return;
    const newTodo = { 
      id: Date.now(), 
      text: inputValue.trim(), 
      completed: false,
      tag: selectedTag,
      isEditing: false 
    };
    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
  };

  // 編輯功能邏輯
  const handleDoubleClick = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, isEditing: true } : t));
  };

  const handleEditChange = (id, newText) => {
    setTodos(todos.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const handleEditBlur = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, isEditing: false } : t));
  };

  // ---------------------------------------------------------
  // 4. 計算衍生資料 (Derived Data)
  // ---------------------------------------------------------
  const completedCount = todos.filter(t => t.completed).length;
  const progress = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div style={styles.background}>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>🚀 Task Master Pro</h2>

        {/* --- 進度條區 --- */}
        <div style={styles.progressSection}>
          <div style={styles.progressInfo}>
            <span>總進度</span>
            <span>{progress}%</span>
          </div>
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBarFill, width: `${progress}%` }} />
          </div>
        </div>

        {/* --- 標籤選擇區 (新增任務用) --- */}
        <div style={styles.tagPicker}>
          {Object.keys(tagColors).map(tag => (
            <button 
              key={tag}
              onClick={() => setSelectedTag(tag)}
              style={{
                ...styles.tagBtn,
                backgroundColor: selectedTag === tag ? tagColors[tag] : '#eee',
                color: selectedTag === tag ? 'white' : '#666'
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* --- 輸入區 --- */}
        <div style={styles.inputGroup}>
          <input 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder={`在「${selectedTag}」中新增任務...`}
            style={styles.mainInput}
          />
          <button onClick={handleAddTodo} style={styles.addBtn}>新增</button>
        </div>

        {/* --- 篩選控制列 --- */}
        <div style={styles.filterControl}>
          <div style={styles.filterTabs}>
            {['all', 'active', 'completed'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  ...styles.tabBtn,
                  color: filter === f ? '#4e73df' : '#aaa',
                  borderBottom: filter === f ? '2px solid #4e73df' : '2px solid transparent'
                }}
              >
                {f === 'all' ? '全部' : f === 'active' ? '待辦' : '已完成'}
              </button>
            ))}
          </div>
          <button onClick={clearCompleted} style={styles.clearBtn}>清除已完成</button>
        </div>

        {/* --- 任務列表 --- */}
        <ul style={styles.todoList}>
          {filteredTodos.map((todo) => (
            <li key={todo.id} style={styles.todoItem}>
              <div style={styles.itemMain}>
                <span style={{ ...styles.tagBadge, backgroundColor: tagColors[todo.tag] }}>
                  {todo.tag}
                </span>
                
                {todo.isEditing ? (
                  <input 
                    autoFocus
                    value={todo.text}
                    onChange={(e) => handleEditChange(todo.id, e.target.value)}
                    onBlur={() => handleEditBlur(todo.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEditBlur(todo.id)}
                    style={styles.editInput}
                  />
                ) : (
                  <span 
                    onDoubleClick={() => handleDoubleClick(todo.id)}
                    onClick={() => toggleComplete(todo.id)}
                    style={{
                      ...styles.todoText,
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#bbb' : '#333'
                    }}
                  >
                    {todo.text}
                  </span>
                )}
              </div>
              <button onClick={() => handleDelete(todo.id)} style={styles.delBtn}>✕</button>
            </li>
          ))}
        </ul>

        {filteredTodos.length === 0 && (
          <p style={styles.emptyHint}>目前沒有任務，來新增一個吧！ ☕</p>
        )}
        <p style={styles.footerHint}>💡 雙擊文字編輯任務內容</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 5. 樣式與配置 (Styles & Config)
// ---------------------------------------------------------
const tagColors = { '工作': '#4e73df', '生活': '#1cc88a', '學習': '#f6c23e' };

const styles = {
  background: { minHeight: '100vh', padding: '40px 20px', backgroundColor: '#f4f7f6', fontFamily: 'Arial, sans-serif' },
  wrapper: { maxWidth: '500px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  title: { textAlign: 'center', marginBottom: '25px', color: '#333' },
  progressSection: { marginBottom: '25px' },
  progressInfo: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888', marginBottom: '6px' },
  progressBarBg: { height: '8px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#4e73df', transition: 'width 0.4s ease' },
  tagPicker: { display: 'flex', gap: '8px', marginBottom: '15px' },
  tagBtn: { border: 'none', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: '0.2s' },
  inputGroup: { display: 'flex', gap: '10px', marginBottom: '25px' },
  mainInput: { flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none', fontSize: '16px' },
  addBtn: { padding: '0 20px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  filterControl: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee' },
  filterTabs: { display: 'flex', gap: '15px' },
  tabBtn: { background: 'none', border: 'none', padding: '10px 0', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  clearBtn: { background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '12px' },
  todoList: { listStyle: 'none', padding: 0 },
  todoItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f9f9f9' },
  itemMain: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1 },
  tagBadge: { fontSize: '10px', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' },
  todoText: { fontSize: '16px', cursor: 'pointer', flex: 1 },
  editInput: { flex: 1, padding: '4px 8px', border: '1px solid #4e73df', borderRadius: '4px', outline: 'none' },
  delBtn: { background: 'none', border: 'none', color: '#ddd', cursor: 'pointer', fontSize: '18px' },
  emptyHint: { textAlign: 'center', color: '#ccc', marginTop: '30px' },
  footerHint: { textAlign: 'center', color: '#bbb', fontSize: '11px', marginTop: '20px' }
};

export default App;