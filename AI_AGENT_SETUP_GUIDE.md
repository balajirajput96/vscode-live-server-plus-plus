# 🤖 AI Agent Setup Guide
**Complete guide for setting up AI agents using various frameworks**

## 🎯 Overview

This guide covers setting up AI agents using the most popular and effective frameworks available today. All setups are tested and include free tier options.

---

## 🔧 AutoGen (Microsoft) - Multi-Agent Conversations

### Installation
```bash
pip install autogen-agentchat
```

### Basic Setup
```python
from autogen import ConversableAgent

# Create agents
user_proxy = ConversableAgent(
    "user_proxy",
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=10,
)

assistant = ConversableAgent(
    "assistant",
    system_message="You are a helpful AI assistant",
    human_input_mode="NEVER",
)

# Start conversation
user_proxy.initiate_chat(
    assistant,
    message="Help me automate my daily tasks"
)
```

### Advanced Multi-Agent Example
```python
import autogen

# Configuration
config_list = [
    {
        "model": "gpt-4",
        "api_key": "your_openai_api_key"
    }
]

# Create multiple agents
researcher = autogen.AssistantAgent(
    name="researcher",
    system_message="Research specialist",
    llm_config={"config_list": config_list}
)

writer = autogen.AssistantAgent(
    name="writer",
    system_message="Content writer",
    llm_config={"config_list": config_list}
)

critic = autogen.AssistantAgent(
    name="critic",
    system_message="Content critic and reviewer",
    llm_config={"config_list": config_list}
)

user_proxy = autogen.UserProxyAgent(
    name="user",
    human_input_mode="TERMINATE",
    code_execution_config={"work_dir": "workspace"}
)

# Group chat
groupchat = autogen.GroupChat(
    agents=[user_proxy, researcher, writer, critic],
    messages=[],
    max_round=12
)

manager = autogen.GroupChatManager(
    groupchat=groupchat,
    llm_config={"config_list": config_list}
)

# Start the conversation
user_proxy.initiate_chat(
    manager,
    message="Create a comprehensive blog post about AI automation tools"
)
```

---

## 🚀 CrewAI - Role-Based Agent Teams

### Installation
```bash
pip install crewai
```

### Basic Setup
```python
from crewai import Agent, Task, Crew

# Define agents
researcher = Agent(
    role='Research Analyst',
    goal='Research comprehensive information about topics',
    backstory='Expert researcher with deep analytical skills',
    verbose=True,
    allow_delegation=False
)

writer = Agent(
    role='Content Writer',
    goal='Create engaging and informative content',
    backstory='Skilled writer with expertise in various topics',
    verbose=True,
    allow_delegation=False
)

# Define tasks
research_task = Task(
    description='Research the latest trends in AI automation',
    agent=researcher
)

writing_task = Task(
    description='Write a blog post based on research findings',
    agent=writer
)

# Create crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    verbose=2
)

# Execute
result = crew.kickoff()
print(result)
```

### Advanced CrewAI with Tools
```python
from crewai import Agent, Task, Crew
from crewai_tools import WebsiteSearchTool, FileReadTool

# Initialize tools
web_search = WebsiteSearchTool()
file_reader = FileReadTool()

# Create specialized agents
market_researcher = Agent(
    role='Market Research Analyst',
    goal='Research market trends and opportunities',
    backstory='Expert in market analysis with 10+ years experience',
    tools=[web_search],
    verbose=True
)

data_analyst = Agent(
    role='Data Analyst',
    goal='Analyze data and extract insights',
    backstory='Statistical expert with strong analytical skills',
    tools=[file_reader],
    verbose=True
)

report_writer = Agent(
    role='Report Writer',
    goal='Create comprehensive reports',
    backstory='Professional technical writer',
    verbose=True
)

# Define tasks
market_research = Task(
    description='Research AI automation market trends',
    agent=market_researcher
)

data_analysis = Task(
    description='Analyze market data and identify patterns',
    agent=data_analyst
)

report_creation = Task(
    description='Create a comprehensive market report',
    agent=report_writer
)

# Create and run crew
crew = Crew(
    agents=[market_researcher, data_analyst, report_writer],
    tasks=[market_research, data_analysis, report_creation],
    process="sequential"
)

result = crew.kickoff()
```

---

## 🕸️ LangGraph - Graph-Based Agent Workflows

### Installation
```bash
pip install langgraph
```

### Basic Graph Setup
```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    current_step: str

def research_node(state: AgentState):
    # Research logic here
    return {
        "messages": state["messages"] + ["Research completed"],
        "current_step": "research"
    }

def analysis_node(state: AgentState):
    # Analysis logic here
    return {
        "messages": state["messages"] + ["Analysis completed"],
        "current_step": "analysis"
    }

def writing_node(state: AgentState):
    # Writing logic here
    return {
        "messages": state["messages"] + ["Writing completed"],
        "current_step": "writing"
    }

# Create graph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("research", research_node)
workflow.add_node("analysis", analysis_node)
workflow.add_node("writing", writing_node)

# Add edges
workflow.add_edge("research", "analysis")
workflow.add_edge("analysis", "writing")
workflow.add_edge("writing", END)

# Set entry point
workflow.set_entry_point("research")

# Compile and run
app = workflow.compile()

# Execute
initial_state = {
    "messages": ["Starting workflow"],
    "current_step": "start"
}

result = app.invoke(initial_state)
print(result)
```

---

## 🌊 OpenAI Swarm - Lightweight Agent Framework

