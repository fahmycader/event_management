import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import ManageEvents from './ManageEvents';
import AddEvent from './AddEvent';
import EditEvent from './EditEvent';
import ViewEventPage from './ViewEventPage';
import AttendeesPage from './AttendeesPage';
import EventAttendees from './EventAttendees';
import ForgotPassword from './ForgotPassword';
import VerifyOtp from './VerifyOtp';
import ResetPassword from './ResetPassword';
import { Toaster } from "react-hot-toast";
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
        <Route path="" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/verify-otp" element={<VerifyOtp />} />
<Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/event/:id" element={<ViewEventPage />} />
        <Route path="/manage-events" element={<ManageEvents token={token} onLogout={handleLogout} />} />
        <Route path="/add-events" element={<AddEvent token={token} onLogout={handleLogout} />} />
        <Route path="/edit-events/:id" element={<EditEvent token={token} onLogout={handleLogout} />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

<Route path="/attendees" element={<EventAttendees token={token} onLogout={handleLogout} />} />
          <Route path="/attendees/:id" element={<AttendeesPage  token={token} onLogout={handleLogout}  />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
