// SharpSeparateCompiler Extension - Main Entry Point
import { init } from '@replit/extensions';

init({
  name: 'SharpSeparateCompiler',
  version: '1.0.0'
});

// Global extension state
window.SharpCompilerExtension = {
  projects: new Map(),
  separatedComponents: new Map(),
  compileHistory: [],
  
  // Initialize extension
  init() {
    console.log('🚀 SharpSeparateCompiler Extension Loaded');
    this.setupEventListeners();
    this.loadUserPreferences();
  },

  // Set up global event listeners
  setupEventListeners() {
    // Listen for file changes
    document.addEventListener('replit:file:changed', (event) => {
      if (event.detail.file.endsWith('.cs')) {
        this.analyzeCSharpFile(event.detail.file);
      }
    });

    // Listen for workspace events
    document.addEventListener('replit:workspace:opened', () => {
      this.scanForCSharpProjects();
    });
  },

  // Load user preferences
  loadUserPreferences() {
    const preferences = localStorage.getItem('sharp-compiler-prefs');
    if (preferences) {
      this.preferences = JSON.parse(preferences);
    } else {
      this.preferences = {
        autoCompile: false,
        separationDepth: 3,
        showWarnings: true,
        compilerVersion: 'latest'
      };
    }
  },

  // Save user preferences
  savePreferences() {
    localStorage.setItem('sharp-compiler-prefs', JSON.stringify(this.preferences));
  },

  // Analyze C# file for separation opportunities
  analyzeCSharpFile(filePath) {
    // This would integrate with the actual file system
    console.log(`Analyzing C# file: ${filePath}`);
  },

  // Scan workspace for C# projects
  scanForCSharpProjects() {
    console.log('Scanning workspace for C# projects...');
    // Implementation would scan for .csproj files
  }
};

// Initialize the extension when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.SharpCompilerExtension.init();
  });
} else {
  window.SharpCompilerExtension.init();
}

export default window.SharpCompilerExtension;