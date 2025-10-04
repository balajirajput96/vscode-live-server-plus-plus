# 🦙 Ollama Docker Setup Guide

**Run Local LLMs (Free Alternative to OpenAI/Gemini)**

> Ollama allows you to run large language models locally using Docker. This is a completely free alternative to paid APIs like OpenAI, Gemini, or Claude. Perfect for automation workflows that need AI capabilities without recurring costs.

---

## 🎯 Why Ollama?

- ✅ **100% Free** - No API costs
- ✅ **Privacy** - Data stays on your machine
- ✅ **Offline** - Works without internet
- ✅ **Multiple Models** - Llama, Mistral, Phi, and more
- ✅ **Easy Integration** - Compatible with n8n workflows

---

## 📋 Prerequisites

### System Requirements
- **Docker** installed and running
- **4GB RAM minimum** (8GB+ recommended)
- **10GB+ disk space** for models

### For GPU Support (Optional but Recommended)
- **NVIDIA GPU**: GTX 1060+ or better
- **AMD GPU**: ROCm compatible GPU

---

## 🚀 Quick Start (CPU Only)

### Step 1: Run Ollama Container

```shell
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

### Step 2: Run Your First Model

```shell
docker exec -it ollama ollama run llama3.2
```

That's it! You now have a local LLM running.

---

## 🎮 NVIDIA GPU Setup

If you have an NVIDIA GPU, follow these steps for significantly faster performance.

### Step 1: Install NVIDIA Container Toolkit

#### Option A: Install with Apt (Ubuntu/Debian)

1. Configure the repository:

   ```shell
   curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey \
       | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
   curl -fsSL https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list \
       | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' \
       | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
   sudo apt-get update
   ```

2. Install the NVIDIA Container Toolkit packages:

   ```shell
   sudo apt-get install -y nvidia-container-toolkit
   ```

#### Option B: Install with Yum or Dnf (RHEL/CentOS/Fedora)

1. Configure the repository:

   ```shell
   curl -fsSL https://nvidia.github.io/libnvidia-container/stable/rpm/nvidia-container-toolkit.repo \
       | sudo tee /etc/yum.repos.d/nvidia-container-toolkit.repo
   ```

2. Install the NVIDIA Container Toolkit packages:

   ```shell
   sudo yum install -y nvidia-container-toolkit
   ```

### Step 2: Configure Docker to Use NVIDIA Driver

```shell
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

### Step 3: Start Ollama with GPU Support

```shell
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

### 📝 Note for NVIDIA JetPack Systems

If you're running on an NVIDIA JetPack system, Ollama can't automatically discover the correct JetPack version. Pass the environment variable to the container:

```shell
# For JetPack 5
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 -e JETSON_JETPACK=5 --name ollama ollama/ollama

# For JetPack 6
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 -e JETSON_JETPACK=6 --name ollama ollama/ollama
```

---

## 🔴 AMD GPU Setup

To run Ollama using Docker with AMD GPUs, use the `rocm` tag:

```shell
docker run -d --device /dev/kfd --device /dev/dri -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama:rocm
```

---

## 🎯 Using Ollama

### Run a Model Locally

```shell
docker exec -it ollama ollama run llama3.2
```

### Try Different Models

More models can be found on the [Ollama library](https://ollama.com/library).

Popular models for automation:
- **llama3.2** - Latest Llama model (4GB)
- **mistral** - Fast and capable (4GB)
- **phi3** - Microsoft's efficient model (2GB)
- **gemma** - Google's open model (5GB)
- **codellama** - Code generation (4GB)

### Install Additional Models

```shell
# Pull a specific model
docker exec -it ollama ollama pull mistral

# List installed models
docker exec -it ollama ollama list

# Remove a model
docker exec -it ollama ollama rm mistral
```

---

## 🔗 Integration with n8n

### Using Ollama API in n8n Workflows

Ollama provides an OpenAI-compatible API endpoint at `http://localhost:11434`.

1. In your n8n workflow, use the **HTTP Request** node
2. Configure the endpoint:
   - Method: `POST`
   - URL: `http://localhost:11434/api/generate`
   - Body (JSON):
     ```json
     {
       "model": "llama3.2",
       "prompt": "Your prompt here",
       "stream": false
     }
     ```

### Example n8n HTTP Request Configuration

```json
{
  "method": "POST",
  "url": "http://localhost:11434/api/generate",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "model": "llama3.2",
    "prompt": "{{ $json.userQuery }}",
    "stream": false
  }
}
```

### Using OpenAI-Compatible Endpoint

Ollama also supports OpenAI-compatible API:

```shell
# API endpoint
http://localhost:11434/v1/chat/completions
```

Use this with the OpenAI node in n8n by changing the base URL to `http://localhost:11434/v1`.

---

## 🛠️ Management Commands

### Check Ollama Status

```shell
docker ps | grep ollama
```

### View Ollama Logs

```shell
docker logs ollama
```

### Stop Ollama

```shell
docker stop ollama
```

### Start Ollama

```shell
docker start ollama
```

### Remove Ollama Container

```shell
docker stop ollama
docker rm ollama
```

### Update Ollama

```shell
docker stop ollama
docker rm ollama
docker pull ollama/ollama
# Then run the container again with your preferred command
```

---

## 💡 Tips & Best Practices

### 1. Model Selection
- Start with smaller models (2-4GB) like **phi3** or **mistral**
- Use larger models (7GB+) only if you have 16GB+ RAM
- For code generation, use **codellama**

### 2. Performance Optimization
- **GPU acceleration** provides 10-100x speed improvement
- Close other applications to free up RAM
- Use SSD for faster model loading

### 3. Resource Management
- Models are cached in the Docker volume `ollama`
- Remove unused models to save disk space
- Monitor GPU/CPU usage with `docker stats ollama`

### 4. Network Access
- Default port: `11434`
- Make sure port is not blocked by firewall
- For remote access, use reverse proxy (nginx/caddy)

---

## 🔧 Troubleshooting

### Container Won't Start
```shell
# Check logs
docker logs ollama

# Ensure port is not in use
lsof -i :11434
```

### Out of Memory Error
- Use smaller models
- Increase Docker memory limit
- Close other applications

### GPU Not Detected
```shell
# Verify NVIDIA driver
nvidia-smi

# Check Docker GPU support
docker run --rm --gpus=all nvidia/cuda:11.0-base nvidia-smi
```

### Slow Response Times
- Switch to GPU if available
- Use smaller/faster models
- Ensure SSD storage for models

---

## 📚 Resources

- **Ollama Official Docs**: https://docs.ollama.com
- **Model Library**: https://ollama.com/library
- **Docker Hub**: https://hub.docker.com/r/ollama/ollama
- **GitHub**: https://github.com/ollama/ollama
- **NVIDIA Container Toolkit**: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/

---

## 🔗 Related Documentation

- [n8n Setup Guide](./README-n8n-setup.md)
- [AI Automation Guide](./COMPREHENSIVE_AI_AUTOMATION_GUIDE.md)
- [OpenAI Health Check](./scripts/health-checks/openai-health-check.sh)
- [Pre-Deployment Checklist](./PRE-DEPLOYMENT-CHECKLIST.md)

---

**Happy automating with free local LLMs! 🦙**
