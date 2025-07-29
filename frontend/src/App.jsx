import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import ManageEvents from './ManageEvents';
import AddEvent from './AddEvent';
import EditEvent from './EditEvent';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (jwt) => {
    setToken(jwt);
    localStorage.setItem('token', jwt);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manage-events" element={<ManageEvents token={token} onLogout={handleLogout} />} />
        <Route path="/add-events" element={<AddEvent token={token} onLogout={handleLogout} />} />
        <Route path="/edit-events/:id" element={<EditEvent token={token} onLogout={handleLogout} />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
