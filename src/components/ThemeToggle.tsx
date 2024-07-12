import { Moon, Sun } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState<boolean>(false);
  const { setTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => {
        setTheme(isLight ? "dark" : "light");
        setIsLight(!isLight);
      }}
      className="bg-slate-200 hover:bg-slate-200/80"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
