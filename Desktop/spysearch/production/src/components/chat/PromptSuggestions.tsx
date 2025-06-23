
import { Button } from "@/components/ui/button";
import { Cpu, Globe, TrendingUp, Bot, Sparkles, Heart, Bitcoin, Microscope, Rocket, Camera, Music, Book, Car, Coffee, Gamepad2, Palette, Shuffle } from "lucide-react";
import { useState, useEffect } from "react";

interface PromptSuggestionsProps {
  onPromptClick: (promptText: string) => void;
  isAuthenticated: boolean;
}

export const PromptSuggestions = ({ onPromptClick, isAuthenticated }: PromptSuggestionsProps) => {
  const allPromptSuggestions = [
    { text: "Latest technology breakthroughs", icon: Cpu },
    { text: "Climate change recent developments", icon: Globe },
    { text: "Stock market analysis today", icon: TrendingUp },
    { text: "AI developments and news", icon: Bot },
    { text: "Space exploration updates", icon: Sparkles },
    { text: "Health and wellness trends", icon: Heart },
    { text: "Cryptocurrency market movements", icon: Bitcoin },
    { text: "Recent scientific discoveries", icon: Microscope },
    { text: "Space technology innovations", icon: Rocket },
    { text: "Photography trends and tips", icon: Camera },
    { text: "Music industry latest news", icon: Music },
    { text: "Best books to read this year", icon: Book },
    { text: "Electric vehicle developments", icon: Car },
    { text: "Coffee culture around the world", icon: Coffee },
    { text: "Gaming industry updates", icon: Gamepad2 },
    { text: "Digital art and design trends", icon: Palette }
  ];

  const [selectedPrompts, setSelectedPrompts] = useState<typeof allPromptSuggestions>([]);

  useEffect(() => {
    const shuffled = [...allPromptSuggestions].sort(() => Math.random() - 0.5);
    setSelectedPrompts(shuffled.slice(0, 8));
  }, []);

  const handlePromptClick = (promptText: string) => {
    // Always call onPromptClick - the parent component will handle authentication
    onPromptClick(promptText);
  };

  const shufflePrompts = () => {
    const shuffled = [...allPromptSuggestions].sort(() => Math.random() - 0.5);
    setSelectedPrompts(shuffled.slice(0, 8));
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {selectedPrompts.map((prompt, index) => (
          <button
            key={`${prompt.text}-${index}`}
            onClick={() => handlePromptClick(prompt.text)}
            className="group p-4 transition-all duration-200 text-left w-full min-h-[100px] rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm"
          >
            <div className="flex flex-col items-center justify-center gap-3 h-full text-center">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                <prompt.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                {prompt.text}
              </span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <button
          onClick={shufflePrompts}
          className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Shuffle className="h-4 w-4" />
          <span>Shuffle Topics</span>
        </button>
      </div>
    </div>
  );
};
