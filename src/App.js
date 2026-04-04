import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Auth/Login.tsx';
import Register from './Pages/Auth/Register.tsx';
import ForgotPassword from './Pages/Auth/ForgotPassword.tsx';
import ResetPassword from './Pages/Auth/ResetPassword.tsx';
import Home from './Pages/Home.tsx';
import NotFound from './Pages/NotFound.tsx';
import ProtectedRoute from './Components/ProtectedRoute.tsx';
import PublicRoute from './Components/PublicRoute.tsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route path="*" element={<NotFound />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;