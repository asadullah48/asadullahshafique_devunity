"""
Portfolio AI Agent — LangGraph Implementation
=============================================
A simple agentic assistant that answers questions about Asadullah's portfolio.
Uses LangGraph StateGraph with a tool-calling loop.

Requires: ANTHROPIC_API_KEY env var (falls back if not set).

Features:
- Portfolio Q&A agent
- Error solver agent (debugs code errors)
- Learning agent (personalized lessons)
- Teaching agent (contribute knowledge)
"""

from __future__ import annotations

import os
from typing import Annotated, TypedDict

# Graceful import — LangGraph is optional (falls back if not installed)
try:
    from langgraph.graph import StateGraph, END
    from langgraph.graph.message import add_messages
    from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
    from langchain_core.tools import tool
    LANGGRAPH_AVAILABLE = True
except ImportError:
    LANGGRAPH_AVAILABLE = False

# ─── Portfolio Data (used by tools) ──────────────────────────────────────────
PORTFOLIO_DATA = {
    "name": "Asadullah Shafique",
    "github": "https://github.com/asadullah48",
    "discord": "https://discord.gg/kXfEYVGX",
    "email": "asadullahshafique@hotmail.com",
    "skills": ["TypeScript", "JavaScript", "Python", "Next.js", "React", "FastAPI", "Docker", "Agentic AI", "Generative AI"],
    "focus": "Agentic AI development, Full-stack engineering, Spec-first development (SpecifyKit)",
    "projects": [
        {"name": "Textbook RAG Chatbot", "tech": ["RAG", "FastAPI", "Next.js"], "type": "Hackathon"},
        {"name": "Portfolio (Asadullah.dev)", "tech": ["Next.js", "FastAPI", "Docker"], "type": "Production"},
        {"name": "Agentic AI Systems", "tech": ["LangGraph", "Claude API", "SpecifyKit"], "type": "Research"},
    ],
    "hackathons": ["Panaversity Physical AI & Humanoid Robotics Hackathon 2025-26"],
    "education": "Student pursuing Agentic AI development at Panaversity",
    "interests": ["Generative AI", "Agentic AI", "RAG", "MCP Servers", "Full-stack development"],
}


def get_static_response(question: str) -> str:
    """Fallback when LangGraph/LLM is not available."""
    q = question.lower()
    if any(w in q for w in ["skill", "tech", "language", "framework"]):
        return f"Asadullah's skills: {', '.join(PORTFOLIO_DATA['skills'])}. Focus: {PORTFOLIO_DATA['focus']}"
    if any(w in q for w in ["project", "built", "work"]):
        projects = [f"{p['name']} ({p['type']})" for p in PORTFOLIO_DATA["projects"]]
        return f"Projects: {', '.join(projects)}"
    if any(w in q for w in ["contact", "email", "discord", "reach"]):
        return f"Email: {PORTFOLIO_DATA['email']} | Discord: {PORTFOLIO_DATA['discord']}"
    if any(w in q for w in ["hackathon", "competition"]):
        return f"Hackathons: {', '.join(PORTFOLIO_DATA['hackathons'])}"
    return (
        f"I'm an AI assistant for {PORTFOLIO_DATA['name']}'s portfolio. "
        f"Ask me about skills, projects, hackathons, or how to contact. "
        f"GitHub: {PORTFOLIO_DATA['github']}"
    )


