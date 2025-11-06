import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';
import api from '../Api';
import SplashScreen from './SplashScreen';
import type { TeleprompterSettings } from '../types/index';

const STORAGE_KEY = 'teleprompter_script';
const SETTINGS_KEY = 'teleprompter_settings';

const DEFAULT_SETTINGS: TeleprompterSettings = {
  line_width: 'Medium',
  scroll_speed: 120,
  number_of_lines: '4',
  custom_text: '',
  auto_replay: false,
  speech_scroll_enabled: true,
  show_estimated_total: true,
};

export default function ScriptView() {
  const navigate = useNavigate();
  const [scriptText, setScriptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen for 1 second on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Load saved script from localStorage on mount
  useEffect(() => {
    const savedScript = localStorage.getItem(STORAGE_KEY);
    if (savedScript) {
      setScriptText(savedScript);
    }
  }, []);

  // Save script to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, scriptText);
  }, [scriptText]);

  const handleStartTeleprompter = async () => {
    if (!scriptText.trim()) {
      toast.error('Please enter some text before starting the teleprompter');
      return;
    }

    setIsLoading(true);

    try {
      // Load saved settings or use defaults
      const savedSettingsStr = localStorage.getItem(SETTINGS_KEY);
      const savedSettings = savedSettingsStr 
        ? JSON.parse(savedSettingsStr) 
        : DEFAULT_SETTINGS;

      // Merge script text with settings
      const settings: TeleprompterSettings = {
        ...savedSettings,
        custom_text: scriptText,
      };

      const response = await api.startTeleprompter(settings);
      
      if (response.success) {
        toast.success('Teleprompter started successfully!');
      } else {
        toast.error(response.message || 'Failed to start teleprompter');
      }
    } catch (error) {
      console.error('Error starting teleprompter:', error);
      toast.error('Failed to start teleprompter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsClick = () => {
    // Save current script before navigating
    localStorage.setItem(STORAGE_KEY, scriptText);
    navigate('/settings');
  };

  // Show splash screen for the first second
  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      {/* Header */}
      <header className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-white">Teleprompter</h1>
      </header>

      {/* Main Content - Text Area */}
      <main className="flex-1 px-6 pb-6 flex flex-col">
        <Textarea
          placeholder="Enter or paste your script here..."
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          className="flex-1 min-h-[400px] bg-slate-800/50 border-slate-700 text-white text-lg placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur"
        />
      </main>

      {/* Action Bar (Footer) */}
      <footer className="p-6 pt-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Button
            onClick={handleStartTeleprompter}
            disabled={isLoading || !scriptText.trim()}
            className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Starting...' : 'Start Teleprompter'}
          </Button>
          <Button
            onClick={handleSettingsClick}
            variant="outline"
            className="h-14 px-6 bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700 hover:text-white"
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>
        </div>
      </footer>
    </div>
  );
}