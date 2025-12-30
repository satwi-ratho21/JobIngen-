import React, { useEffect, useState, useRef } from 'react';
import { X, Send, Activity } from 'lucide-react';

// Simple rule-based empathetic responder and helpers
const NEGATIVE_KEYWORDS = ['overwhelmed','stressed','stress','anxious','anxiety','panic','burnout','depressed','sad','lonely','tired','exhausted','frustrated','angry','stuck','blocked'];
const TASK_KEYWORDS = ['assignment','lab','deadline','project','exam','task','homework','submission','pset'];
const POSITIVE_KEYWORDS = ['ok','fine','good','better','relieved','helped','thanks','thank you'];

const LOCAL_STORAGE_KEY = 'edu_bridge_peer_chat_v1';

function analyzeMessage(text: string) {
  const t = text.toLowerCase();
  const negative = NEGATIVE_KEYWORDS.some(k => t.includes(k));
  const task = TASK_KEYWORDS.some(k => t.includes(k));
  const positive = POSITIVE_KEYWORDS.some(k => t.includes(k));
  // simple score: negative lowers, positive raises
  let score = 0;
  if (negative) score -= 2;
  if (task) score -= 1;
  if (positive) score += 1;
  return { negative, task, positive, score };
}

const defaultPeerOpening = "Hey — I’m Alex. I’m here for you like a friend — you can tell me anything and I’ll listen without judgment. What’s on your mind right now?";

const PeerChat: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ from: 'peer' | 'user'; text: string }[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [{ from: 'peer', text: defaultPeerOpening }];
  });
  const [input, setInput] = useState('');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathStep, setBreathStep] = useState<number>(0); // 0 inhale,1 hold,2 exhale
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    // persist
    try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages)); } catch (e) {}
  }, [messages]);

  useEffect(() => {
    let timer: number | undefined;
    if (isBreathing) {
      // cycle inhale(4s) -> hold(4s) -> exhale(6s) -> repeat for 3 cycles
      let cycle = 0;
      let steps = [4,4,6];
      setBreathStep(0);
      timer = window.setInterval(() => {
        setBreathStep(s => {
          const next = (s + 1) % 3;
          if (next === 0) cycle += 1;
          if (cycle >= 3) { setIsBreathing(false); clearInterval(timer); }
          return next;
        });
      }, 4000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isBreathing]);

  const pushPeer = (text: string) => setMessages(prev => [...prev, { from: 'peer', text }]);

  const send = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');

    // Basic processing and rule-based reply
    const analysis = analyzeMessage(text);

    setTimeout(() => {
      if (analysis.negative) {
      pushPeer("I’m so sorry you’re going through this — that sounds really heavy. I’m right here with you; we can breathe together, talk it through, or just sit with it quietly if you want.");
      pushPeer("You are not alone in this — it’s okay to feel what you’re feeling. If you'd like, I can help make a tiny, gentle plan for the next 15 minutes, or we can try another calming exercise together.");
      }

      if (analysis.task) {
        pushPeer("Sounds like a task or deadline is stressing you out. Want to try breaking it into smaller, manageable steps together?");
        pushPeer("If you'd like, tell me the main blocker you’re facing — I can help brainstorm next steps.");
        return;
      }

      if (analysis.positive) {
        pushPeer("I’m glad to hear you’re feeling a bit better. Remember small steps can add up — anything you want to celebrate today?");
        return;
      }

      // Default curious response
      const responses = [
        "Thank you for telling me — that takes courage. Tell me more when you’re ready; I’m here and listening.",
        "I’m with you. Which part feels the heaviest right now? We can take one tiny step together.",
        "You’re not alone in this. Would it help if I suggested a gentle next step, or if I just listened a bit more?"
      ];
      pushPeer(responses[Math.floor(Math.random() * responses.length)]);
    }, 600);
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setMessages(prev => [...prev, { from: 'peer', text: 'Let’s do a short breathing exercise together — breathe in for 4s, hold 4s, out 6s. I’ll guide you for three rounds.' }]);
  };

  const suggestMentor = () => {
    setMessages(prev => [...prev, { from: 'peer', text: 'I can help request a mentor check-in if you’d like. Would you like me to do that? (You can keep it anonymous)' }]);
  };

  const escalateIfNeeded = () => {
    // If multiple negative messages in a row suggest escalation
    const last = messages.slice(-3).filter(m => m.from === 'user').map(m => analyzeMessage(m.text).negative);
    if (last.length && last.every(Boolean)) {
      pushPeer("I’m concerned for you — I can help request a mentor check-in or share emergency resources if you feel unsafe. Would you like me to request a mentor call?");
    } else {
      suggestMentor();
    }
  };

  return (
    <div className="fixed right-6 bottom-6 w-88 md:w-96 bg-slate-900 rounded-xl border border-slate-800 shadow-lg z-50 overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-violet-600 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-violet-300 flex items-center justify-center font-bold text-slate-900">A</div>
          <div>
            <div className="text-sm font-semibold">Alex (Peer Buddy)</div>
            <div className="text-xs opacity-80">Online • CSE Senior</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={startBreathing} title="Breathing exercise" className="p-1"><Activity className="h-4 w-4 text-white"/></button>
          <button onClick={onClose} className="p-1"><X className="h-4 w-4 text-white" /></button>
        </div>
      </div>

      <div ref={listRef} className="p-3 h-72 overflow-y-auto space-y-3 bg-gradient-to-b from-slate-900 to-slate-950">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] ${m.from === 'peer' ? 'bg-slate-800 text-slate-200 rounded-md px-3 py-2 self-start' : 'bg-indigo-600 text-white rounded-md px-3 py-2 self-end ml-auto'}`}>
            {m.text}
          </div>
        ))}

        {isBreathing && (
          <div className="w-full flex flex-col items-center justify-center mt-2">
            <div className="text-sm text-slate-300 mb-2">Breathing — {breathStep === 0 ? 'Inhale (4s)' : breathStep === 1 ? 'Hold (4s)' : 'Exhale (6s)'}</div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-700 to-violet-500 flex items-center justify-center text-white font-bold">{breathStep === 0 ? 'In' : breathStep === 1 ? 'Hold' : 'Out'}</div>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="Type your message..."
          className="flex-1 bg-slate-800 text-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none"
        />
        <button onClick={send} className="bg-violet-600 p-2 rounded-md"><Send className="h-4 w-4 text-white"/></button>
      </div>

      <div className="p-3 flex gap-2">
        <button onClick={() => { startBreathing(); }} className="flex-1 text-xs px-3 py-2 rounded-md bg-slate-800 text-slate-200">Try breathing exercise</button>
        <button onClick={() => { setMessages(prev => [...prev, { from: 'user', text: 'I need help breaking this down' }]); setTimeout(() => pushPeer('Okay — let’s break it down: What is the smallest step you can do in the next 15 minutes?'), 400); }} className="flex-1 text-xs px-3 py-2 rounded-md bg-slate-800 text-slate-200">Break task into steps</button>
        <button onClick={() => { pushPeer('You’re not alone — I’m here with you. Remember small steps are okay, and it’s okay to take a break. If you want, tell me one small thing we can try right now.'); }} className="flex-1 text-xs px-3 py-2 rounded-md bg-rose-600 text-white">Comfort me</button>
      </div>

      <div className="p-3 text-xs text-slate-400">Note: This chat is supportive and not a substitute for professional help. For emergencies, contact local emergency services.</div>
    </div>
  );
};

export default PeerChat;
