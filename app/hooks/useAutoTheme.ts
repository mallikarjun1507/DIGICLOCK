import { useEffect, useState } from 'react';

type ThemeType = 'light' | 'green' | 'dark';

export default function useAutoTheme() {
  const [theme, setTheme] = useState<ThemeType>('light');

  useEffect(() => {
    const updateTheme = () => {
      const hours = new Date().getHours();

      if (hours >= 6 && hours < 12) {
        setTheme('light'); // Morning (6AM - 12PM)
      } else if (hours >= 12 && hours < 18) {
        setTheme('green'); // Afternoon (12PM - 6PM)
      } else {
        setTheme('dark'); // Evening/Night (6PM - 6AM)
      }
    };

    updateTheme(); // set initially
    const interval = setInterval(updateTheme, 60 * 1000); // update every 1 min

    return () => clearInterval(interval);
  }, []);

  return theme;
}
