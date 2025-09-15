# 📚 GitHub Documentation AI Prompts

## 🎯 DocuWriter.ai Prompts

### Main Documentation Generation Prompt

**Copy and paste this prompt into DocuWriter.ai:**

```
Analyze the provided Python script and generate a comprehensive README.md file for my GitHub repository.

The README should include the following sections:

1. **Project Title:** [Auto-generated from file name]

2. **Description:** A brief, non-technical overview of the project's goal. Explain that this project analyzes [डेटासेट का प्रकार, जैसे: drug trial data] to find [विश्लेषण का लक्ष्य, जैसे: correlations between drug regimen and tumor volume].

3. **Data Source:** Mention that the data is from [डेटा का स्रोत, जैसे: a public dataset from Kaggle].

4. **Methodology:** Briefly explain the steps taken, such as data cleaning with Pandas and visualization with Matplotlib.

5. **Key Findings:** Summarize the main results of the analysis.

6. **How to Run the Code:** Provide instructions on necessary libraries (e.g., pandas, matplotlib) and how to execute the script.

7. **Requirements:** List all required Python packages with versions.

8. **Installation:** Step-by-step setup instructions.

9. **Usage:** How to use the script with examples.

10. **Contributing:** Guidelines for contributions.

11. **License:** MIT License or appropriate license.

Make the content professional, clear, and suitable for biotechnology/bioinformatics professionals.
```

### Advanced Documentation Prompt

```
Create a professional GitHub repository documentation for a bioinformatics project with:

**Repository Structure:**
- Clear folder organization
- Data folder with sample datasets
- Documentation folder with detailed guides
- Examples folder with usage examples

**README.md Sections:**
1. Project Overview (2-3 sentences)
2. Features and Capabilities
3. Installation Guide
4. Quick Start Tutorial
5. API Documentation (if applicable)
6. Examples and Use Cases
7. Contributing Guidelines
8. License Information

**Additional Files:**
- requirements.txt with exact versions
- setup.py for package installation
- .gitignore for Python projects
- LICENSE file
- CONTRIBUTING.md
- CHANGELOG.md

Use professional scientific terminology and clear explanations for both technical and non-technical audiences.
```

## 🔧 GitHub Copilot Prompts

### For README.md Generation

```
Generate a professional README.md for a bioinformatics Python project with the following structure:

# Project Name
Brief description of what the project does and its purpose in bioinformatics research.

## Features
- Key functionality 1
- Key functionality 2
- Key functionality 3

## Installation
```bash
pip install -r requirements.txt
```

## Usage
```python
# Example code snippet
import project_name
result = project_name.analyze_data(data)
```

## Requirements
- Python 3.8+
- pandas
- numpy
- matplotlib
- seaborn

## Contributing
Guidelines for contributing to the project.

## License
MIT License
```

### For Code Documentation

```
Add comprehensive docstrings to this Python function following Google style:

def analyze_gene_expression(data, threshold=0.05):
    """
    Analyze gene expression data to identify differentially expressed genes.
    
    Args:
        data (pd.DataFrame): Gene expression data with genes as rows and samples as columns
        threshold (float): P-value threshold for significance (default: 0.05)
    
    Returns:
        dict: Dictionary containing:
            - 'significant_genes': List of significantly expressed genes
            - 'statistics': Statistical summary
            - 'visualization': Path to generated plot
    
    Raises:
        ValueError: If data is empty or threshold is invalid
    
    Example:
        >>> result = analyze_gene_expression(gene_data, threshold=0.01)
        >>> print(f"Found {len(result['significant_genes'])} significant genes")
    """
```

## 📊 Project-Specific Prompts

### For Data Analysis Projects

```
Create documentation for a bioinformatics data analysis project:

**Project:** [Project Name]
**Goal:** Analyze [specific biological data] to [specific objective]
**Tools:** Python, Pandas, Matplotlib, Seaborn, Scikit-learn

**Documentation Requirements:**
1. Clear explanation of the biological problem
2. Data preprocessing steps
3. Analysis methodology
4. Results interpretation
5. Visualization descriptions
6. Code execution instructions
7. Dependencies and environment setup

**Target Audience:** 
- Bioinformatics researchers
- Data scientists
- Pharmaceutical industry professionals
- Academic researchers

Make it accessible to both technical and non-technical stakeholders.
```

