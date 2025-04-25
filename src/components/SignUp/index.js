import './index.scss'
import { useState } from 'react'
import { ArrowLeft, UserPlus } from 'lucide-react'

const host = process.env.REACT_APP_BACKEND ?? 'http://localhost:5000'

export default function SignUp({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    password: '',
    profilePicture: '',
    status: '',
    privacy: 'public',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch(`${host}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signup failed')
      onSuccess?.(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="signin-page">
      <div className="signin-content">
        <div className="text-zone">
          <h1>Sign&nbsp;Up</h1>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flat-button"
              style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}

          <form onSubmit={submit} className="signin-form">
            <label htmlFor="name">Username</label>
            <input
              id="name"
              value={form.name}
              onChange={update('name')}
              required
              placeholder="jane_doe"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={update('password')}
              required
            />

            <label htmlFor="profile">Profile picture URL (optional)</label>
            <input
              id="profile"
              value={form.profilePicture}
              onChange={update('profilePicture')}
              placeholder="https://..."
            />

            <label htmlFor="status">Status (optional)</label>
            <input
              id="status"
              value={form.status}
              onChange={update('status')}
              placeholder="Hello there!"
            />

            <label htmlFor="privacy">Privacy</label>
            <select id="privacy" value={form.privacy} onChange={update('privacy')}>
              <option value="public">Public</option>
              <option value="friends">Friends</option>
              <option value="private">Private</option>
            </select>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="flat-button" disabled={busy}>
              <UserPlus size={18} /> {busy ? 'Signing up…' : 'Sign up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
