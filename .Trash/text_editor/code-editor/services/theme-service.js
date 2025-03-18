// services/theme-service.js
class ThemeService {
    constructor() {
      this.currentTheme = 'dark';
      this.themes = {
        dark: {
          name: 'VS Dark',
          editorTheme: 'vs-dark',
          backgroundColor: '#1e1e1e',
          foregroundColor: '#d4d4d4',
          sidebarBackgroundColor: '#252526',
          sidebarForegroundColor: '#d4d4d4'
        },
        light: {
          name: 'VS Light',
          editorTheme: 'vs',
          backgroundColor: '#ffffff',
          foregroundColor: '#000000',
          sidebarBackgroundColor: '#f3f3f3',
          sidebarForegroundColor: '#333333'
        }
      };
      this.themeChangeCallbacks = [];
    }
  
    getTheme() {
      return this.themes[this.currentTheme];
    }
  
    setTheme(themeName) {
      if (this.themes[themeName]) {
        this.currentTheme = themeName;
        this.applyTheme();
        this.notifyThemeChange();
        return true;
      }
      return false;
    }
  
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme();
      this.notifyThemeChange();
    }
  
    applyTheme() {
      const theme = this.getTheme();
      document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
      document.documentElement.style.setProperty('--foreground-color', theme.foregroundColor);
      document.documentElement.style.setProperty('--sidebar-background-color', theme.sidebarBackgroundColor);
      document.documentElement.style.setProperty('--sidebar-foreground-color', theme.sidebarForegroundColor);
    }
  
    onThemeChange(callback) {
      this.themeChangeCallbacks.push(callback);
    }
  
    notifyThemeChange() {
      for (const callback of this.themeChangeCallbacks) {
        callback(this.getTheme());
      }
    }
  }
  
  export default new ThemeService();