#!/usr/bin/env python3
"""
Portfolio Generator Script for n8n Career Automation System
Automatically generates professional portfolio content for bioinformatics projects
"""

import os
import sys
import json
import logging
import datetime
from typing import Dict, List, Optional
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PortfolioGenerator:
    def __init__(self):
        self.templates_dir = Path(__file__).parent / "templates"
        self.output_dir = Path(__file__).parent / "output"
        self.output_dir.mkdir(exist_ok=True)
        
    def generate_readme_template(self, project_data: Dict[str, str]) -> str:
        """Generate README.md template for GitHub repository"""
        
        name = project_data.get('name', 'Bioinformatics Project')
        description = project_data.get('description', 'A comprehensive bioinformatics analysis project')
        tools = project_data.get('tools', 'Python, R, SQL')
        dataset = project_data.get('dataset', 'Custom Dataset')
        findings = project_data.get('findings', 'Significant insights discovered')
        project_type = project_data.get('type', 'bioinformatics')
        
        # Generate project slug for URLs
        project_slug = name.lower().replace(' ', '-').replace('_', '-')
        
        template = f"""# {name}

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)](.)

## 🎯 Project Overview

{description}

This project demonstrates the application of computational biology and data science techniques to solve real-world biological problems. Through advanced bioinformatics analysis, we uncover valuable insights that contribute to our understanding of complex biological systems.

## ✨ Key Features

- **Advanced Data Processing**: Robust pipeline for handling large-scale biological datasets
- **Statistical Analysis**: Comprehensive statistical methods for biological data interpretation
- **Machine Learning Integration**: ML algorithms for pattern recognition and prediction
- **Interactive Visualizations**: Rich, publication-ready plots and charts
- **Reproducible Research**: Well-documented code ensuring reproducibility
- **Performance Optimized**: Efficient algorithms for handling large datasets

## 🛠️ Technologies Used

### Programming Languages
- **Python 3.8+**: Primary language for data analysis and machine learning
- **R 4.0+**: Statistical computing and specialized bioinformatics packages
- **SQL**: Database queries and data management
- **Bash**: Workflow automation and system integration

### Libraries and Frameworks
```
# Python Libraries
pandas==1.5.0          # Data manipulation and analysis
numpy==1.24.0           # Numerical computing
matplotlib==3.6.0       # Data visualization
seaborn==0.12.0         # Statistical data visualization
scikit-learn==1.2.0     # Machine learning library
biopython==1.81         # Bioinformatics tools
scipy==1.10.0           # Scientific computing

# R Packages
ggplot2                 # Data visualization
dplyr                   # Data manipulation
Bioconductor           # Bioinformatics packages
DESeq2                 # Differential expression analysis
```

### Bioinformatics Tools
- **BLAST**: Sequence similarity search
- **Clustal Omega**: Multiple sequence alignment
- **NCBI Databases**: Biological sequence databases
- **Galaxy**: Web-based bioinformatics platform

## 📊 Dataset Information

- **Source**: {dataset}
- **Format**: CSV, FASTA, JSON (as applicable)
- **Size**: [Dataset size and complexity]
- **Description**: Comprehensive biological dataset containing [data description]
- **Access**: [Data availability and access instructions]

## 🔬 Methodology

### 1. Data Collection and Preprocessing
```python
# Example data loading
import pandas as pd
import numpy as np

# Load and preprocess data
data = pd.read_csv('data/raw/biological_data.csv')
processed_data = preprocess_biological_data(data)
```

### 2. Exploratory Data Analysis
- Statistical summaries and distributions
- Data quality assessment
- Missing value analysis
- Correlation analysis
- Principal Component Analysis (PCA)

### 3. {project_type.title()} Analysis
- Advanced computational methods
- Statistical hypothesis testing
- Model development and validation
- Cross-validation techniques
- Performance evaluation

### 4. Visualization and Interpretation
- Comprehensive plotting and visualization
- Interactive dashboards
- Statistical summaries
- Biological interpretation of results

## 📈 Key Findings

{findings}

### Detailed Results

1. **Statistical Significance**: Identified statistically significant patterns with p-values < 0.05
2. **Model Performance**: Achieved high accuracy and robust performance metrics
3. **Biological Insights**: Discovered novel biological relationships and patterns
4. **Clinical Relevance**: Results have potential applications in clinical settings

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- R 4.0 or higher (optional)
- Git for version control
- Minimum 4GB RAM recommended

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/username/{project_slug}.git
cd {project_slug}
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Download sample data** (if applicable)
```bash
python scripts/download_data.py
```

### Usage

#### Basic Analysis
```python
from src.analysis import BioinformaticsAnalyzer

# Initialize analyzer
analyzer = BioinformaticsAnalyzer()

# Load data
data = analyzer.load_data('data/processed/sample_data.csv')

# Run analysis
results = analyzer.run_analysis(data)

# Generate visualizations
analyzer.create_visualizations(results, output_dir='results/figures/')
```

#### Command Line Interface
```bash
# Run complete analysis pipeline
python main.py --input data/raw/ --output results/

# Generate specific plots
python scripts/visualize.py --data results/analysis_results.json --plot-type heatmap

# Export results
python scripts/export_results.py --format pdf --output reports/
```

## 📁 Project Structure

```
{project_slug}/
├── data/
│   ├── raw/                    # Raw, unprocessed data
│   ├── processed/              # Cleaned and processed data
│   └── external/               # External reference data
├── notebooks/
│   ├── 01_data_exploration.ipynb     # Initial data exploration
│   ├── 02_preprocessing.ipynb        # Data cleaning and preprocessing
│   ├── 03_analysis.ipynb             # Main analysis notebook
│   └── 04_visualization.ipynb        # Results visualization
├── src/
│   ├── __init__.py
│   ├── data/
│   │   ├── __init__.py
│   │   ├── data_loader.py            # Data loading utilities
│   │   └── preprocessing.py          # Data preprocessing functions
│   ├── analysis/
│   │   ├── __init__.py
│   │   ├── statistical_analysis.py   # Statistical methods
│   │   └── machine_learning.py       # ML algorithms
│   ├── visualization/
│   │   ├── __init__.py
│   │   ├── plots.py                  # Plotting functions
│   │   └── interactive.py            # Interactive visualizations
│   └── utils/
│       ├── __init__.py
│       ├── helpers.py                # Utility functions
│       └── config.py                 # Configuration settings
├── scripts/
│   ├── download_data.py              # Data download script
│   ├── run_pipeline.py               # Main pipeline script
│   └── generate_report.py            # Report generation
├── results/
│   ├── figures/                      # Generated plots and figures
│   ├── tables/                       # Result tables and summaries
│   └── reports/                      # Analysis reports
├── tests/
│   ├── __init__.py
│   ├── test_data_loading.py
│   ├── test_analysis.py
│   └── test_visualization.py
├── docs/
│   ├── conf.py                       # Sphinx configuration
│   ├── index.rst                     # Documentation index
│   └── api/                          # API documentation
├── requirements.txt                  # Python dependencies
├── environment.yml                   # Conda environment file
├── setup.py                          # Package setup file
├── README.md                         # This file
├── LICENSE                           # Project license
└── .gitignore                        # Git ignore rules
```

## 📊 Sample Results

### Data Overview
![Data Distribution](results/figures/data_distribution.png)

### Analysis Results
![Analysis Heatmap](results/figures/analysis_heatmap.png)

### Statistical Summary
![Statistical Plot](results/figures/statistical_summary.png)

## 🧪 Testing

Run the test suite to ensure everything works correctly:

```bash
# Run all tests
python -m pytest tests/

# Run tests with coverage
python -m pytest tests/ --cov=src --cov-report=html

# Run specific test module
python -m pytest tests/test_analysis.py -v
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory. To build the documentation locally:

```bash
cd docs/
make html
```

The documentation includes:
- API reference
- Detailed methodology
- Tutorial notebooks
- Installation guide
- Troubleshooting

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite (`python -m pytest`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style
- Follow PEP 8 for Python code
- Use type hints where applicable
- Write comprehensive docstrings
- Add unit tests for new functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

- **Author**: [Your Name]
- **Email**: [your.email@example.com]
- **LinkedIn**: [Your LinkedIn Profile]
- **GitHub**: [Your GitHub Profile]
- **ORCID**: [Your ORCID ID] (if applicable)

## 🙏 Acknowledgments

- Thanks to the bioinformatics community for valuable resources and tools
- Special appreciation to [Specific contributors or organizations]
- Data sources and their maintainers
- Open-source libraries and their developers

## 📈 Citation

If you use this work in your research, please cite:

```bibtex
@software{{{project_slug}_2024,
  author = {{Your Name}},
  title = {{{name}}},
  url = {{https://github.com/username/{project_slug}}},
  year = {{2024}}
}}
```

## 🔗 Related Projects

- [Project 1](https://github.com/username/project1) - Related bioinformatics tool
- [Project 2](https://github.com/username/project2) - Complementary analysis pipeline
- [Project 3](https://github.com/username/project3) - Extended methodology

---

**Built with ❤️ for the advancement of Biotechnology and Bioinformatics research**

> "Computational biology is not just about computers and biology; it's about understanding life through the lens of data and algorithms." - Anonymous

## 📊 Project Statistics

![GitHub stars](https://img.shields.io/github/stars/username/{project_slug})
![GitHub forks](https://img.shields.io/github/forks/username/{project_slug})
![GitHub issues](https://img.shields.io/github/issues/username/{project_slug})
![GitHub last commit](https://img.shields.io/github/last-commit/username/{project_slug})
![GitHub repo size](https://img.shields.io/github/repo-size/username/{project_slug})
"""

        return template
    
    def generate_requirements_txt(self, tools: str) -> str:
        """Generate requirements.txt based on tools used"""
        
        base_requirements = [
            "pandas>=1.5.0",
            "numpy>=1.24.0",
            "matplotlib>=3.6.0",
            "seaborn>=0.12.0",
            "jupyter>=1.0.0",
            "notebook>=6.5.0"
        ]
        
        # Add tool-specific requirements
        if "python" in tools.lower():
            base_requirements.extend([
                "scikit-learn>=1.2.0",
                "scipy>=1.10.0",
                "biopython>=1.81"
            ])
        
        if "machine learning" in tools.lower() or "ml" in tools.lower():
            base_requirements.extend([
                "tensorflow>=2.10.0",
                "keras>=2.10.0",
                "xgboost>=1.7.0"
            ])
        
        if "deep learning" in tools.lower() or "neural" in tools.lower():
            base_requirements.extend([
                "torch>=1.13.0",
                "torchvision>=0.14.0"
            ])
        
        if "visualization" in tools.lower() or "plot" in tools.lower():
            base_requirements.extend([
                "plotly>=5.11.0",
                "bokeh>=2.4.0"
            ])
        
        return "\n".join(sorted(set(base_requirements)))
    
    def generate_gitignore(self) -> str:
        """Generate .gitignore file for bioinformatics project"""
        
        return """# Byte-compiled / optimized / DLL files
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
.hypothesis/
.pytest_cache/

# Jupyter Notebook
.ipynb_checkpoints

# IPython
profile_default/
ipython_config.py

# pyenv
.python-version

# Environment variables
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Data files (large datasets)
data/raw/*.csv
data/raw/*.tsv
data/raw/*.fasta
data/raw/*.fastq
data/raw/*.sam
data/raw/*.bam
data/external/

# Results and outputs
results/temp/
results/cache/
*.log
*.out

# Model files
models/*.pkl
models/*.joblib
models/*.h5
models/*.pb

# R specific
.Rhistory
.Rapp.history
.RData
.Ruserdata

# Temporary files
tmp/
temp/
.tmp/"""
    
    def generate_license(self) -> str:
        """Generate MIT License"""
        
        current_year = datetime.datetime.now().year
        
        return f"""MIT License

Copyright (c) {current_year} [Your Name]

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
SOFTWARE."""
    
    def generate_setup_py(self, project_data: Dict[str, str]) -> str:
        """Generate setup.py for Python package"""
        
        name = project_data.get('name', 'bioinformatics-project')
        description = project_data.get('description', 'A bioinformatics analysis project')
        project_slug = name.lower().replace(' ', '-').replace('_', '-')
        
        return f'''"""Setup script for {name}"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="{project_slug}",
    version="0.1.0",
    author="Your Name",
    author_email="your.email@example.com",
    description="{description}",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/username/{project_slug}",
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
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    extras_require={{
        "dev": [
            "pytest>=7.0.0",
            "pytest-cov>=4.0.0",
            "black>=22.0.0",
            "flake8>=5.0.0",
            "mypy>=0.991",
        ],
        "docs": [
            "sphinx>=5.0.0",
            "sphinx-rtd-theme>=1.0.0",
        ],
    }},
    entry_points={{
        "console_scripts": [
            "{project_slug}=src.main:main",
        ],
    }},
)'''
    
    def generate_complete_project(self, project_data: Dict[str, str]) -> Dict[str, any]:
        """Generate complete project structure and files"""
        
        try:
            name = project_data.get('name', 'Bioinformatics Project')
            project_slug = name.lower().replace(' ', '-').replace('_', '-')
            
            # Create project directory
            project_dir = self.output_dir / project_slug
            project_dir.mkdir(exist_ok=True)
            
            # Generate files
            files_generated = []
            
            # README.md
            readme_content = self.generate_readme_template(project_data)
            readme_path = project_dir / "README.md"
            readme_path.write_text(readme_content, encoding='utf-8')
            files_generated.append("README.md")
            
            # requirements.txt
            requirements_content = self.generate_requirements_txt(project_data.get('tools', ''))
            requirements_path = project_dir / "requirements.txt"
            requirements_path.write_text(requirements_content, encoding='utf-8')
            files_generated.append("requirements.txt")
            
            # .gitignore
            gitignore_content = self.generate_gitignore()
            gitignore_path = project_dir / ".gitignore"
            gitignore_path.write_text(gitignore_content, encoding='utf-8')
            files_generated.append(".gitignore")
            
            # LICENSE
            license_content = self.generate_license()
            license_path = project_dir / "LICENSE"
            license_path.write_text(license_content, encoding='utf-8')
            files_generated.append("LICENSE")
            
            # setup.py
            setup_content = self.generate_setup_py(project_data)
            setup_path = project_dir / "setup.py"
            setup_path.write_text(setup_content, encoding='utf-8')
            files_generated.append("setup.py")
            
            # Create directory structure
            directories = [
                "data/raw",
                "data/processed",
                "data/external",
                "notebooks",
                "src/data",
                "src/analysis",
                "src/visualization",
                "src/utils",
                "scripts",
                "results/figures",
                "results/tables",
                "results/reports",
                "tests",
                "docs"
            ]
            
            for directory in directories:
                dir_path = project_dir / directory
                dir_path.mkdir(parents=True, exist_ok=True)
                
                # Create __init__.py files for Python packages
                if directory.startswith("src/"):
                    init_file = dir_path / "__init__.py"
                    init_file.write_text("", encoding='utf-8')
                
                # Create empty .gitkeep files to preserve directory structure
                gitkeep_file = dir_path / ".gitkeep"
                gitkeep_file.write_text("", encoding='utf-8')
            
            logger.info(f"Generated complete project structure for '{name}'")
            
            return {
                "status": "success",
                "project_name": name,
                "project_slug": project_slug,
                "project_path": str(project_dir),
                "files_generated": files_generated,
                "directories_created": directories,
                "readme_preview": readme_content[:500] + "..."
            }
            
        except Exception as e:
            logger.error(f"Error generating project: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    def generate_linkedin_post(self, project_data: Dict[str, str]) -> str:
        """Generate LinkedIn post about the project"""
        
        name = project_data.get('name', 'Bioinformatics Project')
        description = project_data.get('description', '')
        findings = project_data.get('findings', '')
        tools = project_data.get('tools', 'Python, R')
        
        post = f"""🚀 Excited to share my latest project: {name}!

{description}

This project showcases the power of computational biology and data science in solving real-world biological challenges. Through advanced bioinformatics techniques, I was able to uncover valuable insights that contribute to our understanding of complex biological systems.

🔬 Key Highlights:
• {findings}
• Utilized cutting-edge tools: {tools}
• Developed scalable analysis pipelines
• Generated publication-ready visualizations
• Contributed to open-source bioinformatics community

The intersection of biology and technology continues to fascinate me, and projects like this demonstrate the incredible potential of computational approaches in advancing scientific discovery.

💻 The complete code and documentation are available on my GitHub. Feel free to explore, contribute, or reach out if you have any questions!

#Bioinformatics #DataScience #ComputationalBiology #Biotechnology #Research #OpenSource #MachineLearning #Python #DataAnalysis #LifeSciences

What's your favorite bioinformatics tool or technique? I'd love to hear about your experiences in the comments! 👇"""

        return post

def main():
    """Main function for command-line usage"""
    generator = PortfolioGenerator()
    
    if len(sys.argv) < 2:
        print("Usage: python portfolio_generator.py <command> [args]")
        print("Commands:")
        print("  generate <project_json>    - Generate complete project")
        print("  readme <project_json>      - Generate README only")
        print("  linkedin <project_json>    - Generate LinkedIn post")
        return
    
    command = sys.argv[1].lower()
    
    if command in ['generate', 'readme', 'linkedin']:
        if len(sys.argv) < 3:
            print(f"Usage: python portfolio_generator.py {command} '<project_json>'")
            return
        
        try:
            project_data = json.loads(sys.argv[2])
            
            if command == 'generate':
                result = generator.generate_complete_project(project_data)
                print(json.dumps(result, indent=2))
            elif command == 'readme':
                readme_content = generator.generate_readme_template(project_data)
                print(readme_content)
            elif command == 'linkedin':
                linkedin_post = generator.generate_linkedin_post(project_data)
                print(linkedin_post)
                
        except json.JSONDecodeError:
            print("Error: Invalid JSON format for project data")
            print("Example: '{\"name\": \"Gene Analysis\", \"description\": \"...\", \"tools\": \"Python, R\"}'")
    
    else:
        print(f"Unknown command: {command}")

if __name__ == "__main__":
    main()