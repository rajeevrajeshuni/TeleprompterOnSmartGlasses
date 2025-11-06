import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import api from '../Api';
import type { TeleprompterSettings } from '../types/index';

const DEFAULT_SETTINGS: TeleprompterSettings = {
  line_width: 'Medium',
  scroll_speed: 120,
  number_of_lines: '4',
  custom_text: '',
  auto_replay: false,
  speech_scroll_enabled: true,
  show_estimated_total: true,
};

export default function TeleprompterSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<TeleprompterSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.startTeleprompter(settings);
      
      if (response.success) {
        toast.success('Teleprompter started successfully!');
        // Optionally navigate to a different screen or show confirmation
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

  const updateSetting = <K extends keyof TeleprompterSettings>(
    key: K,
    value: TeleprompterSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">
              Teleprompter Settings
            </CardTitle>
            <CardDescription className="text-slate-300">
              Configure your teleprompter preferences before starting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Custom Text */}
              <div className="space-y-2">
                <Label htmlFor="custom_text" className="text-white text-lg">
                  Text to Display
                </Label>
                <Textarea
                  id="custom_text"
                  placeholder="Enter or paste your text here..."
                  value={settings.custom_text}
                  onChange={(e) => updateSetting('custom_text', e.target.value)}
                  className="min-h-[200px] bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
                <p className="text-sm text-slate-400">
                  Leave empty to use default welcome text
                </p>
              </div>

              {/* Line Width */}
              <div className="space-y-2">
                <Label htmlFor="line_width" className="text-white text-lg">
                  Line Width
                </Label>
                <Select
                  value={settings.line_width}
                  onValueChange={(value) => updateSetting('line_width', value)}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
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
                <Label htmlFor="scroll_speed" className="text-white text-lg">
                  Scroll Speed (Words Per Minute)
                </Label>
                <Input
                  id="scroll_speed"
                  type="number"
                  min="1"
                  max="500"
                  value={settings.scroll_speed}
                  onChange={(e) => updateSetting('scroll_speed', parseInt(e.target.value) || 120)}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
                <p className="text-sm text-slate-400">
                  Recommended: 120-180 WPM for comfortable reading
                </p>
              </div>

              {/* Number of Lines */}
              <div className="space-y-2">
                <Label htmlFor="number_of_lines" className="text-white text-lg">
                  Number of Lines
                </Label>
                <Select
                  value={settings.number_of_lines}
                  onValueChange={(value) => updateSetting('number_of_lines', value)}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
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

              {/* Toggle Settings */}
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto_replay" className="text-white">
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

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="speech_scroll_enabled" className="text-white">
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

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show_estimated_total" className="text-white">
                      Show Estimated Total Time
                    </Label>
                    <p className="text-sm text-slate-400">
                      Display projected completion time in status bar
                    </p>
                  </div>
                  <Switch
                    id="show_estimated_total"
                    checked={settings.show_estimated_total}
                    onCheckedChange={(checked) => updateSetting('show_estimated_total', checked)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? 'Starting...' : 'Start Teleprompter'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}