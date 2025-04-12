import './index.scss'
import { useState } from 'react'

const User = () => {
  const [user] = useState({
    name: 'User Name',
    email: 'user@email.com',
    avatar: '../../assets/images/logo.png',
    questions: [
      { id: 1, title: 'How do I deploy a React app?', status: 'Answered' },
      { id: 2, title: 'What is the best way to learn TypeScript?', status: 'Open' },
      { id: 3, title: 'How to fix CORS issues?', status: 'Closed' },
    ],
  })

  return (
    <div className="container user-page">
      <aside className="sidebar">
        <img src={user.avatar} alt="User" className="user" />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <nav className="menu">
          <button>My Questions</button>
          <button>Settings</button>
          <button>Log Out</button>
        </nav>
      </aside>

      <main className="main-content">
        <h1>My Questions</h1>
        <ul className="question-list">
          {user.questions.map((q) => (
            <li key={q.id} className="question-item">
              <h3>{q.title}</h3>
              <span className={`status ${q.status.toLowerCase()}`}>{q.status}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export default User
