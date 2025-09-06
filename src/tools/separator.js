// Code Separator Tool
import { readFile, writeFile, showNotification } from '@replit/extensions';

export default function SeparatorTool() {
  return {
    init() {
      this.setupUI();
    },

    setupUI() {
      const container = document.createElement('div');
      container.className = 'code-separator-tool';
      container.innerHTML = `
        <div class="separator-header">
          <h2>🧩 Code Separator</h2>
          <button id="analyze-btn" class="btn-analyze">🔍 Analyze</button>
        </div>

        <div class="file-input-section">
          <label>Select C# File to Analyze:</label>
          <input type="file" id="file-input" accept=".cs" />
          <button id="analyze-current" class="btn-secondary">Analyze Current File</button>
        </div>

        <div class="separation-options">
          <h3>Separation Criteria</h3>
          
          <div class="criteria-group">
            <label>
              <input type="checkbox" id="separate-classes" checked> 
              Separate by Classes
            </label>
          </div>
          
          <div class="criteria-group">
            <label>
              <input type="checkbox" id="separate-interfaces" checked> 
              Separate by Interfaces
            </label>
          </div>
          
          <div class="criteria-group">
            <label>
              <input type="checkbox" id="separate-namespaces" checked> 
              Separate by Namespaces
            </label>
          </div>
          
          <div class="criteria-group">
            <label>
              <input type="checkbox" id="separate-methods"> 
              Extract Large Methods (>50 lines)
            </label>
          </div>
          
          <div class="criteria-group">
            <label>
              <input type="checkbox" id="separate-enums"> 
              Separate Enums
            </label>
          </div>

          <div class="criteria-group">
            <label>Max Lines per File:</label>
            <input type="number" id="max-lines" value="200" min="50" max="1000">
          </div>
        </div>

        <div class="analysis-results">
          <h3>Analysis Results</h3>
          <div id="analysis-output" class="analysis-display"></div>
        </div>

        <div class="separation-preview">
          <h3>Proposed File Structure</h3>
          <div id="file-structure" class="structure-display"></div>
        </div>

        <div class="separation-actions">
          <button id="generate-files" class="btn-primary" disabled>📁 Generate Separated Files</button>
          <button id="preview-changes" class="btn-secondary" disabled>👁️ Preview Changes</button>
          <button id="export-structure" class="btn-secondary">📤 Export Structure</button>
        </div>

        <div class="progress-section" style="display: none;">
          <div class="progress-bar">
            <div id="progress-fill" class="progress-fill"></div>
          </div>
          <div id="progress-text" class="progress-text">Processing...</div>
        </div>
      `;

      this.bindEvents(container);
      return container;
    },

    bindEvents(container) {
      // Analyze button
      container.querySelector('#analyze-btn').addEventListener('click', () => {
        this.analyzeSelectedFile();
      });

      // Analyze current file button
      container.querySelector('#analyze-current').addEventListener('click', () => {
        this.analyzeCurrentFile();
      });

      // File input change
      container.querySelector('#file-input').addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.selectedFile = e.target.files[0];
          container.querySelector('#analyze-btn').disabled = false;
        }
      });

      // Generate files button
      container.querySelector('#generate-files').addEventListener('click', () => {
        this.generateSeparatedFiles();
      });

      // Preview changes button  
      container.querySelector('#preview-changes').addEventListener('click', () => {
        this.previewChanges();
      });

      // Export structure button
      container.querySelector('#export-structure').addEventListener('click', () => {
        this.exportStructure();
      });
    },

    async analyzeSelectedFile() {
      if (!this.selectedFile) {
        showNotification('Please select a file first', 'warning');
        return;
      }

      this.showProgress(true);
      this.updateProgress(0, 'Reading file...');

      try {
        const content = await this.readFileContent(this.selectedFile);
        await this.performAnalysis(content, this.selectedFile.name);
      } catch (error) {
        this.displayError(`Analysis failed: ${error.message}`);
      } finally {
        this.showProgress(false);
      }
    },

    async analyzeCurrentFile() {
      this.showProgress(true);
      this.updateProgress(0, 'Getting current file...');

      try {
        const currentFile = await getActiveFile();
        if (!currentFile || !currentFile.name.endsWith('.cs')) {
          throw new Error('Current file is not a C# file');
        }

        const content = await readFile(currentFile.path);
        await this.performAnalysis(content, currentFile.name);
      } catch (error) {
        this.displayError(`Analysis failed: ${error.message}`);
      } finally {
        this.showProgress(false);
      }
    },

    async performAnalysis(content, fileName) {
      this.updateProgress(25, 'Parsing code structure...');
      
      const analysis = this.parseCodeStructure(content);
      
      this.updateProgress(50, 'Analyzing separation opportunities...');
      
      const separationPlan = this.createSeparationPlan(analysis, fileName);
      
      this.updateProgress(75, 'Generating recommendations...');
      
      this.displayAnalysisResults(analysis);
      this.displaySeparationPlan(separationPlan);
      
      this.updateProgress(100, 'Analysis complete!');
      
      // Enable action buttons
      document.querySelector('#generate-files').disabled = false;
      document.querySelector('#preview-changes').disabled = false;
      
      this.currentAnalysis = analysis;
      this.currentSeparationPlan = separationPlan;
      
      showNotification('Code analysis completed', 'success');
    },

    parseCodeStructure(content) {
      const analysis = {
        totalLines: content.split('\n').length,
        classes: [],
        interfaces: [],
        enums: [],
        methods: [],
        namespaces: new Set(),
        usings: [],
        complexity: 0
      };

      const lines = content.split('\n');
      let currentClass = null;
      let currentNamespace = null;
      let bracketDepth = 0;

      lines.forEach((line, index) => {
        const trimmed = line.trim();
        
        // Track bracket depth
        bracketDepth += (line.match(/{/g) || []).length;
        bracketDepth -= (line.match(/}/g) || []).length;

        // Parse using statements
        if (trimmed.startsWith('using ')) {
          analysis.usings.push(trimmed);
        }

        // Parse namespace
        if (trimmed.startsWith('namespace ')) {
          currentNamespace = trimmed.replace('namespace ', '').replace('{', '').trim();
          analysis.namespaces.add(currentNamespace);
        }

        // Parse class declarations
        if (trimmed.match(/^(public|private|protected|internal)?\s*class\s+\w+/)) {
          const className = trimmed.match(/class\s+(\w+)/)?.[1];
          if (className) {
            currentClass = {
              name: className,
              startLine: index,
              namespace: currentNamespace,
              methods: [],
              properties: [],
              lines: 0
            };
            analysis.classes.push(currentClass);
          }
        }

        // Parse interface declarations
        if (trimmed.match(/^(public|private|protected|internal)?\s*interface\s+\w+/)) {
          const interfaceName = trimmed.match(/interface\s+(\w+)/)?.[1];
          if (interfaceName) {
            analysis.interfaces.push({
              name: interfaceName,
              startLine: index,
              namespace: currentNamespace
            });
          }
        }

        // Parse enum declarations
        if (trimmed.match(/^(public|private|protected|internal)?\s*enum\s+\w+/)) {
          const enumName = trimmed.match(/enum\s+(\w+)/)?.[1];
          if (enumName) {
            analysis.enums.push({
              name: enumName,
              startLine: index,
              namespace: currentNamespace
            });
          }
        }

        // Parse method declarations
        if (currentClass && trimmed.match(/^(public|private|protected|internal).*\w+\s*\(/)) {
          const methodMatch = trimmed.match(/(\w+)\s*\(/);
          if (methodMatch) {
            const method = {
              name: methodMatch[1],
              startLine: index,
              class: currentClass.name,
              lines: 0
            };
            currentClass.methods.push(method);
            analysis.methods.push(method);
          }
        }

        // Calculate complexity (simplified)
        if (trimmed.match(/\b(if|for|while|switch|catch|foreach)\b/)) {
          analysis.complexity++;
        }
      });

      // Calculate line counts for classes and methods
      analysis.classes.forEach(cls => {
        const nextClass = analysis.classes.find(c => c.startLine > cls.startLine);
        cls.lines = (nextClass ? nextClass.startLine : lines.length) - cls.startLine;
      });

      return analysis;
    },

    createSeparationPlan(analysis, fileName) {
      const plan = {
        originalFile: fileName,
        recommendedFiles: [],
        reasons: [],
        metrics: {}
      };

      const baseName = fileName.replace('.cs', '');
      const separateClasses = document.querySelector('#separate-classes').checked;
      const separateInterfaces = document.querySelector('#separate-interfaces').checked;
      const separateNamespaces = document.querySelector('#separate-namespaces').checked;
      const separateEnums = document.querySelector('#separate-enums').checked;
      const maxLines = parseInt(document.querySelector('#max-lines').value);

      // Recommend separating by classes
      if (separateClasses && analysis.classes.length > 1) {
        analysis.classes.forEach(cls => {
          if (cls.lines > 50) {
            plan.recommendedFiles.push({
              name: `${cls.name}.cs`,
              type: 'class',
              content: cls,
              reason: `Class ${cls.name} has ${cls.lines} lines`
            });
          }
        });
        plan.reasons.push(`${analysis.classes.length} classes found - recommend separation`);
      }

      // Recommend separating interfaces
      if (separateInterfaces && analysis.interfaces.length > 0) {
        analysis.interfaces.forEach(iface => {
          plan.recommendedFiles.push({
            name: `I${iface.name}.cs`,
            type: 'interface',
            content: iface,
            reason: 'Interface separation for better organization'
          });
        });
      }

      // Recommend separating enums
      if (separateEnums && analysis.enums.length > 0) {
        analysis.enums.forEach(enumType => {
          plan.recommendedFiles.push({
            name: `${enumType.name}.cs`,
            type: 'enum',
            content: enumType,
            reason: 'Enum separation for reusability'
          });
        });
      }

      // Check if file is too large
      if (analysis.totalLines > maxLines) {
        plan.reasons.push(`File is ${analysis.totalLines} lines (exceeds ${maxLines} line limit)`);
      }

      plan.metrics = {
        originalLines: analysis.totalLines,
        proposedFiles: plan.recommendedFiles.length,
        complexityReduction: Math.round((analysis.complexity / analysis.totalLines) * 100),
        estimatedMaintenanceImprovement: plan.recommendedFiles.length > 2 ? 'High' : 'Medium'
      };

      return plan;
    },

    displayAnalysisResults(analysis) {
      const output = document.querySelector('#analysis-output');
      output.innerHTML = `
        <div class="analysis-summary">
          <div class="metric">
            <span class="metric-label">Total Lines:</span>
            <span class="metric-value">${analysis.totalLines}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Classes:</span>
            <span class="metric-value">${analysis.classes.length}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Interfaces:</span>
            <span class="metric-value">${analysis.interfaces.length}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Enums:</span>
            <span class="metric-value">${analysis.enums.length}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Methods:</span>
            <span class="metric-value">${analysis.methods.length}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Namespaces:</span>
            <span class="metric-value">${analysis.namespaces.size}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Complexity Score:</span>
            <span class="metric-value">${analysis.complexity}</span>
          </div>
        </div>

        <div class="detailed-analysis">
          <h4>Classes Found:</h4>
          ${analysis.classes.map(cls => `
            <div class="item-detail">
              <strong>${cls.name}</strong> - ${cls.lines} lines
              <small>(${cls.methods.length} methods)</small>
            </div>
          `).join('')}
          
          ${analysis.interfaces.length > 0 ? `
            <h4>Interfaces Found:</h4>
            ${analysis.interfaces.map(iface => `
              <div class="item-detail">
                <strong>${iface.name}</strong> - Interface
              </div>
            `).join('')}
          ` : ''}
          
          ${analysis.enums.length > 0 ? `
            <h4>Enums Found:</h4>
            ${analysis.enums.map(enumType => `
              <div class="item-detail">
                <strong>${enumType.name}</strong> - Enum
              </div>
            `).join('')}
          ` : ''}
        </div>
      `;
    },

    displaySeparationPlan(plan) {
      const structure = document.querySelector('#file-structure');
      structure.innerHTML = `
        <div class="separation-summary">
          <h4>Separation Recommendations</h4>
          <div class="plan-metrics">
            <div class="plan-metric">
              <span class="metric-label">Original File:</span>
              <span class="metric-value">${plan.originalFile} (${plan.metrics.originalLines} lines)</span>
            </div>
            <div class="plan-metric">
              <span class="metric-label">Proposed Files:</span>
              <span class="metric-value">${plan.metrics.proposedFiles}</span>
            </div>
            <div class="plan-metric">
              <span class="metric-label">Maintenance Improvement:</span>
              <span class="metric-value">${plan.metrics.estimatedMaintenanceImprovement}</span>
            </div>
          </div>
        </div>

        <div class="proposed-files">
          <h4>Proposed File Structure:</h4>
          ${plan.recommendedFiles.map(file => `
            <div class="proposed-file">
              <div class="file-name">📁 ${file.name}</div>
              <div class="file-type">${file.type.toUpperCase()}</div>
              <div class="file-reason">${file.reason}</div>
            </div>
          `).join('')}
        </div>

        <div class="separation-reasons">
          <h4>Reasons for Separation:</h4>
          ${plan.reasons.map(reason => `
            <div class="reason-item">• ${reason}</div>
          `).join('')}
        </div>
      `;
    },

    async generateSeparatedFiles() {
      if (!this.currentSeparationPlan) {
        showNotification('No separation plan available', 'warning');
        return;
      }

      this.showProgress(true);
      this.updateProgress(0, 'Generating separated files...');

      try {
        for (let i = 0; i < this.currentSeparationPlan.recommendedFiles.length; i++) {
          const file = this.currentSeparationPlan.recommendedFiles[i];
          this.updateProgress(
            (i / this.currentSeparationPlan.recommendedFiles.length) * 100,
            `Creating ${file.name}...`
          );

          const content = this.generateFileContent(file);
          await writeFile(file.name, content);
        }

        this.updateProgress(100, 'Files generated successfully!');
        showNotification(`Generated ${this.currentSeparationPlan.recommendedFiles.length} files`, 'success');
      } catch (error) {
        this.displayError(`File generation failed: ${error.message}`);
      } finally {
        this.showProgress(false);
      }
    },

    generateFileContent(file) {
      // This would generate the actual C# code content
      // For now, return a placeholder structure
      return `// Generated by SharpSeparateCompiler
// File: ${file.name}
// Type: ${file.type}
// Reason: ${file.reason}

using System;

namespace GeneratedFiles
{
    // TODO: Move ${file.content.name} implementation here
    // Original location: line ${file.content.startLine}
}`;
    },

    async previewChanges() {
      if (!this.currentSeparationPlan) return;

      const preview = this.currentSeparationPlan.recommendedFiles.map(file => {
        const content = this.generateFileContent(file);
        return `
========================================
FILE: ${file.name}
========================================
${content}

`;
      }).join('');

      // Create preview modal or new tab
      const previewWindow = window.open('', '_blank');
      previewWindow.document.write(`
        <html>
          <head><title>Code Separation Preview</title></head>
          <body>
            <h1>Code Separation Preview</h1>
            <pre style="font-family: monospace; white-space: pre-wrap;">${preview}</pre>
          </body>
        </html>
      `);
    },

    exportStructure() {
      if (!this.currentSeparationPlan) return;

      const structure = JSON.stringify(this.currentSeparationPlan, null, 2);
      const blob = new Blob([structure], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'separation-plan.json';
      a.click();
      
      URL.revokeObjectURL(url);
      showNotification('Structure exported', 'success');
    },

    readFileContent(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    },

    showProgress(show) {
      const progressSection = document.querySelector('.progress-section');
      progressSection.style.display = show ? 'block' : 'none';
    },

    updateProgress(percent, text) {
      const progressFill = document.querySelector('#progress-fill');
      const progressText = document.querySelector('#progress-text');
      
      progressFill.style.width = `${percent}%`;
      progressText.textContent = text;
    },

    displayError(message) {
      const output = document.querySelector('#analysis-output');
      output.innerHTML = `<div class="error-message">❌ ${message}</div>`;
      showNotification(message, 'error');
    }
  };
}