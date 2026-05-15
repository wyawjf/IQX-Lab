import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "motion/react";
import { 
  Layers, Briefcase, Play,
  Activity, Zap, FileText, MessageSquare, Copy, Check, Target, ChevronRight, AlertTriangle, Sparkles, Terminal, Code, ArrowRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==========================================
// MOCK DATA
// ==========================================
const GUIDED_DATA = [
  { key: 'role', title: '切入职场角色', options: ['产品/业务负责人', 'AI 研发/架构师', '商业化/增长黑客', '跨端项目推动者'] },
  { key: 'industry', title: '核心赋能场景', options: ['全球电商智能履约', '自媒体工业化生产', '私有化金融风控大模型', '企业级智能知识中枢'] },
  { key: 'technology', title: 'AI 核心驱动架构', options: ['LLM Workflow 编排', '多模态 AIGC 矩阵', 'RAG + 向量检索增强', 'Multi-Agent 自主协同'] },
  { key: 'goal', title: '北极星指标 (KPI)', options: ['释放 50% 基础人力', '获客转化率提升 300%', '突破性产品新卖点', '业务流转响应达秒级'] }
];

const EXISTING_PROJECTS = [
  { 
    id: 1, 
    title: "全球多语言智能退换货流转引擎", 
    desc: "基于大型语言模型构建，直接对接并吞吐全球海量售后工单。自动识别 30+ 语言意图、精准提取关键退换要素，处理负面情绪预警并实现工单流程全自动流转。", 
    tags: ["LLM", "AI 客服", "业务流自动化"], 
    status: "已完成", 
    statusType: "completed" 
  },
  { 
    id: 2, 
    title: "多模态自适应短视频矩阵工厂", 
    desc: "深度整合视频扩散模型与零次试音语音克隆（Zero-shot TTS）技术。仅需输入文案大纲，系统即可在 5 分钟内分裂生成适配多平台的混剪短剧、口播矩阵流。", 
    tags: ["AIGC", "多模态生成", "指数级增长"], 
    status: "推进中", 
    statusType: "progress" 
  },
  { 
    id: 3, 
    title: "企业级投研行业知识内脑系统", 
    desc: "打通内部沉淀的数百万份非结构化行研报告与私域数据字典。通过高级 RAG 架构进行知识增强，使 AI 能够秒级提取并对比财报指标，自动撰写投研初稿。", 
    tags: ["RAG 架构", "企业知识库", "Agent 推理"], 
    status: "规划中", 
    statusType: "planned" 
  },
];

const generateMockData = (nodeId: 1 | 2 | 3, payload: any) => {
  return {
    title: nodeId === 1 ? `架构推演系统` : nodeId === 2 ? `${payload.text?.substring(0,10) || '探索任务'}... 破局` : `${payload.title} 落地实战`,
    scene: '业务群每天抱怨低效的人工流程，老板在例会点名：“能不能牵头把 AI 用起来？”\n\n你临危受命。既无 AI 专家背书，也没充足的算力支持。你不仅要弄出一个看似高大上的工具去汇报，还要从最基础的需求摸底、模型选型、不断试错开始，主导一次真正能为公司降本增效的落地战役。',
    mission_brief: `【核心任务指示】\n背景：团队长期习惯于依赖密集人力“搬砖”，然而对新兴的 AI 技术充满了不切实际的科幻幻想。\n\n关键战役拆解：\n1. 明确边界：主动戳破期望泡泡，定义一个能在两周内部署、容错率高的 MVP 雏形。\n2. 原型验证：低成本利用大模型 API 走通骨干业务链路，跑通数据进行真实验货。\n3. 应对反噬：在内测时解决致命的 AI 幻觉问题，设立人工兜底机制保住系统公信力。\n4. 闭环收尾：将系统能力挂载入现有业务流转节点，统计提效 KPI 形成完整的闭环报告。`,
    process: [
      {
        day: "Day 1-3", phase: "博弈与边界划定",
        context: "你组织了一场全员会议，开始收集业务方对 AI 工具的期望。大家情绪高涨，提出各种天马行空的想法与需求。",
        challenge: "业务方提出了几十个“科幻级”的离谱需求，希望 AI 不仅能整理表格，还能自动代替人工做复杂的资金流最终审批。他们对技术的边界毫无概念，期望值完全脱离了当前模型的能力上限与数据安全要求。",
        action: "运用 MVP（最小可行性产品）思维展开预期管理，强行砍掉了 80% 不切实际的想法。通过划分 ROI 象限图，将战线牢牢锁定在一两个极高频刚需、且技术容错率较高的辅助场景（如初级话术起草和工单自动分类）。",
        result: "将过高的预期拉低到了实战层面，避免项目一开始就背上不可能完成的任务，并顺利获批起步阶段的基础试错经费与数据访问权限。"
      },
      {
        day: "Week 1", phase: "原型与触礁危机",
        context: "利用现成的外部大模型 API 快速搭建了初版 Prototype 原型工具，导入了过往一个月的真实业务数据进行脱机跑批验证。",
        challenge: "由于通用大模型缺乏公司特有的垂直业务知识储备，提取的信息频繁出现严重的“AI 幻觉”。模型甚至凭空捏造了不存在的数据接口与客户补偿政策，这要是发给真实客户将酿成不可挽回的公关与信任危机。",
        action: "紧急叫停了原有全自动化直连客户的激进计划。转变产品交互形态，在系统的输出链路中强行加入了【人工审核验证层】（Human-in-the-loop），让 AI 退居二线，只作为业务人员的“建议草稿提供者”。",
        result: "在有惊无险之中保住了业务底线及团队声誉。决策层也深刻意识到，纯靠提示词工程（Prompt Engineering）是不够的，急需探索能够结合本地知识的新架构方案。"
      },
      {
        day: "Week 2", phase: "构筑知识壁垒",
        context: "迅速引入外挂知识检索库架构（RAG），试图通过挂载公司内部的真实规章制度、SOP 流程文档，让大模型的回答能够可追溯、可控制。",
        challenge: "公司历史文档年久失修，冗杂且废话极大。AI 在执行向量检索时常常张冠李戴，抓取到十年前过期的作废政策作为推理依据，导致合并生成的回答依旧经不起推敲，业务人员表示“需要花更多时间检查”。",
        action: "放弃直接喂送原始文件，带领团队对非结构化文档进行一轮彻底的语料清洗与精准的语义切片（Chunking）。同时设定硬性系统级指令：AI 最终得出结论时，必须严格附带强匹配的源文档段落（Citation）并高亮显示。",
        result: "模型输出的准确度与可信度迎来了质的飞跃。业务线骨干在深入试用多轮后，终于在 UAT 验收体验演示会上给出了『这玩意现在真敢用了』的积极反馈和高度认可。"
      },
      {
        day: "Week 3", phase: "防线兜底与降级",
        context: "系统经过多轮沙盒内测后，即将全量开放给整个大部门进行常态化使用。你必须提前为可能出现的生产环境故障设计好最差情况的容灾演练方案。",
        challenge: "真实生产环境极其复杂且难以预测：如果底层调用的外部模型 API 突然因高并发瘫痪，或者用户提问过于含糊生僻导致大模型难以作答被困住，系统一旦无响应，一线业务体验将瞬间崩盘并引发强烈的负面情绪抵触。",
        action: "在系统网关层挂载了极其严格的置信度阈值监控与响应超时熔断保护逻辑。一旦探针检测到推理置信度过低或接口发送超时异常，系统将立刻触发静默降级处理，将请求无缝切换并转交至传统的人工客服备用队列，确保业务不中断。",
        result: "凭借这套万无一失的保底风控容灾机制，系统极其平稳地全量部署上线。在上线的首月内保证了业务线 0 级事故的前提下，自动消化了超过 30% 到 40% 的初级重复性人力处理任务，团队拿到了极佳的人效对标指标。"
      }
    ],
    resume: `[简历亮点]\n‣ 低成本主导部门首个垂直 AI 工程落地，包揽从需求对齐、架构设计（知识增强 RAG）到端到端幻觉风险防范的全生命周期管控。\n‣ 主动梳理并实施复杂业务语料的高质量清洗与切片，构建了基于引用溯源（Citation）的稳定回复机制与低置信度下的平滑降级链路，彻底拦截了因 AI 幻觉可能导致的生产事故。\n‣ 该系统成功切入核心生产流转环节，在保证业务链 0 客诉的基础上，自动消化并分担了超 30% - 40% 的人工重复性流转任务，大幅提升了整个业务作战团队的响应人效与产出率。`,
    linkedin: `[行业洞见经验分享]\n最近带领团队交付并顺利上线了一套核心业务级的 AI 辅助决策系统。在这个全流程跑下来后我深深体会到：调几个现成的 API 写个极简 Demo 并不难，真正难的是如何用敬畏安全的工程化思维去“驯化” AI 带来的非确定性风险。\n如果在架构设计的初期阶段就没有前置考虑【降级容灾】、【置信度阈值阻断】和【Human-in-the-loop 人工兜底验证控制】，那所谓的酷炫 AI 工具就是一个随时会摧毁用户信任的定时炸弹。脱离了实际业务风控去高谈阔论 AI 赋能，都是耍流氓。贴近战场的实战，才是检验技术管理架构思维底色深浅的唯一试金石！🚀`,
    mentor_feedback: `[资深评委 / 面试官视角评价]\n这是一份非常扎实、有着充分实战厚度并且经过沉淀的复盘！你生动地体现出了当下市场上极度稀缺的系统级容错复用工程架构嗅觉。面对眼花缭乱的 AI 浪潮，有大量的新人甚至老鸟都只会盲目追求模型参数调优或堆砌华丽酷站界面，而你却非常敏锐且克制地抓紧了『幻觉控制、信任边界打探、常态化人工兜底降级』这几个关乎生死的业务核心“死穴”。这展示了你为了整个业务大盘的长期安全负责的高阶大局观，证明了你有绝对潜力来担当和主导复杂系统的技术一号位角色。`
  };
};

// ==========================================
// ANIMATIONS & CURSOR
// ==========================================

const CustomCursor = ({ hoverState }: { hoverState: boolean }) => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 800, damping: 35 });
  const springY = useSpring(y, { stiffness: 800, damping: 35 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [x, y]);

  return (
    <motion.div style={{ x: springX, y: springY }} className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block">
      <motion.div 
        animate={{ 
          scale: hoverState ? 2.5 : 1, 
          borderWidth: hoverState ? '1px' : '4px',
          borderColor: hoverState ? '#fff' : '#fff',
          backgroundColor: hoverState ? 'transparent' : '#fff'
        }} 
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-white/90" 
      />
    </motion.div>
  );
};

const MinimalBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none bg-[#F7F7F5] overflow-hidden">
    <motion.div 
      animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
      className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]" 
    />
  </div>
);

const ScrambleText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  useEffect(() => {
    let iteration = 0;
    let interval: ReturnType<typeof setInterval> | null = null;
    interval = setInterval(() => {
      setDisplayText(t => t.split("").map((l, i) => i < iteration ? text[i] : letters[Math.floor(Math.random() * 26)]).join(""));
      if (iteration >= text.length) clearInterval(interval!);
      iteration += 1 / 3;
    }, 20);
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [text]);
  return <span className="tracking-tighter">{displayText}</span>;
};

// ==========================================
// CORE APP
// ==========================================

export default function App() {
  const [hoverState, setHoverState] = useState(false);
  
  const [guided, setGuided] = useState<Record<string, string>>({});
  const [customInput, setCustomInput] = useState("");
  const [activeNode, setActiveNode] = useState<1 | 2 | 3 | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [missionStatus, setMissionStatus] = useState<'idle' | 'started' | 'completed'>('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const run = (id: 1 | 2 | 3, payload: any) => {
    setActiveNode(id); setOutput(null); setMissionStatus('idle'); setCurrentStepIndex(0); setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); setOutput(generateMockData(id, payload)); }, 2000);
  };

  const bindHover = {
    onMouseEnter: () => setHoverState(true),
    onMouseLeave: () => setHoverState(false)
  };

  const stepTransition = {
    hidden: { opacity: 0, x: 20, filter: "blur(3px)", scale: 0.98 },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", scale: 1, transition: { type: "spring", stiffness: 450, damping: 35, staggerChildren: 0.08 } },
    exit: { opacity: 0, x: -20, filter: "blur(3px)", scale: 0.98, transition: { duration: 0.2 } }
  };

  const itemTransition = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } }
  };

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden md:cursor-none text-[#111] selection:bg-black/10">
      <CustomCursor hoverState={hoverState} />
      
      <MinimalBackground />

      <div className="relative z-10 flex flex-col min-h-screen w-full max-w-7xl mx-auto p-4 md:p-6">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <div className="font-black tracking-widest uppercase flex items-center gap-2 text-black text-sm">
             <div className="w-3 h-3 bg-black" />
             OMNIBRAIN
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* STAGE 0: SELECTION */}
          {(!output && !isProcessing) && (
            <motion.div key="stage0" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, filter: "blur(10px)", y: -10 }} className="flex-1 flex flex-col justify-center gap-4 pb-6">
              <div className="text-center md:text-left mb-0">
                <motion.h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter uppercase leading-none text-black">
                  <ScrambleText text="AI 项目模拟沙盘实验室" />
                </motion.h1>
                <div className="text-sm md:text-[15px] leading-relaxed font-bold opacity-70">
                  选择沉浸式演练路径，深入复杂 AI 落地项目。<br />
                  通过高容积的博弈系统，助您萃取实战资产与面试高阶语料。
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* NODE 1 */}
                <motion.div whileHover={{ y: -4, boxShadow: "6px 6px 0 0 rgba(0,0,0,1)" }} {...bindHover} className="bg-white border-black border-[3px] shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-5 md:p-6 flex flex-col transition-all duration-300 rounded-[24px]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 flex items-center justify-center rounded-[12px] border-[3px] border-black text-black"><Layers size={20}/></div>
                    <div><h2 className="text-lg font-black uppercase tracking-tight">智能化立项推演</h2></div>
                  </div>
                  <div className="flex-1 space-y-4 mb-5 overflow-y-auto pr-1">
                    {GUIDED_DATA.map(s => (
                      <div key={s.key}>
                        <h5 className="text-[11px] mb-2 uppercase tracking-widest font-black opacity-60">{s.title}</h5>
                        <div className="flex flex-wrap gap-1.5">
                          {s.options.map(opt => {
                            const isSel = guided[s.key] === opt;
                            return (
                              <button key={opt} onClick={() => setGuided(p => ({ ...p, [s.key]: isSel ? undefined : opt as any }))}
                                className={cn("px-2.5 py-1.5 text-[12px] rounded-md font-bold transition-all border-2", 
                                  isSel ? "bg-black text-white border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]" : "border-black/10 hover:border-black/40 text-black bg-black/[0.03]"
                                )}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => run(1, guided)} className="w-full py-3.5 rounded-lg text-[15px] font-black flex justify-center items-center gap-2 uppercase tracking-wide transition-all bg-black text-white hover:bg-black/90 active:scale-95 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]">
                    生成核心场景视角 <Play size={14} fill="currentColor" />
                  </button>
                </motion.div>

                {/* NODE 2 */}
                <motion.div whileHover={{ y: -4, boxShadow: "6px 6px 0 0 rgba(0,0,0,1)" }} {...bindHover} className="bg-white border-black border-[3px] shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-5 md:p-6 flex flex-col transition-all duration-300 rounded-[24px]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 flex items-center justify-center rounded-[12px] border-[3px] border-black text-black"><Terminal size={20}/></div>
                    <div><h2 className="text-lg font-black uppercase tracking-tight">自定义痛点实验室</h2></div>
                  </div>
                  <textarea value={customInput} onChange={e => setCustomInput(e.target.value)} placeholder="描述业务线正在头疼的烂摊子 (例如：销售线索一直流失，人力全耗在初筛上，老板让我想办法搭个基于大模型的全自动过滤机器人...)" 
                    className="flex-1 w-full p-4 text-[13px] font-bold leading-[1.6] rounded-[12px] resize-none focus:outline-none transition-all mb-5 bg-black/[0.02] border-[3px] border-black/10 focus:border-black placeholder:text-black/30 text-black shadow-inner" />
                  <button disabled={!customInput.trim()} onClick={() => run(2, { text: customInput })} 
                    className="w-full py-3.5 rounded-lg text-[15px] font-black flex justify-center items-center gap-2 uppercase tracking-wide disabled:opacity-50 transition-all bg-black text-white hover:bg-black/90 active:scale-95 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]">
                    注入专项破局方案 <Play size={14} fill="currentColor" />
                  </button>
                </motion.div>

                {/* NODE 3 */}
                <motion.div whileHover={{ y: -4, boxShadow: "6px 6px 0 0 rgba(0,0,0,1)" }} {...bindHover} className="bg-white border-black border-[3px] shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-5 md:p-6 flex flex-col transition-all duration-300 rounded-[24px]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 flex items-center justify-center rounded-[12px] border-[3px] border-black text-black"><Briefcase size={20}/></div>
                    <div><h2 className="text-lg font-black uppercase tracking-tight">真实落地项目库</h2></div>
                  </div>
                  <div className="flex-1 space-y-3">
                    {EXISTING_PROJECTS.map((p, i) => (
                      <motion.div whileHover={{ scale: 1.01, borderColor: "rgba(0,0,0,1)" }} key={p.id} onClick={() => run(3, p)} className="cursor-pointer p-3.5 rounded-[12px] transition-all duration-200 border-[3px] border-black/10 bg-black/[0.02] shadow-[2px_2px_0_0_rgba(0,0,0,0)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] relative">
                        <div className="flex justify-between items-start mb-1.5">
                          <h4 className="text-[13px] leading-tight font-black text-black tracking-tight pr-2">{p.title}</h4>
                          <span className={cn("text-[10px] whitespace-nowrap font-bold px-1.5 py-0.5 rounded-md border-2",
                            p.statusType === 'completed' ? "bg-green-100 text-green-800 border-green-300" :
                            p.statusType === 'progress' ? "bg-orange-100 text-orange-800 border-orange-300" :
                            "bg-gray-100 text-gray-800 border-gray-300"
                          )}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed line-clamp-2 text-black/70 font-medium">{p.desc}</p>
                        <div className="flex gap-1.5 mt-2">
                           {p.tags.map(tag => (
                             <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 bg-black/5 text-black/60 rounded uppercase">{tag}</span>
                           ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

              </div>
            </motion.div>
          )}

          {/* STAGE 1: PROCESSING */}
          {isProcessing && (
            <motion.div key="stage1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex-1 flex flex-col items-center justify-center pb-20">
              <motion.div animate={{ rotate: 180 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                 <Code className="w-16 h-16 mb-6 text-black opacity-90" />
              </motion.div>
              <div className="text-2xl md:text-3xl font-black uppercase tracking-widest text-black">
                <ScrambleText text="ASSEMBLING SCENARIO" />
              </div>
            </motion.div>
          )}

          {/* STAGE 2: BRIEFING */}
          {(output && !isProcessing && missionStatus === 'idle') && (
            <motion.div key="stage2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ type: "spring", damping: 25 }} className="flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto py-4">
              <h3 className="text-3xl md:text-4xl font-black leading-[1.1] mb-4 tracking-tighter uppercase text-center">
                <ScrambleText text={output.title} />
              </h3>
              <p className="text-[14px] md:text-[15px] text-center leading-[1.6] mb-6 font-medium opacity-80 whitespace-pre-wrap px-4">{output.scene}</p>
              
              <div className="p-5 md:p-6 rounded-[20px] text-left w-full mb-6 bg-white border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 font-black text-xs md:text-sm mb-3 uppercase tracking-widest text-black pb-2 border-b-[3px] border-black/10"><Target size={16} /> Mission Control Requirements</div>
                <div className="whitespace-pre-wrap leading-[1.8] font-medium text-[13px] md:text-[14px] text-black/80">{output.mission_brief}</div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: "4px 4px 0 0 rgba(0,0,0,1)" }} 
                whileTap={{ scale: 0.98 }}
                {...bindHover} 
                onClick={() => setMissionStatus('started')} 
                className="px-8 py-3.5 rounded-lg font-black text-sm uppercase tracking-widest flex items-center gap-2 transition-all bg-black text-white border-[3px] border-black"
              >
                Initiate Workflow <ChevronRight size={18} />
              </motion.button>
            </motion.div>
          )}

          {/* STAGE 3: INTERACTIVE PROCESS */}
          {(output && !isProcessing && missionStatus === 'started') && (
            <motion.div key="stage3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 w-full max-w-5xl mx-auto py-2 md:py-4 flex flex-col h-full min-h-0">
              
              <div className="flex justify-between items-center mb-4 gap-4 px-2">
                <div className="flex gap-1.5 p-1 bg-black/[0.04] rounded-full border border-black/5">
                  {output.process.map((p: any, i: number) => (
                    <motion.div key={i} layout className={cn("h-1.5 transition-all rounded-full", i === currentStepIndex ? "w-8 bg-black" : i < currentStepIndex ? "w-4 bg-black/40" : "w-2 bg-black/10")} />
                  ))}
                </div>
                <div className="font-black text-[10px] md:text-xs tracking-widest uppercase text-black">
                  Phase {currentStepIndex + 1} / {output.process.length}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={`step-${currentStepIndex}`}
                  variants={stepTransition}
                  initial="hidden" animate="visible" exit="exit"
                  className="p-5 md:p-6 rounded-[24px] relative overflow-hidden bg-white border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex-1 flex flex-col"
                >
                  <motion.h4 variants={itemTransition} className="text-lg md:text-xl font-black mb-4 leading-[1.4] tracking-tight text-black border-b-[3px] border-black/10 pb-3">
                    {output.process[currentStepIndex].context}
                  </motion.h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 flex-1 content-start">
                    <motion.div variants={itemTransition} className="flex flex-col gap-2">
                      <div className="font-black text-[11px] text-red-600 uppercase tracking-widest flex items-center gap-1.5 bg-red-50 self-start px-2.5 py-1 rounded-md border-2 border-red-200">
                         <AlertTriangle size={14}/> 核心业务阻力
                      </div>
                      <div className="p-4 rounded-[16px] h-full leading-[1.6] bg-red-50/40 border-[3px] border-red-100 font-medium text-[13px] md:text-[14px] text-red-950/90 shadow-sm">
                        {output.process[currentStepIndex].challenge}
                      </div>
                    </motion.div>

                    <motion.div variants={itemTransition} className="flex flex-col gap-2">
                      <div className="font-black text-[11px] uppercase tracking-widest flex items-center gap-1.5 text-black bg-black/5 self-start px-2.5 py-1 rounded-md border-2 border-black/10">
                         <Zap size={14}/> 敏捷破局动作
                      </div>
                      <div className="p-4 rounded-[16px] h-full leading-[1.6] bg-[#111] text-[#fbfbfb] font-medium text-[13px] md:text-[14px] border-[3px] border-black shadow-[4px_4px_0_0_rgba(200,200,200,0.15)]">
                        {output.process[currentStepIndex].action}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div variants={itemTransition} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-[16px] gap-4 bg-green-50/50 border-[3px] border-green-200 mt-auto">
                    <div className="flex-1 flex gap-3 items-center pr-2">
                      <div className="w-6 h-6 shrink-0 rounded-full flex justify-center items-center bg-green-600 text-white shadow-[2px_2px_0_0_rgba(22,163,74,0.3)]"><Check size={14} strokeWidth={4}/></div>
                      <div className="leading-[1.5] font-black text-green-950 text-[13px] md:text-[14px]">
                        <span className="opacity-50 mr-2 text-[10px] uppercase tracking-widest">阶段成果</span>
                        {output.process[currentStepIndex].result}
                      </div>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.02, boxShadow: "2px 2px 0 0 rgba(0,0,0,1)" }}
                      whileTap={{ scale: 0.98 }}
                      {...bindHover} 
                      onClick={() => currentStepIndex < output.process.length - 1 ? setCurrentStepIndex(p=>p+1) : setMissionStatus('completed')} 
                      className="shrink-0 px-5 py-2.5 rounded-lg font-black text-[12px] uppercase tracking-widest transition-all bg-black text-white shadow-[2px_2px_0_0_rgba(0,0,0,0.6)] border-[3px] border-black flex items-center gap-2 group w-full md:w-auto justify-center"
                    >
                      {currentStepIndex < output.process.length - 1 ? '推进推演进度' : '完成复盘通关'}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </motion.div>

                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* STAGE 4: ASSETS COMPLETED */}
          {(output && !isProcessing && missionStatus === 'completed') && (
            <motion.div key="stage4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 25 }} className="flex-1 py-4 md:py-6 w-full max-w-5xl mx-auto">
              <div className="text-center mb-8 relative">
                 <motion.div animate={{ rotate: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="mx-auto w-12 h-12 mb-4 flex justify-center items-center rounded-[14px] border-[3px] border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-black">
                   <Sparkles size={24} />
                 </motion.div>
                 <h2 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tighter text-black"><ScrambleText text="演练完成，知识资产已萃取" /></h2>
                 <p className="text-[13px] font-bold opacity-60">高含金量语料已为您生成完毕，可一键复用至求职或述职场景</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <motion.div whileHover={{ y: -2, boxShadow: "4px 4px 0 0 rgba(0,0,0,1)" }} className="p-6 flex flex-col rounded-[24px] group relative overflow-hidden bg-white border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-black transition-all">
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <h4 className="text-base font-black uppercase flex items-center gap-2"><FileText size={16}/> 简历亮点提炼</h4>
                    <button {...bindHover} onClick={() => navigator.clipboard.writeText(output.resume)} className="w-8 h-8 flex justify-center items-center rounded-[8px] border-[2px] border-black hover:bg-black hover:text-white transition-all active:scale-95"><Copy size={14}/></button>
                  </div>
                  <div className="flex-1 text-[12px] md:text-[13px] leading-[1.8] whitespace-pre-wrap relative z-10 font-medium opacity-80">{output.resume}</div>
                </motion.div>

                <motion.div whileHover={{ y: -2, boxShadow: "4px 4px 0 0 rgba(0,0,0,1)" }} className="p-6 flex flex-col rounded-[24px] group relative overflow-hidden bg-white border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-black transition-all">
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <h4 className="text-base font-black uppercase flex items-center gap-2"><Activity size={16}/> 社媒动态经验</h4>
                    <button {...bindHover} onClick={() => navigator.clipboard.writeText(output.linkedin)} className="w-8 h-8 flex justify-center items-center rounded-[8px] border-[2px] border-black hover:bg-black hover:text-white transition-all active:scale-95"><Copy size={14}/></button>
                  </div>
                  <div className="flex-1 text-[12px] md:text-[13px] leading-[1.8] whitespace-pre-wrap relative z-10 font-medium opacity-80">{output.linkedin}</div>
                </motion.div>

                <motion.div whileHover={{ y: -2, boxShadow: "4px 4px 0 0 rgba(0,0,0,1)" }} className="md:col-span-2 p-6 md:p-6 rounded-[24px] relative overflow-hidden bg-[#ff4e00] text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-[3px] border-black transition-all">
                  <h4 className="text-base font-black uppercase flex items-center gap-2 mb-3 relative z-10"><MessageSquare size={16}/> 资深面试官 / 导师核心评价</h4>
                  <div className="text-[13px] italic leading-[1.7] relative z-10 font-bold text-white max-w-4xl">"{output.mentor_feedback.replace(/\[.*?\]\n/, '')}"</div>
                </motion.div>
              </div>

              <div className="flex justify-center pb-12">
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "4px 4px 0 0 rgba(0,0,0,1)" }}
                  whileTap={{ scale: 0.98 }}
                  {...bindHover} 
                  onClick={() => { setOutput(null); setMissionStatus('idle'); setActiveNode(null); }} 
                  className="px-8 py-3 rounded-lg font-black text-[13px] uppercase tracking-widest transition-all bg-black text-white hover:bg-black/90 border-[3px] border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]"
                >
                  Return to Home
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
