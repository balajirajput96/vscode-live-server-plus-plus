# 📚 GitHub Documentation AI Prompts

## 🎯 DocuWriter.ai Prompts

### Main Documentation Generation Prompt

```
Create professional GitHub repository documentation for a bioinformatics project with the following requirements:

**Project Type**: Computational Biology / Bioinformatics
**Target Audience**: Researchers, Data Scientists, Pharmaceutical Professionals
**Programming Languages**: Python, R, SQL
**Technologies**: pandas, matplotlib, seaborn, scikit-learn, biopython

**Required Sections**:
1. Project Overview (2-3 sentences explaining the purpose)
2. Features and Capabilities
3. Installation Instructions (step-by-step)
4. Quick Start Guide with examples
5. API Documentation (if applicable)
6. Usage Examples with real data scenarios
7. Requirements and Dependencies
8. Contributing Guidelines
9. License Information
10. Contact Information

**Style Requirements**:
- Professional scientific terminology
- Clear explanations for both technical and non-technical readers
- Include code examples with proper syntax highlighting
- Add badges for build status, version, and license
- Use emojis for visual appeal but maintain professionalism
- Include citation information for research use

**Special Focus**:
- Emphasize practical applications in pharmaceutical research
- Highlight data analysis capabilities
- Showcase visualization features
- Mention performance optimization
- Include security considerations for sensitive data

Make the documentation comprehensive yet accessible, suitable for academic publication and industry use.
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

### Code Documentation Enhancement

```
Add comprehensive docstrings to all functions in this bioinformatics Python file:

**Requirements:**
- Use Google style docstrings
- Include parameter types and descriptions
- Add return value documentation
- Include usage examples
- Add error handling documentation
- Reference scientific methods where applicable

**Example Format:**
```python
def analyze_gene_expression(data_file: str, threshold: float = 0.05) -> pd.DataFrame:
    """
    Analyze gene expression data and identify differentially expressed genes.
    
    This function performs statistical analysis on gene expression data using
    t-tests and multiple testing correction to identify significantly
    differentially expressed genes.
    
    Args:
        data_file (str): Path to the gene expression data file (CSV format).
        threshold (float, optional): P-value threshold for significance. 
            Defaults to 0.05.
    
    Returns:
        pd.DataFrame: A DataFrame containing gene IDs, fold changes, p-values,
            and adjusted p-values for significantly expressed genes.
    
    Raises:
        FileNotFoundError: If the data file is not found.
        ValueError: If the data format is incorrect.
    
    Example:
        >>> results = analyze_gene_expression('expression_data.csv', 0.01)
        >>> print(f"Found {len(results)} significant genes")
        Found 342 significant genes
    
    Note:
        This function uses the Benjamini-Hochberg procedure for multiple
        testing correction.
    """
```
```

### README Generation Prompt

```
Generate a comprehensive README.md for this bioinformatics project:

**Project Analysis:**
- Scan the codebase for main functions and classes
- Identify the primary purpose and methodology
- Extract key technologies and dependencies
- Find example usage patterns

**README Structure:**
1. **Project Title with descriptive subtitle**
2. **Badges** (build status, version, license, Python version)
3. **Table of Contents**
4. **Overview** (What problem does this solve?)
5. **Features** (Key capabilities and algorithms)
6. **Installation** (Step-by-step setup)
7. **Quick Start** (Minimal working example)
8. **Usage** (Detailed examples with real scenarios)
9. **API Reference** (If applicable)
10. **Examples** (Multiple use cases)
11. **Contributing** (Guidelines for contributors)
12. **Testing** (How to run tests)
13. **License** (License information)
14. **Citation** (How to cite in academic work)
15. **Contact** (Maintainer information)

**Style Guidelines:**
- Use clear, scientific language
- Include code examples with syntax highlighting
- Add visual elements (diagrams, plots) if applicable
- Make it suitable for both academic and industry use
- Include performance benchmarks if available
```

## 🚀 Automation Prompts

### Workflow Automation Setup

```
Create an automated GitHub workflow for continuous documentation updates:

**Workflow Requirements:**
- Trigger on code changes to main branch
- Automatically update README.md based on code changes
- Generate API documentation from docstrings
- Update CHANGELOG.md with new features
- Run documentation tests
- Deploy to GitHub Pages

**Integration Points:**
- n8n workflow integration
- Email notifications on completion
- Slack/Discord notifications
- Performance monitoring

**Workflow Steps:**
1. Checkout latest code
2. Analyze code changes
3. Generate updated documentation
4. Validate documentation format
5. Commit changes back to repository
6. Deploy documentation site
7. Send notifications

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
- Fix formatting issues
- Update outdated information
- Enhance visual appeal
- Improve SEO optimization

**Focus Areas:**
- Scientific accuracy
- Code example validity
- Installation procedure testing
- Cross-platform compatibility
- Performance considerations
```

## Usage

Copy these prompts into your AI tools (ChatGPT, Claude, GitHub Copilot) to generate high-quality documentation automatically.

## Requirements

- AI tool access (ChatGPT Plus, Claude Pro, GitHub Copilot)
- Basic understanding of your project structure
- Sample data or code examples

## Contributing

Submit new prompts or improvements through pull requests.

## License

These prompts are provided under MIT License for educational and professional use.