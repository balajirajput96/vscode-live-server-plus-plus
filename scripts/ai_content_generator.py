#!/usr/bin/env python3
"""
Local AI Content Generator for n8n Career Automation System
Supports Gemma 3n and SHAKTI models for offline content generation
"""

import os
import sys
import json
import logging
import subprocess
import tempfile
from typing import Dict, List, Optional, Union
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class LocalAIGenerator:
    def __init__(self):
        self.gemma_model_path = os.getenv('GEMMA_MODEL_PATH', '/models/gemma-3n')
        self.shakti_model_path = os.getenv('SHAKTI_MODEL_PATH', '/models/shakti')
        self.cache_dir = os.getenv('AI_CACHE_DIR', '/cache')
        self.supported_models = ['gemma-3n', 'shakti']
        
        # Ensure cache directory exists
        Path(self.cache_dir).mkdir(parents=True, exist_ok=True)
    
    def check_model_availability(self) -> Dict[str, bool]:
        """Check if AI models are available locally"""
        availability = {}
        
        # Check Gemma 3n model
        gemma_path = Path(self.gemma_model_path)
        availability['gemma-3n'] = gemma_path.exists() and any(gemma_path.glob('*.gguf'))
        
        # Check SHAKTI model
        shakti_path = Path(self.shakti_model_path)
        availability['shakti'] = shakti_path.exists() and any(shakti_path.glob('*.bin'))
        
        logger.info(f"Model availability: {availability}")
        return availability
    
    def load_model(self, model_name: str) -> Dict[str, any]:
        """Load AI model for inference"""
        try:
            if model_name not in self.supported_models:
                return {"status": "error", "message": f"Unsupported model: {model_name}"}
            
            availability = self.check_model_availability()
            if not availability.get(model_name, False):
                return {"status": "error", "message": f"Model {model_name} not found locally"}
            
            logger.info(f"Loading model: {model_name}")
            
            if model_name == 'gemma-3n':
                return self._load_gemma_model()
            elif model_name == 'shakti':
                return self._load_shakti_model()
            
        except Exception as e:
            logger.error(f"Error loading model {model_name}: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    def _load_gemma_model(self) -> Dict[str, any]:
        """Load Gemma 3n model using llama.cpp"""
        try:
            model_files = list(Path(self.gemma_model_path).glob('*.gguf'))
            if not model_files:
                return {"status": "error", "message": "No Gemma model files found"}
            
            model_file = model_files[0]
            logger.info(f"Loading Gemma model from: {model_file}")
            
            # Initialize llama.cpp server (if not already running)
            cmd = [
                "llama-server",
                "--model", str(model_file),
                "--host", "127.0.0.1",
                "--port", "8080",
                "--ctx-size", "4096",
                "--threads", "4"
            ]
            
            # Check if server is already running
            try:
                import requests
                response = requests.get('http://127.0.0.1:8080/health', timeout=2)
                if response.status_code == 200:
                    logger.info("Gemma model server already running")
                    return {"status": "success", "model": "gemma-3n", "server": "http://127.0.0.1:8080"}
            except:
                pass
            
            # Start the server
            process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            # Wait for server to start
            import time
            time.sleep(5)
            
            return {
                "status": "success",
                "model": "gemma-3n",
                "server": "http://127.0.0.1:8080",
                "process_id": process.pid
            }
            
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def _load_shakti_model(self) -> Dict[str, any]:
        """Load SHAKTI model"""
        try:
            model_files = list(Path(self.shakti_model_path).glob('*.bin'))
            if not model_files:
                return {"status": "error", "message": "No SHAKTI model files found"}
            
            model_file = model_files[0]
            logger.info(f"Loading SHAKTI model from: {model_file}")
            
            # SHAKTI model loading implementation
            # This would depend on the specific SHAKTI model format and requirements
            
            return {
                "status": "success",
                "model": "shakti",
                "model_path": str(model_file)
            }
            
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def generate_content(self, prompt: str, model: str = "gemma-3n", max_tokens: int = 512) -> Dict[str, any]:
        """Generate content using local AI model"""
        try:
            logger.info(f"Generating content with {model} model")
            
            if model == "gemma-3n":
                return self._generate_with_gemma(prompt, max_tokens)
            elif model == "shakti":
                return self._generate_with_shakti(prompt, max_tokens)
            else:
                return {"status": "error", "message": f"Unsupported model: {model}"}
                
        except Exception as e:
            logger.error(f"Error generating content: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    def _generate_with_gemma(self, prompt: str, max_tokens: int) -> Dict[str, any]:
        """Generate content using Gemma 3n model"""
        try:
            import requests
            
            # Prepare the request payload
            payload = {
                "prompt": prompt,
                "n_predict": max_tokens,
                "temperature": 0.7,
                "top_p": 0.9,
                "top_k": 40,
                "stop": ["</s>", "User:", "Assistant:"]
            }
            
            # Make request to local llama.cpp server
            response = requests.post(
                'http://127.0.0.1:8080/completion',
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result.get('content', '').strip()
                
                return {
                    "status": "success",
                    "model": "gemma-3n",
                    "content": content,
                    "tokens_generated": len(content.split()),
                    "processing_time": result.get('timings', {}).get('predicted_ms', 0) / 1000
                }
            else:
                return {"status": "error", "message": f"API request failed: {response.text}"}
                
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def _generate_with_shakti(self, prompt: str, max_tokens: int) -> Dict[str, any]:
        """Generate content using SHAKTI model"""
        try:
            # This is a placeholder for SHAKTI model implementation
            # The actual implementation would depend on SHAKTI's API or interface
            
            # For now, provide a simulated response
            logger.info("Using SHAKTI model for content generation")
            
            # Simulate content generation
            import time
            start_time = time.time()
            
            # Simulated content based on prompt type
            if "linkedin" in prompt.lower():
                content = self._generate_linkedin_content(prompt)
            elif "resume" in prompt.lower():
                content = self._generate_resume_content(prompt)
            elif "github" in prompt.lower():
                content = self._generate_github_content(prompt)
            else:
                content = self._generate_general_content(prompt)
            
            processing_time = time.time() - start_time
            
            return {
                "status": "success",
                "model": "shakti",
                "content": content,
                "tokens_generated": len(content.split()),
                "processing_time": processing_time
            }
            
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def _generate_linkedin_content(self, prompt: str) -> str:
        """Generate LinkedIn-specific content"""
        return """🚀 Excited to share my latest bioinformatics project!

I've been working on a comprehensive gene expression analysis pipeline that combines machine learning with traditional statistical methods. The project focuses on identifying biomarkers for personalized medicine applications.

Key achievements:
• Processed 10,000+ gene expression profiles
• Developed ML models with 95%+ accuracy
• Identified 15 potential therapeutic targets
• Created automated analysis workflows

This work demonstrates the incredible potential of computational biology in advancing healthcare. By leveraging data science and bioinformatics, we can unlock insights that could lead to more effective treatments.

Grateful for the opportunity to contribute to this exciting field! 💻🧬

#Bioinformatics #DataScience #MachineLearning #Biotechnology #Research #Innovation #PersonalizedMedicine"""
    
    def _generate_resume_content(self, prompt: str) -> str:
        """Generate resume-specific content"""
        return """PROFESSIONAL SUMMARY

Results-driven Biotechnology professional with expertise in bioinformatics, data analysis, and computational biology. Proven track record of applying machine learning and statistical methods to solve complex biological problems. Seeking to leverage analytical skills and domain knowledge in advancing biotech research initiatives.

CORE COMPETENCIES
• Bioinformatics & Computational Biology
• Python, R, SQL Programming
• Machine Learning & Statistical Analysis
• Data Visualization (Matplotlib, Seaborn, Plotly)
• Genomics & Proteomics Analysis
• Database Management & Big Data Processing
• Research Methodology & Scientific Writing

KEY ACHIEVEMENTS
• Developed machine learning models with 95%+ accuracy for gene expression analysis
• Processed and analyzed datasets containing 10M+ data points
• Published research findings in peer-reviewed journals
• Reduced analysis time by 40% through workflow optimization
• Collaborated with cross-functional teams on drug discovery projects

TECHNICAL SKILLS
Programming: Python, R, SQL, Bash, JavaScript
Bioinformatics Tools: BLAST, Clustal Omega, Galaxy, NCBI Databases
Machine Learning: Scikit-learn, TensorFlow, Keras, XGBoost
Data Analysis: Pandas, NumPy, Scipy, Statsmodels
Visualization: Matplotlib, Seaborn, Plotly, ggplot2
Databases: MySQL, PostgreSQL, MongoDB, Neo4j
Cloud Platforms: AWS, Google Cloud, Azure"""
    
    def _generate_github_content(self, prompt: str) -> str:
        """Generate GitHub README content"""
        return """# Bioinformatics Gene Expression Analysis

## 🎯 Project Overview
A comprehensive pipeline for analyzing gene expression data using machine learning and statistical methods. This project focuses on identifying biomarkers for personalized medicine applications through advanced computational biology techniques.

## 🛠️ Technologies Used
- **Programming Languages**: Python, R
- **Libraries/Frameworks**: Pandas, NumPy, Scikit-learn, Biopython
- **Database**: PostgreSQL, MongoDB
- **Visualization**: Matplotlib, Seaborn, Plotly

## 📊 Dataset Information
- **Source**: NCBI GEO Database
- **Size**: 10,000+ gene expression profiles
- **Format**: CSV, GEO SOFT files

## 🔬 Methodology
1. **Data Collection**: Retrieved data from NCBI GEO database
2. **Data Preprocessing**: Normalized and cleaned expression data
3. **Feature Selection**: Applied statistical and ML-based methods
4. **Model Development**: Implemented classification and regression models
5. **Validation**: Cross-validation and statistical testing
6. **Visualization**: Generated comprehensive plots and heatmaps

## 📈 Key Findings
- Identified 15 potential biomarkers with statistical significance
- Achieved 95%+ accuracy in disease classification
- Discovered novel gene interaction networks
- Reduced feature space by 80% while maintaining performance

## 🚀 Results
- Model accuracy: 95.3%
- Processing time: Reduced by 40%
- Biomarkers identified: 15
- Statistical significance: p < 0.001

## 📁 Project Structure
```
gene-expression-analysis/
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
│   ├── data_exploration.ipynb
│   └── analysis.ipynb
├── src/
│   ├── data_processing.py
│   └── analysis.py
├── results/
│   ├── figures/
│   └── reports/
├── requirements.txt
└── README.md
```

## 🔧 Installation & Usage
```bash
# Clone the repository
git clone https://github.com/username/gene-expression-analysis.git

# Install dependencies
pip install -r requirements.txt

# Run the analysis
python src/analysis.py
```

## 📊 Sample Output
![Gene Expression Heatmap](results/figures/heatmap.png)
![PCA Analysis](results/figures/pca_plot.png)

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact
- **Author**: Your Name
- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn Profile]

---
**Built with ❤️ for advancing Biotechnology and Bioinformatics research**"""
    
    def _generate_general_content(self, prompt: str) -> str:
        """Generate general content based on prompt"""
        return f"""Based on your request: "{prompt[:100]}..."

I understand you're looking for content related to biotechnology and bioinformatics. Here's a comprehensive response:

The field of bioinformatics represents a fascinating intersection of biology, computer science, and data analysis. As we advance into an era of precision medicine and personalized healthcare, the role of computational biology becomes increasingly critical.

Key areas of focus include:

1. **Genomics Analysis**: Processing and interpreting large-scale genomic data to understand genetic variations and their implications for health and disease.

2. **Protein Structure Prediction**: Using computational methods to predict protein folding patterns and understand their functional implications.

3. **Drug Discovery**: Applying machine learning algorithms to identify potential therapeutic compounds and optimize drug development processes.

4. **Clinical Bioinformatics**: Integrating genomic data with clinical information to support diagnostic and treatment decisions.

5. **Systems Biology**: Understanding complex biological systems through computational modeling and network analysis.

The future of bioinformatics lies in developing more sophisticated AI models that can handle the complexity and scale of biological data while providing interpretable results for clinical applications.

This field offers tremendous opportunities for professionals who combine biological knowledge with computational skills, contributing to advances in healthcare and scientific understanding."""
    
    def generate_portfolio_content(self, project_data: Dict[str, str]) -> Dict[str, any]:
        """Generate portfolio content for bioinformatics projects"""
        try:
            prompt = f"""
            Generate professional portfolio content for a bioinformatics project:
            
            Project Name: {project_data.get('name', 'Unnamed Project')}
            Project Type: {project_data.get('type', 'Bioinformatics Analysis')}
            Description: {project_data.get('description', '')}
            Tools Used: {project_data.get('tools', 'Python, R')}
            Dataset: {project_data.get('dataset', 'Custom Dataset')}
            Key Findings: {project_data.get('findings', '')}
            
            Create a comprehensive GitHub README.md format with:
            - Professional project overview
            - Technical implementation details
            - Methodology and approach
            - Results and achievements
            - Installation instructions
            - Usage examples
            """
            
            return self.generate_content(prompt, model="gemma-3n", max_tokens=1024)
            
        except Exception as e:
            logger.error(f"Error generating portfolio content: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    def generate_social_media_post(self, post_data: Dict[str, str]) -> Dict[str, any]:
        """Generate social media content"""
        try:
            platform = post_data.get('platform', 'linkedin')
            post_type = post_data.get('type', 'project-share')
            content = post_data.get('content', '')
            tone = post_data.get('tone', 'professional')
            
            prompt = f"""
            Generate a {platform} post about {post_type} with {tone} tone:
            
            Content: {content}
            
            Requirements:
            - Engaging and professional
            - Include relevant hashtags
            - Appropriate length for {platform}
            - Focus on biotechnology/bioinformatics
            """
            
            return self.generate_content(prompt, model="shakti", max_tokens=300)
            
        except Exception as e:
            logger.error(f"Error generating social media post: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    def optimize_resume_content(self, resume_data: Dict[str, str]) -> Dict[str, any]:
        """Optimize resume content"""
        try:
            content_type = resume_data.get('type', 'resume')
            current_content = resume_data.get('content', '')
            target_role = resume_data.get('role', 'Bioinformatics Analyst')
            
            prompt = f"""
            Optimize this {content_type} content for a {target_role} position:
            
            Current Content: {current_content}
            
            Requirements:
            - ATS-friendly format
            - Industry-specific keywords
            - Quantifiable achievements
            - Professional language
            - Focus on biotechnology skills
            """
            
            return self.generate_content(prompt, model="gemma-3n", max_tokens=800)
            
        except Exception as e:
            logger.error(f"Error optimizing resume content: {str(e)}")
            return {"status": "error", "message": str(e)}

def main():
    """Main function for command-line usage"""
    ai_generator = LocalAIGenerator()
    
    if len(sys.argv) < 2:
        print("Usage: python ai_content_generator.py <command> [args]")
        print("Commands:")
        print("  check-models              - Check model availability")
        print("  load-model <model_name>   - Load specific model")
        print("  generate <prompt>         - Generate content from prompt")
        print("  portfolio <project_json>  - Generate portfolio content")
        print("  social <post_json>        - Generate social media post")
        print("  resume <resume_json>      - Optimize resume content")
        return
    
    command = sys.argv[1].lower()
    
    if command == 'check-models':
        availability = ai_generator.check_model_availability()
        print(json.dumps(availability, indent=2))
        
    elif command == 'load-model':
        if len(sys.argv) < 3:
            print("Usage: python ai_content_generator.py load-model <model_name>")
            return
        
        model_name = sys.argv[2]
        result = ai_generator.load_model(model_name)
        print(json.dumps(result, indent=2))
        
    elif command == 'generate':
        if len(sys.argv) < 3:
            print("Usage: python ai_content_generator.py generate '<prompt>'")
            return
        
        prompt = sys.argv[2]
        result = ai_generator.generate_content(prompt)
        print(json.dumps(result, indent=2))
        
    elif command == 'portfolio':
        if len(sys.argv) < 3:
            print("Usage: python ai_content_generator.py portfolio '<project_json>'")
            return
        
        try:
            project_data = json.loads(sys.argv[2])
            result = ai_generator.generate_portfolio_content(project_data)
            print(json.dumps(result, indent=2))
        except json.JSONDecodeError:
            print("Error: Invalid JSON format for project data")
            
    elif command == 'social':
        if len(sys.argv) < 3:
            print("Usage: python ai_content_generator.py social '<post_json>'")
            return
        
        try:
            post_data = json.loads(sys.argv[2])
            result = ai_generator.generate_social_media_post(post_data)
            print(json.dumps(result, indent=2))
        except json.JSONDecodeError:
            print("Error: Invalid JSON format for post data")
            
    elif command == 'resume':
        if len(sys.argv) < 3:
            print("Usage: python ai_content_generator.py resume '<resume_json>'")
            return
        
        try:
            resume_data = json.loads(sys.argv[2])
            result = ai_generator.optimize_resume_content(resume_data)
            print(json.dumps(result, indent=2))
        except json.JSONDecodeError:
            print("Error: Invalid JSON format for resume data")
    
    else:
        print(f"Unknown command: {command}")

if __name__ == "__main__":
    main()