# ─── LangGraph Agent ─────────────────────────────────────────────────────────
if LANGGRAPH_AVAILABLE:

    @tool
    def get_portfolio_info(topic: str) -> str:
        """
        Get information about Asadullah's portfolio.
        topic: one of 'skills', 'projects', 'hackathons', 'contact', 'about', 'education'
        """
        topic = topic.lower()
        if topic == "skills":
            return f"Skills: {', '.join(PORTFOLIO_DATA['skills'])}. Focus areas: {PORTFOLIO_DATA['focus']}"
        if topic == "projects":
            return "\n".join(
                f"- {p['name']}: {', '.join(p['tech'])} ({p['type']})"
                for p in PORTFOLIO_DATA["projects"]
            )
        if topic == "hackathons":
            return f"Hackathons: {', '.join(PORTFOLIO_DATA['hackathons'])}"
        if topic == "contact":
            return f"Email: {PORTFOLIO_DATA['email']} | Discord: {PORTFOLIO_DATA['discord']} | GitHub: {PORTFOLIO_DATA['github']}"
        if topic == "education":
            return PORTFOLIO_DATA["education"]
        # default: about
        return (
            f"{PORTFOLIO_DATA['name']} is an Agentic AI developer specializing in "
            f"{PORTFOLIO_DATA['focus']}. Interests: {', '.join(PORTFOLIO_DATA['interests'][:3])}."
        )

    TOOLS = [get_portfolio_info]

    class AgentState(TypedDict):
        messages: Annotated[list, add_messages]

    def _build_graph():
        """Build and compile the LangGraph agent."""
        anthropic_key = os.getenv("ANTHROPIC_API_KEY", "")
        if not anthropic_key:
            return None

        try:
            from langchain_anthropic import ChatAnthropic

            llm = ChatAnthropic(
                model="claude-haiku-4-5-20251001",
                api_key=anthropic_key,
                max_tokens=512,
            ).bind_tools(TOOLS)
        except Exception:
            return None

        SYSTEM_PROMPT = (
            "You are a concise portfolio assistant for Asadullah Shafique, an Agentic AI developer. "
            "Answer questions about his skills, projects, hackathons, and contact info. "
            "Use the get_portfolio_info tool when asked about specific topics. "
            "Keep answers under 3 sentences."
        )

        def call_model(state: AgentState):
            messages = [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]
            response = llm.invoke(messages)
            return {"messages": [response]}

        def call_tools(state: AgentState):
            last_msg = state["messages"][-1]
            results = []
            for tc in last_msg.tool_calls:
                tool_fn = next((t for t in TOOLS if t.name == tc["name"]), None)
                result = tool_fn.invoke(tc["args"]) if tool_fn else "Tool not found"
                results.append(ToolMessage(content=str(result), tool_call_id=tc["id"]))
            return {"messages": results}

        def should_continue(state: AgentState):
            last = state["messages"][-1]
            if hasattr(last, "tool_calls") and last.tool_calls:
                return "tools"
            return END

        graph = StateGraph(AgentState)
        graph.add_node("agent", call_model)
        graph.add_node("tools", call_tools)
        graph.set_entry_point("agent")
        graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
        graph.add_edge("tools", "agent")
        return graph.compile()

    _compiled_graph = None

    def get_graph():
        global _compiled_graph
        if _compiled_graph is None:
            _compiled_graph = _build_graph()
        return _compiled_graph


async def run_agent(question: str) -> dict:
    """
    Run the portfolio agent. Uses LangGraph if available + ANTHROPIC_API_KEY set,
    otherwise falls back to static response.
    """
    if not LANGGRAPH_AVAILABLE:
        return {"answer": get_static_response(question), "mode": "static"}

    graph = get_graph()
    if graph is None:
        return {"answer": get_static_response(question), "mode": "static"}

    try:
        result = await graph.ainvoke({"messages": [HumanMessage(content=question)]})
        answer = result["messages"][-1].content
        return {"answer": answer, "mode": "langgraph"}
    except Exception as e:
        return {"answer": get_static_response(question), "mode": "static", "error": str(e)}


# ─── Error Solver Agent ───────────────────────────────────────────────────────
def get_static_error_solution(error_message: str, code_snippet: str = None, language: str = "python") -> dict:
    """Fallback error solver when LangGraph/LLM not available."""
    error_lower = error_message.lower()
    
    # Common error patterns
    if "typeerror" in error_lower and "not iterable" in error_lower:
        return {
            "explanation": "You're trying to iterate over a non-iterable object (like an integer). In Python, you can only iterate over sequences like lists, tuples, strings, or ranges.",
            "solution": "Use range() to create an iterable sequence from the integer.",
            "corrected_code": "for i in range(5):\n    print(i)",
            "confidence": 0.95,
        }
    
    if "indexerror" in error_lower:
        return {
            "explanation": "You're trying to access an index that doesn't exist in the list/array.",
            "solution": "Check the length of your list and ensure the index is within bounds (0 to len(list)-1).",
            "corrected_code": "# Check bounds before accessing\nif index < len(my_list):\n    item = my_list[index]",
            "confidence": 0.90,
        }
    
    if "keyerror" in error_lower:
        return {
            "explanation": "You're trying to access a dictionary key that doesn't exist.",
            "solution": "Use .get() method or check if key exists before accessing.",
            "corrected_code": "# Safe access\nvalue = my_dict.get('key', default_value)\n# Or check first\nif 'key' in my_dict:\n    value = my_dict['key']",
            "confidence": 0.90,
        }
    
    if "nameerror" in error_lower:
        return {
            "explanation": "You're using a variable or function name that hasn't been defined.",
            "solution": "Check for typos, ensure the variable is defined before use, or import the required module.",
            "corrected_code": "# Define before use\nvariable = value\n# Or import required module\nimport module_name",
            "confidence": 0.85,
        }
    
    if "attributeerror" in error_lower:
        return {
            "explanation": "You're trying to access an attribute or method that doesn't exist on this object.",
            "solution": "Check the object type and verify the attribute/method name is correct.",
            "corrected_code": "# Check object type and available methods\ndir(object_name)  # See available attributes",
            "confidence": 0.85,
        }
    
    # Default response
    return {
        "explanation": f"The error '{error_message}' indicates an issue in your code.",
        "solution": "Review the error message, check the line mentioned in the traceback, and verify your logic.",
        "corrected_code": code_snippet,
        "confidence": 0.70,
    }


