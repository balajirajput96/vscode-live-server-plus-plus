# FASTA + BLAST Mini-Project (Entry-level Bioinformatics Signal)

## Goals
- Parse FASTA sequences from a file
- Compute basic stats (sequence length, GC%)
- (Optional) Run BLAST using local BLAST+ (if installed) and capture top hits
- Export CSV summary; share repo link in applications

## Setup
- Python 3.10+
- pip install -r requirements.txt
- If using BLAST locally: install NCBI BLAST+ and add to PATH (blastn/blastp)

## Files
- fasta_blast_demo.py — main script
- data/example.fasta — sample sequences (add your file)
- output/results.csv — generated summary
- (Optional) blast_db/ — if you build a local BLAST database

## Run
```bash
python fasta_blast_demo.py --fasta data/example.fasta --out output/results.csv
```

## Notes
- If BLAST+ not available, skip BLAST for now; compute GC%/length and produce CSV
- Document steps in README; post 2–3 screenshots for LinkedIn

## Project Structure
```
fasta-blast-mini-project/
├── README.md
├── requirements.txt
├── fasta_blast_demo.py
├── data/
│   └── example.fasta
├── output/
│   └── results.csv
└── docs/
    └── project_screenshots/
```

## Sample Output
The script will generate a CSV file with the following columns:
- Sequence ID
- Sequence Length
- GC Content (%)
- (Optional) BLAST Top Hit
- (Optional) E-value

## LinkedIn Post Template
```
🧬 Excited to share my latest bioinformatics mini-project!

Built a FASTA sequence analyzer that:
✅ Parses multi-FASTA files
✅ Calculates GC content
✅ Exports results to CSV
✅ (Optional) BLAST integration

🛠️ Tools: Python, BioPython, Pandas
🎯 Perfect for quality control in genomics workflows

This demonstrates my ability to handle biological data and create automated analysis pipelines - essential skills for pharmaceutical and biotech companies.

Check out the complete code on my GitHub: [Repository Link]

#Bioinformatics #DataAnalysis #Python #Genomics #PharmaJobs #QualityControl
```

## Career Application Value
This project demonstrates:
- Practical bioinformatics skills
- Data handling and processing
- Quality control mindset
- Documentation abilities
- Industry-relevant experience