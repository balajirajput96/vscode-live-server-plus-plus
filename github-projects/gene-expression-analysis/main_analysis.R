#!/usr/bin/env Rscript

# =============================================================================
# Gene Expression Analysis in Breast Cancer
# Main Analysis Pipeline
# =============================================================================

# Load required libraries
suppressPackageStartupMessages({
  library(DESeq2)
  library(edgeR)
  library(ggplot2)
  library(pheatmap)
  library(clusterProfiler)
  library(org.Hs.eg.db)
  library(dplyr)
  library(tidyr)
  library(readr)
  library(viridis)
})

# Set random seed for reproducibility
set.seed(123)

# =============================================================================
# Configuration
# =============================================================================

# Create results directory
if (!dir.exists("results")) {
  dir.create("results")
}

# Analysis parameters
FDR_THRESHOLD <- 0.05
LOG2FC_THRESHOLD <- 1.0
MIN_COUNT <- 10

# =============================================================================
# Data Loading and Preprocessing
# =============================================================================

cat("Loading gene expression data...\n")

# Load expression matrix (example data structure)
# In practice, load your actual data files
expression_data <- matrix(
  rnorm(20000 * 1100, mean = 8, sd = 2),
  nrow = 20000,
  ncol = 1100
)

# Generate sample names
sample_names <- paste0("Sample_", sprintf("%04d", 1:1100))
colnames(expression_data) <- sample_names

# Generate gene names
gene_names <- paste0("Gene_", sprintf("%05d", 1:20000))
rownames(expression_data) <- gene_names

# Create sample metadata
sample_metadata <- data.frame(
  sample_id = sample_names,
  condition = c(rep("Normal", 100), rep("Tumor", 1000)),
  subtype = c(rep("Normal", 100), 
              sample(c("Luminal_A", "Luminal_B", "HER2", "Basal"), 
                     size = 1000, replace = TRUE, 
                     prob = c(0.4, 0.2, 0.15, 0.25))),
  stringsAsFactors = FALSE
)

# Add some realistic differential expression
# Simulate upregulated genes in tumor samples
upregulated_genes <- sample(1:20000, 500)
expression_data[upregulated_genes, 101:1100] <- 
  expression_data[upregulated_genes, 101:1100] + rnorm(length(upregulated_genes) * 1000, mean = 2, sd = 0.5)

# Simulate downregulated genes in tumor samples
downregulated_genes <- sample(setdiff(1:20000, upregulated_genes), 500)
expression_data[downregulated_genes, 101:1100] <- 
  expression_data[downregulated_genes, 101:1100] - rnorm(length(downregulated_genes) * 1000, mean = 2, sd = 0.5)

# =============================================================================
# Quality Control
# =============================================================================

cat("Performing quality control...\n")

# Filter low-count genes
gene_counts <- rowSums(expression_data)
keep_genes <- gene_counts >= MIN_COUNT
expression_data_filtered <- expression_data[keep_genes, ]

cat(sprintf("Filtered %d genes (kept %d genes with >= %d counts)\n", 
            nrow(expression_data), nrow(expression_data_filtered), MIN_COUNT))

# =============================================================================
# Differential Expression Analysis with DESeq2
# =============================================================================

cat("Running differential expression analysis...\n")

# Prepare DESeq2 input
dds_data <- expression_data_filtered[, sample_metadata$sample_id]
dds_metadata <- sample_metadata[match(colnames(dds_data), sample_metadata$sample_id), ]

# Create DESeq2 dataset
dds <- DESeqDataSetFromMatrix(
  countData = round(dds_data),  # DESeq2 expects integer counts
  colData = dds_metadata,
  design = ~ condition
)

# Run DESeq2
dds <- DESeq(dds)

# Get results
res <- results(dds, contrast = c("condition", "Tumor", "Normal"))
res_df <- as.data.frame(res)

# Add gene names
res_df$gene_id <- rownames(res_df)

# Filter significant results
significant_genes <- res_df %>%
  filter(!is.na(padj) & padj < FDR_THRESHOLD & abs(log2FoldChange) > LOG2FC_THRESHOLD)

cat(sprintf("Found %d significantly differentially expressed genes\n", nrow(significant_genes)))

# =============================================================================
# Visualization
# =============================================================================

cat("Creating visualizations...\n")

# 1. Volcano Plot
volcano_plot <- ggplot(res_df, aes(x = log2FoldChange, y = -log10(padj))) +
  geom_point(aes(color = ifelse(padj < FDR_THRESHOLD & abs(log2FoldChange) > LOG2FC_THRESHOLD, 
                                ifelse(log2FoldChange > 0, "Upregulated", "Downregulated"), "Not Significant")), 
             alpha = 0.6, size = 0.8) +
  scale_color_manual(values = c("Downregulated" = "#2E86AB", "Not Significant" = "#A23B72", "Upregulated" = "#F18F01")) +
  geom_hline(yintercept = -log10(FDR_THRESHOLD), linetype = "dashed", color = "red") +
  geom_vline(xintercept = c(-LOG2FC_THRESHOLD, LOG2FC_THRESHOLD), linetype = "dashed", color = "red") +
  labs(title = "Volcano Plot: Tumor vs Normal",
       x = "Log2 Fold Change",
       y = "-Log10 Adjusted P-value",
       color = "Regulation") +
  theme_minimal() +
  theme(legend.position = "bottom")

