// C# Compiler Tool
import { getActiveFile, executeTerminalCommand, showNotification } from '@replit/extensions';

export default function CompilerTool() {
  return {
    init() {
      this.setupUI();
      this.loadProjects();
    },

    setupUI() {
      const container = document.createElement('div');
      container.className = 'sharp-compiler-tool';
      container.innerHTML = `
        <div class="compiler-header">
          <h2>🔧 C# Compiler</h2>
          <button id="refresh-projects" class="btn-refresh">↻ Refresh</button>
        </div>
        
        <div class="project-selector">
          <label>Select Project:</label>
          <select id="project-select">
            <option value="">-- Choose Project --</option>
          </select>
          <button id="scan-projects" class="btn-scan">📁 Scan</button>
        </div>

        <div class="compile-options">
          <div class="option-group">
            <label>Build Configuration:</label>
            <select id="build-config">
              <option value="Debug">Debug</option>
              <option value="Release">Release</option>
            </select>
          </div>
          
          <div class="option-group">
            <label>Target Framework:</label>
            <select id="target-framework">
              <option value="net8.0">NET 8.0</option>
              <option value="net7.0">NET 7.0</option>
              <option value="net6.0">NET 6.0</option>
              <option value="netstandard2.1">NET Standard 2.1</option>
            </select>
          </div>

          <div class="option-group">
            <label>
              <input type="checkbox" id="auto-restore"> 
              Auto-restore NuGet packages
            </label>
          </div>

          <div class="option-group">
            <label>
              <input type="checkbox" id="warnings-as-errors"> 
              Treat warnings as errors
            </label>
          </div>
        </div>

        <div class="compile-actions">
          <button id="compile-btn" class="btn-primary">🔨 Compile</button>
          <button id="clean-btn" class="btn-secondary">🧹 Clean</button>
          <button id="rebuild-btn" class="btn-secondary">🔄 Rebuild</button>
          <button id="run-btn" class="btn-success">▶️ Run</button>
        </div>

        <div class="output-section">
          <div class="output-header">
            <h3>Compilation Output</h3>
            <button id="clear-output" class="btn-clear">Clear</button>
          </div>
          <div id="compile-output" class="output-display"></div>
        </div>

        <div class="stats-section">
          <div class="stat-item">
            <span class="stat-label">Last Compile:</span>
            <span id="last-compile-time">Never</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Success Rate:</span>
            <span id="success-rate">0%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Warnings:</span>
            <span id="warning-count">0</span>
          </div>
        </div>
      `;

      this.bindEvents(container);
      return container;
    },

    bindEvents(container) {
      // Compile button
      container.querySelector('#compile-btn').addEventListener('click', () => {
        this.compileProject();
      });

      // Clean button  
      container.querySelector('#clean-btn').addEventListener('click', () => {
        this.cleanProject();
      });

      // Rebuild button
      container.querySelector('#rebuild-btn').addEventListener('click', () => {
        this.rebuildProject();
      });

      // Run button
      container.querySelector('#run-btn').addEventListener('click', () => {
        this.runProject();
      });

      // Scan projects button
      container.querySelector('#scan-projects').addEventListener('click', () => {
        this.scanForProjects();
      });

      // Clear output button
      container.querySelector('#clear-output').addEventListener('click', () => {
        container.querySelector('#compile-output').innerHTML = '';
      });

      // Refresh projects button
      container.querySelector('#refresh-projects').addEventListener('click', () => {
        this.loadProjects();
      });
    },

    async compileProject() {
      const projectSelect = document.querySelector('#project-select');
      const selectedProject = projectSelect.value;
      
      if (!selectedProject) {
        showNotification('Please select a project to compile', 'warning');
        return;
      }

      this.updateOutput('🔨 Starting compilation...');
      
      const buildConfig = document.querySelector('#build-config').value;
      const autoRestore = document.querySelector('#auto-restore').checked;
      
      try {
        if (autoRestore) {
          this.updateOutput('📦 Restoring NuGet packages...');
          await executeTerminalCommand(`dotnet restore "${selectedProject}"`);
        }

        this.updateOutput('🔨 Compiling project...');
        const result = await executeTerminalCommand(
          `dotnet build "${selectedProject}" --configuration ${buildConfig} --verbosity normal`
        );
        
        this.updateOutput(result.output);
        
        if (result.exitCode === 0) {
          this.updateOutput('✅ Compilation successful!');
          showNotification('Project compiled successfully', 'success');
          this.updateStats(true);
        } else {
          this.updateOutput('❌ Compilation failed!');
          showNotification('Compilation failed', 'error');
          this.updateStats(false);
        }
      } catch (error) {
        this.updateOutput(`❌ Error: ${error.message}`);
        showNotification('Compilation error', 'error');
        this.updateStats(false);
      }
    },

    async cleanProject() {
      const selectedProject = document.querySelector('#project-select').value;
      if (!selectedProject) return;

      this.updateOutput('🧹 Cleaning project...');
      
      try {
        const result = await executeTerminalCommand(`dotnet clean "${selectedProject}"`);
        this.updateOutput(result.output);
        this.updateOutput('✅ Project cleaned successfully!');
        showNotification('Project cleaned', 'success');
      } catch (error) {
        this.updateOutput(`❌ Clean failed: ${error.message}`);
      }
    },

    async rebuildProject() {
      await this.cleanProject();
      await this.compileProject();
    },

    async runProject() {
      const selectedProject = document.querySelector('#project-select').value;
      if (!selectedProject) return;

      this.updateOutput('▶️ Running project...');
      
      try {
        await executeTerminalCommand(`dotnet run --project "${selectedProject}"`);
      } catch (error) {
        this.updateOutput(`❌ Run failed: ${error.message}`);
      }
    },

    async scanForProjects() {
      this.updateOutput('📁 Scanning for C# projects...');
      
      try {
        const result = await executeTerminalCommand('find . -name "*.csproj" -type f');
        const projects = result.output.split('\n').filter(line => line.trim());
        
        const projectSelect = document.querySelector('#project-select');
        projectSelect.innerHTML = '<option value="">-- Choose Project --</option>';
        
        projects.forEach(project => {
          const option = document.createElement('option');
          option.value = project.trim();
          option.textContent = project.trim().split('/').pop();
          projectSelect.appendChild(option);
        });

        this.updateOutput(`✅ Found ${projects.length} C# projects`);
        showNotification(`Found ${projects.length} projects`, 'info');
      } catch (error) {
        this.updateOutput(`❌ Scan failed: ${error.message}`);
      }
    },

    updateOutput(message) {
      const output = document.querySelector('#compile-output');
      const timestamp = new Date().toLocaleTimeString();
      output.innerHTML += `<div class="output-line">[${timestamp}] ${message}</div>`;
      output.scrollTop = output.scrollHeight;
    },

    updateStats(success) {
      const stats = JSON.parse(localStorage.getItem('sharp-compiler-stats') || '{"total": 0, "success": 0}');
      stats.total++;
      if (success) stats.success++;
      
      localStorage.setItem('sharp-compiler-stats', JSON.stringify(stats));
      
      document.querySelector('#last-compile-time').textContent = new Date().toLocaleString();
      document.querySelector('#success-rate').textContent = `${Math.round((stats.success / stats.total) * 100)}%`;
    },

    loadProjects() {
      this.scanForProjects();
    }
  };
}