// Quick Code Separation Command for CLUI
import { readFile, writeFile, showNotification, getActiveFile } from '@replit/extensions';

export default {
  name: 'separate-code',
  displayName: 'Separate Code Components',
  description: 'Analyze and separate code into components',
  
  async execute(args) {
    try {
      showNotification('🧩 Starting code separation...', 'info');
      
      // Get target file
      let targetFile;
      if (args.length > 0 && args[0].endsWith('.cs')) {
        targetFile = { path: args[0] };
      } else {
        targetFile = await getActiveFile();
      }
      
      if (!targetFile || !targetFile.path.endsWith('.cs')) {
        showNotification('❌ No C# file selected', 'error');
        return { success: false, message: 'Please select a C# file' };
      }
      
      // Read file content
      const content = await readFile(targetFile.path);
      
      // Parse separation options from arguments
      const options = this.parseOptions(args);
      
      // Perform analysis
      const analysis = this.analyzeCode(content);
      
      // Create separation plan
      const plan = this.createSeparationPlan(analysis, targetFile.path, options);
      
      // Execute separation if requested
      if (options.execute) {
        await this.executeSeparation(plan);
        showNotification(`✅ Created ${plan.files.length} separated files`, 'success');
        
        return {
          success: true,
          message: `Code separated into ${plan.files.length} files`,
          plan: plan
        };
      } else {
        // Just show the plan
        this.displaySeparationPlan(plan);
        showNotification('📋 Separation plan created (use --execute to apply)', 'info');
        
        return {
          success: true,
          message: 'Separation plan created',
          plan: plan
        };
      }
      
    } catch (error) {
      showNotification(`❌ Separation error: ${error.message}`, 'error');
      return {
        success: false,
        message: error.message
      };
    }
  },
  
  parseOptions(args) {
    return {
      execute: args.includes('--execute') || args.includes('-e'),
      classes: !args.includes('--no-classes'),
      interfaces: !args.includes('--no-interfaces'), 
      enums: !args.includes('--no-enums'),
      maxLines: this.extractArgValue(args, '--max-lines') || 200,
      methods: args.includes('--extract-methods'),
      preview: args.includes('--preview') || args.includes('-p')
    };
  },
  
  extractArgValue(args, flag) {
    const index = args.indexOf(flag);
    if (index !== -1 && index + 1 < args.length) {
      return parseInt(args[index + 1]);
    }
    return null;
  },
  
  analyzeCode(content) {
    const analysis = {
      totalLines: content.split('\n').length,
      classes: [],
      interfaces: [],
      enums: [],
      methods: [],
      namespaces: new Set(),
      usings: []
    };
    
    const lines = content.split('\n');
    let currentNamespace = null;
    let currentClass = null;
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
            endLine: index,
            namespace: currentNamespace,
            methods: [],
            properties: [],
            content: []
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
            endLine: index,
            namespace: currentNamespace,
            content: []
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
            endLine: index,
            namespace: currentNamespace,
            content: []
          });
        }
      }
      
      // Store line content for each component
      if (currentClass) {
        currentClass.content.push(line);
        currentClass.endLine = index;
      }
    });
    
    return analysis;
  },
  
  createSeparationPlan(analysis, originalFile, options) {
    const plan = {
      originalFile: originalFile,
      files: [],
      summary: {
        totalComponents: 0,
        estimatedReduction: 0
      }
    };
    
    const baseName = originalFile.replace(/\.cs$/, '');
    const baseDir = originalFile.includes('/') ? originalFile.substring(0, originalFile.lastIndexOf('/')) : '';
    
    // Create files for classes
    if (options.classes && analysis.classes.length > 0) {
      analysis.classes.forEach(cls => {
        if (cls.content.length > 10) { // Only separate substantial classes
          const fileName = baseDir ? `${baseDir}/${cls.name}.cs` : `${cls.name}.cs`;
          plan.files.push({
            name: fileName,
            type: 'class',
            component: cls,
            estimatedLines: cls.content.length
          });
        }
      });
    }
    
    // Create files for interfaces
    if (options.interfaces && analysis.interfaces.length > 0) {
      analysis.interfaces.forEach(iface => {
        const fileName = baseDir ? `${baseDir}/I${iface.name}.cs` : `I${iface.name}.cs`;
        plan.files.push({
          name: fileName,
          type: 'interface',
          component: iface,
          estimatedLines: iface.content.length
        });
      });
    }
    
    // Create files for enums
    if (options.enums && analysis.enums.length > 0) {
      analysis.enums.forEach(enumType => {
        const fileName = baseDir ? `${baseDir}/${enumType.name}.cs` : `${enumType.name}.cs`;
        plan.files.push({
          name: fileName,
          type: 'enum',
          component: enumType,
          estimatedLines: enumType.content.length
        });
      });
    }
    
    plan.summary.totalComponents = plan.files.length;
    plan.summary.estimatedReduction = Math.round(
      ((analysis.totalLines - plan.files.reduce((sum, f) => sum + f.estimatedLines, 0)) / analysis.totalLines) * 100
    );
    
    return plan;
  },
  
  async executeSeparation(plan) {
    for (const file of plan.files) {
      const content = this.generateFileContent(file);
      await writeFile(file.name, content);
    }
  },
  
  generateFileContent(file) {
    const component = file.component;
    const usings = [
      'using System;',
      'using System.Collections.Generic;',
      'using System.Linq;'
    ];
    
    let content = `// Generated by SharpSeparateCompiler Extension
// Separated from original file
// Component: ${component.name} (${file.type})

`;
    
    // Add using statements
    content += usings.join('\n') + '\n\n';
    
    // Add namespace if present
    if (component.namespace) {
      content += `namespace ${component.namespace}\n{\n`;
    }
    
    // Add the component content (simplified - would need more sophisticated parsing)
    if (file.type === 'class') {
      content += `    public class ${component.name}\n    {\n`;
      content += `        // TODO: Move class implementation here\n`;
      content += `        // Original location: lines ${component.startLine}-${component.endLine}\n`;
      content += '    }\n';
    } else if (file.type === 'interface') {
      content += `    public interface ${component.name}\n    {\n`;
      content += `        // TODO: Move interface definition here\n`;
      content += '    }\n';
    } else if (file.type === 'enum') {
      content += `    public enum ${component.name}\n    {\n`;
      content += `        // TODO: Move enum values here\n`;
      content += '    }\n';
    }
    
    if (component.namespace) {
      content += '}\n';
    }
    
    return content;
  },
  
  displaySeparationPlan(plan) {
    console.log('\n📋 Code Separation Plan:');
    console.log(`Original file: ${plan.originalFile}`);
    console.log(`Proposed files: ${plan.files.length}`);
    console.log(`Estimated reduction: ${plan.summary.estimatedReduction}%\n`);
    
    plan.files.forEach(file => {
      console.log(`📁 ${file.name} (${file.type}) - ~${file.estimatedLines} lines`);
    });
    
    console.log('\nUse --execute flag to create the files');
  },
  
  // Help text for the command
  help: `
Usage: separate-code [file] [options]

Arguments:
  file                 C# file to separate (default: current file)

Options:
  --execute, -e        Execute the separation (create files)
  --preview, -p        Show detailed preview
  --no-classes         Don't separate classes
  --no-interfaces      Don't separate interfaces  
  --no-enums          Don't separate enums
  --extract-methods    Extract large methods
  --max-lines <num>    Maximum lines per file (default: 200)

Examples:
  separate-code                           # Analyze current file
  separate-code MyClass.cs --execute      # Separate MyClass.cs
  separate-code --preview --max-lines 150 # Preview with custom line limit
  separate-code --execute --no-enums      # Separate but keep enums in original
  `
};