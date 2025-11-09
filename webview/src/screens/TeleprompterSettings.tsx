import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { TeleprompterSettings } from '../types/index';
import { createApiClient } from '../Api';
import { useAuthenticatedApi } from '../hooks/useAuthenticatedApi';

export default function TeleprompterSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<TeleprompterSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { getHeaders } = useAuthenticatedApi();
  const api = createApiClient(getHeaders);

  // Always fetch settings from API on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Get user email from localStorage (set by useAuth)
        const userEmail = localStorage.getItem('user_email') || 'default_user';
        const userSettings = await api.getUserSettings(userEmail);
        setSettings(userSettings);
      } catch (error) {
        console.error('Error fetching user settings:', error);
        toast.error('Failed to load settings');
        // Fallback to hardcoded defaults if API fails
        const fallbackSettings = {
          line_width: 'Medium',
          scroll_speed: 120,
          number_of_lines: '4',
          custom_text: '',
          auto_replay: false,
          speech_scroll_enabled: true,
          show_estimated_total: true,
        };
        setSettings(fallbackSettings);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleCancel = () => {
    navigate('/');
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      // Get user email from localStorage (set by useAuth)
      const userEmail = localStorage.getItem('user_email') || 'default_user';
      await api.saveUserSettings(userEmail, settings);
      toast.success('Settings saved');
      navigate('/');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = <K extends keyof TeleprompterSettings>(
    key: K,
    value: TeleprompterSettings[K]
  ) => {
    setSettings(prev => prev ? ({ ...prev, [key]: value }) : null);
  };

  // Show loading state
  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      {/* Header with Cancel and Back Buttons */}
      <header className="p-6 pb-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {/* Cancel Button - Top Left */}
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-white hover:text-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600 rounded-md hover:border-purple-400"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg">Back</span>
          </button>

          {/* Title - Center */}
          <span className="text-xl font-semibold text-white">
            {isSaving ? 'Saving...' : 'Settings'}
          </span>

          {/* Save Button - Top Right */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-white hover:text-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600 rounded-md hover:border-purple-400"
          >
            <span className="text-lg">Save</span>
          </button>
        </div>
      </header>

      {/* Main Content - Settings List */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Line Width */}
          <div className="space-y-2">
            <Label htmlFor="line_width" className="text-white text-base">
              Line Width
            </Label>
            <Select
              value={settings.line_width}
              onValueChange={(value) => updateSetting('line_width', value)}
            >
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="Small">Small</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scroll Speed */}
          <div className="space-y-2">
            <Label htmlFor="scroll_speed" className="text-white text-base">
              Scroll Speed (Words Per Minute)
            </Label>
            <Input
              id="scroll_speed"
              type="number"
              min="1"
              max="500"
              value={settings.scroll_speed}
              onChange={(e) => updateSetting('scroll_speed', parseInt(e.target.value) || 120)}
              className="bg-slate-800/50 border-slate-700 text-white h-12"
            />
            <p className="text-sm text-slate-400">
              Recommended: 120-180 WPM for comfortable reading
            </p>
          </div>

          {/* Number of Lines */}
          <div className="space-y-2">
            <Label htmlFor="number_of_lines" className="text-white text-base">
              Number of Lines
            </Label>
            <Select
              value={settings.number_of_lines}
              onValueChange={(value) => updateSetting('number_of_lines', value)}
            >
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="2">2 Lines</SelectItem>
                <SelectItem value="3">3 Lines</SelectItem>
                <SelectItem value="4">4 Lines</SelectItem>
                <SelectItem value="5">5 Lines</SelectItem>
                <SelectItem value="6">6 Lines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Separator */}
          <div className="border-t border-slate-700 my-6"></div>

          {/* Toggle Settings */}
          <div className="space-y-6">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="auto_replay" className="text-white text-base">
                  Auto Replay
                </Label>
                <p className="text-sm text-slate-400">
                  Automatically restart when text ends
                </p>
              </div>
              <Switch
                id="auto_replay"
                checked={settings.auto_replay}
                onCheckedChange={(checked) => updateSetting('auto_replay', checked)}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="speech_scroll_enabled" className="text-white text-base">
                  Speech-Based Scrolling
                </Label>
                <p className="text-sm text-slate-400">
                  Scroll based on your speech instead of time
                </p>
              </div>
              <Switch
                id="speech_scroll_enabled"
                checked={settings.speech_scroll_enabled}
                onCheckedChange={(checked) => updateSetting('speech_scroll_enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="show_estimated_total" className="text-white text-base">
                  Show Estimated Total Time
                </Label>
                <p className="text-sm text-slate-400">
                  Display projected completion time
                </p>
              </div>
              <Switch
                id="show_estimated_total"
                checked={settings.show_estimated_total}
                onCheckedChange={(checked) => updateSetting('show_estimated_total', checked)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}