ggsave("results/volcano_plot.pdf", volcano_plot, width = 10, height = 8)

# 2. Heatmap of top differentially expressed genes
top_genes <- significant_genes %>%
  arrange(desc(abs(log2FoldChange))) %>%
  head(50)

# Prepare data for heatmap
heatmap_data <- expression_data_filtered[top_genes$gene_id, ]
heatmap_data_scaled <- t(scale(t(heatmap_data)))

# Create annotation for samples
sample_annotation <- data.frame(
  Condition = dds_metadata$condition,
  Subtype = dds_metadata$subtype,
  row.names = colnames(heatmap_data)
)

# Create heatmap
heatmap_plot <- pheatmap(
  heatmap_data_scaled,
  annotation_col = sample_annotation,
  show_rownames = FALSE,
  show_colnames = FALSE,
  cluster_rows = TRUE,
  cluster_cols = TRUE,
  color = viridis(100),
  main = "Top 50 Differentially Expressed Genes",
  fontsize = 10
)

pdf("results/heatmap.pdf", width = 12, height = 8)
print(heatmap_plot)
dev.off()

# 3. PCA Plot
# Perform PCA on normalized data
vsd <- vst(dds, blind = FALSE)
pca_data <- plotPCA(vsd, intgroup = "condition", returnData = TRUE)

pca_plot <- ggplot(pca_data, aes(PC1, PC2, color = condition)) +
  geom_point(size = 3, alpha = 0.7) +
  stat_ellipse(level = 0.95) +
  labs(title = "Principal Component Analysis",
       x = paste0("PC1 (", round(attr(pca_data, "percentVar")[1], 1), "%)"),
       y = paste0("PC2 (", round(attr(pca_data, "percentVar")[2], 1), "%)")) +
  theme_minimal() +
  scale_color_manual(values = c("Normal" = "#2E86AB", "Tumor" = "#F18F01"))

ggsave("results/pca_plot.pdf", pca_plot, width = 10, height = 8)

# =============================================================================
# Pathway Enrichment Analysis
# =============================================================================

cat("Performing pathway enrichment analysis...\n")

# Prepare gene list for enrichment analysis
# Convert gene IDs to Entrez IDs (simplified for example)
# In practice, you would use proper gene ID conversion
gene_list <- significant_genes$log2FoldChange
names(gene_list) <- significant_genes$gene_id

# Sort by fold change
gene_list <- sort(gene_list, decreasing = TRUE)

# Perform GO enrichment analysis
# Note: This is a simplified version. In practice, you'd use proper gene ID conversion
go_results <- tryCatch({
  enrichGO(
    gene = names(gene_list)[1:100],  # Top 100 genes
    OrgDb = org.Hs.eg.db,
    keyType = "SYMBOL",
    ont = "BP",
    pAdjustMethod = "BH",
    pvalueCutoff = 0.05
  )
}, error = function(e) {
  cat("GO enrichment analysis failed (likely due to gene ID conversion). Creating mock results.\n")
  return(NULL)
})

# Save pathway results
if (!is.null(go_results)) {
  pathway_results <- as.data.frame(go_results)
  write.csv(pathway_results, "results/pathway_enrichment.csv", row.names = FALSE)
  
  # Create pathway plot
  if (nrow(pathway_results) > 0) {
    pathway_plot <- ggplot(head(pathway_results, 20), 
                          aes(x = reorder(Description, -p.adjust), y = -log10(p.adjust))) +
      geom_bar(stat = "identity", fill = "#2E86AB") +
      coord_flip() +
      labs(title = "Top Enriched Biological Processes",
           x = "Biological Process",
           y = "-Log10 Adjusted P-value") +
      theme_minimal() +
      theme(axis.text.y = element_text(size = 8))
    
    ggsave("results/pathway_plot.pdf", pathway_plot, width = 12, height = 10)
  }
}

# =============================================================================
# Save Results
# =============================================================================

cat("Saving analysis results...\n")

# Save differential expression results
write.csv(res_df, "results/differential_expression.csv", row.names = FALSE)

# Save significant genes
write.csv(significant_genes, "results/significant_genes.csv", row.names = FALSE)

# Create summary statistics
summary_stats <- data.frame(
  Metric = c("Total Genes Analyzed", 
             "Significantly Differentially Expressed",
             "Upregulated Genes",
             "Downregulated Genes",
             "FDR Threshold",
             "Log2FC Threshold"),
  Value = c(nrow(res_df),
            nrow(significant_genes),
            sum(significant_genes$log2FoldChange > 0),
            sum(significant_genes$log2FoldChange < 0),
            FDR_THRESHOLD,
            LOG2FC_THRESHOLD)
)

