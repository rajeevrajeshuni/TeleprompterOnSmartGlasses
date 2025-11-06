import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScriptView from './screens/ScriptView';
import TeleprompterSettings from './screens/TeleprompterSettings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScriptView />} />
        <Route path="/settings" element={<TeleprompterSettings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}