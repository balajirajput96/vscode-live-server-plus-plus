#!/usr/bin/env python3
"""
GitHub Documentation Generator for Bioinformatics Projects
Automated documentation creation with AI integration
"""

import json
import os
import ast
import re
from pathlib import Path
from typing import Dict, List, Optional
import argparse


class GitHubDocumentationGenerator:
    """Automated GitHub documentation generator for bioinformatics projects"""
    
    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        self.config = self.load_config()
        
    def load_config(self) -> Dict:
        """Load configuration from config file"""
        config_path = self.project_path / "config" / "documentation_config.json"
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        else:
            return self.get_default_config()
    
    def get_default_config(self) -> Dict:
        """Get default configuration for bioinformatics projects"""
        return {
            "project_type": "bioinformatics",
            "target_audience": ["researchers", "data_scientists", "pharmaceutical_professionals"],
            "keywords": ["biotechnology", "bioinformatics", "data_analysis", "python", "pharmaceutical"],
            "sections": [
                "project_overview",
                "features",
                "installation",
                "usage",
                "requirements",
                "contributing",
                "license"
            ],
            "templates": {
                "readme": "templates/readme_template.md",
                "requirements": "templates/requirements_template.txt",
                "setup": "templates/setup_template.py"
            }
        }
    
    def analyze_python_file(self, file_path: Path) -> Dict:
        """Analyze Python file and extract information"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            tree = ast.parse(content)
            
            info = {
                "file_path": str(file_path),
                "imports": [],
                "functions": [],
                "classes": [],
                "docstring": ast.get_docstring(tree) or ""
            }
            
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        info["imports"].append(alias.name)
                elif isinstance(node, ast.ImportFrom):
                    if node.module:
                        info["imports"].append(node.module)
                elif isinstance(node, ast.FunctionDef):
                    info["functions"].append({
                        "name": node.name,
                        "docstring": ast.get_docstring(node) or "",
                        "args": [arg.arg for arg in node.args.args]
                    })
                elif isinstance(node, ast.ClassDef):
                    info["classes"].append({
                        "name": node.name,
                        "docstring": ast.get_docstring(node) or "",
                        "methods": [n.name for n in node.body if isinstance(n, ast.FunctionDef)]
                    })
            
            return info
        except Exception as e:
            print(f"Error analyzing {file_path}: {e}")
            return {"file_path": str(file_path), "error": str(e)}
    
    def generate_requirements_txt(self, python_files: List[Path]) -> str:
        """Generate requirements.txt from Python imports"""
        all_imports = set()
        
        for file_path in python_files:
            info = self.analyze_python_file(file_path)
            if "imports" in info:
                all_imports.update(info["imports"])
        
        # Filter out standard library modules
        stdlib_modules = {
            'os', 'sys', 'json', 'ast', 're', 'pathlib', 'typing', 'argparse',
            'collections', 'itertools', 'functools', 'datetime', 'time', 'math',
            'random', 'csv', 'sqlite3', 'urllib', 'http', 'email', 'html',
            'xml', 'unittest', 'logging', 'subprocess', 'threading', 'multiprocessing'
        }
        
        external_imports = all_imports - stdlib_modules
        
        # Map common imports to package names
        package_mapping = {
            'numpy': 'numpy>=1.21.0',
            'pandas': 'pandas>=1.3.0',
            'matplotlib': 'matplotlib>=3.4.0',
            'seaborn': 'seaborn>=0.11.0',
            'scipy': 'scipy>=1.7.0',
            'sklearn': 'scikit-learn>=1.0.0',
            'requests': 'requests>=2.25.0',
            'flask': 'Flask>=2.0.0',
            'django': 'Django>=3.2.0',
            'fastapi': 'fastapi>=0.65.0',
            'biopython': 'biopython>=1.78',
            'plotly': 'plotly>=5.0.0'
        }
        
        requirements = []
        for imp in sorted(external_imports):
            if imp in package_mapping:
                requirements.append(package_mapping[imp])
            else:
                requirements.append(f"{imp}>=1.0.0")
        
        return '\n'.join(requirements)
    
    def generate_readme_content(self, project_name: str, analysis_results: List[Dict]) -> str:
        """Generate README.md content"""
        
        # Extract project information
        all_functions = []
        all_classes = []
        main_description = ""
        
        for result in analysis_results:
            if "functions" in result:
                all_functions.extend(result["functions"])
            if "classes" in result:
                all_classes.extend(result["classes"])
            if result.get("docstring") and not main_description:
                main_description = result["docstring"]
        
        readme_content = f"""# {project_name}

