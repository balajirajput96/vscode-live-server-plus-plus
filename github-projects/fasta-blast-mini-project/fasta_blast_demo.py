import argparse
from pathlib import Path
import csv

def parse_fasta(path):
    """Parse FASTA file and return dictionary of sequences"""
    seqs = {}
    header = None
    chunks = []
    
    with open(path, "r") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            if line.startswith(">"):
                if header:
                    seqs[header] = "".join(chunks).upper()
                header = line[1:].strip()
                chunks = []
            else:
                chunks.append(line)
        if header:
            seqs[header] = "".join(chunks).upper()
    return seqs

def gc_content(seq: str) -> float:
    """Calculate GC content percentage"""
    if not seq:
        return 0.0
    gc = sum(1 for c in seq if c in ("G", "C"))
    return round(100.0 * gc / len(seq), 2)

def analyze_sequence(seq_id: str, seq: str) -> dict:
    """Analyze a single sequence and return statistics"""
    return {
        "id": seq_id,
        "length": len(seq),
        "gc_percent": gc_content(seq),
        "a_count": seq.count('A'),
        "t_count": seq.count('T'),
        "g_count": seq.count('G'),
        "c_count": seq.count('C'),
        "n_count": seq.count('N')
    }

def write_csv(rows, out_path):
    """Write analysis results to CSV file"""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    
    fieldnames = ["id", "length", "gc_percent", "a_count", "t_count", "g_count", "c_count", "n_count"]
    
    with open(out_path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for r in rows:
            w.writerow(r)

def main():
    ap = argparse.ArgumentParser(description="FASTA sequence analyzer for basic statistics")
    ap.add_argument("--fasta", required=True, help="Input FASTA file")
    ap.add_argument("--out", required=True, help="Output CSV path")
    args = ap.parse_args()

    fasta_path = Path(args.fasta)
    out_path = Path(args.out)

    if not fasta_path.exists():
        print(f"Error: FASTA file {fasta_path} not found")
        return

    print(f"Parsing FASTA file: {fasta_path}")
    seqs = parse_fasta(fasta_path)
    
    print(f"Found {len(seqs)} sequences")
    
    rows = []
    for seq_id, seq in seqs.items():
        analysis = analyze_sequence(seq_id, seq)
        rows.append(analysis)
        print(f"  {seq_id}: {len(seq)} bp, {analysis['gc_percent']}% GC")
    
    write_csv(rows, out_path)
    print(f"Results written to: {out_path}")
    
    # Summary statistics
    total_length = sum(row['length'] for row in rows)
    avg_gc = sum(row['gc_percent'] for row in rows) / len(rows) if rows else 0
    
    print(f"\nSummary:")
    print(f"  Total sequences: {len(rows)}")
    print(f"  Total length: {total_length:,} bp")
    print(f"  Average GC content: {avg_gc:.2f}%")

if __name__ == "__main__":
    main()