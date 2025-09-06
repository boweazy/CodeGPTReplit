// C# File Handler for Enhanced Editing
import { readFile, writeFile, showNotification } from '@replit/extensions';

export default {
  name: 'csharp-handler',
  extensions: ['.cs'],
  displayName: 'Enhanced C# Editor',
  
  async onFileOpen(file) {
    try {
      const content = await readFile(file.path);
      const analysis = this.analyzeFile(content, file.path);
      
      // Add enhanced editing features to the file
      this.enhanceEditor(file, analysis);
      
      // Show file insights
      this.showFileInsights(analysis);
      
    } catch (error) {
      console.error('C# file handler error:', error);
    }
  },
  
  analyzeFile(content, filePath) {
    const lines = content.split('\n');
    const analysis = {
      file: filePath,
      totalLines: lines.length,
      classes: [],
      methods: [],
      properties: [],
      complexity: 0,
      issues: [],
      suggestions: []
    };
    
    let currentClass = null;
    let bracketDepth = 0;
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      const lineNumber = index + 1;
      
      // Track bracket depth
      bracketDepth += (line.match(/{/g) || []).length;
      bracketDepth -= (line.match(/}/g) || []).length;
      
      // Find classes
      const classMatch = trimmed.match(/^(public|private|protected|internal)?\s*class\s+(\w+)/);
      if (classMatch) {
        currentClass = {
          name: classMatch[2],
          line: lineNumber,
          methods: [],
          properties: []
        };
        analysis.classes.push(currentClass);
      }
      
      // Find methods
      const methodMatch = trimmed.match(/^(public|private|protected|internal).*\s+(\w+)\s*\(/);
      if (methodMatch && currentClass) {
        const method = {
          name: methodMatch[2],
          line: lineNumber,
          class: currentClass.name
        };
        currentClass.methods.push(method);
        analysis.methods.push(method);
      }
      
      // Find properties
      const propertyMatch = trimmed.match(/^(public|private|protected|internal).*\s+(\w+)\s*{\s*(get|set)/);
      if (propertyMatch && currentClass) {
        const property = {
          name: propertyMatch[2],
          line: lineNumber,
          class: currentClass.name
        };
        currentClass.properties.push(property);
        analysis.properties.push(property);
      }
      
      // Calculate complexity
      if (trimmed.match(/\b(if|for|while|switch|foreach|catch)\b/)) {
        analysis.complexity++;
      }
      
      // Check for common issues
      this.checkForIssues(line, lineNumber, analysis);
    });
    
    // Generate suggestions
    this.generateSuggestions(analysis);
    
    return analysis;
  },
  
  checkForIssues(line, lineNumber, analysis) {
    const trimmed = line.trim();
    
    // Check for long lines
    if (line.length > 120) {
      analysis.issues.push({
        type: 'style',
        severity: 'warning',
        line: lineNumber,
        message: 'Line exceeds 120 characters',
        suggestion: 'Consider breaking this line into multiple lines'
      });
    }
    
    // Check for TODO comments
    if (trimmed.includes('TODO') || trimmed.includes('FIXME')) {
      analysis.issues.push({
        type: 'todo',
        severity: 'info',
        line: lineNumber,
        message: 'TODO/FIXME comment found',
        suggestion: 'Remember to address this task'
      });
    }
    
    // Check for potential null reference issues
    if (trimmed.includes('.') && !trimmed.includes('?.') && !trimmed.includes('null')) {
      const nullableCheck = trimmed.match(/(\w+)\./);
      if (nullableCheck) {
        analysis.issues.push({
          type: 'potential-null',
          severity: 'suggestion',
          line: lineNumber,
          message: 'Consider null-conditional operator',
          suggestion: `Use ${nullableCheck[1]}?.method() instead of ${nullableCheck[1]}.method()`
        });
      }
    }
    
    // Check for magic numbers
    const magicNumberMatch = trimmed.match(/\b(\d{2,})\b/);
    if (magicNumberMatch && !trimmed.includes('const') && !trimmed.includes('=')) {
      analysis.issues.push({
        type: 'magic-number',
        severity: 'suggestion',
        line: lineNumber,
        message: `Magic number found: ${magicNumberMatch[1]}`,
        suggestion: 'Consider using a named constant'
      });
    }
  },
  
  generateSuggestions(analysis) {
    // Suggest separation if file is large
    if (analysis.totalLines > 200) {
      analysis.suggestions.push({
        type: 'separation',
        priority: 'high',
        message: `File has ${analysis.totalLines} lines - consider separation`,
        action: 'Use Code Separator tool to break into smaller files'
      });
    }
    
    // Suggest refactoring if too many classes
    if (analysis.classes.length > 3) {
      analysis.suggestions.push({
        type: 'organization',
        priority: 'medium',
        message: `${analysis.classes.length} classes in one file`,
        action: 'Consider moving classes to separate files'
      });
    }
    
    // Suggest complexity reduction
    if (analysis.complexity > 20) {
      analysis.suggestions.push({
        type: 'complexity',
        priority: 'medium',
        message: `High complexity score: ${analysis.complexity}`,
        action: 'Consider breaking down complex methods'
      });
    }
    
    // Suggest documentation
    const undocumentedMethods = analysis.methods.filter(m => 
      !['get', 'set', 'ToString', 'GetHashCode', 'Equals'].includes(m.name)
    );
    if (undocumentedMethods.length > 5) {
      analysis.suggestions.push({
        type: 'documentation',
        priority: 'low',
        message: 'Consider adding XML documentation',
        action: 'Add /// <summary> comments to public methods'
      });
    }
  },
  
  enhanceEditor(file, analysis) {
    // This would integrate with the actual editor
    // For now, we'll store the enhancements in the file metadata
    file.metadata = {
      ...file.metadata,
      sharpCompilerAnalysis: analysis,
      enhancedFeatures: {
        smartCompletion: true,
        codeNavigation: true,
        quickActions: true
      }
    };
    
    // Add quick action buttons
    this.addQuickActions(file, analysis);
  },
  
  addQuickActions(file, analysis) {
    const quickActions = {
      compile: {
        label: '🔨 Quick Compile',
        action: () => this.quickCompile(file)
      },
      separate: {
        label: '🧩 Separate Code',
        action: () => this.quickSeparate(file)
      },
      analyze: {
        label: '📊 Re-analyze',
        action: () => this.reanalyze(file)
      },
      format: {
        label: '✨ Format Code',
        action: () => this.formatCode(file)
      }
    };
    
    // Store quick actions for the editor UI
    file.quickActions = quickActions;
  },
  
  async quickCompile(file) {
    try {
      showNotification('🔨 Compiling file...', 'info');
      
      // Find the project file for this C# file
      const projectDir = file.path.substring(0, file.path.lastIndexOf('/'));
      const findProject = await this.executeCommand(`find ${projectDir} -name "*.csproj" | head -1`);
      
      if (findProject.trim()) {
        const result = await this.executeCommand(`dotnet build "${findProject.trim()}"`);
        if (result.includes('Build succeeded')) {
          showNotification('✅ Compilation successful', 'success');
        } else {
          showNotification('❌ Compilation failed', 'error');
        }
      } else {
        showNotification('❌ No project file found', 'error');
      }
    } catch (error) {
      showNotification(`❌ Compile error: ${error.message}`, 'error');
    }
  },
  
  async quickSeparate(file) {
    showNotification('🧩 Starting code separation...', 'info');
    // This would trigger the separator tool
    window.SharpCompilerExtension?.tools?.separator?.analyzeFile(file.path);
  },
  
  async reanalyze(file) {
    const content = await readFile(file.path);
    const analysis = this.analyzeFile(content, file.path);
    this.showFileInsights(analysis);
    showNotification('📊 File re-analyzed', 'info');
  },
  
  async formatCode(file) {
    try {
      showNotification('✨ Formatting code...', 'info');
      const result = await this.executeCommand(`dotnet format "${file.path}"`);
      showNotification('✅ Code formatted', 'success');
    } catch (error) {
      showNotification(`❌ Format error: ${error.message}`, 'error');
    }
  },
  
  showFileInsights(analysis) {
    // Create insights panel
    const insights = {
      summary: {
        lines: analysis.totalLines,
        classes: analysis.classes.length,
        methods: analysis.methods.length,
        complexity: analysis.complexity
      },
      issues: analysis.issues,
      suggestions: analysis.suggestions,
      quality: this.calculateQualityScore(analysis)
    };
    
    // Display in console for now (would be shown in extension UI)
    console.log('📊 C# File Insights:', insights);
    
    // Store for extension UI
    if (window.SharpCompilerExtension) {
      window.SharpCompilerExtension.currentFileInsights = insights;
    }
  },
  
  calculateQualityScore(analysis) {
    let score = 100;
    
    // Deduct points for issues
    analysis.issues.forEach(issue => {
      switch (issue.severity) {
        case 'error': score -= 10; break;
        case 'warning': score -= 5; break;
        case 'suggestion': score -= 2; break;
        case 'info': score -= 1; break;
      }
    });
    
    // Deduct for high complexity
    if (analysis.complexity > 20) score -= 10;
    if (analysis.complexity > 30) score -= 20;
    
    // Deduct for file size
    if (analysis.totalLines > 200) score -= 10;
    if (analysis.totalLines > 500) score -= 20;
    
    return Math.max(0, score);
  },
  
  async executeCommand(command) {
    // Placeholder for command execution
    // In real implementation, this would use the Replit Extensions API
    return Promise.resolve('Command executed');
  },
  
  // File save handler
  async onFileSave(file) {
    // Auto-format on save if enabled
    const preferences = JSON.parse(localStorage.getItem('sharp-compiler-prefs') || '{}');
    if (preferences.autoFormat) {
      await this.formatCode(file);
    }
    
    // Auto-compile on save if enabled
    if (preferences.autoCompile) {
      await this.quickCompile(file);
    }
  },
  
  // Context menu items
  getContextMenuItems(file) {
    return [
      {
        label: '🔨 Compile Project',
        action: () => this.quickCompile(file)
      },
      {
        label: '🧩 Separate Code',
        action: () => this.quickSeparate(file)
      },
      {
        label: '📊 Show Insights',
        action: () => this.reanalyze(file)
      },
      {
        label: '✨ Format Code',
        action: () => this.formatCode(file)
      }
    ];
  }
};