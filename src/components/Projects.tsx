"use client";

import { useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, ChevronDown, ChevronUp, Zap, Star, Clock, ShoppingBag } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

type ProjectStatus = "Featured" | "In Development" | "Completed" | "Research" | "Flagship";

type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  statusColor: string;
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
    id: "bazaar",
    title: "Bazaar: Unified B2B + B2C Marketplace",
    status: "Flagship",
    statusColor: "#f59e0b",
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
    statusColor: "#84cc16",
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
    statusColor: "#84cc16",
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
    statusColor: "#a855f7",
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
    statusColor: "#84cc16",
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
    statusColor: "#a855f7",
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
    statusColor: "#3b82f6",
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
    id: "bazaar",
    title: "بازار: سوق B2B + B2C الموحد",
    status: "Flagship",
    statusColor: "#f59e0b",
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
    statusColor: "#84cc16",
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
    statusColor: "#84cc16",
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
    statusColor: "#a855f7",
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
    statusColor: "#84cc16",
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
    statusColor: "#a855f7",
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
    statusColor: "#3b82f6",
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
  Flagship:         <ShoppingBag className="w-3 h-3" />,
  Featured:         <Star className="w-3 h-3" />,
  "In Development": <Clock className="w-3 h-3" />,
  Completed:        <Zap className="w-3 h-3" />,
  Research:         <Zap className="w-3 h-3" />,
};

function StatusBadge({ status, color, label }: { status: ProjectStatus; color: string; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      {STATUS_ICONS[status]}
      {label}
    </span>
  );
}

function ProjectCard({ project, labels }: { project: Project; labels: Record<string, string> }) {
  const [expanded, setExpanded] = useState(false);
  const hasCaseStudy = !!(project.problem && project.solution && project.impact);

  // Spotlight: track the cursor via CSS vars so the glow follows the mouse
  // without triggering React re-renders on every pointer move.
  const handleSpotlight = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      layout
      onMouseMove={handleSpotlight}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      className={`group relative bg-[#111111] border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
        project.status === "Flagship"
          ? "border-amber-500/30 hover:border-amber-500/60 md:col-span-2 lg:col-span-1"
          : "border-white/8 hover:border-green-500/30"
      }`}
    >
      <div
        className="h-0.5 w-full flex-shrink-0"
        style={{ background: `linear-gradient(to right, transparent, ${project.statusColor}80, transparent)` }}
      />

      {/* Cursor-tracking glow (position set by handleSpotlight) */}
      <div className="spotlight-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[1]" />

      {project.image && (
        <div className="w-full overflow-hidden bg-[#0d0d0d]" style={{ maxHeight: "200px" }}>
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-top"
            style={{ maxHeight: "200px" }}
          />
        </div>
      )}

      {project.isNew && (
        <div className="absolute top-4 right-4 z-10">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
            {labels.new}
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <StatusBadge status={project.status} color={project.statusColor} label={labels[project.status] ?? project.status} />
        <h3 className="text-xl font-bold text-white mt-3 mb-1.5 group-hover:text-green-400 transition-colors duration-200 pr-12">
          {project.title}
        </h3>
        <p className="text-sm font-medium mb-4" style={{ color: project.statusColor + "cc" }}>
          {project.tagline}
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">{project.description}</p>

        {project.metrics && (
          <div className="flex gap-6 mb-5 flex-wrap">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <div className="font-bold text-sm" style={{ color: project.statusColor }}>{m.value}</div>
                <div className="text-gray-600 text-xs mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((tech) => (
            <span key={tech} className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-400 text-xs rounded-md font-mono hover:border-white/20 transition-colors">
              {tech}
            </span>
          ))}
        </div>

        {hasCaseStudy && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-xs font-medium transition-colors duration-200 mb-4 w-fit"
            style={{ color: expanded ? project.statusColor : project.statusColor + "99" }}
          >
            {expanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> {labels.hideCaseStudy}</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> {labels.viewCaseStudy}</>
            )}
          </button>
        )}

        <AnimatePresence>
          {expanded && hasCaseStudy && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border border-white/8 rounded-xl p-5 mb-5 space-y-4 bg-[#0d0d0d]">
                {[
                  { label: labels.problem,  dot: "bg-red-400",   textColor: "#f87171", body: project.problem  },
                  { label: labels.solution, dot: "bg-blue-400",  textColor: "#60a5fa", body: project.solution },
                  { label: labels.impact,   dot: "bg-green-400", textColor: "#84cc16", body: project.impact   },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: row.textColor }}>
                      <span className={`w-1.5 h-1.5 rounded-full ${row.dot} inline-block`} />
                      {row.label}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{row.body}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mt-auto">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm border border-white/10 hover:border-white/30 px-4 py-2 rounded-lg transition-all duration-200">
              <Github className="w-4 h-4" /> {labels.viewCode}
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-green-400 text-sm border border-white/10 hover:border-green-500/40 px-4 py-2 rounded-lg transition-all duration-200">
              <ExternalLink className="w-4 h-4" /> {labels.viewDemo}
            </a>
          )}
        </div>
      </div>
    </motion.div>
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
    Featured: "Featured",
    "In Development": "In Development",
    Completed: "Completed",
    Research: "Research",
  };

  return (
    <section id="projects" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="text-xs font-mono text-green-400/60 uppercase tracking-widest mb-3">
            {"// projects"}
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("projects.title")} <span className="text-green-400">{t("projects.titleHighlight")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-green-400 mx-auto mb-5" />
          <p className="text-gray-400 max-w-xl mx-auto">
            {t("projects.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} labels={labels} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/asadullah48"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-green-500/40 text-green-400 hover:bg-green-500/10 px-6 py-3 rounded-lg transition-all duration-200"
          >
            <Github className="w-4 h-4" />
            {t("projects.viewAllGithub")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default ProjectsSection;
