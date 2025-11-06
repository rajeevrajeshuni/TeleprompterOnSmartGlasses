import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import TeleprompterSettings from './screens/TeleprompterSettings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/settings" element={<TeleprompterSettings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}