### For Web Development Projects

```
Generate documentation for a bioinformatics web application:

**Project:** [Web App Name]
**Purpose:** Web-based tool for [specific bioinformatics task]
**Technologies:** HTML, CSS, JavaScript, Python Flask/Django

**Documentation Sections:**
1. Application Overview
2. Features and Functionality
3. Installation and Deployment
4. API Documentation (if applicable)
5. User Guide
6. Development Setup
7. Testing Instructions
8. Deployment Guide

**Include:**
- Screenshots of the application
- Code examples
- Configuration instructions
- Troubleshooting guide
```

## 🎨 Visual Documentation Prompts

### For Diagrams and Flowcharts

```
Create visual documentation for this bioinformatics workflow:

**Workflow Steps:**
1. Data Input and Validation
2. Preprocessing and Cleaning
3. Analysis and Processing
4. Results Generation
5. Visualization and Reporting

**Requirements:**
- Use Mermaid or PlantUML syntax
- Include decision points and error handling
- Show data flow between steps
- Add color coding for different process types
- Include tool names and technologies used

**Output Format:** Mermaid flowchart code
```

### For API Documentation

```
Generate comprehensive API documentation for a bioinformatics REST API:

**Endpoints:**
- POST /analyze - Submit data for analysis
- GET /results/{id} - Retrieve analysis results
- GET /status/{id} - Check analysis status
- DELETE /results/{id} - Delete analysis results

**Documentation Requirements:**
1. Endpoint descriptions
2. Request/response schemas
3. Authentication methods
4. Error codes and messages
5. Rate limiting information
6. Code examples in Python, JavaScript, and curl
7. Testing instructions

**Format:** OpenAPI/Swagger specification
```

## 🔄 Automation Prompts

### For Automated Documentation Updates

```
Create a script that automatically updates GitHub documentation when code changes:

**Requirements:**
1. Monitor Python files for changes
2. Extract function signatures and docstrings
3. Update README.md with new functions
4. Generate requirements.txt from imports
5. Update CHANGELOG.md with version changes
6. Commit and push changes to GitHub

**Tools:** Python, Git, GitHub Actions
**Triggers:** Code commits, new releases, documentation updates
```

### For Continuous Integration

```
Set up GitHub Actions workflow for automated documentation:

**Workflow Steps:**
1. Check out code
2. Install dependencies
3. Run documentation generation
4. Validate documentation format
5. Deploy to GitHub Pages
6. Notify on completion

**Triggers:** Push to main branch, pull requests, releases
**Output:** Automated documentation website
```

## 📈 Quality Assurance Prompts

### For Documentation Review

```
Review and improve this GitHub documentation:

**Checklist:**
- [ ] Clear project description
- [ ] Complete installation instructions
- [ ] Usage examples provided
- [ ] Requirements listed accurately
- [ ] Contributing guidelines included
- [ ] License information present
- [ ] No broken links
- [ ] Professional tone maintained
- [ ] Technical accuracy verified
- [ ] Accessibility considerations

**Improvements Needed:**
- Add missing sections
- Clarify unclear instructions
- Update outdated information
- Improve formatting and structure
```

### For SEO Optimization

```
Optimize GitHub repository for search engines:

**Keywords:** bioinformatics, data analysis, Python, biotechnology, gene expression, pharmaceutical

**Optimization Tasks:**
1. Add relevant keywords to README title and description
2. Include project tags and topics
3. Write detailed project description
4. Add screenshots and visual content
5. Include links to related projects
6. Update repository description
7. Add appropriate license
8. Include citation information

**Target:** Improve discoverability in GitHub search and Google
```

---

**💡 Best Practices:**
1. Always include installation instructions
2. Provide clear usage examples
3. List all dependencies with versions
4. Include screenshots for visual projects
5. Keep documentation up-to-date with code changes
6. Use consistent formatting and style
7. Test all code examples before publishing
8. Include troubleshooting sections