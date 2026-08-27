"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Github, ExternalLink, ChevronDown, ChevronUp, Zap, Star, Clock, ShoppingBag, ShieldCheck, Terminal, LayoutGrid } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

type ProjectStatus = "Featured" | "In Development" | "Completed" | "Research" | "Flagship" | "Enterprise Grade";

/**
 * Status is a SEMANTIC role, not a colour. Each status resolves to tokens via
 * STATUS_TOKENS below, so the palette stays cyan-only and retints with the
 * theme. The previous `statusColor: string` field smuggled four extra accents
 * (#f59e0b, #84cc16, #a855f7, #3b82f6) past the design system — including the
 * retired lime brand — and painted titles, borders and metrics with them.
 */
type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  tagline: string;
  problem?: string;
  solution?: string;
  impact?: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  image?: string;
  metrics?: { label: string; value: string }[];
  featured?: boolean;
  isNew?: boolean;
};

const PROJECTS_EN: Project[] = [
  {
    id: "legacyx",
    title: "LegacyX: Automated COBOL & Java Migration Agent",
    status: "Enterprise Grade",
    tagline: "AST Intermediate Representation, Fixed-Point Arithmetic & 100% Semantic Parity Transpilation",
    problem: "Global enterprises run over 220B lines of legacy COBOL and aging Java J2EE code where manual rewrites take 3-7 years and fail 70%+ of the time due to undocumented business rules.",
    solution: "A loop-driven legacy modernization multi-agent framework featuring ParserAgent (deconstructing COBOL divisions & EJB patterns into an AST Intermediate Representation), TranslatorAgent (transpiling into typed Python 3.12 & TypeScript with Decimal precision), and VerifierAgent (executing automated boundary condition tests to certify 100% semantic equivalence).",
    impact: "100% semantic parity, zero fixed-point rounding drift, <25ms transpilation latency, and 11/11 passing automated tests.",
    description: "Enterprise multi-agent framework that translates monolithic COBOL and legacy Java into modern TypeScript and Python 3.12 with guaranteed semantic parity.",
    tech: ["FastAPI", "Python 3.12", "AST Parser", "TypeScript", "Pydantic", "Zod", "Docker", "Helm", "Pytest"],
    github: "https://github.com/asadullah48/legacyx",
    demo: "http://127.0.0.1:8017/",
    metrics: [
      { label: "Semantic Parity", value: "100.0%" },
      { label: "Math Drift", value: "0.0%" },
      { label: "Tests", value: "11/11" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "synthdata",
    title: "SynthData: Privacy-First Synthetic Data Generator",
    status: "Enterprise Grade",
    tagline: "Laplace Differential Privacy Noise, Zero-PII Eradication & GDPR/HIPAA Compliant Test Data Harness",
    problem: "Using production customer data for testing and machine learning exposes enterprises to severe GDPR/HIPAA regulatory fines and catastrophic privacy breach liabilities.",
    solution: "A privacy-first synthetic data generation multi-agent framework featuring GeneratorAgent (producing domain-tailored records with Laplace differential privacy noise), ValidatorAgent (verifying correlation preservation r >= 0.90), and ComplianceAgent (executing deep zero-PII leak scans and certifying GDPR Article 25 & HIPAA Safe Harbor compliance).",
    impact: "Strict epsilon <= 0.50 DP guarantee, 0.0% PII leak rate, 94.0% correlation preservation, and 10/10 passing automated tests.",
    description: "Enterprise multi-agent framework generating realistic synthetic datasets with strict Differential Privacy and Zero-PII certification for GDPR/HIPAA safe testing.",
    tech: ["FastAPI", "Python 3.12", "Differential Privacy", "Laplace Noise", "PII Scrubber", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/synthdata",
    demo: "http://127.0.0.1:8016/",
    metrics: [
      { label: "Privacy DP", value: "ε <= 0.5" },
      { label: "PII Leaks", value: "0.0%" },
      { label: "Tests", value: "10/10" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "accessai",
    title: "AccessAI: Real-Time Audio Description & Accessibility Agent",
    status: "Enterprise Grade",
    tagline: "Live Media Stream Ingestion, Zero-Collision SSML Narration & WCAG 2.2 AAA Accessibility Certification",
    problem: "Live media broadcasts, keynotes, and video conferencing remain largely inaccessible to visually impaired users, while manual audio description post-production takes days.",
    solution: "A real-time assistive multi-agent framework featuring StreamAgent (detecting visual salience and inter-dialogue silence gaps), NarratorAgent (synthesizing concise SSML audio descriptions fitted into silence windows), and ComplianceAgent (enforcing WCAG 2.2 AAA, Section 508, and ADA Title III with zero speech collisions).",
    impact: "Sub-120ms stream latency, 0.0% dialogue collision rate, 8.4:1 contrast ratio, and 11/11 passing automated tests.",
    description: "Assistive multi-agent framework generating live audio descriptions and real-time visual summaries for visually impaired users with WCAG 2.2 AAA compliance.",
    tech: ["FastAPI", "Python 3.12", "Multimodal AI", "SSML Synthesis", "WCAG 2.2 AAA", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/accessai",
    demo: "http://127.0.0.1:8015/",
    metrics: [
      { label: "Latency", value: "<120ms" },
      { label: "WCAG Level", value: "2.2 AAA" },
      { label: "Tests", value: "11/11" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "collabx",
    title: "CollabX: Multi-Agent Newsletter & Editorial Team",
    status: "Enterprise Grade",
    tagline: "Orchestrated Newsroom State Graph, Autonomous Research Ingestion, Narrative Composition & Flesch-Kincaid Auditing",
    problem: "Single-prompt LLMs generate generic, uninspired content with hallucinated statistics and inconsistent tone, while manual corporate newsletter production takes days.",
    solution: "An orchestrated multi-agent collaborative editorial desk featuring ResearcherAgent (discovering verified industry statistics and executive quotes), WriterAgent (composing engaging narrative arcs and catchy hooks), and EditorAgent (Flesch-Kincaid readability scoring >= 80, fact-checking, and dual Markdown/HTML export).",
    impact: "3.4x publishing velocity speedup, 88.5/100 readability score, 100% verified quote grounding, and 10/10 passing automated tests.",
    description: "Orchestrated multi-agent framework coordinating specialized Researcher, Writer, and Editor agents in a collaborative state graph to produce publication-ready newsletters.",
    tech: ["FastAPI", "Python 3.12", "LangGraph Patterns", "Multi-Agent Teams", "Editorial Automation", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/collabx",
    demo: "http://127.0.0.1:8014/",
    metrics: [
      { label: "Velocity", value: "3.4x" },
      { label: "Readability", value: "88.5" },
      { label: "Tests", value: "10/10" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "docucode",
    title: "DocuCode: Contextual Documentation Agent (AST Diff & Auto-Sync)",
    status: "Enterprise Grade",
    tagline: "Real-Time AST Diff Monitoring, Google-Style Docstring Synthesis, Type Accuracy Auditing & Zero-Drift READMEs",
    problem: "Software codebases evolve rapidly while documentation stagnates, causing signature drift, broken API references, and hours wasted decoding undocumented parameters.",
    solution: "An IDE-embedded contextual documentation framework governed by Watch-Doc-Review loops featuring WatcherAgent (AST signature diffing & drift calculation), DocAgent (Google/Sphinx docstrings & README API table synthesis), and ReviewerAgent (type annotation accuracy validation).",
    impact: "98.5% AST signature accuracy, 100% parameter coverage, sub-4ms sync latency, and 11/11 passing automated tests.",
    description: "IDE-embedded agent framework auto-updating in-code docstrings, API references, and README tables as developers write code.",
    tech: ["FastAPI", "Python 3.12", "AST Diffing", "Docstring Generator", "Developer Tools", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/docucode",
    demo: "http://127.0.0.1:8013/",
    metrics: [
      { label: "AST Match", value: "98.5%" },
      { label: "Coverage", value: "100%" },
      { label: "Tests", value: "11/11" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "privatebrain",
    title: "PrivateBrain: Local Finance Memory Agent (Air-Gapped & Zero-Cloud)",
    status: "Enterprise Grade",
    tagline: "Air-Gapped On-Device Execution, AES-256 Encrypted Memory Vault, PII Redaction & Zero Cloud Egress",
    problem: "Transmitting confidential wealth records, tax returns (Schedule C/1099), and private bank accounts (IBAN/SSN) to multi-tenant cloud LLMs violates banking secrecy and creates catastrophic data leakage risks.",
    solution: "A privacy-first local financial memory framework featuring IndexerAgent (local document ingestion into encrypted vector partitions), MemoryAgent (zero-knowledge semantic retrieval with ephemeral in-memory context), and PrivacyAgent (strict air-gap egress firewall and automatic PII sanitization).",
    impact: "100% on-device air-gap isolation, 0 bytes cloud egress leakage, sub-3ms retrieval latency, and 14/14 passing automated tests.",
    description: "Privacy-first on-device agent framework indexing personal financial emails, wealth notes, tax slips, and browsing history with strict zero-cloud egress.",
    tech: ["FastAPI", "Python 3.12", "Local LLMs", "Air-Gapped Security", "AES-256 Vault", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/privatebrain",
    demo: "http://127.0.0.1:8012/",
    metrics: [
      { label: "Air-Gap", value: "100%" },
      { label: "Cloud Egress", value: "0 Bytes" },
      { label: "Tests", value: "14/14" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "researchx",
    title: "ResearchX: Autonomous Analyst Agent & Market Intelligence",
    status: "Enterprise Grade",
    tagline: "Multi-Source Evidence Triangulation, SEC Filing Ingestion, Divergence Auditing & SWOT Synthesis",
    problem: "Financial analysts spend 80% of their time cross-referencing conflicting industry numbers across filings, while traditional LLMs hallucinate statistics and lack verifiable citation provenance.",
    solution: "An autonomous analyst framework governed by Plan-Act-Verify loops featuring SearchAgent (SEC 10-K & industry benchmark ingestion), VerifyAgent (multi-source triangulation & divergence delta auditing), and ReportAgent (institutional dossiers with SWOT matrices & verifiable inline citations).",
    impact: "98% triangulation consensus accuracy, 0% hallucinated statistics, sub-50ms synthesis latency, and 10/10 passing automated tests.",
    description: "Autonomous analyst framework independently discovering, verifying, and cross-referencing industry data to produce full market intelligence reports.",
    tech: ["FastAPI", "Python 3.12", "Market Intelligence", "Evidence Triangulation", "Equity Research", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/researchx",
    demo: "http://127.0.0.1:8011/",
    metrics: [
      { label: "Consensus", value: "98%" },
      { label: "Provenance", value: "100%" },
      { label: "Tests", value: "10/10" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "graphai",
    title: "GraphAI: Enterprise Workflow Orchestration (DAGs, HITL & Retries)",
    status: "Enterprise Grade",
    tagline: "Topological DAG Scheduling, Parallel Fan-Out Execution, HITL Compliance Gating & Exponential Retries",
    problem: "Linear unstructured agent execution causes unhandled dependency race conditions, lack of human-in-the-loop compliance authorization, and fatal workflow halts on transient downstream network errors.",
    solution: "A graph-first enterprise workflow framework featuring WorkflowAgent (topological sorting, parallel fan-out/fan-in dispatch, and branching), ApprovalAgent (compliance policy evaluation and HMAC signature validation), and RetryAgent (exponential backoff with jitter and idempotent fault recovery).",
    impact: "100% DAG topological integrity, 2.4x parallel execution speedup, 99.99% self-healing error recovery, and 12/12 passing automated tests.",
    description: "Enterprise graph orchestration engine enabling multi-agent DAG execution with HITL approvals and exponential retries.",
    tech: ["FastAPI", "Python 3.12", "DAG Workflows", "HITL Approvals", "Exponential Backoff", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/graphai",
    demo: "http://127.0.0.1:8010/",
    metrics: [
      { label: "DAG Integrity", value: "100%" },
      { label: "Speedup", value: "2.4x" },
      { label: "Tests", value: "12/12" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "loopai",
    title: "LoopAI: Feedback-Driven Agents (Plan-Act-Verify Self-Correction)",
    status: "Enterprise Grade",
    tagline: "Autonomous Reflection, Evidentiary Assertion Auditing, Closed-Loop Replanning & Convergence",
    problem: "Single-pass linear agent execution produces ungrounded hallucinations, structural formatting omissions, and silent calculation errors with zero autonomous self-correction mechanisms.",
    solution: "A closed-loop agent framework featuring PlannerAgent (goal decomposition & formal verification assertions), ActorAgent (tool execution & candidate generation), and VerifierAgent (evidentiary auditing, confidence scoring V_score >= 0.90, and actionable critique feedback for iterative replanning).",
    impact: "100% verification convergence, 0% groundless claims, average 2-iteration self-correction cycle, and 12/12 passing automated tests.",
    description: "Plan-Act-Verify feedback loop framework enabling autonomous agents to self-correct and verify evidentiary correctness.",
    tech: ["FastAPI", "Python 3.12", "Feedback Loops", "Self-Correction", "Reflection", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/loopai",
    demo: "http://127.0.0.1:8009/",
    metrics: [
      { label: "Convergence", value: "100%" },
      { label: "Confidence", value: ">=0.90" },
      { label: "Tests", value: "12/12" },
    ],
    featured: true,
  },
  {
    id: "orchestratorx",
    title: "OrchestratorX: Supervisor-Pattern Multi-Agent Framework",
    status: "Completed",
    tagline: "Routing as a testable invariant, not a prompt",
    problem: "A multi-agent system has to answer four questions: who runs next, what happens when a specialist finds something, what happens when one fails, and how you prove afterwards what actually occurred. The common answer puts all four inside a prompt, which makes the most important behaviour in the system untestable without a live model, non-deterministic across runs, and unprovable to a reviewer.",
    solution: "All four move into typed state and plain Python on a LangGraph supervisor. Specialist agents (RiskModeler, ComplianceChecker, ClientAdvisor, Reporter) return only to the supervisor and never to each other, so every routing decision sits in one function that can be tested in isolation. Six invariants are enforced structurally rather than by convention: only the supervisor routes, required specialists always run before a report, every run terminates, every hop is recorded on success and failure, routing never consults a model, and concurrent runs are isolated by run id so breaker state cannot leak between them.",
    impact: "41 tests pass with no API key and no network, because routing is model-free — that is what makes 'the supervisor never skips ComplianceChecker' a millisecond CI assertion rather than a claim in a README. A looping supervisor needs a hop budget, not just a retry cap: retries bound one node's failures, but only a budget bounds the cycle. Escalation is graduated and isolated in one function marked POLICY SEAM — halt on critical, one bounded mitigation round on high — so an organisation's risk posture is a single-function edit. Ships a CLI, a FastAPI service whose GET /trace/{run_id} lets a run be interrogated after the fact, a Dockerfile, and CI across Python 3.11 to 3.13.",
    description: "A supervisor-pattern multi-agent framework where the routing rules are typed state rather than prompt text, every hop lands in an ordered audit trace including the failures, and the whole suite runs offline.",
    tech: ["LangGraph", "Python 3.13", "Pydantic", "FastAPI", "Docker", "GitHub Actions", "pytest"],
    github: "https://github.com/asadullah48/orchestratorx",
    metrics: [
      { label: "Tests",      value: "41" },
      { label: "Invariants", value: "6"  },
      { label: "API Keys",   value: "0"  },
    ],
    isNew: true,
  },
  {
    id: "harnessai",
    title: "HarnessAI: Safe Operating Environment for Autonomous Agents",
    status: "Enterprise Grade",
    tagline: "Deterministic Containment, Sandboxed Capability Broker, Memory Partitioning & Runaway Circuit Breakers",
    problem: "Autonomous AI agents executing tools and mutating shared context risk infinite recursive execution, context memory poisoning, unhandled timeouts, and dirty state mutations without rollback capabilities.",
    solution: "A harness-first safe runtime architecture featuring ToolManager (capability-scoped sandboxing and 3.0s timeout ceilings), MemoryAgent (partitioned working/episodic context storage with poison scrubbers), and ObserverAgent (real-time telemetry and automated runaway circuit breaker tripping).",
    impact: "100% blast radius containment, automatic state rollbacks, 0 dirty memory states, and 15/15 passing automated tests.",
    description: "Harness layer ensuring autonomous agents operate safely with sandboxed tools, partitioned memory, and deterministic telemetry.",
    tech: ["FastAPI", "Python 3.12", "Agent Harness", "Sandboxing", "Circuit Breaker", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/harnessai",
    demo: "http://127.0.0.1:8008/",
    metrics: [
      { label: "Containment", value: "100%" },
      { label: "Trip Latency", value: "<10ms" },
      { label: "Tests", value: "15/15" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "securebridge",
    title: "SecureBridge: Agent Security Layer for MCP/A2A Mesh",
    status: "Enterprise Grade",
    tagline: "Compliance-First Zero-Trust Interoperability, Tool Poisoning Defense & Data Loss Prevention (DLP)",
    problem: "Model Context Protocol (MCP) and Agent-to-Agent (A2A) meshes are vulnerable to tool poisoning, indirect prompt injection inside tool outputs, shadow shell execution, and unauthorized PII/API key exfiltration.",
    solution: "A zero-trust agent security layer featuring SecurityAgent (handshake authentication, mTLS validation, and token rate-limiting), DefenseAgent (AST deep packet inspection, prompt override blocking, and output sanitization), and ComplianceAgent (least-privilege RBAC, DLP data egress tokenization, and SHA-256 cryptographic audit ledger).",
    impact: "100% tool poisoning interception rate, 0.42ms gateway latency, 45k+ tokenized confidential secrets, and 14/14 passing automated tests.",
    description: "Compliance-first security layer for MCP and A2A interoperability defending against tool poisoning and malicious connections.",
    tech: ["FastAPI", "Python 3.12", "MCP Protocol", "Zero-Trust Security", "DLP Engine", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/securebridge",
    demo: "http://127.0.0.1:8007/",
    metrics: [
      { label: "Attack Block Rate", value: "100%" },
      { label: "Gateway Latency", value: "0.42ms" },
      { label: "Tests", value: "14/14" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "workforceai-academy",
    title: "WorkforceAI Academy: Enterprise AI-Human Teaming & Fluency Platform",
    status: "Enterprise Grade",
    tagline: "Interactive AI Enablement, Real-Time In-Workflow Co-Pilot Scaffolding & Collaboration Index Certifications",
    problem: "Enterprise AI adoption fails when employees treat advanced reasoning agents as generic search engines, succumb to hallucination blindness, and lack structured guidance when designing agentic tool schemas.",
    solution: "An enterprise enablement multi-agent suite featuring TrainerAgent (interactive multi-track AI fluency curriculum from Zero-Shot to Multi-Agent Choreography), MentorAgent (real-time in-flight co-pilot scaffolding and prompt refactoring), and AssessmentAgent (mathematical Collaboration Index scoring and verifiable SHA-256 certifications).",
    impact: "88.5% workforce fluency rate, +3.4x task speedup delta, 94.2% evidentiary hallucination interception, and 12/12 passing automated tests.",
    description: "Enterprise multi-agent framework that trains, mentors, and certifies employees in high-value AI collaboration, prompt engineering, and agentic orchestration.",
    tech: ["FastAPI", "Python 3.12", "Human-AI Teaming", "Collaboration Index", "Workflow Scaffolding", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/workforceai-academy",
    demo: "http://127.0.0.1:8006/",
    metrics: [
      { label: "Fluency Rate", value: "88.5%" },
      { label: "Speedup Delta", value: "+3.4x" },
      { label: "Tests", value: "12/12" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "conciergeagent",
    title: "ConciergeAgent: Hyperpersonalized Service AI Platform",
    status: "Enterprise Grade",
    tagline: "White-Glove Tier-Adapted Wealth Advisory, Instant Dispute Auto-Credits & Five-Star Hospitality AI",
    problem: "Generic conversational chatbots alienate high-net-worth and VIP clients in banking, insurance, and luxury retail with rigid scripts, ungrounded responses, and slow escalation during high-distress fraud and claims scenarios.",
    solution: "A luxury multi-agent concierge architecture featuring AdvisorAgent (tier-adapted asset allocation and tax-loss harvesting), SupportAgent (instant provisional dispute auto-credits up to $50k and fast-tracked VIP claims), and ExperienceAgent (real-time sentiment tracking, luxury gifting, and white-glove executive handover).",
    impact: "4.98/5.00 predicted CSAT, 30-second guaranteed VIP SLA, zero-liability instant dispute protection, and 13/13 passing automated tests.",
    description: "Customer-facing multi-agent framework delivering white-glove concierge-level personalization in banking, insurance, and luxury retail.",
    tech: ["FastAPI", "Python 3.12", "Hyperpersonalization", "Wealth Tier SLA", "Sentiment Modulation", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/conciergeagent",
    demo: "http://127.0.0.1:8005/",
    metrics: [
      { label: "CSAT Score", value: "4.98 / 5.0" },
      { label: "VIP SLA", value: "30s" },
      { label: "Tests", value: "13/13" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "contextx",
    title: "ContextX: Advanced Context Engineering Framework",
    status: "Enterprise Grade",
    tagline: "Beyond Prompt Engineering: Hybrid RRF, Lost-in-the-Middle Attention Windows & Grounded Synthesis",
    problem: "Standard prompt stuffing in enterprise RAG pipelines suffers from the 'Lost-in-the-Middle' effect (up to 60% attention degradation in mid-context tokens), severe context dilution, and ungrounded hallucinations lacking chunk-level attribution.",
    solution: "An enterprise context engineering framework featuring RetrieverAgent (dense vectors + BM25 keywords + exponential recency decay RRF), ContextBuilder (boundary-weighted Lost-in-the-Middle mitigation and mathematical token budget clamping), and DecisionAgent (synthesizing multi-hop decisions with explicit chunk citations).",
    impact: "+34% retrieval precision lift, -42% token waste eliminated, 99.4% boundary attention recall, and 12/12 passing automated tests.",
    description: "Advanced Context Engineering Framework optimizing agent retrieval, token allocation, boundary-weighted context windows, and cited multi-hop decision synthesis beyond basic prompt engineering.",
    tech: ["FastAPI", "Python 3.12", "RRF Hybrid Search", "Context Compression", "Lost-in-the-Middle Layout", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/contextx",
    demo: "http://127.0.0.1:8004/",
    metrics: [
      { label: "Precision Lift", value: "+34%" },
      { label: "Token Savings", value: "42%" },
      { label: "Tests", value: "12/12" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "guardrailai",
    title: "GuardrailAI: Deterministic Workflow & Compliance Layer",
    status: "Enterprise Grade",
    tagline: "Zero-Trust Agentic Guardrails, Circuit Breakers & Cryptographic SHA-256 Audit Trails",
    problem: "Probabilistic LLM agents cannot be deployed in high-consequence finance, healthcare, and legal workflows due to non-deterministic hallucinations, lack of hard safety ceilings, and failure to meet evidentiary audit standards (SOC-2, SEC 17a-4, HIPAA).",
    solution: "A zero-trust multi-agent state machine where compliance is structural: pre-flight statutory interceptors, ProcessAgent bounded executions, ComplianceAgent post-flight threshold enforcement, automated circuit breakers with safe fallbacks, and an immutable SHA-256 blockchain-style audit ledger.",
    impact: "0.00% state non-determinism, 100% automated enforcement across AML, OFAC, HIPAA Safe Harbor, and liability caps, cryptographic non-repudiation certificates, and 17/17 passing automated tests.",
    description: "Compliance-critical multi-agent framework enforcing deterministic guardrails, mathematical bounds, circuit breaker fallbacks, and cryptographic hash-chained audit trails.",
    tech: ["FastAPI", "Python 3.12", "LangGraph", "State Machines", "SHA-256 Cryptography", "Circuit Breakers", "Helm", "Docker"],
    github: "https://github.com/asadullah48/guardrailai",
    demo: "http://127.0.0.1:8003/",
    metrics: [
      { label: "Non-Determinism", value: "0.00%" },
      { label: "Audit Ledger", value: "SHA-256" },
      { label: "Tests", value: "17/17" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "domainx",
    title: "DomainX: Specialized Multi-Agent Framework",
    status: "Enterprise Grade",
    tagline: "Specialized Vertical Intelligence (Legal • Medical • Supply Chain) Outperforming Generalist LLMs",
    problem: "Generalist foundation models suffer from 14%+ hallucination rates and regulatory non-compliance in high-stakes legal, healthcare, and supply chain applications.",
    solution: "Specialized multi-agent architecture fusing deterministic rule engines, clinical ontologies (ICD-10-CM / CPT), HIPAA Safe Harbor 18 PHI scrubber, and mathematical Economic Order Quantity (EOQ) inventory optimization.",
    impact: "99.4% legal precision with automated redlines, 99.2% clinical coding accuracy with 100% PHI redaction, 22% inventory holding cost reduction with Scope 1-3 ESG carbon tracking, and 16/16 passing automated tests.",
    description: "High-precision vertical multi-agent framework outperforming generalist models across Legal, Medical, and Supply Chain domains.",
    tech: ["FastAPI", "Python 3.12", "HIPAA Safe Harbor", "ICD-10 / CPT", "EOQ Optimization", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/domainx",
    demo: "http://127.0.0.1:8002/",
    metrics: [
      { label: "Legal Precision", value: "99.4%" },
      { label: "Medical Accuracy", value: "99.2%" },
      { label: "Tests", value: "16/16" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "marketagenthub",
    title: "MarketAgentHub: Marketplace-Ready Multi-Agent Suite",
    status: "Enterprise Grade",
    tagline: "Multi-Cloud A2A & MCP Autonomous Agents for AWS, Azure, GCP & Salesforce",
    problem: "Deploying autonomous agentic AI across major cloud marketplaces (AWS Bedrock, Azure AI, GCP Vertex, Salesforce Agentforce) requires fragmented action schemas, custom metering, and unstandardized inter-agent protocols.",
    solution: "Marketplace-ready multi-agent framework featuring PortfolioAgent, ComplianceAgent, and ClientEngagementAgent with native OpenAPI action group adapters, SaaS token metering engine, and A2A inter-agent protocol.",
    impact: "Universal multi-cloud packaging with 100% deterministic regulatory checks (SEC, FINRA, MiFID II). Interactive glassmorphic command center with 19/19 passing automated tests.",
    description: "Production-ready autonomous agent suite designed for deployment in AWS, Microsoft Azure, Google Cloud, and Salesforce marketplaces.",
    tech: ["FastAPI", "Python 3.12", "A2A Protocol", "AWS Bedrock", "Azure AI", "GCP Vertex", "Salesforce Agentforce", "Docker"],
    github: "https://github.com/asadullah48/marketagenthub",
    demo: "http://127.0.0.1:8000/",
    metrics: [
      { label: "Cloud Giants", value: "4 Clouds" },
      { label: "Deterministic SLA", value: "100%" },
      { label: "Tests", value: "19/19" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "workforceai",
    title: "WorkforceAI: Agent-as-a-Worker Automation Platform",
    status: "Enterprise Grade",
    tagline: "Scalable Agent Workforce Automation with Outcome-Based Pricing & Supervisor Governance",
    problem: "Traditional RPA and generalist LLMs charge per-token without accountability for task completion, leading to unpredictable SaaS costs and zero SLA guarantees.",
    solution: "Outcome-based agent workforce platform with TaskRunner workers, BillingAgent tracking per-task completion rates and SLA penalty discounts, and SupervisorAgent dynamically balancing workforce bottlenecks.",
    impact: "98%+ SLA completion rate with automated penalty credits, cryptographic Proof-of-Work task signatures, interactive ROI calculator against $75k human FTEs, and 15/15 passing tests.",
    description: "Enterprise agent workforce orchestration platform with outcome-based pricing models based on task completion rates.",
    tech: ["FastAPI", "Python 3.12", "Supervisor Governance", "Outcome Pricing", "Async Worker Pools", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/workforceai",
    demo: "http://127.0.0.1:8001/",
    metrics: [
      { label: "Task SLA", value: "98%+" },
      { label: "FTE Savings", value: "85%" },
      { label: "Tests", value: "15/15" },
    ],
    featured: true,
  },
  {
    id: "protobridge",
    title: "ProtoBridge: MCP × A2A Interoperability Layer",
    status: "Completed",
    tagline: "Protocol-first interoperability for agentic AI",
    problem: "Anthropic's MCP and Google's A2A solve adjacent problems, and a real enterprise agent needs both: MCP to call tools you host over stdio, A2A to delegate work to agents another company operates over HTTP. Wiring them together ad hoc produces N-squared translators and, worse, drops the governance context at every seam. The caller's identity, the data's sensitivity label and the correlation id all evaporate the moment a message changes protocol.",
    solution: "One normalised ProtocolEnvelope that every message is lifted into and lowered out of, so adding a protocol costs a single codec pair instead of N-squared adapters. Governance rides inside the message rather than in transport headers, because headers do not survive an MCP stdio hop. Three agents sit on a LangGraph state machine: MCPConnector binds external tools, A2AGateway delegates across vendor boundaries, and AuditAgent inspects twice per hop, once before dispatch and once after, because ingress cannot know a response will carry a national ID and egress cannot un-send a request. Both protocols are implemented to the wire rather than simulated: real JSON-RPC over stdio in a subprocess, and a real HTTP peer serving an Agent Card at /.well-known/agent.json.",
    impact: "41 tests pass with no API key and no network. Every hop lands in a hash-chained ledger that covers a payload digest rather than the payload, so the integrity proof survives dropping the sensitive bytes. The live demo replays six real traces and recomputes all ten SHA-256 digests in the visitor's own browser, so tamper detection can be checked rather than taken on trust. Enforcement is isolated in one function marked POLICY SEAM, which makes an organisation's risk posture a single-function edit.",
    description: "A standards-compliant interoperability layer that speaks Anthropic's MCP and Google's A2A through one governed pipeline, inspecting, redacting or refusing every message that crosses a boundary.",
    tech: ["LangGraph", "MCP", "A2A", "JSON-RPC 2.0", "Python 3.13", "Pydantic", "GitHub Pages"],
    github: "https://github.com/asadullah48/protobridge",
    demo: "https://asadullah48.github.io/protobridge/",
    metrics: [
      { label: "Protocols", value: "MCP + A2A" },
      { label: "Tests",     value: "41"        },
      { label: "API Keys",  value: "0"         },
    ],
    isNew: true,
  },
  {
    id: "finagent-nexus",
    title: "FinAgent-Nexus: Multi-Agent Financial Intelligence",
    status: "Enterprise Grade",
    tagline: "Agentic AI adoption for financial services",
    problem: "Most agentic pilots in financial services die at the compliance review, not because the models are weak, but because a system that cannot show why it reached a conclusion cannot be signed off by a second line of defence. A control a model can argue its way past is not a control.",
    solution: "Three specialised agents, MarketAnalyst, ComplianceOfficer and WealthStrategist, on a fixed Plan-Act-Verify state machine rather than a conversation. Compliance is structural: no agent holds two of the three powers (market data, setting weights, rendering the verdict), and there is deliberately no graph edge from drafting a recommendation to approving one, so verification cannot be skipped under load or disabled by a flag. Shari'ah and regulatory principles live in a versioned constitution reviewed like code, and anything expressible as arithmetic is settled in Python with no model involved.",
    impact: "A full compliance screen runs in under 2ms with zero model calls, settling 8 of 14 principles by arithmetic, reproducible offline at no marginal cost. Every run writes a hash-chained, tamper-evident audit trail. 94 tests pass with no API key and no network, and the screening engine is deployed live and interactive, so every figure here can be checked in one click.",
    description: "An autonomous multi-agent system automating wealth management research and Sharia-compliant regulatory checks.",
    tech: ["LangGraph", "Anthropic Claude", "Constitutional AI", "Python 3.12", "Pydantic", "pytest", "Vercel"],
    github: "https://github.com/asadullah48/finagent-nexus",
    demo: "https://finagent-nexus.vercel.app",
    metrics: [
      { label: "Compliance Screen", value: "<2ms" },
      { label: "Model Calls",       value: "0"    },
      { label: "Tests",             value: "94"   },
    ],
    isNew: true,
  },
  {
    id: "bazaar",
    title: "Bazaar: Unified B2B + B2C Marketplace",
    status: "Flagship",
    tagline: "Pakistan's First Unified B2B/B2C Marketplace",
    problem: "Local SMEs in Pakistan and the UAE have no unified digital storefront. Buyers juggle multiple platforms, vendors lack analytics, and enterprise clients need white-label flexibility, all three groups are underserved by existing solutions.",
    solution: "Bazaar unifies B2C retail (browse, cart, checkout, JazzCash, Easypaisa, Card) and B2B wholesale (RFQ engine, quantity-tier pricing, verified suppliers) into one platform. Architecture: multi-tenant Next.js 15 storefront, FastAPI microservices, Supabase BaaS for auth/realtime, local + Stripe payment gateways, vendor dashboard with analytics, AI-powered recommendations, and a white-label enterprise tier.",
    impact: "500+ verified sellers, 10K+ products across Textiles, Electronics, Furniture, Auto Parts & more. PKR-native, 3 languages (EN/UR/AR). Modular design means each tier is additive, one codebase, SME to enterprise scale.",
    description: "Pakistan's first unified marketplace with dual B2C retail storefront and B2B wholesale/RFQ engine, 500+ verified sellers, 10K+ products, JazzCash/Easypaisa/Card payments, and PKR-native currency. Built for local SMEs and enterprise adoption.",
    tech: ["Next.js 15", "FastAPI", "Supabase", "PostgreSQL", "Redis", "Docker", "TypeScript", "WhatsApp"],
    github: "https://github.com/asadullah48/bazaar",
    demo: "https://frontend-three-kappa-64.vercel.app",
    image: "/images/bazaar-preview.svg",
    metrics: [
      { label: "Mode",     value: "B2B + B2C" },
      { label: "Sellers",  value: "500+"       },
      { label: "Products", value: "10K+"       },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "ai-tradeflow",
    title: "AI TradeFlow: Inventory & Accounting for Wholesalers",
    status: "In Development",
    tagline: "AI for Pakistan's Trade Economy, Portfolio Project 1",
    problem: "Pakistan's wholesalers and traders run multi-crore operations on paper registers, WhatsApp voice notes, and memory, no real-time stock visibility, chaotic udhaar (credit) tracking, and reorder decisions made on gut feel instead of data.",
    solution: "A bilingual (Urdu + English) inventory and accounting platform with a real digital FTE, Munshi AI, an OpenAI Agents SDK agent with 5 read-only tools and a deterministic constitutional guardrail that blocks fraud/tax-evasion requests before any LLM call, never fabricates a number, and gracefully degrades to tool-grounded answers if the model API fails. FastAPI + SQLAlchemy + Alembic backend, a Next.js web app, and an Expo mobile companion, all against one shared API.",
    impact: "90 automated tests, including full-trade-cycle API integration tests and agent golden-question suites with tool-citation assertions. Proper FIFO udhaar aging, not a balance heuristic. First project in the 'AI for Pakistan Trade' series, back-office module now, sourcing/logistics/negotiation phases to follow.",
    description: "Bilingual AI-powered inventory & accounting platform for Pakistani wholesalers, with Munshi AI, a constitutionally-guarded digital accountant that reads your own data and answers 'what should I order this week?' with cited, grounded recommendations.",
    tech: ["FastAPI", "Next.js 16", "OpenAI Agents SDK", "SQLAlchemy", "Alembic", "Expo", "PostgreSQL"],
    github: "https://github.com/asadullah48/ai-tradeflow",
    metrics: [
      { label: "Tests",       value: "90+"       },
      { label: "Platforms",   value: "Web+Mobile" },
      { label: "Agent Tools", value: "5"          },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "textile-erp",
    title: "Textile ERP Platform",
    status: "In Development",
    tagline: "Full-scale ERP for Pakistan's textile industry",
    problem: "Pakistan's textile industry, CMT stitching units, garment factories, fabric mills, runs on WhatsApp messages, Excel sheets, and paper ledgers. Billing errors, zero production visibility, and manual inventory cost real money every day.",
    solution: "Multi-tenant SaaS ERP. Module 1 (Fabric Mill): roll/lot management, weaving & knitting stage tracking, yarn inventory, imported fabric. CMT modules: full order lifecycle, auto-billing across 4 bill types, BOM inventory, production sessions, dispatch, party ledgers, and cash tracking.",
    impact: "Targeting Faisalabad, Sialkot, Gujranwala, Karachi, and Lahore, Pakistan's full textile heartland. Multi-tenant SaaS on Kubernetes. Launching 2026.",
    description: "Full-scale ERP for Pakistan's textile and garment industry, from Fabric Mills to garment exporters.",
    tech: ["Next.js", "FastAPI", "PostgreSQL", "Kubernetes", "Supabase", "TypeScript"],
    github: "https://github.com/asadullah48",
    metrics: [
      { label: "Target Cities", value: "5+"   },
      { label: "Modules",       value: "6+"   },
      { label: "Launch",        value: "2026" },
    ],
    featured: true,
  },
  {
    id: "devunity",
    title: "DevUnity Platform",
    status: "Featured",
    tagline: "Open-source developer community hub",
    problem: "Pakistani developers lack a local, context-aware Q&A platform. Most alternatives are too generic and not community-driven.",
    solution: "Open-source community platform with threaded Q&A, blogs, project collaboration, and AI-powered answer suggestions. Built with Next.js 15 App Router and shadcn/ui.",
    impact: "Live with Code + Demo. Modular codebase with 85% reuse for future community products.",
    description: "Open-source developer community platform with Q&A, blogs, and collaboration features.",
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "shadcn/ui", "PostgreSQL"],
    github: "https://github.com/asadullah48",
    demo:   "https://asadullahshafique-devunity.vercel.app",
    image:  "/images/devunity-preview.svg",
    metrics: [
      { label: "Stack",   value: "Next.js 15"  },
      { label: "Status",  value: "Live"        },
      { label: "License", value: "Open Source" },
    ],
    featured: true,
  },
  {
    id: "stitching-packing",
    title: "Stitching & Packing ERP",
    status: "In Development",
    tagline: "CMT operations management for garment factories",
    description: "Specialised ERP for stitching units and packing departments. Order tracking, machine allocation, QC checkpoints, packaging labels, and export documentation, built for Pakistan's garment exporters.",
    tech: ["Next.js", "Supabase", "TypeScript", "PostgreSQL", "FastAPI"],
    github: "https://github.com/asadullah48",
    metrics: [
      { label: "Sector",  value: "CMT/Garment" },
      { label: "Status",  value: "Module 1"    },
      { label: "Target",  value: "Exporters"   },
    ],
  },
  {
    id: "agent-factory",
    title: "Agent Factory",
    status: "Featured",
    tagline: "Two-tier agent architecture at enterprise scale",
    description: "General Agent (Claude Code) builds Custom Agent (OpenAI Agents SDK). SKILL.md files as portable, monetizable intelligence units. Digital FTE model deployed on Kubernetes + Dapr. Targets OpenAI Apps ecosystem (800M users).",
    tech: ["Claude Code", "OpenAI Agents SDK", "SKILL.md", "MCP", "Kubernetes", "Dapr"],
    github: "https://github.com/asadullah48",
    metrics: [
      { label: "Hackathon", value: "H5 Completed" },
      { label: "Slides",    value: "117"          },
      { label: "Market",    value: "800M users"   },
    ],
  },
  {
    id: "rag-textbook",
    title: "RAG Textbook Platform",
    status: "Completed",
    tagline: "AI-powered textbook chatbot with RAG architecture",
    description: "Comprehensive textbook platform with RAG chatbot built during Panaversity Hackathon (H1) using specification-first development and Spec-Kit Plus methodology.",
    tech: ["Python", "FastAPI", "RAG", "SpecifyKit", "OpenAI API", "PostgreSQL"],
    github: "https://github.com/asadullah48",
    metrics: [
      { label: "Hackathon",    value: "H1 Silver"     },
      { label: "Architecture", value: "RAG + FastAPI" },
      { label: "Reuse",        value: "70%"           },
    ],
  },
];

const PROJECTS_AR: Project[] = [
  {
    id: "legacyx",
    title: "منصة LegacyX: وكيل التحديث البرمجي وتحويل الأنظمة القديمة",
    status: "Enterprise Grade",
    tagline: "تحليل شجرة AST، وضمان دقة الحسابات المالية، وترجمة برمجية بتطابق دلالي 100%",
    problem: "تشغل المؤسسات العالمية أكثر من 220 مليار سطر برمجي من أنظمة COBOL و Java القديمة حيث تستغرق إعادة الكتابة اليدوية سنوات وتفشل في أغلب الأحيان لغياب التوثيق.",
    solution: "إطار عمل ذكي متعدد الوكلاء لتحديث الأنظمة الموروثة يضم ParserAgent (تفكيك كود COBOL وأقسام البيانات إلى مخطط وسيط IR)، و TranslatorAgent (ترجمة الكود إلى Python 3.12 و TypeScript بدقة Decimal تامة)، و VerifierAgent (التدقيق الآلي للشروط الحدية واعتماد التطابق السلوكي بنسبة 100%).",
    impact: "تطابق دلالي بنسبة 100%، انعدام أخطاء التقريب الحسابي، سرعة تحويل فائقة أقل من 25 مللي ثانية، مع اجتياز 11/11 اختباراً آلياً.",
    description: "إطار عمل رائد متعدد الوكلاء لتحويل أنظمة COBOL و Java القديمة إلى لغات حديثة مثل TypeScript و Python 3.12 مع ضمان التطابق الدلالي والرياضي التام.",
    tech: ["FastAPI", "Python 3.12", "AST Parser", "TypeScript", "Pydantic", "Zod", "Docker", "Helm", "Pytest"],
    github: "https://github.com/asadullah48/legacyx",
    demo: "http://127.0.0.1:8017/",
    metrics: [
      { label: "التطابق الدلالي", value: "100.0%" },
      { label: "أخطاء الحساب", value: "0.0%" },
      { label: "الاختبارات", value: "11/11" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "synthdata",
    title: "منصة SynthData: مولد البيانات الاصطناعية الموجه لحماية الخصوصية",
    status: "Enterprise Grade",
    tagline: "ضوضاء الخصوصية التفاضلية (Laplace)، واستبعاد كامل للهويات (Zero-PII)، وبيئة اختبار معتمدة لـ GDPR و HIPAA",
    problem: "استخدام بيانات العملاء الحقيقية في بيئات الاختبار وتدريب الذكاء الاصطناعي يعرض الشركات لغرامات تنظيمية باهظة ومخاطر تسريب البيانات الحساسة.",
    solution: "إطار عمل ذكي متعدد الوكلاء لإنتاج البيانات الاصطناعية يضم GeneratorAgent (توليد سجلات واقعية بضوضاء لابلاس التفاضلية)، و ValidatorAgent (التحقق من دقة الترابط الإحصائي r >= 0.90)، و ComplianceAgent (الفحص العميق لمنع تسريب الهويات واعتماد معايير GDPR و HIPAA).",
    impact: "ضمان خصوصية تفاضلية إبسيلون <= 0.50، نسبة تسريب هويات 0.0%، الحفاظ على مصفوفة الترابط بنسبة 94.0%، مع اجتياز 10/10 اختبارات آلياً.",
    description: "إطار عمل رائد متعدد الوكلاء لتوليد مجموعات بيانات اصطناعية عالية الدقة الإحصائية مع ضمانات الخصوصية التفاضلية الرياضية وخلوها التام من البيانات الشخصية.",
    tech: ["FastAPI", "Python 3.12", "Differential Privacy", "Laplace Noise", "PII Scrubber", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/synthdata",
    demo: "http://127.0.0.1:8016/",
    metrics: [
      { label: "ميزانية DP", value: "ε <= 0.5" },
      { label: "تسريب PII", value: "0.0%" },
      { label: "الاختبارات", value: "10/10" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "accessai",
    title: "منصة AccessAI: وكيل الوصف الصوتي الفوري وإتاحة الوصول الرقمي الشامل",
    status: "Enterprise Grade",
    tagline: "معالجة فورية للبث المرئي المباشر، وتوليد نطق SSML خالٍ من التداخل، واعتماد معايير WCAG 2.2 AAA",
    problem: "يظل البث المرئي والمؤتمرات الحية غير متاح للمستخدمين ضعاف البصر، بينما يستغرق إعداد الأوصاف الصوتية يدوياً أياماً عديدة.",
    solution: "إطار عمل ذكي متعدد الوكلاء لإتاحة الوصول يضم StreamAgent (رصد العناصر المرئية وفترات الصمت بين الحوارات)، و NarratorAgent (صياغة الوصف الصوتي بتوقيت مثالي)، و ComplianceAgent (التدقيق الصارم لمعايير WCAG 2.2 AAA و Section 508 مع منع تداخل الأصوات تماماً).",
    impact: "زمن استجابة أقل من 120 مللي ثانية، نسبة تصادم الحوار 0.0%، تباين النصوص بنسبة 8.4:1، مع اجتياز 11/11 اختباراً آلياً.",
    description: "إطار عمل متعدد الوكلاء للذكاء الاصطناعي المساعد يقوم بتوليد أوصاف صوتية فورية وتلخيص المشاهد المرئية للمستخدمين ضعاف وفاقدي البصر وفق معايير WCAG 2.2 AAA.",
    tech: ["FastAPI", "Python 3.12", "Multimodal AI", "SSML Synthesis", "WCAG 2.2 AAA", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/accessai",
    demo: "http://127.0.0.1:8015/",
    metrics: [
      { label: "زمن الاستجابة", value: "<120ms" },
      { label: "معيار WCAG", value: "2.2 AAA" },
      { label: "الاختبارات", value: "11/11" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "collabx",
    title: "منصة CollabX: فريق التحرير متعدد الوكلاء لإنتاج النشرات والتقارير الإخبارية",
    status: "Enterprise Grade",
    tagline: "مخطط سير عمل تحريري منسق، واستكشاف ذكي للأدلة، وصياغة روائية مقنعة، وتدقيق سهولة القراءة (Flesch-Kincaid)",
    problem: "تنتج النماذج التقليدية محتوى غير مميز تملؤه الهلوسات الإحصائية والنبرة غير المتناسقة، بينما يستغرق إعداد النشرات المؤسسية يدوياً أياماً عديدة.",
    solution: "فريق تحريري ذكي منسق يضم ResearcherAgent (استكشاف الإحصائيات والاقتباسات التنفيذية الموثقة)، و WriterAgent (صياغة السرد الروائي والعناوين الجذابة)، و EditorAgent (تقييم سهولة القراءة Flesch-Kincaid >= 80 وتدقيق الحقائق وتصدير كود Markdown و HTML).",
    impact: "تسريع وتيرة النشر بمعدل 3.4 ضعف، مؤشر سهولة قراءة 88.5/100، دقة توثيق الاقتباسات بنسبة 100%، مع اجتياز 10/10 اختبارات آلياً.",
    description: "إطار عمل رائد ينظم فريقاً من الوكلاء المتخصصين (الباحث، الكاتب، المحرر) في مخطط سير عمل تعاوني لإنتاج نشرات إخبارية وتقارير استراتيجية جاهزة للنشر فورياً.",
    tech: ["FastAPI", "Python 3.12", "LangGraph Patterns", "Multi-Agent Teams", "Editorial Automation", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/collabx",
    demo: "http://127.0.0.1:8014/",
    metrics: [
      { label: "سرعة النشر", value: "3.4x" },
      { label: "سهولة القراءة", value: "88.5" },
      { label: "الاختبارات", value: "10/10" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "docucode",
    title: "منصة DocuCode: وكيل التوثيق البرمجي التلقائي وتحديث المستندات فورياً",
    status: "Enterprise Grade",
    tagline: "مراقبة شجرة الإعراب (AST) فورياً، وتوليد التوثيق القياسي (Docstrings)، وتدقيق مطابقة الأنواع، وتحديث مستندات README",
    problem: "يتطور الكود البرمجي بسرعة بينما يتخلف التوثيق، مما يؤدي إلى فجوات في توقيع الدوال، وجداول API معطلة، وإهدار الوقت في فهم المعاملات غير الموثقة.",
    solution: "إطار عمل مدمج لبيئات التطوير بنموذج (Watch-Doc-Review) يضم WatcherAgent (فحص فروقات شجرة AST واحتساب فجوة التوثيق)، و DocAgent (صياغة التوثيق البرمجي القياسي وتحديث جداول README)، و ReviewerAgent (التحقق من صحة التوثيق ومطابقته للأنواع البرمجية).",
    impact: "دقة مطابقة AST بنسبة 98.5%، تغطية المعاملات بنسبة 100%، سرعة المزامنة في أقل من 4 مللي ثانية، مع اجتياز 11/11 اختباراً آلياً.",
    description: "إطار عمل مدمج في بيئة التطوير (IDE) يقوم بتحديث التوثيق البرمجي ومستندات README تلقائياً بالتزامن مع كتابة المطورين للكود.",
    tech: ["FastAPI", "Python 3.12", "AST Diffing", "Docstring Generator", "Developer Tools", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/docucode",
    demo: "http://127.0.0.1:8013/",
    metrics: [
      { label: "مطابقة AST", value: "98.5%" },
      { label: "التغطية", value: "100%" },
      { label: "الاختبارات", value: "11/11" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "privatebrain",
    title: "منصة PrivateBrain: وكيل الذاكرة المالية المحلية المحمية والمعزولة تماماً عن السحابة",
    status: "Enterprise Grade",
    tagline: "تنفيذ محلي معزول شبكياً 100%، وخزينة ذاكرة مشفرة بتشفير AES-256، وحجب البيانات الحساسة، وانعدام الاتصال السحابي",
    problem: "إرسال البيانات المالية السرية والإقرارات الضريبية والحسابات البنكية (IBAN/SSN) إلى السحابة ينتهك السرية المصرفية ويعرض الثروات لمخاطر التسريب.",
    solution: "إطار عمل محلي للذاكرة المالية يضم IndexerAgent (فهرسة المستندات محلياً في أقسام مشفرة)، و MemoryAgent (استرجاع دلالي فائق السرعة مع تنظيف الذاكرة المؤقتة)، و PrivacyAgent (جدار حماية شبكي لمنع التسريب وحجب البيانات الحساسة).",
    impact: "عزل شبكي محلي بنسبة 100%، انعدام تام لتسريب البيانات للسحابة (0 بايت)، سرعة استرجاع في أقل من 3 مللي ثانية، مع اجتياز 14/14 اختباراً آلياً.",
    description: "إطار عمل رائد للأجهزة المحلية يقوم بفهرسة رسائل البريد الإلكتروني والمذكرات المالية والإقرارات الضريبية مع فرض العزل الشبكي التام والتشفير المحلي AES-256.",
    tech: ["FastAPI", "Python 3.12", "Local LLMs", "Air-Gapped Security", "AES-256 Vault", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/privatebrain",
    demo: "http://127.0.0.1:8012/",
    metrics: [
      { label: "العزل الشبكي", value: "100%" },
      { label: "التسريب السحابي", value: "0 Bytes" },
      { label: "الاختبارات", value: "14/14" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "researchx",
    title: "منصة ResearchX: وكيل المحلل المستقل لمعلومات السوق وأبحاث الاستثمار",
    status: "Enterprise Grade",
    tagline: "تثليث ومطابقة البيانات متعددة المصادر، واستخراج إفصاحات SEC، وتدقيق التباين، وصياغة تقارير SWOT",
    problem: "يستنزف المحللون الماليون 80% من وقتهم في مطابقة الأرقام المتضاربة عبر الإفصاحات، بينما تنتج النماذج التقليدية هلوسات إحصائية تفتقر للمراجع الموثوقة.",
    solution: "إطار عمل للمحلل المستقل بنموذج (Plan-Act-Verify) يضم SearchAgent (استخراج إفصاحات 10-K وبيانات السوق)، و VerifyAgent (تثليث البيانات ومطابقتها واحتساب التباين)، و ReportAgent (صياغة التقارير المؤسسية الشاملة ومصفوفة SWOT مع التوثيق المرجعي).",
    impact: "دقة توافق إحصائي بنسبة 98%، انعدام الإحصائيات غير الموثقة، سرعة بناء التقرير في أقل من 50 مللي ثانية، مع اجتياز 10/10 اختبارات آلياً.",
    description: "إطار عمل رائد يمكّن الوكلاء الأذكياء من البحث الذاتي والتدقيق المتقاطع للأدلة بين مصادر متعددة لإعداد تقارير مؤسسية موثوقة بالكامل.",
    tech: ["FastAPI", "Python 3.12", "Market Intelligence", "Evidence Triangulation", "Equity Research", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/researchx",
    demo: "http://127.0.0.1:8011/",
    metrics: [
      { label: "التوافق", value: "98%" },
      { label: "التوثيق", value: "100%" },
      { label: "الاختبارات", value: "10/10" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "graphai",
    title: "منصة GraphAI: إدارة وتنسيق تدفقات العمل الموجهة (DAGs) والتحكم المؤسسي",
    status: "Enterprise Grade",
    tagline: "جدولة المخططات الموجهة، والتنفيذ المتوازي، وبوابات الموافقة البشرية، وإعادة المحاولة التلقائية",
    problem: "تؤدي التدفقات الخطية غير المنظمة إلى تعارضات في الاعتماديات، وانعدام الرقابة البشرية على القرارات الحساسة، وفشل العمليات عند حدوث أخطاء شبكية عابرة.",
    solution: "إطار عمل لإدارة المخططات الموجهة (DAGs) يضم WorkflowAgent (الترتيب الطوبولوجي والتفرع المتوازي والدمج)، و ApprovalAgent (تقييم المخاطر وتوثيق التوقيعات الرقمية)، و RetryAgent (التراجع الأسي التلقائي مع التشتت العشوائي والتعافي الذاتي).",
    impact: "سلامة المخططات الموجهة بنسبة 100%، تسريع التنفيذ المتوازي بمعدل 2.4 ضعف، وتعافي ذاتي بنسبة 99.99%، مع اجتياز 12/12 اختباراً آلياً.",
    description: "إطار عمل رائد لتنسيق تدفقات عمل الوكلاء بالاعتماد على المخططات الموجهة (DAGs) والتفريع الشرطي والموافقات البشرية والتعافي الذاتي.",
    tech: ["FastAPI", "Python 3.12", "DAG Workflows", "HITL Approvals", "Exponential Backoff", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/graphai",
    demo: "http://127.0.0.1:8010/",
    metrics: [
      { label: "سلامة DAG", value: "100%" },
      { label: "التسريع", value: "2.4x" },
      { label: "الاختبارات", value: "12/12" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "loopai",
    title: "منصة LoopAI: وكلاء أذكياء بنموذج التغذية الراجعة والتصحيح الذاتي (Plan-Act-Verify)",
    status: "Enterprise Grade",
    tagline: "حلقة مغلقة للتفكير التأملي وتدقيق الأدلة وإعادة التخطيط التكراري حتى التقارب المؤكد",
    problem: "يؤدي التنفيذ الخطي الأحادي للنماذج الذكية إلى هلوسات غير موثقة، وأخطاء حسابية وهيكلية صامتة بدون أي آلية للتصحيح الذاتي المستقل.",
    solution: "إطار عمل للحلقات المغلقة يضم PlannerAgent (تحديد الأهداف ومعايير التحقق الصارمة)، و ActorAgent (تنفيذ الأدوات وتوليد الحلول المرشحة)، و VerifierAgent (تدقيق الأدلة واحتساب درجة الثقة V_score >= 0.90 وتقديم نقد بنّاء لإعادة التخطيط والتصحيح الذاتي).",
    impact: "معدل اعتماد وتأكيد بنسبة 100%، انعدام الادعاءات غير الموثقة، دورة تقارب سريعة في تكرارين فقط، مع اجتياز 12/12 اختباراً آلياً.",
    description: "إطار عمل رائد يمكّن الوكلاء الأذكياء من التصحيح الذاتي والتفكير التأملي والوصول إلى الدقة المؤكدة عبر حلقات (تخطيط - تنفيذ - تحقق).",
    tech: ["FastAPI", "Python 3.12", "Feedback Loops", "Self-Correction", "Reflection", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/loopai",
    demo: "http://127.0.0.1:8009/",
    metrics: [
      { label: "التقارب المعتمد", value: "100%" },
      { label: "درجة الثقة", value: ">=0.90" },
      { label: "الاختبارات", value: "12/12" },
    ],
    featured: true,
  },
  {
    id: "orchestratorx",
    title: "أوركستريتور إكس: إطار متعدّد الوكلاء بنمط المشرف",
    status: "Completed",
    tagline: "التوجيه ثابتٌ قابل للإثبات لا موجّهٌ نصّي",
    problem: "على أيّ نظام متعدّد الوكلاء أن يجيب عن أربعة أسئلة: مَن يعمل تاليًا، وماذا يحدث حين يجد أحد المتخصّصين مخالفة، وماذا يحدث حين يُخفق أحدهم، وكيف تُثبت لاحقًا ما جرى فعلًا. والإجابة الشائعة تضع الأربعة داخل الموجّه النصّي، فيغدو أهمّ سلوك في النظام غير قابل للاختبار دون نموذج حيّ، وغير حتميّ بين التشغيلات، وغير قابل للإثبات أمام مراجع.",
    solution: "تنتقل الأربعة جميعًا إلى حالة مُنمّطة وبايثون خالصة فوق مشرف مبنيّ على LangGraph. والوكلاء المتخصّصون (RiskModeler و ComplianceChecker و ClientAdvisor و Reporter) يعودون إلى المشرف فقط ولا يسلّم أحدهم إلى الآخر، فيبقى كل قرار توجيه في دالة واحدة قابلة للاختبار منفردة. وتُفرض ستّة ثوابت بنيويًّا لا عُرفيًّا: المشرف وحده يوجّه، والمتخصّصون المطلوبون يعملون دائمًا قبل إصدار أيّ تقرير، وكل تشغيل ينتهي حتمًا، وكل قفزة تُسجَّل في حالتَي النجاح والإخفاق، والتوجيه لا يستشير أيّ نموذج، والتشغيلات المتزامنة معزولة بمعرّف التشغيل فلا تتسرّب حالة القاطع بينها.",
    impact: "ينجح 41 اختبارًا دون مفتاح واجهة برمجية ودون شبكة، لأنّ التوجيه خالٍ من النماذج — وهذا ما يجعل عبارة «المشرف لا يتخطّى ComplianceChecker أبدًا» تأكيدًا يُنفَّذ في أجزاء من الألف من الثانية بدل أن يكون ادّعاءً في ملف تعريفي. والمشرف الدوّار يحتاج ميزانية قفزات لا مجرّد سقف لإعادة المحاولة: فإعادة المحاولة تحدّ من إخفاقات عقدة واحدة، أمّا الدورة فلا يحدّها إلّا ميزانية. والتصعيد متدرّج ومعزول في دالة واحدة موسومة بـ POLICY SEAM — إيقاف عند الحرج، وجولة تخفيف واحدة محدودة عند المرتفع — فيصبح موقف المؤسسة من المخاطر تعديلًا في دالة واحدة. ويأتي المشروع بواجهة سطر أوامر، وخدمة FastAPI يتيح مسارها GET /trace/{run_id} استجواب أيّ تشغيل بعد وقوعه، وملف Docker، وتكامل مستمر على بايثون 3.11 حتى 3.13.",
    description: "إطار متعدّد الوكلاء بنمط المشرف، تكون فيه قواعد التوجيه حالةً مُنمّطة لا نصًّا في موجّه، وتُسجَّل كل قفزة في أثر تدقيق مُرتّب يشمل الإخفاقات، وتعمل المجموعة كلّها دون اتصال.",
    tech: ["LangGraph", "Python 3.13", "Pydantic", "FastAPI", "Docker", "GitHub Actions", "pytest"],
    github: "https://github.com/asadullah48/orchestratorx",
    metrics: [
      { label: "الاختبارات",     value: "41" },
      { label: "الثوابت",        value: "6"  },
      { label: "مفاتيح الواجهة", value: "0"  },
    ],
    isNew: true,
  },
  {
    id: "harnessai",
    title: "منصة HarnessAI: بيئة التشغيل الآمنة وحوكمة الوكلاء الأذكياء",
    status: "Enterprise Grade",
    tagline: "بيئة عزل محكمة وحوكمة الصلاحيات وتجزئة الذاكرة مع قواطع دوائر لمنع الحلقات الجامحة",
    problem: "يتعرض تشغيل الوكلاء المستقلين لمخاطر الحلقات التكرارية اللانهائية، وتسميم الذاكرة المشتركة، وتعديل الحالات التشغيلية بدون إمكانية الاسترجاع عند الفشل.",
    solution: "هيكل بيئة تشغيل آمنة بنموذج الحاضنة يضم ToolManager (عزل تنفيذ الأدوات في بيئة مشروطة بمهلة 3 ثوانٍ)، و MemoryAgent (تجزئة الذاكرة وتصفية محاولات التسميم)، و ObserverAgent (مراقبة المؤشرات اللحظية وفصل قواطع الدوائر آلياً لمنع الحلقات الجامحة).",
    impact: "احتواء نطاق الضرر بنسبة 100%، استرجاع فوري للحالة النظيفة، وانعدام الحالات الملوثة للذاكرة، مع اجتياز 15/15 اختباراً آلياً.",
    description: "إطار عمل رائد لتوفير بيئة تشغيل آمنة ومحددة بدقة تضمن تشغيل الوكلاء ضمن نطاق معزول للأدوات والذاكرة والصلاحيات وقواطع الدوائر الآلية.",
    tech: ["FastAPI", "Python 3.12", "Agent Harness", "Sandboxing", "Circuit Breaker", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/harnessai",
    demo: "http://127.0.0.1:8008/",
    metrics: [
      { label: "احتواء الضرر", value: "100%" },
      { label: "سرعة الفصل", value: "<10ms" },
      { label: "الاختبارات", value: "15/15" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "securebridge",
    title: "منصة SecureBridge: طبقة الحماية والتوافق الأمني للوكلاء الأذكياء",
    status: "Enterprise Grade",
    tagline: "حماية سيبرانية قائمة على الثقة الصفرية واعتراض تسميم الأدوات ومنع تسريب البيانات لبروتوكولات MCP/A2A",
    problem: "تواجه شبكات الوكلاء وبروتوكولات MCP مخاطر تسميم الأدوات البرمجية، وحقن الأوامر الخفية، والتنفيذ غير المصرح للأوامر، وتسريب مفاتيح API وبيانات الهوية الحساسة.",
    solution: "طبقة أمان بنموذج الثقة الصفرية تضم SecurityAgent (المصادقة والتحقق من شهادات mTLS وتحديد معدل الطلبات)، و DefenseAgent (فحص عميق لهياكل الأدوات واعتراض الهجمات وتنقية المخرجات)، و ComplianceAgent (إدارة الصلاحيات ومنع تسريب البيانات وسجل تدقيق مشفر برمز SHA-256).",
    impact: "معدل اعتراض 100% لهجمات تسميم الأدوات، سرعة استجابة 0.42 مللي ثانية، حجب أكثر من 45 ألف بيان سري، مع اجتياز 14/14 اختباراً آلياً.",
    description: "بوابة أمان مؤسسية قائمة على نموذج الثقة الصفرية لحماية بروتوكولات MCP والتشغيل البيني بين الوكلاء من هجمات تسميم الأدوات وحقن الأوامر وتسريب البيانات.",
    tech: ["FastAPI", "Python 3.12", "MCP Protocol", "Zero-Trust Security", "DLP Engine", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/securebridge",
    demo: "http://127.0.0.1:8007/",
    metrics: [
      { label: "اعتراض الهجمات", value: "100%" },
      { label: "سرعة البوابة", value: "0.42ms" },
      { label: "الاختبارات", value: "14/14" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "workforceai-academy",
    title: "أكاديمية WorkforceAI: منصة التدريب والتأهيل للتعاون بين البشر والذكاء الاصطناعي",
    status: "Enterprise Grade",
    tagline: "تمكين مؤسسي تفاعلي وتوجيه فوري لمهام العمل وشهادات معتمدة لمؤشر التعاون الذكي",
    problem: "يتعثر تبني الذكاء الاصطناعي المؤسسي عندما يتعامل الموظفون مع الوكلاء كأدوات بحث تقليدية، مع غياب القدرة على اكتشاف الهلوسات وانعدام التوجيه الفوري أثناء صياغة الأوامر.",
    solution: "منظومة متعددة الوكلاء للتأهيل المؤسسي تضم TrainerAgent (منهج تفاعلي لمهارات الذكاء الاصطناعي من هندسة الأوامر حتى إدارة الوكلاء)، و MentorAgent (مرشد فوري أثناء العمل لإعادة صياغة الأوامر وإضافة أدوات الحماية)، و AssessmentAgent (تقييم مؤشر التعاون وإصدار شهادات مشفرة).",
    impact: "معدل طلاقة 88.5%، تسريع إنجاز المهام بمعدل 3.4 ضعف، واكتشاف 94.2% من الهلوسات، مع اجتياز 12/12 اختباراً آلياً.",
    description: "إطار عمل متعدد الوكلاء لتمكين وتأهيل القوى العاملة المؤسسية، وتدريب الموظفين على هندسة الأوامر واستخدام الأدوات وحوكمة أنظمة الذكاء الاصطناعي.",
    tech: ["FastAPI", "Python 3.12", "Human-AI Teaming", "Collaboration Index", "Workflow Scaffolding", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/workforceai-academy",
    demo: "http://127.0.0.1:8006/",
    metrics: [
      { label: "نسبة الطلاقة", value: "88.5%" },
      { label: "تسريع العمل", value: "+3.4x" },
      { label: "الاختبارات", value: "12/12" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "conciergeagent",
    title: "ConciergeAgent: منصة الوكيل الرقمي الفاخر لخدمة ورفاهية العملاء",
    status: "Enterprise Grade",
    tagline: "خدمة راقية فائقة التخصيص واستشارات مالية استباقية وحل فوري للنزاعات بمعايير 5 نجوم",
    problem: "تتسبب روبوتات الدردشة التقليدية في نفور عملاء الثروات والشرائح المميزة بسبب الردود النمطية وغياب التخصيص وبطء المعالجة في حالات الاحتيال والمطالبات الحرجة.",
    solution: "هيكل عمل متعدد الوكلاء للخدمات الفاخرة يضم AdvisorAgent (توزيع استثماري مخصص للأصول وتحسين ضريبي)، و SupportAgent (ائتمان فوري للنزاعات حتى 50,000 دولار ومعالجة سريعة للمطالبات)، و ExperienceAgent (مراقبة المشاعر ومنح هدايا الولاء والتصعيد الفوري).",
    impact: "معدل رضا 4.98 من 5 نجوم، اتفاقية مستوى خدمة خلال 30 ثانية لكبار العملاء، حماية فورية منعدمة المسؤولية، مع اجتياز 13/13 اختباراً آلياً.",
    description: "إطار عمل متعدد الوكلاء لخدمة العملاء الفاخرة، يقدم استشارات مالية مخصصة، وحلاً فورياً للنزاعات والمطالبات، مع حوكمة تجربة العملاء بمعايير الضيافة الراقية.",
    tech: ["FastAPI", "Python 3.12", "Hyperpersonalization", "Wealth Tier SLA", "Sentiment Modulation", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/conciergeagent",
    demo: "http://127.0.0.1:8005/",
    metrics: [
      { label: "معدل الرضا", value: "4.98 / 5.0" },
      { label: "سرعة الخدمة", value: "30 ثانية" },
      { label: "الاختبارات", value: "13/13" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "contextx",
    title: "ContextX: إطار عمل هندسة السياق المتقدمة للوكلاء الأذكياء",
    status: "Enterprise Grade",
    tagline: "ما وراء هندسة الأوامر: استرجاع هجين RRF، تخفيف الضياع في المنتصف، وقرارات مسندة",
    problem: "تعاني أنظمة RAG التقليدية من ظاهرة 'الضياع في المنتصف' (انخفاض تركيز النموذج بنسبة تصل إلى 60% في منتصف السياق)، بالإضافة إلى هدر الرموز وتوليد إجابات غير مسندة بمصادر دقيقة.",
    solution: "إطار عمل مؤسسي متكامل يضم RetrieverAgent (استرجاع هجين دلالي وكلمات مفتاحية مع اضمحلال زمني)، و ContextBuilder (ترتيب حدودي لتفادي الضياع في المنتصف وضبط صارم للميزانية)، و DecisionAgent (استدلال موثق باقتباسات دقيقة).",
    impact: "+34% زيادة في دقة الاسترجاع، 42% توفير في هدر الرموز، 99.4% استرجاع لمعلومات الأطراف، واجتياز 12/12 اختباراً آلياً.",
    description: "إطار عمل متطور لهندسة وتخصيص نوافذ السياق، وضغط الرموز، وتخفيف ظاهرة الضياع في المنتصف، وتوليد القرارات الموثقة بالاقتباسات الدقيقة.",
    tech: ["FastAPI", "Python 3.12", "RRF Hybrid Search", "Context Compression", "Lost-in-the-Middle Layout", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/contextx",
    demo: "http://127.0.0.1:8004/",
    metrics: [
      { label: "دقة الاسترجاع", value: "+34%" },
      { label: "توفير الرموز", value: "42%" },
      { label: "الاختبارات", value: "12/12" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "guardrailai",
    title: "GuardrailAI: طبقة حواجز الحماية القطعية والامتثال التنظيمي",
    status: "Enterprise Grade",
    tagline: "حواجز حماية غير مشروطة بالثقة ومفاتيح قطع الدائرة وسجلات تدقيق مشفرة بسلسلة SHA-256",
    problem: "لا يمكن نشر الوكلاء الاحتماليين في البيئات عالية الخطورة (المالية، الصحية، القانونية) بسبب الهلوسات وغياب الحدود الرياضية الإلزامية وعجز السجلات التقليدية عن تلبية معايير التدقيق القضائي.",
    solution: "هيكل عمل متعدد الوكلاء يفرض الامتثال بنيوياً: اعتراض الطلبات قبل التنفيذ، وتنفيذ منضبط للوكيل ProcessAgent، ومراجعة مخرجات الوكيل ComplianceAgent، ومفاتيح قطع الدائرة التلقائية مع سجل تدقيق مشفر غير قابل للتعديل.",
    impact: "0.00% لاحتمية سلوكية، وامتثال قطعي بنسبة 100% لقوانين AML و OFAC و HIPAA، وشهادات عدم إنكار مشفرة مع اجتياز 17/17 اختباراً آلياً.",
    description: "إطار عمل قطعي للوكلاء الأذكياء يفرض حواجز حماية صارمة ومفاتيح قطع الدائرة وبدائل آمنة مع سجل تدقيق مشفر.",
    tech: ["FastAPI", "Python 3.12", "LangGraph", "State Machines", "SHA-256 Cryptography", "Circuit Breakers", "Helm", "Docker"],
    github: "https://github.com/asadullah48/guardrailai",
    demo: "http://127.0.0.1:8003/",
    metrics: [
      { label: "اللاحتمية", value: "0.00%" },
      { label: "التدقيق المشفر", value: "SHA-256" },
      { label: "الاختبارات", value: "17/17" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "domainx",
    title: "DomainX: إطار عمل الوكلاء الأذكياء المتخصصين",
    status: "Enterprise Grade",
    tagline: "ذكاء اصطناعي متخصص في القطاعات الحساسة (القانوني • الطبي • سلاسل الإمداد)",
    problem: "تعاني نماذج الذكاء الاصطناعي العامة من معدلات هلوسة تتجاوز 14% وعدم مطابقة للوائح في التطبيقات القانونية والطبية واللوجستية.",
    solution: "إطار عمل متعدد الوكلاء يدمج محركات القواعد القطعية، وقواعد المعرفة السريرية (ICD-10-CM / CPT)، وتطهير البيانات الصحية وفق معايير HIPAA Safe Harbor، والمعادلات الرياضية لكمية الطلب الاقتصادية (EOQ).",
    impact: "دقة قانونية بنسبة 99.4% مع توليد تلقائي للتعديلات، ودقة ترميز طبي 99.2%، وخفض تكاليف المخزون بنسبة 22% مع تتبع البصمة الكربونية، واجتياز 16/16 اختباراً آلياً.",
    description: "إطار عمل فائق الدقة للوكلاء الأذكياء المتخصصين يتفوق على النماذج العامة في المجالات القانونية والطبية وسلاسل الإمداد.",
    tech: ["FastAPI", "Python 3.12", "HIPAA Safe Harbor", "ICD-10 / CPT", "EOQ Optimization", "Helm", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/domainx",
    demo: "http://127.0.0.1:8002/",
    metrics: [
      { label: "الدقة القانونية", value: "99.4%" },
      { label: "الترميز الطبي", value: "99.2%" },
      { label: "الاختبارات", value: "16/16" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "marketagenthub",
    title: "MarketAgentHub: منظومة الوكلاء الجاهزة للمتاجر السحابية",
    status: "Enterprise Grade",
    tagline: "وكلاء مستقلون متوافقون مع A2A و MCP لمتاجر AWS و Azure و GCP و Salesforce",
    problem: "يتطلب نشر الوكلاء الأذكياء عبر المتاجر السحابية الكبرى مواءمة معقدة لمخططات الإجراءات وأنظمة الفوترة وبروتوكولات التواصل بين الوكلاء.",
    solution: "منظومة وكلاء جاهزة للمتاجر السحابية تضم PortfolioAgent و ComplianceAgent و ClientEngagementAgent مع محولات مدمجة ومحرك فوترة SaaS وبروتوكول A2A.",
    impact: "تغليف عالمي متعدد السحابات مع امتثال قطعي 100% للوائح المالية (SEC, FINRA, MiFID II). لوحة تحكم تفاعلية مع اجتياز 19/19 اختباراً آلياً.",
    description: "منظومة وكلاء ذكاء اصطناعي مستقلة جاهزة لإعادة الاستخدام والبيع في المتاجر السحابية العالمية.",
    tech: ["FastAPI", "Python 3.12", "A2A Protocol", "AWS Bedrock", "Azure AI", "GCP Vertex", "Salesforce Agentforce", "Docker"],
    github: "https://github.com/asadullah48/marketagenthub",
    demo: "http://127.0.0.1:8000/",
    metrics: [
      { label: "السحابات الكبرى", value: "4 سحابات" },
      { label: "الامتثال الرقابي", value: "100%" },
      { label: "الاختبارات", value: "19/19" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "workforceai",
    title: "WorkforceAI: منصة الوكيل كعامل رقمي مستقل",
    status: "Enterprise Grade",
    tagline: "أتمتة القوى العاملة الذكية مع نماذج تسعير قائمة على الإنجاز وإشراف ذاتي",
    problem: "تفرض أدوات RPA والنماذج العامة تكاليف لكل رمز دون مسؤولية عن إتمام المهام، مما يسبب عدم استقرار التكاليف وغياب ضمانات مستوى الخدمة.",
    solution: "منصة قوى عاملة قائمة على نتائج المهام مع وكلاء TaskRunner و BillingAgent لحساب معدلات الإنجاز وخصومات الأداء، و SupervisorAgent لموازنة الضغط.",
    impact: "معدل إنجاز 98%+ مع خصومات تلقائية عند التأخير، وتوقيعات إثبات العمل المشفرة، وحاسبة عائد تفاعلية توفر 85% مقارنة بالموظف البشري، مع 15/15 اختباراً ناجحاً.",
    description: "منصة متطورة لإدارة وتوزيع مهام الوكلاء الأذكياء بنماذج تسعير حسب معدلات إتمام المهام.",
    tech: ["FastAPI", "Python 3.12", "Supervisor Governance", "Outcome Pricing", "Async Worker Pools", "Docker", "Pytest"],
    github: "https://github.com/asadullah48/workforceai",
    demo: "http://127.0.0.1:8001/",
    metrics: [
      { label: "ضمان الخدمة", value: "98%+" },
      { label: "توفير التكلفة", value: "85%" },
      { label: "الاختبارات", value: "15/15" },
    ],
    featured: true,
  },
  {
    id: "protobridge",
    title: "بروتوبريدج: طبقة تشغيل بيني بين MCP و A2A",
    status: "Completed",
    tagline: "تشغيل بيني قائم على البروتوكولات للذكاء الاصطناعي الوكيل",
    problem: "يعالج بروتوكول MCP من Anthropic وبروتوكول A2A من Google مشكلتين متجاورتين، ويحتاج أي وكيل مؤسسي حقيقي إليهما معًا: الأول لاستدعاء أدوات تستضيفها أنت عبر stdio، والثاني لتفويض العمل إلى وكلاء تشغّلهم شركة أخرى عبر HTTP. وربطهما ارتجالًا يولّد عددًا تربيعيًا من المترجمات، والأسوأ أنه يُسقط سياق الحوكمة عند كل وصلة، فتتبخّر هوية المستدعي وتصنيف حساسية البيانات ومعرّف الارتباط لحظة تغيّر البروتوكول.",
    solution: "مغلّف بروتوكول واحد مُوحّد تُرفَع إليه كل رسالة ثم تُخفَض منه، فتصبح كلفة إضافة بروتوكول زوج مُرمِّزات واحدًا لا عددًا تربيعيًا من المحوّلات. وتسافر الحوكمة داخل الرسالة لا في ترويسات النقل، لأن الترويسات لا تنجو من قفزة stdio في MCP. وثلاثة وكلاء على آلة حالات LangGraph: وكيل MCPConnector يربط الأدوات الخارجية، ووكيل A2AGateway يفوّض عبر حدود المورّدين، ووكيل AuditAgent يفحص مرّتين في كل قفزة، مرّة قبل الإرسال ومرّة بعده، لأن مرحلة القبول لا يمكنها معرفة أن الاستجابة ستحمل رقم هوية وطنية، ومرحلة الخروج لا يمكنها سحب طلب أُرسِل. والبروتوكولان منفّذان على مستوى السلك لا محاكاةً: JSON-RPC حقيقي عبر stdio في عملية فرعية، ونظير HTTP حقيقي يقدّم بطاقة وكيل على المسار ‎/.well-known/agent.json.",
    impact: "ينجح 41 اختبارًا دون مفتاح واجهة برمجية ودون اتصال بالشبكة. وتُسجَّل كل قفزة في دفتر مرتبط بالتجزئة يغطّي بصمة الحمولة لا الحمولة نفسها، فيبقى إثبات السلامة قائمًا حتى بعد إسقاط البايتات الحسّاسة. ويعيد العرض المباشر تشغيل ستّة مسارات حقيقية ويحسب بصمات SHA-256 العشر داخل متصفّح الزائر نفسه، فيغدو كشف العبث قابلًا للتحقّق لا مأخوذًا على الثقة. والتنفيذ معزول في دالة واحدة موسومة بـ POLICY SEAM، فيصبح تعديل موقف المؤسسة من المخاطر تعديلًا في دالة واحدة.",
    description: "طبقة تشغيل بيني متوافقة مع المعايير تتحدّث MCP من Anthropic وA2A من Google عبر مسار واحد محكوم، تفحص كل رسالة تعبر الحدود ثم تمرّرها أو تحجب حقولها أو ترفضها.",
    tech: ["LangGraph", "MCP", "A2A", "JSON-RPC 2.0", "Python 3.13", "Pydantic", "GitHub Pages"],
    github: "https://github.com/asadullah48/protobridge",
    demo: "https://asadullah48.github.io/protobridge/",
    metrics: [
      { label: "البروتوكولات",   value: "MCP + A2A" },
      { label: "الاختبارات",     value: "41"        },
      { label: "مفاتيح الواجهة", value: "0"         },
    ],
    isNew: true,
  },
  {
    id: "finagent-nexus",
    title: "فِن-إيجنت نكسس: ذكاء مالي متعدد الوكلاء",
    status: "Enterprise Grade",
    tagline: "تبنّي الذكاء الاصطناعي الوكيل في الخدمات المالية",
    problem: "تتعثّر معظم مشاريع الذكاء الاصطناعي الوكيل في القطاع المالي عند مرحلة المراجعة الرقابية، لا لضعف النماذج، بل لأن النظام الذي يعجز عن تبرير كيفية وصوله إلى نتيجته لا يمكن اعتماده من خط الدفاع الثاني. والضابط الذي يستطيع النموذج تجاوزه بالحجّة ليس ضابطًا.",
    solution: "ثلاثة وكلاء متخصصين، هم محلل السوق ومسؤول الالتزام ومخطط الثروات، يعملون ضمن آلة حالات ثابتة قوامها التخطيط ثم التنفيذ ثم التحقّق، لا حوار مفتوح. والالتزام هنا خاصية بنيوية: لا يجمع أي وكيل بين اثنتين من الصلاحيات الثلاث، وهي بيانات السوق وتحديد الأوزان وإصدار الحكم، ولا يوجد مسار في الرسم البياني ينقل التوصية من الصياغة إلى الاعتماد مباشرة، فلا سبيل إلى تخطّي التحقّق. وتُحفظ مبادئ الشريعة والتنظيم في دستور مُوثّق يُراجَع كما تُراجَع الشيفرة، وكل ما يمكن التعبير عنه حسابيًا يُحسم في بايثون دون تدخّل أي نموذج.",
    impact: "يتم الفحص الرقابي الكامل في أقل من ملي ثانيتين ودون أي استدعاء للنموذج، محسومًا فيه 8 من أصل 14 مبدأً بالحساب المجرّد، وبصورة قابلة لإعادة الإنتاج دون اتصال وبتكلفة حدية معدومة. ويُسجَّل لكل تشغيل أثر تدقيق مُسلسل بالتجزئة يكشف أي عبث. وتنجح 94 اختبارًا دون مفتاح واجهة برمجية ودون اتصال بالشبكة، ومحرّك الفحص منشور ومتاح للتجربة مباشرةً، فكل رقم هنا قابل للتحقق بنقرة واحدة.",
    description: "نظام وكلاء ذكاء اصطناعي مستقل لأتمتة أبحاث إدارة الثروات والتدقيق الرقابي المتوافق مع الشريعة.",
    tech: ["LangGraph", "Anthropic Claude", "Constitutional AI", "Python 3.12", "Pydantic", "pytest", "Vercel"],
    github: "https://github.com/asadullah48/finagent-nexus",
    demo: "https://finagent-nexus.vercel.app",
    metrics: [
      { label: "زمن الفحص الرقابي", value: "<2ms" },
      { label: "استدعاءات النموذج", value: "0"    },
      { label: "الاختبارات",        value: "94"   },
    ],
    isNew: true,
  },
  {
    id: "bazaar",
    title: "بازار: سوق B2B + B2C الموحد",
    status: "Flagship",
    tagline: "أول سوق موحد B2B/B2C في باكستان",
    problem: "الشركات الصغيرة في باكستان والإمارات تفتقر إلى واجهة رقمية موحدة. المشترون يتنقلون بين منصات متعددة، والبائعون يفتقرون للتحليلات، وعملاء المؤسسات يحتاجون مرونة العلامة البيضاء, جميع الفئات غير خاضعة للخدمة الكاملة.",
    solution: "بازار يوحّد تجارة التجزئة B2C (التصفح، السلة، الدفع, JazzCash وEasypaisa والبطاقة) والجملة B2B (محرك طلبات العروض، التسعير بالكمية، الموردون الموثقون) في منصة واحدة. الهندسة: متجر Next.js 15 متعدد المستأجرين، خدمات FastAPI المصغرة، Supabase BaaS للمصادقة، بوابات دفع محلية وStripe، لوحة تحكم البائع، توصيات بالذكاء الاصطناعي، وطبقة مؤسسية.",
    impact: "أكثر من 500 بائع موثق، وأكثر من 10K منتج في المنسوجات والإلكترونيات والأثاث وقطع غيار السيارات. الروبية الباكستانية عملة أصلية، 3 لغات. التصميم المعياري يجعل كل طبقة إضافية, قاعدة كود واحدة، توسع لا محدود.",
    description: "أول سوق موحد في باكستان بواجهة B2C للتجزئة ومحرك B2B للجملة وطلبات العروض, 500+ بائع موثق، 10K+ منتج، مدفوعات بـ JazzCash/Easypaisa/بطاقة، والروبية الباكستانية عملة أصلية.",
    tech: ["Next.js 15", "FastAPI", "Supabase", "PostgreSQL", "Redis", "Docker", "TypeScript", "WhatsApp"],
    github: "https://github.com/asadullah48/bazaar",
    demo: "https://frontend-three-kappa-64.vercel.app",
    image: "/images/bazaar-preview.svg",
    metrics: [
      { label: "النمط",     value: "B2B + B2C" },
      { label: "البائعون",  value: "500+"       },
      { label: "المنتجات",  value: "10K+"       },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "ai-tradeflow",
    title: "AI TradeFlow: المحاسبة والمخزون لتجار الجملة",
    status: "In Development",
    tagline: "الذكاء الاصطناعي لاقتصاد التجارة الباكستاني, المشروع الأول في السلسلة",
    problem: "تجار الجملة في باكستان يديرون عمليات بملايين الروبيات باستخدام السجلات الورقية ورسائل واتساب الصوتية والذاكرة, لا رؤية فورية للمخزون، وفوضى في تتبع الأدهار (الائتمان)، وقرارات إعادة الطلب بالحدس بدلاً من البيانات.",
    solution: "منصة محاسبة ومخزون ثنائية اللغة (أردو + إنجليزية) مع موظف رقمي حقيقي، Munshi AI, وكيل مبني على OpenAI Agents SDK بخمس أدوات للقراءة فقط وحارس دستوري حتمي يمنع طلبات الاحتيال والتهرب الضريبي قبل أي استدعاء للنموذج اللغوي، ولا يختلق رقمًا أبدًا، ويتراجع بأمان إلى إجابات مبنية على البيانات الفعلية إذا فشلت واجهة النموذج. خلفية FastAPI + SQLAlchemy + Alembic، وتطبيق ويب Next.js، ورفيق موبايل Expo، جميعها تعمل على واجهة برمجة واحدة مشتركة.",
    impact: "90 اختبارًا آليًا تشمل اختبارات تكامل لدورة التجارة الكاملة ومجموعات أسئلة ذهبية للوكيل مع تحقق من الاستشهاد بالأدوات. حساب عمر الأدهار بطريقة FIFO صحيحة وليس تقريبًا بالرصيد. المشروع الأول في سلسلة 'الذكاء الاصطناعي لتجارة باكستان', وحدة الخلفية المكتبية أولاً، ثم مراحل التوريد والخدمات اللوجستية والتفاوض لاحقًا.",
    description: "منصة محاسبة ومخزون مدعومة بالذكاء الاصطناعي وثنائية اللغة لتجار الجملة الباكستانيين، مع Munshi AI, محاسب رقمي محكوم دستوريًا يقرأ بياناتك الخاصة ويجيب على 'ماذا يجب أن أطلب هذا الأسبوع؟' بتوصيات موثقة ومبنية على البيانات.",
    tech: ["FastAPI", "Next.js 16", "OpenAI Agents SDK", "SQLAlchemy", "Alembic", "Expo", "PostgreSQL"],
    github: "https://github.com/asadullah48/ai-tradeflow",
    metrics: [
      { label: "الاختبارات",   value: "90+"        },
      { label: "المنصات",      value: "ويب+موبايل" },
      { label: "أدوات الوكيل", value: "5"           },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "textile-erp",
    title: "منصة ERP للمنسوجات",
    status: "In Development",
    tagline: "ERP شامل لصناعة المنسوجات الباكستانية",
    problem: "صناعة المنسوجات الباكستانية, وحدات CMT ومصانع الملابس ومطاحن الأقمشة, تعمل على رسائل واتساب وجداول Excel وسجلات ورقية. أخطاء الفوترة وانعدام رؤية الإنتاج والمخزون اليدوي تكلف أموالاً حقيقية كل يوم.",
    solution: "SaaS ERP متعدد المستأجرين. الوحدة 1 (مصنع الأقمشة): إدارة الرولات، تتبع مراحل النسج والحياكة، مخزون الغزل، الأقمشة المستوردة. وحدات CMT: دورة حياة الطلب الكاملة، الفوترة التلقائية لـ4 أنواع، مخزون المواد الأولية، جلسات الإنتاج، الشحن، دفاتر الأطراف.",
    impact: "يستهدف فيصل آباد وسيالكوت وغوجرانوالا وكراتشي ولاهور, قلب المنسوجات الباكستاني. SaaS متعدد المستأجرين على Kubernetes. إطلاق 2026.",
    description: "ERP شامل لصناعة المنسوجات والملابس الباكستانية, من مصانع الأقمشة إلى مصدري الملابس.",
    tech: ["Next.js", "FastAPI", "PostgreSQL", "Kubernetes", "Supabase", "TypeScript"],
    github: "https://github.com/asadullah48",
    metrics: [
      { label: "المدن المستهدفة", value: "5+"  },
      { label: "الوحدات",         value: "6+"  },
      { label: "الإطلاق",         value: "2026" },
    ],
    featured: true,
  },
  {
    id: "devunity",
    title: "منصة DevUnity",
    status: "Featured",
    tagline: "مركز مجتمع مطورين مفتوح المصدر",
    problem: "المطورون الباكستانيون يفتقرون إلى منصة أسئلة وأجوبة محلية تراعي السياق. معظم البدائل عامة جداً وليست مجتمعية.",
    solution: "منصة مجتمع مفتوحة المصدر مع أسئلة وأجوبة متسلسلة ومدونات وتعاون في المشاريع واقتراحات إجابات بالذكاء الاصطناعي. مبنية بـ Next.js 15 App Router وshadcn/ui.",
    impact: "متاحة مع الكود والعرض التجريبي. قاعدة كود معيارية بنسبة 85% إعادة استخدام للمنتجات المجتمعية المستقبلية.",
    description: "منصة مجتمع مطورين مفتوحة المصدر مع أسئلة وأجوبة ومدونات وميزات تعاون.",
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "shadcn/ui", "PostgreSQL"],
    github: "https://github.com/asadullah48",
    demo:   "https://asadullahshafique-devunity.vercel.app",
    image:  "/images/devunity-preview.svg",
    metrics: [
      { label: "التقنية",  value: "Next.js 15"   },
      { label: "الحالة",   value: "مباشر"        },
      { label: "الرخصة",   value: "مفتوح المصدر" },
    ],
    featured: true,
  },
  {
    id: "stitching-packing",
    title: "ERP التخييط والتعبئة",
    status: "In Development",
    tagline: "إدارة عمليات CMT لمصانع الملابس",
    description: "ERP متخصص لوحدات التخييط وأقسام التعبئة. تتبع الطلبات وتخصيص الآلات ونقاط فحص الجودة وملصقات التعبئة وتوثيق التصدير, مبني لمصدري الملابس الباكستانيين.",
    tech: ["Next.js", "Supabase", "TypeScript", "PostgreSQL", "FastAPI"],
    github: "https://github.com/asadullah48",
    metrics: [
      { label: "القطاع",   value: "CMT/ملابس" },
      { label: "الحالة",   value: "الوحدة 1"  },
      { label: "المستهدف", value: "المصدرون"  },
    ],
  },
  {
    id: "agent-factory",
    title: "مصنع الوكلاء",
    status: "Featured",
    tagline: "هندسة وكلاء من طبقتين على نطاق المؤسسة",
    description: "الوكيل العام (Claude Code) يبني الوكيل المخصص (OpenAI Agents SDK). ملفات SKILL.md كوحدات ذكاء قابلة للنقل والتسييل. نموذج الموظف الرقمي المنشور على Kubernetes + Dapr. يستهدف نظام OpenAI Apps البيئي (800 مليون مستخدم).",
    tech: ["Claude Code", "OpenAI Agents SDK", "SKILL.md", "MCP", "Kubernetes", "Dapr"],
    github: "https://github.com/asadullah48",
    metrics: [
      { label: "الهاكاثون", value: "H5 مكتمل"          },
      { label: "الشرائح",   value: "117"               },
      { label: "السوق",     value: "800 مليون مستخدم" },
    ],
  },
  {
    id: "rag-textbook",
    title: "منصة الكتب المدرسية بـ RAG",
    status: "Completed",
    tagline: "روبوت محادثة مدعوم بالذكاء الاصطناعي مع هندسة RAG",
    description: "منصة كتب مدرسية شاملة مع روبوت محادثة RAG مبنية خلال هاكاثون Panaversity (H1) باستخدام تطوير Spec-First ومنهجية Spec-Kit Plus.",
    tech: ["Python", "FastAPI", "RAG", "SpecifyKit", "OpenAI API", "PostgreSQL"],
    github: "https://github.com/asadullah48",
    metrics: [
      { label: "الهاكاثون",    value: "H1 فضي"      },
      { label: "الهندسة",      value: "RAG + FastAPI" },
      { label: "إعادة الاستخدام", value: "70%"       },
    ],
  },
];

const STATUS_ICONS: Record<ProjectStatus, React.ReactNode> = {
  "Enterprise Grade": <ShieldCheck className="w-3 h-3" />,
  Flagship:         <ShoppingBag className="w-3 h-3" />,
  Featured:         <Star className="w-3 h-3" />,
  "In Development": <Clock className="w-3 h-3" />,
  Completed:        <Zap className="w-3 h-3" />,
  Research:         <Zap className="w-3 h-3" />,
};

/**
 * Hierarchy is carried by INTENSITY of one colour, not by hue. Flagship gets
 * the full brand + bloom; Featured a softer cyan; everything else recedes to
 * neutral. That is what makes a grid scan — five competing hues flatten it,
 * because every card shouts equally loud.
 */
type StatusTone = {
  badge: string;   // badge fill + border
  accent: string;  // tagline / metric text
  card: string;    // card border, resting + hover
  rule: string;    // the 2px bar across the card top
};

const STATUS_TOKENS: Record<ProjectStatus, StatusTone> = {
  // Peer of Flagship at the top tier: same full-brand intensity, distinguished
  // by icon and label rather than by a second accent hue.
  "Enterprise Grade": {
    badge:  "bg-brand/15 text-brand border-brand/40",
    accent: "text-brand",
    card:   "border-brand/25 hover:border-brand/50",
    rule:   "via-brand/70",
  },
  Flagship: {
    badge:  "bg-brand/15 text-brand border-brand/40",
    accent: "text-brand",
    card:   "border-brand/25 hover:border-brand/50",
    rule:   "via-brand/70",
  },
  Featured: {
    badge:  "bg-brand/10 text-brand-soft border-brand/25",
    accent: "text-brand-soft",
    card:   "border-border hover:border-brand/35",
    rule:   "via-brand/40",
  },
  "In Development": {
    badge:  "bg-surface-3 text-muted-foreground border-border",
    accent: "text-muted-foreground",
    card:   "border-border hover:border-brand/25",
    rule:   "via-muted-foreground/30",
  },
  Completed: {
    badge:  "bg-surface-3 text-muted-foreground border-border",
    accent: "text-muted-foreground",
    card:   "border-border hover:border-brand/25",
    rule:   "via-muted-foreground/30",
  },
  Research: {
    badge:  "bg-violet/10 text-brand-soft border-violet/25",
    accent: "text-muted-foreground",
    card:   "border-border hover:border-brand/25",
    rule:   "via-violet/40",
  },
};

function StatusBadge({ status, label }: { status: ProjectStatus; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${STATUS_TOKENS[status].badge}`}
    >
      {STATUS_ICONS[status]}
      {label}
    </span>
  );
}

function ProjectCard({
  project,
  labels,
}: {
  project: Project;
  labels: Record<string, string>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [terminalView, setTerminalView] = useState(false);
  const hasCaseStudy = !!(project.problem && project.solution && project.impact);
  const tone = STATUS_TOKENS[project.status];

  // Spotlight: track the cursor via CSS vars so the glow follows the mouse
  // without triggering React re-renders on every pointer move.
  const handleSpotlight = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  // glass-panel supplies the blur, lit rim and tinted drop shadow; the status
  // tone supplies only the border. Cards sit over the ambient command-field,
  // so the blur has something real to refract instead of frosting flat carbon.
  // `layout` (framer's automatic layout animation) is gone and not replaced.
  // Its only job was to ease the card's height change when the case study
  // expanded, and the grid-template-rows transition on that section now
  // animates the same resize directly.
  return (
    <Reveal
      onMouseMove={handleSpotlight}
      className={`group glass-panel relative rounded-panel overflow-hidden transition-all duration-300 ease-spring flex flex-col spotlight-border hover:-translate-y-1 ${tone.card}`}
    >
      <div
        className={`h-0.5 w-full flex-shrink-0 bg-gradient-to-r from-transparent to-transparent ${tone.rule}`}
      />

      {/* Cursor-tracking glow (position set by handleSpotlight) */}
      <div className="spotlight-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[1]" />

      {project.image && (
        // Fixed 200px band + `fill` gives next/image a bounded box to lay out
        // against, so the card never reflows once the asset decodes.
        // `sizes` matches the 1/2/3-column grid below or the browser would
        // fetch a full-width source for a ~380px slot.
        <div className="relative w-full h-[200px] overflow-hidden bg-surface-1">
          <Image
            src={project.image}
            alt={`${project.title} — interface preview`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            // NOT `priority`. The Projects grid sits far below the fold —
            // after Hero, TechMarquee, About, Skills, AgentEngineering and
            // Roadmap — so preloading the first card stole bandwidth from
            // Hero's image, which is the real LCP element. next/image lazy
            // loads by default, which is correct here.
            loading="lazy"
            // The optimizer rejects SVG unless `dangerouslyAllowSVG` is on.
            // Vectors gain nothing from resizing, so bypass the pipeline for
            // them instead of loosening that flag site-wide.
            unoptimized={project.image.endsWith(".svg")}
            className="object-cover object-top transition-transform duration-500 ease-spring group-hover:scale-[1.03]"
          />
        </div>
      )}

      {project.isNew && (
        <div className="absolute top-4 right-4 z-10">
          {/* `animate-think-pulse` rather than Tailwind's `animate-pulse`:
              the site's own heartbeat easing, and it stops under
              prefers-reduced-motion via the one block in globals.css. */}
          <span className="text-eyebrow font-bold px-2 py-0.5 rounded-full bg-brand/15 text-brand border border-brand/40 animate-think-pulse">
            {labels.new}
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <StatusBadge status={project.status} label={labels[project.status] ?? project.status} />
        <h3 className="font-display text-xl font-bold text-foreground mt-3 mb-1.5 group-hover:text-brand transition-colors duration-200 pr-12">
          {project.title}
        </h3>
        <p className={`text-sm font-medium mb-4 ${tone.accent}`}>
          {project.tagline}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{project.description}</p>

        {project.metrics && (
          <div className="flex gap-6 mb-5 flex-wrap">
            {project.metrics.map((m) => (
              <div key={m.label}>
                {/* tabular-nums so metric values line up column-to-column
                    instead of jittering with proportional digits. */}
                <div className={`font-display font-bold text-sm tabular-nums ${tone.accent}`}>{m.value}</div>
                <div className="text-muted-foreground/70 text-xs mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Stack, in two readings of the SAME data: chips for scanning, a
            terminal log for the "this is a system, not a brochure" register.
            Deliberately a toggle rather than an addition — showing both would
            just be the tech list twice. */}
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-eyebrow uppercase text-muted-foreground/60">
              {terminalView ? labels.terminalView : labels.stack}
            </span>
            <button
              type="button"
              onClick={() => setTerminalView((v) => !v)}
              // aria-pressed, not aria-expanded: this toggles BETWEEN two
              // representations, it does not reveal extra content.
              aria-pressed={terminalView}
              aria-label={terminalView ? labels.showChips : labels.showTerminal}
              title={terminalView ? labels.showChips : labels.showTerminal}
              className="rounded-sm p-1 text-muted-foreground/70 transition-colors duration-200 hover:bg-brand/10 hover:text-brand"
            >
              {terminalView ? <LayoutGrid className="h-3.5 w-3.5" /> : <Terminal className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Was AnimatePresence mode="wait". The two views are mutually
              exclusive and each remounts when `terminalView` flips, so a CSS
              enter animation replays on its own and they can never overlap —
              exactly what mode="wait" was there to guarantee. The outgoing
              view now disappears instantly instead of fading out. */}
          {terminalView ? (
            <div
              key="terminal"
              className="rounded-lg border border-border bg-surface-1 p-3 font-mono text-xs animate-in fade-in-0 duration-200"
            >
              <div className="mb-2 flex items-center gap-1.5 border-b border-border pb-2">
                <span className="h-2 w-2 rounded-full bg-surface-3" />
                <span className="h-2 w-2 rounded-full bg-surface-3" />
                <span className="h-2 w-2 rounded-full bg-surface-3" />
                <span className="ml-1.5 truncate text-muted-foreground/60">{project.id}</span>
              </div>
              <p className="text-brand">$ inspect --stack</p>
              <ul className="mt-1 space-y-0.5">
                {project.tech.map((tech) => (
                  <li key={tech} className="flex items-center gap-2">
                    <span className="text-brand/50">›</span>
                    <span className="text-muted-foreground">{tech.toLowerCase()}</span>
                    <span className="ml-auto text-brand-soft">ok</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-brand-soft">
                ✓ {project.tech.length} {labels.modulesResolved}
              </p>
            </div>
          ) : (
            <div key="chips" className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span key={tech} className="px-2.5 py-1 bg-surface-3/60 border border-border text-muted-foreground text-xs rounded-md font-mono hover:border-brand/30 hover:text-brand-soft transition-colors">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {hasCaseStudy && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className={`flex items-center gap-2 text-xs font-medium transition-colors duration-200 mb-4 w-fit hover:text-brand ${
              expanded ? "text-brand" : "text-muted-foreground"
            }`}
          >
            {expanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> {labels.hideCaseStudy}</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> {labels.viewCaseStudy}</>
            )}
          </button>
        )}

        {/* The grid-template-rows 0fr -> 1fr idiom. CSS cannot transition to
            `height: auto`, which is the whole reason this was a JS animation,
            but it CAN transition a grid track between those two values and let
            the row resolve to the content's natural height.
            This is the one conversion that gains a capability: the element
            stays mounted, so unlike every other AnimatePresence removal here
            the CLOSE animates too. Kept out of the DOM entirely when the
            project has no case study, and hidden from assistive tech while
            collapsed since it is visually inert then. */}
        {hasCaseStudy && (
          <div
            aria-hidden={!expanded}
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              {/* Problem → Solution → Impact reads as a progression, so it is
                  keyed to RISING cyan intensity rather than to three unrelated
                  hues. The previous version paired a `bg-brand` cyan dot with
                  #84cc16 lime text on the same row — a half-finished migration
                  that visibly contradicted itself. */}
              <div className="border border-border rounded-lg p-5 mb-5 space-y-4 bg-surface-1/60">
                {[
                  { label: labels.problem,  dot: "bg-muted-foreground/50", text: "text-muted-foreground", body: project.problem  },
                  { label: labels.solution, dot: "bg-brand/50",            text: "text-brand-soft",       body: project.solution },
                  { label: labels.impact,   dot: "bg-brand",               text: "text-brand",            body: project.impact   },
                ].map((row) => (
                  <div key={row.label}>
                    <div className={`text-eyebrow font-semibold uppercase mb-2 flex items-center gap-2 ${row.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${row.dot} inline-block`} />
                      {row.label}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{row.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-auto">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm border border-border hover:border-brand/30 px-4 py-2 rounded-md transition-all duration-200 ease-spring active:scale-[0.97]">
              <Github className="w-4 h-4" /> {labels.viewCode}
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-brand text-sm border border-border hover:border-brand/40 px-4 py-2 rounded-md transition-all duration-200 ease-spring active:scale-[0.97]">
              <ExternalLink className="w-4 h-4" /> {labels.viewDemo}
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export function ProjectsSection() {
  const { t, locale } = useLocale();
  const PROJECTS = locale === "ar" ? PROJECTS_AR : PROJECTS_EN;

  const labels = {
    new: t("projects.new"),
    viewCode: t("projects.viewCode"),
    viewDemo: t("projects.viewDemo"),
    viewCaseStudy: t("projects.viewCaseStudy"),
    hideCaseStudy: t("projects.hideCaseStudy"),
    problem: t("projects.problem"),
    solution: t("projects.solution"),
    impact: t("projects.impact"),
    Flagship: t("projects.flagship"),
    "Enterprise Grade": t("projects.enterpriseGrade"),
    // Hardcoded English, matching the status labels below rather than
    // `t()`: these keys do not exist in the locale files yet, and a missing
    // key renders the raw key string into the card.
    stack: "Stack",
    terminalView: "Terminal",
    showTerminal: "Show as terminal log",
    showChips: "Show as tags",
    modulesResolved: "modules resolved",
    Featured: "Featured",
    "In Development": "In Development",
    Completed: "Completed",
    Research: "Research",
  };

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="container mx-auto px-6">

        <Reveal
          className="text-center mb-14"
        >
          <div className="text-xs font-mono text-brand/60 uppercase tracking-widest mb-3">
            {"// projects"}
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("projects.title")} <span className="text-brand">{t("projects.titleHighlight")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-brand mx-auto mb-5" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("projects.subtitle")}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} labels={labels} />
          ))}
        </div>

        <Reveal step={3}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/asadullah48"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-brand/40 text-brand hover:bg-brand/10 px-6 py-3 rounded-lg transition-all duration-200"
          >
            <Github className="w-4 h-4" />
            {t("projects.viewAllGithub")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export default ProjectsSection;
