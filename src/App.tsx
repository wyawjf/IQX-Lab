import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Layers, Briefcase, Play, PenTool, 
  Terminal, Activity, Zap, Cpu, Server, Network, FileText, MessageSquare, Copy, Check, Target
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AtmosphericBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#030303] overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,78,0,0.08)_0%,_transparent_50%)] blur-[100px]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(255,255,255,0.03)_0%,_transparent_50%)] blur-[100px]" />
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')"
      }}
    />
  </div>
);

const GUIDED_DATA = [
  { key: 'issue', title: '【CTO】Slack: 当前卡点', options: ['数据库全表扫描', 'API 延迟飙升', '大模型 OOM 崩溃', '并发队列死锁'] },
  { key: 'impact', title: '【PM】影响面评估', options: ['核心大客户', '全量 C 端瘫痪', '内部测试环境'] },
  { key: 'directive', title: '【CEO】紧急指令', options: ['立刻切断容灾备份', '不管原因先恢复', '停机维护'] },
  { key: 'action', title: '你的临时决策', options: ['重启服务', '降级大模型', '熔断限流', '增加机器'] }
];

const EXISTING_PROJECTS = [
  { id: 1, title: "[PROD-942] 核心语义分发路由崩溃", desc: "昨晚发版后多语言工单全部路由到英文组，客户投诉激增", tags: ["P0 事故", "紧急回滚"], status: "数据暴跌中", statusType: "archived" },
  { id: 2, title: "[REQ-118] 增加金融风控实时报警拦截", desc: "由于汇率剧烈波动，原有的 T+1 预警已失效，需改为毫秒级拦截", tags: ["需求变更", "业务施压"], status: "老板突然 Push", statusType: "progress" },
  { id: 3, title: "[SYS-099] 企业知识库(RAG)幻觉投诉", desc: "大模型在回答 HR 政策时自己捏造了离职补偿条款，导致严重 PR 风险", tags: ["内部红线", "高危"], status: "上线事故", statusType: "planned" },
  { id: 4, title: "[FEAT-204] 视觉扩散模型涉黄拦截部分失效", desc: "新跑的模型未能识别部分特殊视角的图像，合规部门要求停机整顿", tags: ["合规审查", "停机"], status: "紧急修复中", statusType: "expansion" },
];

const generateMockData = (nodeId: 1 | 2 | 3, payload: any) => ({
  title: nodeId === 1 ? `Jira 工单: [紧急] 线上雪崩` : nodeId === 2 ? 'Slack: 紧急复盘会议' : `任务: ${payload.title}`,
  scene: '刚才系统出现严重降级，所有北美节点的请求都被错误打回了，现在客户群里已经炸了。你需要马上采取行动。',
  mission_brief: `【背景与任务目标】\n事故原因：昨日晚间发布的 v2.4 核心路由引擎更新中，包含了一段未经验证的熔断限流配置。今早 10:20 流量早高峰期间，该配置由于正则匹配溢出导致 Gateway_Router 陷入死锁，大量合法请求被拒绝并返回 502 错误。\n受影响范围：北美及欧洲节点的全部 API 请求，已收到超 400 起关键客户的严重投诉，潜在违约金高达数百万美元。\n您的任务：\n1. 立即识别并回滚导致崩溃的有毒配置（Toxic Configuration）。\n2. 在不中断剩余无损服务的情况下，部署临时降级策略以恢复受阻北美流量。\n3. 主导跨部门（研发、SRE、客户成功团队）的紧急通讯与事故宣告，平息客户怒火。\n4. 事故修复后，完成完整的 RFO (故障根因) 报告并提取可写入简历的应对经验。`,
  process: [
    '🔔 [Slack] @here CTO: 谁动了配置？马上定位问题！！',
    '🚨 [P0 预警] 接口延迟 > 15,000ms',
    '🔄 执行了紧急降级与回滚，暂时稳住局面。',
    '📊 [Jira] 新建任务：彻查本次更新导致的崩溃根因。'
  ],
  resume: `[简历金句] ‣ 主导并处理了影响北美节点的 P0 级系统停机事故，在 10 分钟内将延迟从 >15s 恢复至 <200ms。\n[STAR 法则] ‣ 情境：全球网关遭遇毁灭性配置错误。\n‣ 任务：立即恢复服务并止损。\n‣ 行动：协调跨部门实施有毒配置回滚，并部署自动化熔断器防止连锁反应。\n‣ 结果：成功阻止了系统性崩溃，将系统可用性重新拉回至 99.99%。`,
  linkedin: `【领英/动态分享】\n熬过 P0 事故是成长的必经之路！今天为了应对全球网关的延迟激增，我的团队实现了一种即时回滚机制。真正的工程能力往往在压力下绽放。 #技术领导力 #SRE #危机管理`,
  mentor_feedback: `【AI 导师 (硅谷 CTO 毒舌视角) 💬】\n"还算能看的抢救，但你第一时间居然没去查监控报警的源头，而是直接降级？这非常业余。在大厂，你这操作会被写进事故复盘的负面典型里。下次遇到这种情况，先稳住流量，然后分流排查，不要搞一刀切！"`
});