### Installation
```bash
pip install git+https://github.com/openai/swarm.git
```

### Basic Swarm Setup
```python
from swarm import Swarm, Agent

client = Swarm()

def get_weather(location):
    """Get weather information for a location"""
    return f"Weather in {location}: Sunny, 25°C"

def search_web(query):
    """Search the web for information"""
    return f"Search results for: {query}"

# Create agents
weather_agent = Agent(
    name="Weather Agent",
    instructions="You provide weather information",
    functions=[get_weather]
)

search_agent = Agent(
    name="Search Agent", 
    instructions="You search for information on the web",
    functions=[search_web]
)

# Transfer function to switch agents
def transfer_to_search():
    return search_agent

def transfer_to_weather():
    return weather_agent

# Add transfer functions
weather_agent.functions.append(transfer_to_search)
search_agent.functions.append(transfer_to_weather)

# Run conversation
response = client.run(
    agent=weather_agent,
    messages=[{"role": "user", "content": "What's the weather in London?"}]
)

print(response.messages[-1]["content"])
```

---

## 🌊 Flowise - Visual LangChain Builder

### Installation
```bash
npm install -g flowise
```

### Run Flowise
```bash
npx flowise start
```

### Docker Setup
```bash
docker run -d --name flowise -p 3000:3000 flowiseai/flowise
```

### Custom Chatflow Creation
1. Open http://localhost:3000
2. Create new chatflow
3. Drag and drop components:
   - Document Loaders
   - Text Splitters
   - Vector Stores
   - Chat Models
   - Memory
4. Connect components
5. Test and deploy

---

## 🎭 AgentGPT - Browser-Based Agents

### Access
Go to: https://agentgpt.reworkd.ai

### Setup Custom Agent
```javascript
// Custom agent configuration
const agentConfig = {
  name: "Personal Assistant",
  goal: "Automate daily tasks and improve productivity",
  tasks: [
    "Organize email inbox",
    "Create daily schedule", 
    "Generate content ideas",
    "Track project progress"
  ]
}

// Run agent
agent.run(agentConfig)
```

---

## 🔧 Integration Examples

### Combining Multiple Frameworks
```python
# main_automation.py
import asyncio
from autogen import ConversableAgent
from crewai import Agent, Task, Crew
from swarm import Swarm, Agent as SwarmAgent

class MultiFrameworkAutomation:
    def __init__(self):
        self.setup_autogen()
        self.setup_crewai()
        self.setup_swarm()
    
    def setup_autogen(self):
        self.autogen_user = ConversableAgent("user")
        self.autogen_assistant = ConversableAgent("assistant")
    
    def setup_crewai(self):
        self.crew_researcher = Agent(
            role='Researcher',
            goal='Research information',
            backstory='Expert researcher'
        )
        
        self.crew_writer = Agent(
            role='Writer', 
            goal='Create content',
            backstory='Professional writer'
        )
    
    def setup_swarm(self):
        self.swarm_client = Swarm()
        
        def analyze_data(data):
            return f"Analysis: {data}"
        
        self.swarm_agent = SwarmAgent(
            name="Analyzer",
            instructions="Analyze data and provide insights",
            functions=[analyze_data]
        )
    
    async def run_automation_pipeline(self, task):
        """Run a complete automation pipeline using multiple frameworks"""
        
        # 1. Research with CrewAI
        research_task = Task(
            description=f"Research: {task}",
            agent=self.crew_researcher
        )
        
        crew = Crew(
            agents=[self.crew_researcher],
            tasks=[research_task]
        )
        
        research_result = crew.kickoff()
        
        # 2. Analyze with Swarm
        analysis_response = self.swarm_client.run(
            agent=self.swarm_agent,
            messages=[{"role": "user", "content": f"Analyze: {research_result}"}]
        )
        
        # 3. Generate final output with AutoGen
        self.autogen_user.initiate_chat(
            self.autogen_assistant,
            message=f"Create final report based on: {analysis_response.messages[-1]['content']}"
        )

# Usage
automation = MultiFrameworkAutomation()
asyncio.run(automation.run_automation_pipeline("AI automation trends"))
```

---

## 📊 Performance Comparison

| Framework | Ease of Use | Flexibility | Community | Best For |
|-----------|-------------|-------------|-----------|----------|
| **AutoGen** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Multi-agent conversations |
| **CrewAI** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | Role-based teams |
| **LangGraph** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Complex workflows |
| **Swarm** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Simple agent handoffs |
| **Flowise** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Visual workflows |
| **AgentGPT** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | Quick prototyping |

---

## 🚀 Quick Start Template

Choose your framework and get started:

```bash
# Clone the template
git clone https://github.com/your-repo/ai-agent-templates

# Choose framework
cd autogen-template  # or crewai-template, langgraph-template, etc.

# Install dependencies
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env with your API keys

# Run
python main.py
```

---

## 📚 Learning Resources

### Documentation
- **AutoGen**: https://microsoft.github.io/autogen/
- **CrewAI**: https://docs.crewai.com/
- **LangGraph**: https://langchain-ai.github.io/langgraph/
- **Swarm**: https://github.com/openai/swarm
- **Flowise**: https://docs.flowiseai.com/

### Tutorials
- **AutoGen Tutorial**: Multi-agent conversation patterns
- **CrewAI Guide**: Building effective agent teams
- **LangGraph Examples**: Complex workflow automation
- **Swarm Cookbook**: Agent handoff strategies

---

**🎯 Ready to build your AI agent army? Pick a framework and start automating!**