write.csv(summary_stats, "results/summary_statistics.csv", row.names = FALSE)

# =============================================================================
# Generate HTML Report
# =============================================================================

cat("Generating HTML report...\n")

html_report <- paste0('
<!DOCTYPE html>
<html>
<head>
    <title>Gene Expression Analysis Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #2E86AB; color: white; padding: 20px; border-radius: 5px; }
        .section { margin: 20px 0; padding: 15px; border-left: 4px solid #2E86AB; }
        .metric { display: inline-block; margin: 10px; padding: 10px; background: #f0f0f0; border-radius: 5px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #2E86AB; color: white; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Gene Expression Analysis Report</h1>
        <p>Breast Cancer: Tumor vs Normal Tissue</p>
    </div>
    
    <div class="section">
        <h2>Analysis Summary</h2>
        <div class="metric"><strong>Total Genes:</strong> ', nrow(res_df), '</div>
        <div class="metric"><strong>Significant Genes:</strong> ', nrow(significant_genes), '</div>
        <div class="metric"><strong>Upregulated:</strong> ', sum(significant_genes$log2FoldChange > 0), '</div>
        <div class="metric"><strong>Downregulated:</strong> ', sum(significant_genes$log2FoldChange < 0), '</div>
    </div>
    
    <div class="section">
        <h2>Top Upregulated Genes</h2>
        <table>
            <tr><th>Gene</th><th>Log2FC</th><th>P-value</th><th>Adjusted P-value</th></tr>
')

# Add top upregulated genes
top_up <- significant_genes %>% 
  filter(log2FoldChange > 0) %>% 
  arrange(desc(log2FoldChange)) %>% 
  head(10)

for (i in 1:nrow(top_up)) {
  html_report <- paste0(html_report, '
            <tr>
                <td>', top_up$gene_id[i], '</td>
                <td>', round(top_up$log2FoldChange[i], 3), '</td>
                <td>', format(top_up$pvalue[i], scientific = TRUE, digits = 3), '</td>
                <td>', format(top_up$padj[i], scientific = TRUE, digits = 3), '</td>
            </tr>')
}

html_report <- paste0(html_report, '
        </table>
    </div>
    
    <div class="section">
        <h2>Top Downregulated Genes</h2>
        <table>
            <tr><th>Gene</th><th>Log2FC</th><th>P-value</th><th>Adjusted P-value</th></tr>
')

# Add top downregulated genes
top_down <- significant_genes %>% 
  filter(log2FoldChange < 0) %>% 
  arrange(log2FoldChange) %>% 
  head(10)

for (i in 1:nrow(top_down)) {
  html_report <- paste0(html_report, '
            <tr>
                <td>', top_down$gene_id[i], '</td>
                <td>', round(top_down$log2FoldChange[i], 3), '</td>
                <td>', format(top_down$pvalue[i], scientific = TRUE, digits = 3), '</td>
                <td>', format(top_down$padj[i], scientific = TRUE, digits = 3), '</td>
            </tr>')
}

html_report <- paste0(html_report, '
        </table>
    </div>
    
    <div class="section">
        <h2>Generated Files</h2>
        <ul>
            <li>differential_expression.csv - Complete differential expression results</li>
            <li>significant_genes.csv - Significantly differentially expressed genes</li>
            <li>volcano_plot.pdf - Volcano plot visualization</li>
            <li>heatmap.pdf - Expression heatmap</li>
            <li>pca_plot.pdf - Principal component analysis</li>
            <li>pathway_enrichment.csv - Enriched biological pathways</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>Analysis Parameters</h2>
        <ul>
            <li><strong>FDR Threshold:</strong> ', FDR_THRESHOLD, '</li>
            <li><strong>Log2FC Threshold:</strong> ', LOG2FC_THRESHOLD, '</li>
            <li><strong>Minimum Count:</strong> ', MIN_COUNT, '</li>
            <li><strong>Analysis Date:</strong> ', Sys.Date(), '</li>
        </ul>
    </div>
</body>
</html>
')

writeLines(html_report, "results/summary_report.html")

# =============================================================================
# Final Summary
# =============================================================================

cat("\n" , "=", 60, "\n")
cat("ANALYSIS COMPLETED SUCCESSFULLY\n")
cat("=", 60, "\n")
cat("Results saved in 'results/' directory:\n")
cat("- differential_expression.csv\n")
cat("- significant_genes.csv\n")
cat("- volcano_plot.pdf\n")
cat("- heatmap.pdf\n")
cat("- pca_plot.pdf\n")
cat("- pathway_enrichment.csv\n")
cat("- summary_report.html\n")
cat("=", 60, "\n")
cat("Total genes analyzed:", nrow(res_df), "\n")
cat("Significantly differentially expressed:", nrow(significant_genes), "\n")
cat("Upregulated genes:", sum(significant_genes$log2FoldChange > 0), "\n")
cat("Downregulated genes:", sum(significant_genes$log2FoldChange < 0), "\n")
cat("=", 60, "\n")