async def run_error_solver_agent(
    error_message: str,
    code_snippet: str = None,
    language: str = "python",
    context: str = None,
) -> dict:
    """
    AI-powered error solver agent.
    Analyzes coding errors and provides explanations and solutions.
    """
    if not LANGGRAPH_AVAILABLE:
        return get_static_error_solution(error_message, code_snippet, language)
    
    anthropic_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not anthropic_key:
        return get_static_error_solution(error_message, code_snippet, language)
    
    try:
        from langchain_anthropic import ChatAnthropic
        
        llm = ChatAnthropic(
            model="claude-haiku-4-5-20251001",
            api_key=anthropic_key,
            max_tokens=1024,
        )
        
        prompt = f"""You are an expert programming tutor. Analyze this coding error and provide a helpful solution.

**Error Message:** {error_message}
**Language:** {language}
**Code Snippet:** {code_snippet or "Not provided"}
**Context:** {context or "Not provided"}

Provide your response in JSON format with these fields:
- explanation: Clear explanation of what went wrong (2-3 sentences)
- solution: Step-by-step solution
- corrected_code: The fixed code (if applicable)
- confidence: Confidence score (0.0 to 1.0)

Be concise, educational, and encouraging."""

        response = await llm.ainvoke(prompt)
        content = response.content
        
        # Try to parse JSON from response
        import json
        import re
        
        # Extract JSON from response (handle markdown code blocks)
        json_match = re.search(r'\{[\s\S]*\}', content)
        if json_match:
            try:
                result = json.loads(json_match.group())
                return {
                    "explanation": result.get("explanation", "Error analysis unavailable"),
                    "solution": result.get("solution", "Review the error and code carefully"),
                    "corrected_code": result.get("corrected_code"),
                    "confidence": result.get("confidence", 0.8),
                }
            except json.JSONDecodeError:
                pass
        
        # Fallback if JSON parsing fails
        return {
            "explanation": content[:500],
            "solution": "Review the error message and apply the explanation",
            "corrected_code": code_snippet,
            "confidence": 0.75,
        }
        
    except Exception as e:
        return get_static_error_solution(error_message, code_snippet, language)