const COLOR_THEMES = {
  1: {
    text: "text-[#10b981]",
    bg: "bg-[#10b981]",
    bgOpacity10: "bg-[#10b981]/10",
    border20: "border-emerald-500/20",
    text80: "text-emerald-500/80",
    selection: "selection:bg-[#10b981]/30",
    fill: "fill-emerald-500"
  },
  2: {
    text: "text-[#0ea5e9]",
    bg: "bg-[#0ea5e9]",
    bgOpacity10: "bg-[#0ea5e9]/10",
    border20: "border-sky-500/20",
    text80: "text-sky-500/80",
    selection: "selection:bg-[#0ea5e9]/30",
    fill: "fill-sky-500"
  },
  3: {
    text: "text-[#8b5cf6]",
    bg: "bg-[#8b5cf6]",
    bgOpacity10: "bg-[#8b5cf6]/10",
    border20: "border-violet-500/20",
    text80: "text-violet-500/80",
    selection: "selection:bg-[#8b5cf6]/30",
    fill: "fill-violet-500"
  }
} as const;

type ThemeMode = 1 | 2 | 3;

const CopyBtn = ({ text, t }: { text: string, t: any }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={onCopy} className={cn("p-1.5 rounded-md transition-colors border", copied ? cn(t.bgOpacity10, t.border20, t.text) : "border-transparent text-white/40 hover:bg-white/5 hover:text-white/80")}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

const TypewriterText = ({ text, delay = 15 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);

  return <>{displayedText}</>;
};

const TerminalSimulation = ({ activeNode }: { activeNode: ThemeMode | null }) => {
   const [logs, setLogs] = useState<string[]>([]);
   const [isRunning, setIsRunning] = useState(false);
   const scrollRef = useRef<HTMLDivElement>(null);
   const t = activeNode ? COLOR_THEMES[activeNode] : COLOR_THEMES[1];

   useEffect(() => {
     if (scrollRef.current) {
       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
     }
   }, [logs]);

   useEffect(() => {
     const handleRun = () => {
        setIsRunning(true);
        setLogs([]);
        const steps = [
          "[10:30:15] 🚨 P0 报警: 接口延迟 > 15s...",
          "[10:30:18] > 正在初始化战时复盘室...",
          "[10:30:22] [Slack] @值班工程师 客户投诉服务不可用！",
          "[10:30:26] > 挂载线上流量图谱... 分析中",
          "[10:30:31] ⚠️ 发现异常点，定位模块: 网关路由器",
          "WAIT",
          "[10:30:45] ✨ 临时降级策略已应用，服务状态: 正在恢复",
          "[10:30:52] [Jira] 自动生成事故记录单 工单-991",
          "[10:30:58] => 正在抽取职业资产...",
          "WAIT",
          "✅ 职业履历片段生成完毕！"
        ];
        let idx = 0;
        const intv = setInterval(() => {
          if (idx < steps.length) {
             const step = steps[idx];
             if (step !== "WAIT") setLogs(p => [...p, step]);
             idx++;
          } else {
             setIsRunning(false);
             clearInterval(intv);
          }
        }, 300);
     };
     window.addEventListener('run-sim', handleRun);
     return () => window.removeEventListener('run-sim', handleRun);
   }, []);

   return (
     <div className="flex flex-col h-full bg-[#050505] rounded-xl border border-white/5 overflow-hidden shadow-inner group">
       <div className="h-8 bg-white/[0.02] border-b border-white/5 flex items-center px-4 gap-2">
          <Terminal size={12} className="text-white/40" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-white/50">模拟运行过程</span>
       </div>
       <div ref={scrollRef} className="flex-1 p-4 font-mono text-[11px] leading-relaxed text-white/60 overflow-y-auto custom-scrollbar">
          {!isRunning && logs.length === 0 && (
            <div className="text-white/20 italic select-none">点击上方的“看看它是怎么运转的”按钮，查看系统如何工作...</div>
          )}
          {logs.map((log, i) => (
             <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} key={i} className={log.includes('✅') || log.includes('✨') ? t.text : ''}>
               {log}
             </motion.div>
          ))}
          {isRunning && <div className="flex items-center gap-2 text-white/30 pt-2"><span className={cn("w-1.5 h-3 animate-pulse", t.bg)} /> 正在解析...</div>}
       </div>
     </div>
   );
};

