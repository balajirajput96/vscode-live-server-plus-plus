#!/usr/bin/env python3
"""
GitHub Documentation Generator for Bioinformatics Projects
Automated documentation generator for biotech/bioinformatics projects
"""

import os
import sys
import argparse
import ast
import json
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime

class GitHubDocumentationGenerator:
    """Automated GitHub documentation generator for bioinformatics projects"""
    
    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        self.project_name = self.project_path.name
        self.analysis_results = {}
        
    def analyze_python_files(self) -> Dict[str, Any]:
        """Analyze Python files in the project directory"""
        python_files = list(self.project_path.glob("**/*.py"))
        
        analysis = {
            'files': [],
            'total_functions': 0,
            'total_classes': 0,
            'imports': set(),
            'docstrings': []
        }
        
        for py_file in python_files:
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                tree = ast.parse(content)
                file_analysis = self._analyze_ast(tree, py_file)
                analysis['files'].append(file_analysis)
                analysis['total_functions'] += file_analysis['functions']
                analysis['total_classes'] += file_analysis['classes']
                analysis['imports'].update(file_analysis['imports'])
                
            except Exception as e:
                print(f"Warning: Could not analyze {py_file}: {e}")
                
        analysis['imports'] = list(analysis['imports'])
        return analysis
    
    def _analyze_ast(self, tree: ast.AST, file_path: Path) -> Dict[str, Any]:
        """Analyze AST for functions, classes, and imports"""
        analysis = {
            'file': str(file_path.relative_to(self.project_path)),
            'functions': 0,
            'classes': 0,
            'imports': set(),
            'docstring': None
        }
        
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                analysis['functions'] += 1
            elif isinstance(node, ast.ClassDef):
                analysis['classes'] += 1
            elif isinstance(node, (ast.Import, ast.ImportFrom)):
                for alias in node.names:
                    if hasattr(node, 'module') and node.module:
                        analysis['imports'].add(node.module)
                    else:
                        analysis['imports'].add(alias.name)
        
        # Get module docstring
        if (isinstance(tree.body[0], ast.Expr) and 
            isinstance(tree.body[0].value, ast.Str)):
            analysis['docstring'] = tree.body[0].value.s
        
        analysis['imports'] = list(analysis['imports'])
        return analysis
    
    def generate_readme(self, output_path: Path) -> str:
        """Generate comprehensive README.md file"""
        readme_content = f"""# {self.project_name}

## 🔬 Project Overview

This bioinformatics project demonstrates advanced computational analysis techniques for biological data processing and interpretation. The implementation showcases industry-standard practices in data science and bioinformatics.

## 📊 Dataset Information

**Data Source**: [Specify your data source]
**Data Type**: [Genomic/Proteomic/Clinical/etc.]
**Sample Size**: [Number of samples/observations]
**Format**: [FASTA/CSV/JSON/etc.]

## 🛠️ Technologies Used

### Programming Languages
- Python 3.8+
- R (optional)
- SQL (if applicable)

### Key Libraries
{self._generate_requirements_section()}

### Development Tools
- Jupyter Notebook
- Git version control
- Docker (containerization)
- pytest (testing)

## 🚀 Installation & Setup

### Prerequisites
```bash
# Ensure Python 3.8+ is installed
python --version

# Install pip if not available
python -m ensurepip --upgrade
```

### Installation Steps
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/{self.project_name.lower()}.git
cd {self.project_name.lower()}

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run setup script (if available)
python setup.py install
```

## 📈 Usage Guide

### Basic Analysis
```python
# Import main modules
from src.analysis import DataProcessor, BioinformaticsAnalyzer
from src.visualization import PlotGenerator

# Initialize the analyzer
processor = DataProcessor('data/input.csv')
analyzer = BioinformaticsAnalyzer(processor.cleaned_data)

# Perform analysis
results = analyzer.run_analysis()

# Generate visualizations
plotter = PlotGenerator(results)
plotter.create_summary_plots()
```

### Advanced Features
```python
# Custom analysis pipeline
pipeline = analyzer.create_pipeline([
    'quality_control',
    'normalization', 
    'differential_analysis',
    'pathway_enrichment'
])

# Execute pipeline
final_results = pipeline.execute()
```

## 📋 Project Structure

```
{self.project_name}/
├── data/                   # Raw and processed data files
│   ├── raw/               # Original datasets
│   ├── processed/         # Cleaned and normalized data
│   └── results/           # Analysis outputs
├── src/                   # Source code
│   ├── analysis/          # Core analysis modules
│   ├── visualization/     # Plotting and visualization
│   ├── utils/            # Utility functions
│   └── tests/            # Unit tests
├── notebooks/            # Jupyter notebooks
├── docs/                 # Documentation
├── requirements.txt      # Python dependencies
├── setup.py             # Installation script
└── README.md           # This file
```

## 🔍 Key Features

### Data Processing
- Automated quality control and validation
- Missing data imputation strategies
- Normalization and scaling techniques
- Outlier detection and handling

### Statistical Analysis
- Descriptive statistics generation
- Hypothesis testing frameworks
- Multiple testing correction
- Effect size calculations

### Visualization
- Interactive plotting with Plotly
- Publication-ready figures
- Statistical plots and heatmaps
- Pathway visualization networks

### Reproducibility
- Parameterized analysis workflows
- Automated report generation
- Version-controlled datasets
- Containerized execution environment

## 📊 Results Summary

### Key Findings
[Describe your main biological/clinical findings here]

### Statistical Significance
[Report p-values, effect sizes, confidence intervals]

### Biological Relevance
[Explain the biological meaning of your results]

### Clinical Implications
[Discuss potential clinical applications if applicable]

## 🧪 Testing

Run the test suite to ensure everything works correctly:

```bash
# Run all tests
pytest tests/

# Run with coverage report
pytest --cov=src tests/

# Run specific test module
pytest tests/test_analysis.py -v
```

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

- [API Reference](docs/api.md)
- [Tutorial Notebooks](notebooks/)
- [Methodology](docs/methodology.md)
- [Troubleshooting](docs/troubleshooting.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Clone for development
git clone https://github.com/yourusername/{self.project_name.lower()}.git
cd {self.project_name.lower()}

# Install in development mode
pip install -e .[dev]

# Install pre-commit hooks
pre-commit install
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Author**: [Your Name]
- **Email**: [your.email@domain.com]
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **LinkedIn**: [Your LinkedIn Profile]

## 🙏 Acknowledgments

- [Dataset Provider/Institution]
- [Relevant research papers or methodologies]
- [Collaborators or advisors]
- [Funding sources if applicable]

## 🔄 Version History

### v1.0.0 (Current)
- Initial release with core analysis pipeline
- Comprehensive visualization suite
- Automated report generation
- Full test coverage

### Planned Features
- [ ] Integration with additional databases
- [ ] Machine learning model implementations
- [ ] Real-time data processing capabilities
- [ ] Web interface for non-technical users

---

**Generated by GitHub Documentation Generator v1.0**
*Last updated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}*
"""

        readme_path = output_path / "README.md"
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(readme_content)
            
        return str(readme_path)
    
    def _generate_requirements_section(self) -> str:
        """Generate requirements section based on detected imports"""
        common_bioinfo_packages = {
            'pandas': 'pandas>=1.3.0',
            'numpy': 'numpy>=1.21.0', 
            'matplotlib': 'matplotlib>=3.4.0',
            'seaborn': 'seaborn>=0.11.0',
            'scipy': 'scipy>=1.7.0',
            'sklearn': 'scikit-learn>=1.0.0',
            'plotly': 'plotly>=5.0.0',
            'biopython': 'biopython>=1.79',
            'pysam': 'pysam>=0.16.0',
            'requests': 'requests>=2.25.0'
        }
        
        requirements = []
        for imp in self.analysis_results.get('imports', []):
            if imp in common_bioinfo_packages:
                requirements.append(f"- {common_bioinfo_packages[imp]}")
        
        if not requirements:
            requirements = [
                "- pandas>=1.3.0",
                "- numpy>=1.21.0", 
                "- matplotlib>=3.4.0",
                "- scipy>=1.7.0"
            ]
            
        return '\n'.join(requirements)
    
    def generate_additional_files(self, output_path: Path, project_name: str) -> None:
        """Generate additional project files"""
        
        # Generate requirements.txt
        requirements_content = """# Core data science libraries
pandas>=1.3.0
numpy>=1.21.0
matplotlib>=3.4.0
seaborn>=0.11.0
scipy>=1.7.0

# Bioinformatics specific
biopython>=1.79
pysam>=0.16.0

# Machine learning
scikit-learn>=1.0.0

# Visualization
plotly>=5.0.0

# Development tools
pytest>=6.0.0
pytest-cov>=2.12.0
black>=21.0.0
flake8>=3.9.0

# Documentation
sphinx>=4.0.0
sphinx-rtd-theme>=0.5.0
"""
        
        requirements_path = output_path / "requirements.txt"
        with open(requirements_path, 'w') as f:
            f.write(requirements_content)
        
        # Generate .gitignore
        gitignore_content = """# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# C extensions
*.so

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
pip-wheel-metadata/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# PyInstaller
*.manifest
*.spec

# Installer logs
pip-log.txt
pip-delete-this-directory.txt

# Unit test / coverage reports
htmlcov/
.tox/
.nox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.py,cover
.hypothesis/
.pytest_cache/

# Translations
*.mo
*.pot

# Django stuff:
*.log
local_settings.py
db.sqlite3

# Flask stuff:
instance/
.webassets-cache

# Scrapy stuff:
.scrapy

# Sphinx documentation
docs/_build/

# PyBuilder
target/

# Jupyter Notebook
.ipynb_checkpoints

# pyenv
.python-version

# celery beat schedule file
celerybeat-schedule

# SageMath parsed files
*.sage.py

# Environments
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# Spyder project settings
.spyderproject
.spyproject

# Rope project settings
.ropeproject

# mkdocs documentation
/site

# mypy
.mypy_cache/
.dmypy.json
dmypy.json

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Data files (add your specific data extensions)
*.csv
*.tsv
*.xlsx
*.h5
*.hdf5
*.pkl
*.pickle

# Large result files
results/
output/
plots/
figures/
"""
        
        gitignore_path = output_path / ".gitignore"
        with open(gitignore_path, 'w') as f:
            f.write(gitignore_content)
        
        # Generate CONTRIBUTING.md
        contributing_content = f"""# Contributing to {project_name}

Thank you for your interest in contributing to this bioinformatics project!

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/{project_name.lower()}.git`
3. Create a virtual environment: `python -m venv venv`
4. Activate it: `source venv/bin/activate` (or `venv\\Scripts\\activate` on Windows)
5. Install dependencies: `pip install -r requirements.txt`
6. Install pre-commit hooks: `pre-commit install`

## Code Standards

- Follow PEP 8 style guidelines
- Use type hints where appropriate
- Write comprehensive docstrings
- Include unit tests for new functionality
- Ensure all tests pass before submitting

## Submitting Changes

1. Create a feature branch: `git checkout -b feature-name`
2. Make your changes
3. Run tests: `pytest`
4. Run linting: `flake8 src/`
5. Commit: `git commit -m "Description of changes"`
6. Push: `git push origin feature-name`
7. Create a Pull Request

## Reporting Issues

Please use the GitHub issue tracker to report bugs or request features.
Include:
- Clear description of the problem
- Steps to reproduce
- Expected behavior
- Your environment details
"""
        
        contributing_path = output_path / "CONTRIBUTING.md"
        with open(contributing_path, 'w') as f:
            f.write(contributing_content)
    
    def generate_documentation(self, output_dir: Optional[str] = None) -> Dict[str, Any]:
        """Generate complete GitHub documentation"""
        try:
            # Set output directory
            if output_dir:
                output_path = Path(output_dir)
            else:
                output_path = self.project_path
            
            output_path.mkdir(exist_ok=True)
            
            # Analyze the project
            self.analysis_results = self.analyze_python_files()
            
            # Generate files
            files_generated = []
            
            # Generate README.md
            readme_path = self.generate_readme(output_path)
            files_generated.append(readme_path)
            
            # Generate additional files
            self.generate_additional_files(output_path, self.project_name)
            files_generated.extend([
                str(output_path / "requirements.txt"),
                str(output_path / ".gitignore"),
                str(output_path / "CONTRIBUTING.md")
            ])
            
            return {
                'project_name': self.project_name,
                'files_generated': files_generated,
                'python_files_analyzed': len(self.analysis_results['files']),
                'total_functions': self.analysis_results['total_functions'],
                'total_classes': self.analysis_results['total_classes']
            }
            
        except Exception as e:
            return {'error': str(e)}

def main():
    """Main function to run the documentation generator"""
    parser = argparse.ArgumentParser(description="Generate GitHub documentation for bioinformatics projects")
    parser.add_argument("project_path", help="Path to the project directory")
    parser.add_argument("--output", "-o", help="Output directory (default: project directory)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.project_path):
        print(f"Error: Project path '{args.project_path}' does not exist")
        return 1
    
    try:
        generator = GitHubDocumentationGenerator(args.project_path)
        result = generator.generate_documentation(args.output)
        
        if "error" in result:
            print(f"Error: {result['error']}")
            return 1
        
        print("✅ Documentation generated successfully!")
        print(f"📁 Project: {result['project_name']}")
        print(f"📄 Files generated: {len(result['files_generated'])}")
        print(f"🐍 Python files analyzed: {result['python_files_analyzed']}")
        print(f"🔧 Total functions: {result['total_functions']}")
        print(f"🏗️ Total classes: {result['total_classes']}")
        
        if args.verbose:
            print("\n📋 Generated files:")
            for file_path in result['files_generated']:
                print(f"  - {file_path}")
        
        return 0
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())