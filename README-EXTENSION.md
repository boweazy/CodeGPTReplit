# SharpSeparateCompiler - Replit Extension

A powerful Replit extension for C# development that provides advanced compilation and code separation features.

## 🚀 Features

### 🔨 C# Compiler Tool
- **Quick Compilation**: Compile C# projects with customizable build configurations
- **Auto-restore**: Automatically restore NuGet packages before compilation
- **Build Analytics**: Track compilation success rates and performance metrics
- **Multiple Configurations**: Support for Debug/Release builds with different target frameworks
- **Real-time Output**: Live compilation output with error parsing and highlighting

### 🧩 Code Separator Tool
- **Intelligent Analysis**: Automatically analyze C# files for separation opportunities
- **Class Separation**: Extract classes into individual files for better organization
- **Interface Extraction**: Separate interfaces for improved modularity
- **Enum Organization**: Move enums to dedicated files for reusability
- **Method Extraction**: Identify and extract large methods (configurable threshold)
- **Complexity Analysis**: Calculate code complexity scores and provide recommendations

### ⚡ Quick Commands (CLUI Integration)
- `compile-sharp` - Quick compilation with keyboard shortcut (Ctrl+Shift+C)
- `separate-code` - Instant code separation analysis (Ctrl+Shift+S)
- Support for command-line arguments and options
- Detailed help and usage information

### 📁 Enhanced File Handling
- **Smart C# Editor**: Enhanced editing experience for .cs files
- **Code Insights**: Real-time analysis of file quality and structure
- **Quick Actions**: Context menu integration with compilation and separation tools
- **Auto-formatting**: Optional automatic code formatting on save
- **Issue Detection**: Identify potential problems like magic numbers, null references, and TODOs

## 🛠️ Installation & Setup

### Option 1: Use in Existing Replit Project
1. Copy all extension files to your project root
2. Include the extension.json manifest
3. Load the extension using Replit's Extension Devtools

### Option 2: Create New Extension Project
1. Go to Replit Extensions section
2. Create new Extension App named "SharpSeparateCompiler"
3. Choose React or JavaScript template
4. Replace template files with the provided extension code

## 📂 File Structure

```
SharpSeparateCompiler/
├── extension.json           # Extension manifest
├── src/
│   ├── main.js             # Main extension entry point
│   ├── tools/
│   │   ├── compiler.js     # C# Compiler tool
│   │   └── separator.js    # Code Separator tool
│   ├── commands/
│   │   ├── compile.js      # Quick compile command
│   │   └── separate.js     # Quick separate command
│   └── fileHandlers/
│       └── csharp.js       # Enhanced C# file handler
├── assets/
│   ├── styles.css          # Extension styling
│   └── extension.html      # Extension UI template
└── README-EXTENSION.md     # This file
```

## ⚙️ Configuration

### Extension Settings
Access settings via the toolbar settings button or extension preferences:

- **Auto-compile**: Automatically compile on file save
- **Auto-format**: Format code automatically on save  
- **Show warnings**: Display compilation warnings
- **Separation depth**: Conservative/Moderate/Aggressive separation
- **Compiler version**: Target .NET framework version

### Command Arguments

#### compile-sharp
```bash
compile-sharp [options]
  --release, -r     Build in Release configuration
  --verbose, -v     Use detailed verbosity
  --no-restore      Don't restore packages before building
```

#### separate-code
```bash
separate-code [file] [options]
  --execute, -e        Execute the separation (create files)
  --preview, -p        Show detailed preview
  --no-classes         Don't separate classes
  --no-interfaces      Don't separate interfaces
  --no-enums          Don't separate enums
  --extract-methods    Extract large methods
  --max-lines <num>    Maximum lines per file
```

## 🎯 Usage Examples

### Basic Compilation
```bash
# Quick compile current project
compile-sharp

# Release build with verbose output
compile-sharp --release --verbose
```

### Code Separation
```bash
# Analyze current file for separation opportunities
separate-code

# Separate a specific file
separate-code MyLargeClass.cs --execute

# Preview separation with custom settings
separate-code --preview --max-lines 150 --no-enums
```

### Using Tools
1. **Compiler Tool**: Click the hammer icon in the toolbar
2. **Separator Tool**: Click the layer-group icon in the toolbar
3. **Quick Actions**: Use keyboard shortcuts or the quick actions panel

## 🔧 Development

### Local Development
1. Clone/copy the extension files
2. Open in Replit Extension environment
3. Use "Load Locally" in Extension Devtools
4. Test features with "Preview" buttons

### Customization
- Modify `src/tools/` files to add new features
- Update `assets/styles.css` for UI customization
- Add new commands in `src/commands/` directory
- Extend file handlers in `src/fileHandlers/`

## 📊 Analytics & Insights

The extension tracks:
- Compilation success rates
- Code complexity metrics
- Separation recommendations
- File quality scores
- Usage statistics

## 🔍 Code Quality Features

### Automatic Detection
- Long lines (>120 characters)
- Magic numbers
- TODO/FIXME comments
- Potential null reference issues
- High complexity methods

### Recommendations
- File separation suggestions
- Code organization improvements
- Complexity reduction strategies
- Documentation reminders

## 🎨 UI Features

### Modern Interface
- Glassmorphism design
- Dark mode support
- Responsive layout
- Smooth animations
- Keyboard shortcuts

### Interactive Elements
- Real-time progress bars
- Live output displays
- Context menus
- Quick action buttons
- Settings modal

## 🚀 Performance

### Optimizations
- Lazy loading of tools
- Efficient code parsing
- Minimal memory footprint
- Fast file analysis
- Cached compilation results

## 📝 License

MIT License - Feel free to modify and distribute.

## 🤝 Contributing

1. Fork the extension
2. Add new features or improvements
3. Test thoroughly
4. Submit pull request

## 📞 Support

For issues or feature requests:
1. Check existing functionality
2. Review command help text
3. Consult Extension Devtools
4. Report bugs with detailed reproduction steps

---

**Made with ❤️ for the C# development community**