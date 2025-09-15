#!/usr/bin/env python3
"""
🚀 GitHub Documentation Generator
Automated README.md and documentation generation for bioinformatics projects

Features:
- Auto-generate README.md from Python scripts
- Extract function documentation
- Generate requirements.txt
- Create project structure
- Update existing documentation
"""

import os
import re
import ast
import json
import argparse
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

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
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        try:
            tree = ast.parse(content)
        except SyntaxError:
            return {"error": f"Syntax error in {file_path.name}"}
        
        analysis = {
            "filename": file_path.name,
            "functions": [],
            "classes": [],
            "imports": [],
            "docstring": "",
            "lines_of_code": len(content.split('\n'))
        }
        
        # Extract imports
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    analysis["imports"].append(alias.name)
            elif isinstance(node, ast.ImportFrom):
                module = node.module or ""
                for alias in node.names:
                    analysis["imports"].append(f"{module}.{alias.name}")
        
        # Extract functions and classes
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                func_info = {
                    "name": node.name,
                    "docstring": ast.get_docstring(node) or "",
                    "args": [arg.arg for arg in node.args.args],
                    "returns": ast.get_docstring(node) or ""
                }
                analysis["functions"].append(func_info)
            elif isinstance(node, ast.ClassDef):
                class_info = {
                    "name": node.name,
                    "docstring": ast.get_docstring(node) or "",
                    "methods": []
                }
                for child in node.body:
                    if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)):
                        method_info = {
                            "name": child.name,
                            "docstring": ast.get_docstring(child) or ""
                        }
                        class_info["methods"].append(method_info)
                analysis["classes"].append(class_info)
        
        # Extract module docstring
        if tree.body and isinstance(tree.body[0], ast.Expr) and isinstance(tree.body[0].value, ast.Str):
            analysis["docstring"] = tree.body[0].value.s
        
        return analysis
    
    def generate_requirements_txt(self, python_files: List[Path]) -> str:
        """Generate requirements.txt from Python imports"""
        all_imports = set()
        
        for file_path in python_files:
            analysis = self.analyze_python_file(file_path)
            if "imports" in analysis:
                all_imports.update(analysis["imports"])
        
        # Common bioinformatics packages with versions
        package_versions = {
            "pandas": ">=1.3.0",
            "numpy": ">=1.21.0",
            "matplotlib": ">=3.4.0",
            "seaborn": ">=0.11.0",
            "scikit-learn": ">=1.0.0",
            "biopython": ">=1.79",
            "plotly": ">=5.0.0",
            "jupyter": ">=1.0.0",
            "requests": ">=2.25.0",
            "beautifulsoup4": ">=4.9.0"
        }
        
        requirements = []
        for import_name in all_imports:
            # Extract base package name
            base_package = import_name.split('.')[0]
            if base_package in package_versions:
                requirements.append(f"{base_package}{package_versions[base_package]}")
            elif base_package not in ['os', 'sys', 'json', 'datetime', 'pathlib', 'typing', 're', 'ast']:
                requirements.append(base_package)
        
        return "\n".join(sorted(set(requirements)))
    
    def generate_readme_content(self, project_name: str, analysis_results: List[Dict]) -> str:
        """Generate README.md content"""
        
        # Extract project information
        main_file = None
        total_functions = 0
        total_classes = 0
        
        for analysis in analysis_results:
            if "error" not in analysis:
                total_functions += len(analysis.get("functions", []))
                total_classes += len(analysis.get("classes", []))
                if not main_file and analysis.get("docstring"):
                    main_file = analysis
        
        # Generate README content
        readme_content = f"""# {project_name.replace('_', ' ').title()}

## 📋 Project Overview

{main_file.get('docstring', 'A bioinformatics project for data analysis and visualization.') if main_file else 'A bioinformatics project for data analysis and visualization.'}

## 🚀 Features

- **Data Analysis**: Comprehensive data processing and analysis capabilities
- **Visualization**: Advanced plotting and charting features
- **Bioinformatics Tools**: Specialized functions for biological data
- **Modular Design**: Well-organized, reusable code structure

## 📊 Project Statistics

- **Total Functions**: {total_functions}
- **Total Classes**: {total_classes}
- **Python Files**: {len(analysis_results)}

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/{project_name}.git
cd {project_name}

# Install dependencies
pip install -r requirements.txt
```

## 📖 Usage

```python
# Example usage
from {project_name} import main_function

# Run analysis
results = main_function(data)
```

## 📋 Requirements

- Python 3.8+
- See `requirements.txt` for package dependencies

## 🔬 Key Functions

"""
        
        # Add function documentation
        for analysis in analysis_results:
            if "error" not in analysis:
                for func in analysis.get("functions", []):
                    if func.get("docstring"):
                        readme_content += f"""
### {func['name']}

{func['docstring']}

**Parameters:**
- {', '.join(func['args']) if func['args'] else 'None'}

"""
        
        readme_content += f"""
## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Contact

- **LinkedIn**: [Your LinkedIn Profile]
- **Portfolio**: [Your Portfolio Website]
- **Email**: [your.email@example.com]

---

**Built with ❤️ for the Bioinformatics Community**
"""
        
        return readme_content
    
    def generate_setup_py(self, project_name: str, requirements: str) -> str:
        """Generate setup.py file"""
        setup_content = f"""#!/usr/bin/env python3
\"\"\"
Setup script for {project_name}
\"\"\"

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements_list = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="{project_name}",
    version="0.1.0",
    author="Your Name",
    author_email="your.email@example.com",
    description="A bioinformatics project for data analysis and visualization",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url=f"https://github.com/yourusername/{project_name}",
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
    install_requires=requirements_list,
    extras_require={{
        "dev": [
            "pytest>=6.0",
            "black>=21.0",
            "flake8>=3.8",
        ],
    }},
)
"""
        return setup_content
    
    def create_project_structure(self) -> None:
        """Create recommended project structure"""
        directories = [
            "data",
            "docs",
            "tests",
            "examples",
            "config",
            "templates"
        ]
        
        for directory in directories:
            dir_path = self.project_path / directory
            dir_path.mkdir(exist_ok=True)
            
            # Create .gitkeep files for empty directories
            if not any(dir_path.iterdir()):
                (dir_path / ".gitkeep").touch()
    
    def generate_documentation(self, output_dir: Optional[str] = None) -> Dict:
        """Generate complete documentation for the project"""
        if output_dir is None:
            output_dir = self.project_path
        
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Find all Python files
        python_files = list(self.project_path.rglob("*.py"))
        python_files = [f for f in python_files if "venv" not in str(f) and "env" not in str(f)]
        
        if not python_files:
            return {"error": "No Python files found in the project"}
        
        # Analyze all Python files
        analysis_results = []
        for file_path in python_files:
            analysis = self.analyze_python_file(file_path)
            analysis_results.append(analysis)
        
        # Generate project name from directory
        project_name = self.project_path.name
        
        # Generate requirements.txt
        requirements_content = self.generate_requirements_txt(python_files)
        requirements_path = output_path / "requirements.txt"
        with open(requirements_path, 'w') as f:
            f.write(requirements_content)
        
        # Generate README.md
        readme_content = self.generate_readme_content(project_name, analysis_results)
        readme_path = output_path / "README.md"
        with open(readme_path, 'w') as f:
            f.write(readme_content)
        
        # Generate setup.py
        setup_content = self.generate_setup_py(project_name, requirements_content)
        setup_path = output_path / "setup.py"
        with open(setup_path, 'w') as f:
            f.write(setup_content)
        
        # Create project structure
        self.create_project_structure()
        
        # Generate additional files
        self.generate_additional_files(output_path, project_name)
        
        return {
            "success": True,
            "files_generated": [
                str(requirements_path),
                str(readme_path),
                str(setup_path)
            ],
            "project_name": project_name,
            "python_files_analyzed": len(python_files),
            "total_functions": sum(len(analysis.get("functions", [])) for analysis in analysis_results if "error" not in analysis),
            "total_classes": sum(len(analysis.get("classes", [])) for analysis in analysis_results if "error" not in analysis)
        }
    
    def generate_additional_files(self, output_path: Path, project_name: str) -> None:
        """Generate additional project files"""
        
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

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Project specific
data/raw/
data/processed/
*.csv
*.xlsx
*.json
*.pkl
*.h5
"""
        
        gitignore_path = output_path / ".gitignore"
        with open(gitignore_path, 'w') as f:
            f.write(gitignore_content)
        
        # Generate LICENSE
        license_content = """MIT License

Copyright (c) 2024 [Your Name]

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
        
        # Generate CONTRIBUTING.md
        contributing_content = f"""# Contributing to {project_name}

We love your input! We want to make contributing to {project_name} as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github
We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html)
We use GitHub Flow. So all code changes happen through Pull Requests.

## Pull Requests
1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License
In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issue tracker](https://github.com/yourusername/{project_name}/issues)
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/{project_name}/issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License
By contributing, you agree that your contributions will be licensed under its MIT License.

## References
This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md).
"""
        
        contributing_path = output_path / "CONTRIBUTING.md"
        with open(contributing_path, 'w') as f:
            f.write(contributing_content)

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
    exit(main())