{main_description or "A bioinformatics project for data analysis and research."}

## 🧬 Project Overview

This project provides tools and utilities for bioinformatics research, focusing on data analysis, visualization, and computational biology applications.

## ✨ Features

"""
        
        if all_classes:
            readme_content += "### Classes\n"
            for cls in all_classes[:5]:  # Limit to first 5
                readme_content += f"- **{cls['name']}**: {cls['docstring'][:100] or 'No description available'}...\n"
            readme_content += "\n"
        
        if all_functions:
            readme_content += "### Functions\n"
            for func in all_functions[:5]:  # Limit to first 5
                readme_content += f"- **{func['name']}**: {func['docstring'][:100] or 'No description available'}...\n"
            readme_content += "\n"
        
        readme_content += """## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/username/{project_name}.git
cd {project_name}

# Install dependencies
pip install -r requirements.txt
```

## 📊 Usage

```python
# Basic usage example
from {project_name} import main_module

# Initialize and run
result = main_module.analyze_data('data.csv')
print(result)
```

## 📋 Requirements

See `requirements.txt` for detailed dependencies.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contact

For questions or collaboration opportunities, please contact:
- Email: researcher@university.edu
- GitHub: @username

## 🔬 Citation

If you use this software in your research, please cite:

```
@software{{{project_name},
  author = {{Research Team}},
  title = {{{project_name}}},
  url = {{https://github.com/username/{project_name}}},
  year = {{2024}}
}}
```
""".format(project_name=project_name.lower().replace(' ', '_'))
        
        return readme_content
    
    def generate_setup_py(self, project_name: str, requirements: str) -> str:
        """Generate setup.py file"""
        requirements_list = [req.split('>=')[0] for req in requirements.split('\n') if req.strip()]
        
        return f'''from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="{project_name.lower().replace(' ', '-')}",
    version="0.1.0",
    author="Research Team",
    author_email="researcher@university.edu",
    description="A bioinformatics project for data analysis and research",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/username/{project_name.lower().replace(' ', '-')}",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Science/Research",
        "Topic :: Scientific/Engineering :: Bio-Informatics",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
    python_requires=">=3.8",
    install_requires={requirements_list},
    keywords="bioinformatics data-analysis research computational-biology",
)
'''
    
    def create_project_structure(self) -> None:
        """Create recommended project structure"""
        dirs = [
            "data", "src", "tests", "docs", "examples", "scripts", "results"
        ]
        
        for dir_name in dirs:
            dir_path = self.project_path / dir_name
            dir_path.mkdir(exist_ok=True)
            
            # Create __init__.py for src
            if dir_name == "src":
                init_file = dir_path / "__init__.py"
                init_file.touch()
    
    def generate_additional_files(self, output_path: Path, project_name: str) -> None:
        """Generate additional project files"""
        
        # .gitignore
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
*.egg-info/
.installed.cfg
*.egg

# PyInstaller
*.manifest
*.spec

# Installer logs
pip-log.txt
pip-delete-this-directory.txt

# Unit test / coverage reports
htmlcov/
.tox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
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

# Data files
*.csv
*.tsv
*.xlsx
*.json
*.xml
*.h5
*.hdf5
*.pkl
*.pickle
results/
data/raw/
data/processed/
"""
        
        gitignore_path = output_path / ".gitignore"
        with open(gitignore_path, 'w') as f:
            f.write(gitignore_content)
        
        # LICENSE
        license_content = """MIT License

Copyright (c) 2024 Research Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""
        
        license_path = output_path / "LICENSE"
        with open(license_path, 'w') as f:
            f.write(license_content)
        
        # CONTRIBUTING.md
        contributing_content = f"""# Contributing to {project_name}

Thank you for your interest in contributing to this project! This document provides guidelines for contributing.

## How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes**
4. **Add tests** for your changes if applicable
5. **Run tests**: `python -m pytest tests/`
6. **Commit your changes**: `git commit -am 'Add new feature'`
7. **Push to your fork**: `git push origin feature/new-feature`
8. **Submit a Pull Request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/{project_name.lower().replace(' ', '-')}.git
cd {project_name.lower().replace(' ', '-')}

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install development dependencies
pip install -r requirements.txt
pip install -e .
```

## Code Style

- Follow PEP 8 guidelines
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Include type hints where appropriate

## Testing

- Write tests for new functionality
- Ensure all tests pass before submitting PR
- Aim for good test coverage

## Reporting Issues

When reporting issues, please include:
- Python version
- Operating system
- Steps to reproduce the issue
- Expected vs actual behavior
- Any error messages

## Questions?

Feel free to open an issue for questions or join our discussions.
"""
        
        contributing_path = output_path / "CONTRIBUTING.md"
        with open(contributing_path, 'w') as f:
            f.write(contributing_content)
    
    def run(self, output_path: Optional[str] = None, project_name: Optional[str] = None, verbose: bool = False) -> None:
        """Run the documentation generator"""
        
        if output_path:
            output_dir = Path(output_path)
        else:
            output_dir = self.project_path
        
        output_dir.mkdir(exist_ok=True)
        
        if not project_name:
            project_name = self.project_path.name.replace('_', ' ').replace('-', ' ').title()
        
        if verbose:
            print(f"Generating documentation for: {project_name}")
            print(f"Output directory: {output_dir}")
        
        # Find Python files
        python_files = list(self.project_path.glob("**/*.py"))
        if verbose:
            print(f"Found {len(python_files)} Python files")
        
        # Analyze Python files
        analysis_results = []
        for py_file in python_files:
            if verbose:
                print(f"Analyzing: {py_file}")
            result = self.analyze_python_file(py_file)
            analysis_results.append(result)
        
        # Generate requirements.txt
        if verbose:
            print("Generating requirements.txt...")
        requirements = self.generate_requirements_txt(python_files)
        requirements_path = output_dir / "requirements.txt"
        with open(requirements_path, 'w') as f:
            f.write(requirements)
        
        # Generate README.md
        if verbose:
            print("Generating README.md...")
        readme_content = self.generate_readme_content(project_name, analysis_results)
        readme_path = output_dir / "README.md"
        with open(readme_path, 'w') as f:
            f.write(readme_content)
        
        # Generate setup.py
        if verbose:
            print("Generating setup.py...")
        setup_content = self.generate_setup_py(project_name, requirements)
        setup_path = output_dir / "setup.py"
        with open(setup_path, 'w') as f:
            f.write(setup_content)
        
        # Create project structure
        if verbose:
            print("Creating project structure...")
        self.create_project_structure()
        
        # Generate additional files
        if verbose:
            print("Generating additional files...")
        self.generate_additional_files(output_dir, project_name)
        
        if verbose:
            print("Documentation generation complete!")


def main():
    parser = argparse.ArgumentParser(description="Generate GitHub documentation for bioinformatics projects")
    parser.add_argument("project_path", help="Path to the project directory")
    parser.add_argument("--output", "-o", help="Output directory (defaults to project directory)")
    parser.add_argument("--name", "-n", help="Project name (defaults to directory name)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    generator = GitHubDocumentationGenerator(args.project_path)
    generator.run(args.output, args.name, args.verbose)


if __name__ == "__main__":
    main()