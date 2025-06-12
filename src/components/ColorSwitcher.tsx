
import React from 'react';
import { Button } from '@/components/ui/button';

interface ColorSwitcherProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const ColorSwitcher = ({ currentTheme, onThemeChange }: ColorSwitcherProps) => {
  const themes = [
    { name: 'Blue/Teal', value: 'blue', colors: 'from-blue-500 to-teal-500' },
    { name: 'Purple/Pink', value: 'purple', colors: 'from-purple-500 to-pink-500' },
    { name: 'Green/Emerald', value: 'green', colors: 'from-emerald-500 to-green-500' },
    { name: 'Orange/Red', value: 'orange', colors: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="fixed top-4 left-4 z-50 bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30">
      <p className="text-white text-sm font-medium mb-3">Escolha uma cor:</p>
      <div className="space-y-2">
        {themes.map((theme) => (
          <Button
            key={theme.value}
            variant={currentTheme === theme.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onThemeChange(theme.value)}
            className={`w-full justify-start text-left text-white hover:bg-white/20 ${
              currentTheme === theme.value ? 'bg-white/30' : ''
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.colors} mr-2`}></div>
            {theme.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ColorSwitcher;
