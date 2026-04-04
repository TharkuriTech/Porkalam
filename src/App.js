import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Auth/Login.tsx';
import Register from './Pages/Auth/Register.tsx';
import ForgotPassword from './Pages/Auth/ForgotPassword.tsx';
import ResetPassword from './Pages/Auth/ResetPassword.tsx';
import NotFound from './Pages/NotFound.tsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;