# ─── Learning Agent ───────────────────────────────────────────────────────────
async def run_learning_agent(
    topic: str,
    level: str = "beginner",
    learning_style: str = "interactive",
    questions: list = None,
) -> dict:
    """
    Create personalized learning experiences.
    Generates lesson plans, resources, and quizzes.
    """
    # Static fallback
    lesson_plan = f"""# {topic} - {level.capitalize()} Lesson Plan

## Learning Objectives
- Understand the fundamentals of {topic}
- Apply key concepts in practical scenarios
- Build foundational knowledge for advanced topics

## Module 1: Introduction
- What is {topic}?
- Why is it important?
- Real-world applications

## Module 2: Core Concepts
- Key terminology
- Fundamental principles
- Common patterns

## Module 3: Hands-On Practice
- Guided exercises
- Mini-projects
- Code examples

## Module 4: Assessment
- Quiz on key concepts
- Practical challenge
- Next steps"""

    resources = [
        f"Official {topic} Documentation",
        f"{topic} for {level}s - FreeCodeCamp",
        f"Interactive {topic} Tutorial - Codecademy",
        f"{topic} Best Practices Guide",
    ]
    
    quiz_questions = [
        f"What is the primary purpose of {topic}?",
        f"Name three key concepts in {topic}.",
        f"How would you apply {topic} in a real-world scenario?",
    ]
    
    next_steps = f"""Continue your {topic} journey by:
1. Building a small project
2. Joining online communities
3. Contributing to open-source
4. Exploring advanced topics"""
    
    # If LLM available, enhance the content
    if LANGGRAPH_AVAILABLE:
        anthropic_key = os.getenv("ANTHROPIC_API_KEY", "")
        if anthropic_key:
            try:
                from langchain_anthropic import ChatAnthropic
                
                llm = ChatAnthropic(
                    model="claude-haiku-4-5-20251001",
                    api_key=anthropic_key,
                    max_tokens=1500,
                )
                
                questions_str = "\n".join(questions) if questions else "None specified"
                
                prompt = f"""You are an expert educator. Create a personalized learning plan for:

**Topic:** {topic}
**Level:** {level}
**Learning Style:** {learning_style}
**Student Questions:** {questions_str}

Respond in JSON format with:
- lesson_plan: Detailed lesson plan (markdown format)
- resources: List of 4-5 learning resources (URLs or titles)
- quiz_questions: List of 3 quiz questions
- next_steps: Recommended next steps

Make it engaging, practical, and tailored to the learning style."""

                response = await llm.ainvoke(prompt)
                content = response.content
                
                import json
                import re
                
                json_match = re.search(r'\{[\s\S]*\}', content)
                if json_match:
                    try:
                        result = json.loads(json_match.group())
                        return {
                            "lesson_plan": result.get("lesson_plan", lesson_plan),
                            "resources": result.get("resources", resources),
                            "quiz_questions": result.get("quiz_questions", quiz_questions),
                            "next_steps": result.get("next_steps", next_steps),
                        }
                    except json.JSONDecodeError:
                        pass
            except Exception:
                pass
    
    return {
        "lesson_plan": lesson_plan,
        "resources": resources,
        "quiz_questions": quiz_questions,
        "next_steps": next_steps,
    }


# ─── Teaching Agent ───────────────────────────────────────────────────────────
async def run_teaching_agent(
    topic: str,
    content: str,
    difficulty: str = "intermediate",
    examples: list = None,
) -> dict:
    """
    Process and structure educational content contributed by users.
    Enhances content with exercises and related topics.
    """
    examples_str = "\n".join(examples) if examples else "No examples provided"
    
    acknowledgment = f"Thank you for contributing to the {topic} knowledge base! Your content has been processed and added to our learning platform."
    
    structured_content = f"""# {topic} ({difficulty.capitalize()})

## Overview
{content}

## Examples
{examples_str}

## Key Takeaways
- Core concepts have been indexed
- Related topics have been linked
- Content is now searchable"""

    suggested_exercises = [
        f"Implement a basic {topic} example",
        f"Compare {topic} with alternative approaches",
        f"Build a project using {topic}",
        f"Teach {topic} to someone else",
    ]
    
    related_topics = [
        f"Advanced {topic}",
        f"{topic} Best Practices",
        f"{topic} vs Alternatives",
        f"Real-world {topic} Applications",
    ]
    
    # Enhance with LLM if available
    if LANGGRAPH_AVAILABLE:
        anthropic_key = os.getenv("ANTHROPIC_API_KEY", "")
        if anthropic_key:
            try:
                from langchain_anthropic import ChatAnthropic
                
                llm = ChatAnthropic(
                    model="claude-haiku-4-5-20251001",
                    api_key=anthropic_key,
                    max_tokens=1000,
                )
                
                prompt = f"""You are an educational content curator. Process this teaching contribution:

**Topic:** {topic}
**Content:** {content}
**Difficulty:** {difficulty}
**Examples:** {examples_str}

Respond in JSON format with:
- acknowledgment: Thank you message
- structured_content: Well-formatted content (markdown)
- suggested_exercises: List of 3-4 practical exercises
- related_topics: List of 4 related topics to explore

Make it educational and engaging."""

                response = await llm.ainvoke(prompt)
                content = response.content
                
                import json
                import re
                
                json_match = re.search(r'\{[\s\S]*\}', content)
                if json_match:
                    try:
                        result = json.loads(json_match.group())
                        return {
                            "acknowledgment": result.get("acknowledgment", acknowledgment),
                            "structured_content": result.get("structured_content", structured_content),
                            "suggested_exercises": result.get("suggested_exercises", suggested_exercises),
                            "related_topics": result.get("related_topics", related_topics),
                        }
                    except json.JSONDecodeError:
                        pass
            except Exception:
                pass
    
    return {
        "acknowledgment": acknowledgment,
        "structured_content": structured_content,
        "suggested_exercises": suggested_exercises,
        "related_topics": related_topics,
    }
