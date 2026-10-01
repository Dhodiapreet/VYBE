import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';

export default function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
