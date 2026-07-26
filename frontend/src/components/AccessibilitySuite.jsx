import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Eye, 
  Volume2, 
  VolumeX, 
  Type, 
  Ruler, 
  Volume, 
  X, 
  Check, 
  Sparkles,
  Sun,
  BookOpen
} from 'lucide-react';

export default function AccessibilitySuite({ isMuted, setIsMuted }) {
   const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('synapsee_font_size') || 'medium'); // small, medium, large, xl
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('synapsee_high_contrast') === 'true');
  const [dyslexicFont, setDyslexicFont] = useState(() => localStorage.getItem('synapsee_dyslexic_font') === 'true');
  const [rulerActive, setRulerActive] = useState(() => localStorage.getItem('synapsee_ruler_active') === 'true');
  const [rulerY, setRulerY] = useState(200);

  // Apply Font Size
  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'small') root.style.setProperty('--app-font-scale', '0.85');
    else if (fontSize === 'medium') root.style.setProperty('--app-font-scale', '1');
    else if (fontSize === 'large') root.style.setProperty('--app-font-scale', '1.25');
    else if (fontSize === 'xl') root.style.setProperty('--app-font-scale', '1.5');
    localStorage.setItem('synapsee_font_size', fontSize);
  }, [fontSize]);

  // Apply High Contrast Mode
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
    localStorage.setItem('synapsee_high_contrast', String(highContrast));
  }, [highContrast]);

  // Apply Dyslexic Font
  useEffect(() => {
    if (dyslexicFont) {
      document.body.classList.add('opendyslexic-font');
    } else {
      document.body.classList.remove('opendyslexic-font');
    }
    localStorage.setItem('synapsee_dyslexic_font', String(dyslexicFont));
  }, [dyslexicFont]);

  // Handle Reading Ruler Mouse Tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (rulerActive) {
        setRulerY(e.clientY);
      }
    };
    localStorage.setItem('synapsee_ruler_active', String(rulerActive));

    if (rulerActive) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [rulerActive]);

  // Read Selected Text / Text-to-Speech
  const readSelectedText = () => {
    const selected = window.getSelection().toString();
    const textToRead = selected.trim() || "Welcome to Synapsee. Use this accessibility panel to adjust font size, enable high contrast, or trigger reading aids.";
    
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else if (isMuted) {
      alert("Sounds are currently muted! Unmute in the accessibility menu to listen.");
    }
  };

  return (
    <>
      {/* Screen Reading Ruler Overlay */}
      {rulerActive && (
        <div 
          className="screen-ruler-overlay" 
          style={{ top: `${rulerY}px` }} 
          aria-hidden="true"
        />
      )}

      {/* Floating Action Button (Bottom-Left Pinned) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 h-16 w-16 bg-navy text-white hover:bg-teal rounded-full shadow-2xl flex items-center justify-center border-4 border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        title="Accessibility Suite"
        aria-label="Open Accessibility Suite Modal"
      >
        <Sliders className="h-8 w-8 text-skyblue" />
        <span className="sr-only">Accessibility Suite</span>
      </button>

      {/* Accessibility Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-md flex items-center justify-start p-4 sm:p-6 animate-fade-in">
          <div className="bg-white text-navy rounded-3xl max-w-md w-full shadow-2xl border-4 border-skyblue p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-skyblue pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-teal/10 p-3 rounded-2xl">
                  <Eye className="h-7 w-7 text-teal" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-navy leading-tight">Accessibility Suite</h3>
                  <p className="text-teal font-semibold text-xs">Tailor your reading & viewing comfort</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-skysoft hover:bg-skyblue rounded-full text-navy transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Controls List */}
            <div className="space-y-5">
              
              {/* 1. Font Size Slider */}
              <div className="bg-skysoft p-4 rounded-2xl border border-skyblue space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-teal" />
                    <span className="font-extrabold text-sm text-navy uppercase tracking-wider">Text Size</span>
                  </div>
                  <span className="text-xs font-black bg-white px-3 py-1 rounded-full text-teal uppercase border border-teal/20">
                    {fontSize.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { id: 'small', label: 'Small', size: '14px' },
                    { id: 'medium', label: 'Med', size: '16px' },
                    { id: 'large', label: 'Large', size: '20px' },
                    { id: 'xl', label: 'XL', size: '24px' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setFontSize(item.id)}
                      className={`py-3 px-2 rounded-xl font-bold transition flex flex-col items-center justify-center cursor-pointer border ${
                        fontSize === item.id 
                        ? 'bg-teal text-white border-teal shadow-md' 
                        : 'bg-white text-navy border-skyblue hover:bg-skyblue/50'
                      }`}
                    >
                      <span style={{ fontSize: item.size }}>A</span>
                      <span className="text-[10px] mt-0.5">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. High Contrast Mode Toggle */}
              <div className="bg-skysoft p-4 rounded-2xl border border-skyblue flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sun className="h-6 w-6 text-teal" />
                  <div>
                    <h4 className="font-extrabold text-navy text-md">High Contrast Mode</h4>
                    <p className="text-navy/70 text-xs font-medium">Ultra-high contrast yellow/black theme</p>
                  </div>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                    highContrast ? 'bg-teal justify-end' : 'bg-skyblue justify-start'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                    {highContrast && <Check className="h-4 w-4 text-teal" />}
                  </div>
                </button>
              </div>

              {/* 3. Mute All Sounds & Music */}
              <div className="bg-skysoft p-4 rounded-2xl border border-skyblue flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isMuted ? <VolumeX className="h-6 w-6 text-alert" /> : <Volume2 className="h-6 w-6 text-teal" />}
                  <div>
                    <h4 className="font-extrabold text-navy text-md">Mute All Audio</h4>
                    <p className="text-navy/70 text-xs font-medium">Turn off all speech and audio clips</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const nextMuted = !isMuted;
                    setIsMuted(nextMuted);
                    if (nextMuted && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                  }}
                  className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                    isMuted ? 'bg-alert justify-end' : 'bg-skyblue justify-start'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                    {isMuted && <Check className="h-4 w-4 text-alert" />}
                  </div>
                </button>
              </div>

              {/* 4. OpenDyslexic Font Helper */}
              <div className="bg-skysoft p-4 rounded-2xl border border-skyblue flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-teal" />
                  <div>
                    <h4 className="font-extrabold text-navy text-md">OpenDyslexic Font</h4>
                    <p className="text-navy/70 text-xs font-medium">Dyslexic-friendly letter spacing</p>
                  </div>
                </div>
                <button
                  onClick={() => setDyslexicFont(!dyslexicFont)}
                  className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                    dyslexicFont ? 'bg-teal justify-end' : 'bg-skyblue justify-start'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                    {dyslexicFont && <Check className="h-4 w-4 text-teal" />}
                  </div>
                </button>
              </div>

              {/* 5. Screen Reading Ruler Overlay */}
              <div className="bg-skysoft p-4 rounded-2xl border border-skyblue flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Ruler className="h-6 w-6 text-teal" />
                  <div>
                    <h4 className="font-extrabold text-navy text-md">Screen Reading Ruler</h4>
                    <p className="text-navy/70 text-xs font-medium">Focus guide line following cursor</p>
                  </div>
                </div>
                <button
                  onClick={() => setRulerActive(!rulerActive)}
                  className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                    rulerActive ? 'bg-teal justify-end' : 'bg-skyblue justify-start'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                    {rulerActive && <Check className="h-4 w-4 text-teal" />}
                  </div>
                </button>
              </div>

              {/* 6. Text-to-Speech / Screen Reader Tool */}
              <div className="bg-teal/10 p-4 rounded-2xl border border-teal/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy text-sm flex items-center gap-2">
                    <Volume className="h-4 w-4 text-teal" />
                    Text-to-Speech Reader
                  </span>
                  <button
                    onClick={readSelectedText}
                    className="bg-navy hover:bg-navy/90 text-white text-xs font-bold py-2 px-3 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-skyblue" />
                    <span>Read Text</span>
                  </button>
                </div>
                <p className="text-navy/70 text-xs">
                  Highlight any text on the page and click "Read Text", or tap to hear a friendly overview.
                </p>
              </div>

            </div>

            {/* Footer Done Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-navy hover:bg-navy/95 text-white font-black py-4 rounded-2xl shadow-lg transition cursor-pointer text-lg"
            >
              Done & Save Preferences
            </button>

          </div>
        </div>
      )}
    </>
  );
}
