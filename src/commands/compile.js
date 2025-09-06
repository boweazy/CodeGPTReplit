// Quick Compile Command for CLUI
import { executeTerminalCommand, showNotification, getActiveFile } from '@replit/extensions';

export default {
  name: 'compile-sharp',
  displayName: 'Compile C# Project',
  description: 'Quickly compile the current C# project',
  
  async execute(args) {
    try {
      showNotification('🔨 Starting compilation...', 'info');
      
      // Get current file to determine project context
      const currentFile = await getActiveFile();
      let projectPath = '.';
      
      if (currentFile && currentFile.path.includes('.csproj')) {
        projectPath = currentFile.path;
      } else {
        // Search for nearest .csproj file
        const findResult = await executeTerminalCommand('find . -name "*.csproj" -type f | head -1');
        if (findResult.output.trim()) {
          projectPath = findResult.output.trim();
        }
      }
      
      // Parse arguments for build configuration
      const buildConfig = args.includes('--release') || args.includes('-r') ? 'Release' : 'Debug';
      const verbosity = args.includes('--verbose') || args.includes('-v') ? 'detailed' : 'normal';
      const noRestore = args.includes('--no-restore');
      
      // Build command
      let buildCommand = `dotnet build "${projectPath}" --configuration ${buildConfig} --verbosity ${verbosity}`;
      
      if (noRestore) {
        buildCommand += ' --no-restore';
      }
      
      // Execute compilation
      const result = await executeTerminalCommand(buildCommand);
      
      if (result.exitCode === 0) {
        showNotification('✅ Compilation successful!', 'success');
        
        // Save compilation stats
        this.updateCompileStats(true);
        
        // Return success info
        return {
          success: true,
          message: 'Project compiled successfully',
          output: result.output,
          buildConfig,
          projectPath
        };
      } else {
        showNotification('❌ Compilation failed!', 'error');
        
        this.updateCompileStats(false);
        
        return {
          success: false,
          message: 'Compilation failed',
          output: result.output,
          errors: this.parseCompileErrors(result.output)
        };
      }
      
    } catch (error) {
      showNotification(`❌ Compile error: ${error.message}`, 'error');
      return {
        success: false,
        message: error.message
      };
    }
  },
  
  parseCompileErrors(output) {
    const errors = [];
    const lines = output.split('\n');
    
    lines.forEach(line => {
      // Parse MSBuild error format: file(line,col): error CS####: message
      const errorMatch = line.match(/(.+?)\((\d+),(\d+)\):\s*error\s+(\w+):\s*(.+)/);
      if (errorMatch) {
        errors.push({
          file: errorMatch[1],
          line: parseInt(errorMatch[2]),
          column: parseInt(errorMatch[3]),
          code: errorMatch[4],
          message: errorMatch[5]
        });
      }
      
      // Parse warning format
      const warningMatch = line.match(/(.+?)\((\d+),(\d+)\):\s*warning\s+(\w+):\s*(.+)/);
      if (warningMatch) {
        errors.push({
          file: warningMatch[1],
          line: parseInt(warningMatch[2]),
          column: parseInt(warningMatch[3]),
          code: warningMatch[4],
          message: warningMatch[5],
          type: 'warning'
        });
      }
    });
    
    return errors;
  },
  
  updateCompileStats(success) {
    const stats = JSON.parse(localStorage.getItem('sharp-compiler-stats') || '{"total": 0, "success": 0, "lastCompile": null}');
    stats.total++;
    if (success) stats.success++;
    stats.lastCompile = Date.now();
    
    localStorage.setItem('sharp-compiler-stats', JSON.stringify(stats));
  },
  
  // Help text for the command
  help: `
Usage: compile-sharp [options]

Options:
  --release, -r     Build in Release configuration (default: Debug)
  --verbose, -v     Use detailed verbosity
  --no-restore      Don't restore packages before building

Examples:
  compile-sharp                    # Build in Debug mode
  compile-sharp --release          # Build in Release mode
  compile-sharp -r -v              # Release build with verbose output
  compile-sharp --no-restore       # Build without restoring packages
  `
};