export default function App() {
  const [guided, setGuided] = useState<Record<string, string>>({});
  const [customInput, setCustomInput] = useState("");
  const [activeNode, setActiveNode] = useState<1 | 2 | 3 | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({
    title: '紧急提醒',
    role: 'CTO',
    color: 'red',
    content: '"@here 系统好像挂了？！客户说收到一堆乱码，什么情况，赶快给我查！这是今天的 P0！"'
  });
  const [output, setOutput] = useState<any>(null);

  const n1Ref = useRef<HTMLDivElement>(null);
  const n2Ref = useRef<HTMLDivElement>(null);
  const n3Ref = useRef<HTMLDivElement>(null);
  const resRef = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const activeColor = activeNode === 1 ? "#10b981" : activeNode === 2 ? "#0ea5e9" : activeNode === 3 ? "#8b5cf6" : "#ff4e00";
  const t = activeNode ? COLOR_THEMES[activeNode] : COLOR_THEMES[1];

  const updateLine = () => {
    if (!activeNode || !output || !resRef.current || !containerRef.current) return setLine(null);
    const src = activeNode === 1 ? n1Ref : activeNode === 2 ? n2Ref : n3Ref;
    if (src.current && resRef.current) {
      const sRect = src.current.getBoundingClientRect();
      const tRect = resRef.current.getBoundingClientRect();
      const cRect = containerRef.current.getBoundingClientRect();

      // Calculate coordinates relative to the absolute container
      setLine({
        x1: sRect.left - cRect.left + sRect.width / 2, 
        y1: sRect.top - cRect.top + sRect.height,
        x2: tRect.left - cRect.left + tRect.width / 2, 
        y2: tRect.top - cRect.top
      });
    }
  };

  useEffect(() => {
    let timer: any;
    if (output) timer = setTimeout(updateLine, 150); // Ensure layout is settled
    
    const obs = new ResizeObserver(updateLine);
    if (containerRef.current) obs.observe(containerRef.current);
    
    window.addEventListener("resize", updateLine);
    return () => {
      clearTimeout(timer);
      obs.disconnect();
      window.removeEventListener("resize", updateLine);
    };
  }, [activeNode, output]);

  const toggleGuided = (k: string, v: string) => setGuided(p => p[k] === v ? { ...p, [k]: undefined } as any : { ...p, [k]: v });

  const run = (id: 1 | 2 | 3, payload: any) => {
    setActiveNode(id);
    
    if (id === 1) {
      setNotificationConfig({
        title: '紧急提醒',
        role: 'CTO',
        color: 'red',
        content: '"@here 系统好像挂了？！客户说收到一堆乱码，什么情况，赶快给我查！这是今天的 P0！"'
      });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }

    if (id === 2 && typeof payload.text === 'string' && payload.text.trim().length < 20) {
      setNotificationConfig({
        title: '暴躁 PM 的反馈',
        role: 'PM',
        color: 'orange',
        content: '"你写的这是什么玩意儿？！客户系统挂了你在这儿打哈哈？连个具体恢复时间和排查方案都没有！重新写！至少说清楚你打算降级什么组件、查什么日志！"'
      });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
      return; 
    }

    setOutput(null);
    setLine(null);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOutput(generateMockData(id, payload));
    }, 1800); // Snappier processing
  };

  return (
    <div ref={containerRef} className={cn("flex flex-col min-h-screen bg-transparent text-white/90 font-sans p-4 lg:p-6 gap-6 relative overflow-y-auto custom-scrollbar", activeNode ? t.selection : "selection:bg-[#ff4e00]/30")}>
      <AtmosphericBackground />

      <AnimatePresence>
        {showNotification && (
          <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }} className="fixed top-20 right-6 z-[100] bg-[#161618]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-4 w-80 text-sm">
            <div className="flex items-center gap-3 mb-2 pb-2 border-b border-white/5">
              <div className={cn("w-8 h-8 rounded border flex items-center justify-center font-bold text-[11px]", 
                notificationConfig.color === 'red' ? "bg-red-500/20 text-red-500 border-red-500/30" : "bg-orange-500/20 text-orange-500 border-orange-500/30"
              )}>
                {notificationConfig.role}
              </div>
              <div>
                <div className="text-white/90 font-medium text-[12px]">{notificationConfig.title}</div>
                <div className="text-white/40 text-[10px] font-mono">#事故频道</div>
              </div>
            </div>
            <p className="text-white/70 text-[12px] leading-relaxed">{notificationConfig.content}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <svg className="absolute inset-0 pointer-events-none z-0" style={{ width: '100%', height: '100%' }}>
        <AnimatePresence>
          {line && (
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              d={`M ${line.x1} ${line.y1 + 4} C ${line.x1} ${line.y1 + 100}, ${line.x2} ${line.y2 - 100}, ${line.x2} ${line.y2 - 4}`}
              stroke={activeColor} strokeWidth="1" fill="none" strokeDasharray="4 4"
            />
          )}
        </AnimatePresence>
      </svg>

      {/* Extreme Compact Header */}
      <header className="shrink-0 flex items-center justify-between z-10 px-2 lg:px-4">
        <div className="flex items-center gap-4 text-[13px] font-mono tracking-widest uppercase text-white/50">
          <div className="flex items-center gap-2 font-semibold">
            <span className={cn("w-2 h-2 rounded-full blur-[1px] animate-pulse", activeNode ? t.bg : "bg-white/50")} />
            IQX 实验室 / OmniBrain 入职初体验
          </div>
          <span className="w-[1px] h-3 bg-white/20" />
          <span className="text-white/30 hidden sm:inline-block">Vision-Syn 内部任务工作区</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex -space-x-2">
             <div className="w-6 h-6 rounded-full border border-black bg-blue-500 flex items-center justify-center text-[10px] text-white font-medium z-30 ring-1 ring-white/10">CTO</div>
             <div className="w-6 h-6 rounded-full border border-black bg-red-500 flex items-center justify-center text-[10px] text-white font-medium z-20 ring-1 ring-white/10">PM</div>
             <div className="w-6 h-6 rounded-full border border-black bg-emerald-500 flex items-center justify-center text-[10px] text-white font-medium z-10 ring-1 ring-white/10 relative">
               我
               <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0A0A0B]"></span>
             </div>
          </div>
          <div className="text-[11px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/40 font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            在线：您已加入
          </div>
        </div>
      </header>

      {/* Top Row: Input Modules (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0 z-10">
        
        {/* Node 1 */}
        <div ref={n1Ref} className={cn("group flex flex-col bg-[#0A0A0B]/80 backdrop-blur-xl border rounded-[16px] p-5 transition-all duration-500", activeNode === 1 ? "border-[#10b981]/50 shadow-[0_4px_30px_rgba(16,185,129,0.15)] ring-1 ring-[#10b981]/20 transform -translate-y-1" : "border-white/5 hover:border-[#10b981]/30 hover:shadow-[0_4px_20px_rgba(16,185,129,0.08)] hover:-translate-y-0.5")}>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border transition-colors", activeNode === 1 ? "bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]" : "bg-white/5 border-white/5 text-white/70 group-hover:text-[#10b981]/80")}><MessageSquare size={14} /></div>
            <div>
              <h2 className="text-[13px] font-medium tracking-wide text-white/90 group-hover:text-white transition-colors">Slack: CTO 发来的需求</h2>
              <p className="text-[10px] text-white/40 mt-0.5 font-mono uppercase tracking-widest group-hover:text-white/50 transition-colors">紧急沟通 / 请立即决策</p>
            </div>
          </div>
          <div className="flex-1 space-y-4 mb-5 overflow-y-auto custom-scrollbar pr-2 h-[130px] lg:h-auto opacity-90 group-hover:opacity-100 transition-opacity">
            {GUIDED_DATA.map(s => (
              <div key={s.key}>
                <h5 className="text-[10px] text-white/30 mb-2 font-mono uppercase">{s.title}</h5>
                <div className="flex flex-wrap gap-1.5">
                   {s.options.map(opt => (
                     <button key={opt} onClick={() => toggleGuided(s.key, opt)} className={cn("px-2.5 py-1 text-[11px] rounded-[6px] transition-all duration-200", guided[s.key] === opt ? "bg-[#10b981] text-white font-medium shadow-[0_2px_10px_rgba(16,185,129,0.3)] scale-105" : "bg-white/5 text-white/60 hover:bg-[#10b981]/10 hover:text-[#10b981] border border-white/5 hover:border-[#10b981]/30")}>
                       {opt}
                     </button>
                   ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => run(1, guided)} className={cn("shrink-0 w-full py-2 bg-transparent rounded-lg text-[12px] font-medium transition-all flex items-center justify-center gap-2 border", activeNode === 1 ? "bg-[#10b981]/10 border-[#10b981]/40 text-[#10b981]" : "border-white/10 text-white/70 hover:border-[#10b981]/50 hover:bg-[#10b981]/10 hover:text-[#10b981] shadow-sm")}>
            进入模拟体验 <Play size={12} fill="currentColor" />
          </button>
        </div>

        {/* Node 2 */}
        <div ref={n2Ref} className={cn("group flex flex-col bg-[#0A0A0B]/80 backdrop-blur-xl border rounded-[16px] p-5 transition-all duration-500", activeNode === 2 ? "border-[#0ea5e9]/50 shadow-[0_4px_30px_rgba(14,165,233,0.15)] ring-1 ring-[#0ea5e9]/20 transform -translate-y-1" : "border-white/5 hover:border-[#0ea5e9]/30 hover:shadow-[0_4px_20px_rgba(14,165,233,0.08)] hover:-translate-y-0.5")}>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border transition-colors", activeNode === 2 ? "bg-[#0ea5e9]/10 border-[#0ea5e9]/30 text-[#0ea5e9]" : "bg-white/5 border-white/5 text-white/70 group-hover:text-[#0ea5e9]/80")}><MessageSquare size={14} /></div>
            <div>
              <h2 className="text-[13px] font-medium tracking-wide text-white/90 group-hover:text-white transition-colors">客户投诉截图 / Ticket</h2>
              <p className="text-[10px] text-white/40 mt-0.5 font-mono uppercase tracking-widest group-hover:text-white/50 transition-colors">收到一封愤怒的邮件...</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col mb-5 opacity-90 group-hover:opacity-100 transition-opacity">
            <textarea value={customInput} onChange={e => setCustomInput(e.target.value)} placeholder="“你们的系统又挂了！我刚才的操作数据全丢了，今天如果不能恢复并给出合理解释我马上解约！”...请输入你的第一步响应手段" className="flex-1 w-full bg-black/40 border border-white/5 rounded-lg p-3 text-[12px] leading-relaxed text-white/80 placeholder:text-white/20 focus:outline-none resize-none custom-scrollbar focus:border-[#0ea5e9]/40 focus:ring-1 focus:ring-[#0ea5e9]/20 transition-all shadow-inner" />
          </div>
          <button disabled={!customInput.trim()} onClick={() => run(2, { text: customInput })} className={cn("shrink-0 w-full py-2 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-[12px] font-medium transition-all flex items-center justify-center gap-2 border", activeNode === 2 ? "bg-[#0ea5e9] text-white border-transparent shadow-[0_2px_15px_rgba(14,165,233,0.3)]" : "bg-white/5 border-white/10 text-white/80 hover:border-[#0ea5e9]/50 hover:bg-[#0ea5e9]/10 hover:text-[#0ea5e9]")}>
            开启你的首个项目 <Play size={12} fill="currentColor" />
          </button>
        </div>

        {/* Node 3 */}
        <div ref={n3Ref} className={cn("group flex flex-col bg-[#0A0A0B]/80 backdrop-blur-xl border rounded-[16px] p-5 transition-all duration-500", activeNode === 3 ? "border-[#8b5cf6]/50 shadow-[0_4px_30px_rgba(139,92,246,0.15)] ring-1 ring-[#8b5cf6]/20 transform -translate-y-1" : "border-white/5 hover:border-[#8b5cf6]/30 hover:shadow-[0_4px_20px_rgba(139,92,246,0.08)] hover:-translate-y-0.5")}>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border transition-colors", activeNode === 3 ? "bg-[#8b5cf6]/10 border-[#8b5cf6]/30 text-[#8b5cf6]" : "bg-white/5 border-white/5 text-white/70 group-hover:text-[#8b5cf6]/80")}><FileText size={14} /></div>
            <div>
              <h2 className="text-[13px] font-medium tracking-wide text-white/90 group-hover:text-white transition-colors">Jira: Active Sprint</h2>
              <p className="text-[10px] text-white/40 mt-0.5 font-mono uppercase tracking-widest group-hover:text-white/50 transition-colors">高危隐患与突发事故处理区</p>
            </div>
          </div>
          <div className="flex-1 space-y-2.5 overflow-y-auto custom-scrollbar pr-2 h-[130px] lg:h-auto opacity-90 group-hover:opacity-100 transition-opacity">
            {EXISTING_PROJECTS.map(p => (
              <div key={p.id} onClick={() => run(3, p)} className={cn("cursor-pointer p-3 bg-black/40 border rounded-lg transition-all duration-300", activeNode === 3 ? "border-[#8b5cf6]/20 hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/5" : "border-white/5 hover:border-[#8b5cf6]/30 hover:bg-[#8b5cf6]/5")}>
                <div className="flex justify-between items-start mb-1.5">
                  <h4 className="text-[12px] font-medium text-white/90 truncate mr-2 group-hover:text-white">{p.title}</h4>
                  <div className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded-full border shrink-0 font-medium",
                    p.statusType === 'archived' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                    p.statusType === 'progress' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                    p.statusType === 'planned' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                    "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  )}>
                    {p.status}
                  </div>
                </div>
                <p className="text-[11px] text-white/40 font-light mb-2 line-clamp-1">{p.desc}</p>
                <div className="flex gap-1.5 overflow-x-hidden">
                  {p.tags.map(t => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 bg-white/5 text-white/30 rounded border border-transparent">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Processing State Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-x-0 bottom-0 top-[280px] z-50 flex items-center justify-center backdrop-blur-[2px]">
            <div className="bg-[#0A0A0B]/90 border border-white/10 px-6 py-4 rounded-xl flex items-center gap-4 shadow-2xl">
               <Activity className={cn("w-5 h-5 animate-pulse", t.text)} />
               <span className={cn("text-[12px] font-mono tracking-widest", t.text)}>&gt;&gt; 正在进入模拟工作区...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Area: Output Workspace (Flex-1) */}
      <div className="flex-1 min-h-0 relative z-10 flex flex-col">
        {!output && !isProcessing && (
          <div className="flex-1 flex flex-col items-center justify-center border border-white/5 border-dashed rounded-2xl bg-white/[0.01]">
            <Server size={24} className="text-white/10 mb-4" />
            <p className="text-[12px] text-white/30 tracking-wide font-mono">请在上方选择一个工作项，开始你的模拟体验</p>
          </div>
        )}

        <AnimatePresence>
          {output && !isProcessing && (
            <motion.section ref={resRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
               
               {/* Left Panel: Analysis & Action Plan */}
               <div className="flex-[4] flex flex-col gap-4 min-h-0">
                 {/* Top info card */}
                 <div className="bg-[#0A0A0B]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-[80px] opacity-10 pointer-events-none" style={{ backgroundColor: activeColor }} />
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn("flex items-center gap-2 px-2.5 py-1 rounded border text-[10px] uppercase font-mono tracking-wider", t.bgOpacity10, t.border20, t.text)}>
                        <Zap size={10} fill="currentColor" /> 您的专属方案已生成
                      </div>
                      <button onClick={() => window.dispatchEvent(new CustomEvent('run-sim'))} className="px-3 py-1.5 bg-white text-black hover:bg-white/90 rounded text-[11px] font-medium transition-all active:scale-95 flex items-center gap-1.5">
                        <Play size={10} fill="currentColor"/> 看看它是怎么运转的
                      </button>
                    </div>
                    <h3 className="text-xl font-medium tracking-tight mb-3 text-white/95">{output.title}</h3>
                    <p className="text-[12px] leading-relaxed text-white/60 mb-5">{output.scene}</p>

                    {/* Mission Context */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3 relative z-10">
                      <h4 className={cn("text-[13px] font-mono flex items-center gap-2", t.text80)}><Target size={14} /> 任务简报 / Mission Brief</h4>
                      <div className="text-[12px] text-white/80 whitespace-pre-wrap leading-[1.8] font-light">
                        <TypewriterText text={output.mission_brief} delay={5} />
                      </div>
                    </div>
                 </div>

                 {/* Summary & Interview split */}
                 <div className="flex-1 min-h-0 grid grid-cols-1 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Mentor Feedback */}
                    <div className="bg-[#ff4e00]/5 border border-[#ff4e00]/20 rounded-2xl p-4 group flex flex-col shrink-0 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4e00] rounded-full filter blur-[50px] opacity-10 pointer-events-none" />
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#ff4e00]/20 relative z-10">
                        <h4 className="text-[12px] font-mono flex items-center gap-2 text-[#ff4e00]/90"><MessageSquare size={14} /> AI Mentor 反馈</h4>
                      </div>
                      <div className="text-[12px] text-[#ff4e00]/80 whitespace-pre-wrap leading-relaxed font-medium italic relative z-10 min-h-[40px]">
                        <TypewriterText text={output.mentor_feedback} delay={10} />
                      </div>
                    </div>
                 
                    <div className="bg-black/60 border border-white/5 rounded-2xl p-5 group flex flex-col shrink-0">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                        <h4 className={cn("text-[12px] font-mono flex items-center gap-2", t.text80)}><FileText size={14} /> Resume Bullet (STAR 结构化)</h4>
                        <CopyBtn text={output.resume} t={t} />
                      </div>
                      <div className="text-[13px] text-white/80 whitespace-pre-wrap leading-[1.8] font-light font-mono min-h-[100px]">
                        <TypewriterText text={output.resume} delay={15} />
                      </div>
                    </div>
                    
                    <div className="bg-black/60 border border-white/5 rounded-2xl p-5 group flex flex-col shrink-0">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                        <h4 className={cn("text-[12px] font-mono flex items-center gap-2", t.text80)}><Briefcase size={14} /> LinkedIn 收获与分享</h4>
                        <CopyBtn text={output.linkedin} t={t} />
                      </div>
                      <div className="text-[13px] text-white/80 whitespace-pre-wrap leading-[1.8] font-light min-h-[80px]">
                        <TypewriterText text={output.linkedin} delay={20} />
                      </div>
                    </div>
                 </div>
               </div>

               {/* Right Panel: Architecture & Terminal */}
               <div className="flex-[3] flex flex-col gap-4 min-h-0">
                  <div className="bg-[#0A0A0B]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col shrink-0">
                    <h5 className="text-[12px] font-mono text-white/60 uppercase mb-4 flex items-center gap-2"><Layers size={14}/> 项目落地流程指导</h5>
                    <ul className="space-y-3">
                      {output.process.map((step: string, i: number) => (
                        <li key={i} className="flex gap-3 text-[12px] text-white/70 leading-relaxed items-start">
                           <span className={cn("font-mono text-[10px] mt-0.5 px-1.5 rounded-sm bg-white/5", t.text80)}>{i+1}</span> 
                           <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex-1 min-h-[150px]">
                    <TerminalSimulation activeNode={activeNode} />
                  </div>
               </div>

            </motion.section>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

