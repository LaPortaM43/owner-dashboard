// src/App.jsx
import { useState } from 'react';
import Login from './assets/Login';
import Dashboard from './assets/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  return user ? <Dashboard /> : <Login onLogin={setUser} />;
}

export default App;
