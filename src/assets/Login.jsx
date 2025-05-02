// src/Login.jsx
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      if (userCred.user.email === 'owner@gmail.com') {
        onLogin(userCred.user);
      } else {
        setError('Not authorized.');
      }
    } catch (err) {
      setError('Login failed.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}
