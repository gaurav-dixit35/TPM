import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Activity, ArrowRight, Bot, Mic, MicOff, Send, Volume2, X } from 'lucide-react';
import { config } from './config';

type Patient = {
  id: number;
  name: string;
  bed: string;
  temp?: number;
  visited?: boolean;
  fever?: boolean;
  ready?: boolean;
  pendingDischarge?: boolean;
  outcome?: 'cured' | 'early' | 'deceased';
};
type Role = 'Nurse' | 'Doctor' | 'Front Desk' | 'Centre Lead';
type Message = { from: 'assistant' | 'you'; text: string };
type RecognitionResult = { transcript: string };
type RecognitionEvent = { results: ArrayLike<ArrayLike<RecognitionResult>> };
type Recognition = {
  lang: string;
  interimResults: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type RecognitionConstructor = new () => Recognition;
type Props = { people: Patient[]; role: Role; initialQuestion?: string | null; onQuestionUsed?: () => void; onOpenQueue: (role: Role) => void };

const suggestions = ['What needs attention?', 'Who needs a temperature?', 'Who is ready for discharge?', 'How full is the centre?'];

function answerFor(question: string, people: Patient[], role: Role) {
  const q = question.trim().toLowerCase();
  const active = people.filter((patient) => patient.bed !== '—');
  const dueTemp = active.filter((patient) => patient.temp === undefined);
  const dueVisit = active.filter((patient) => !patient.visited);
  const discharge = active.filter((patient) => patient.pendingDischarge || patient.ready);
  const fever = active.filter((patient) => patient.fever);
  const closed = people.filter((patient) => patient.outcome !== undefined);
  const deaths = closed.filter((patient) => patient.outcome === 'deceased').length;
  const occupancy = Math.round(active.length / config.totalBeds * 100);
  const names = (patients: Patient[]) => patients.slice(0, 5).map((patient) => `${patient.name} (${patient.bed})`).join(', ');

  if (/what is sajag|about sajag|main goal|objective|purpose|what does (sajag|this website|this app) do|what is (this website|this app)/.test(q)) {
    return 'Sajag is a care-coordination prototype for a 74-bed quarantine centre. Its main goal is to make daily temperatures, doctor visits, verdicts, and discharge handoffs visible to the team so fewer steps are missed and beds can be released promptly after the approved process.';
  }
  if (/workflow|patient flow|care relay|handoff process|daily relay/.test(q)) {
    return 'The daily relay is: Front Desk admits and assigns a bed → Nurse records today’s temperature → Doctor reviews and visits → Doctor records notes and a verdict → Front Desk processes any discharge handoff and releases the bed. Each queue shows the next owner.';
  }
  if (/what can each role|roles|who can do|responsibilit|permissions|who is sajag for|who uses|target users/.test(q)) {
    return 'Nurse: records daily temperatures. Doctor: reviews readings, records visits and verdicts, and recommends discharge. Front Desk: admits patients and processes discharge handoffs. Centre Lead: reviews operational and illustrative outcome data. The role picker is only a demo control, not authentication.';
  }
  if (/how (do i|to) (record|enter|save)|record a temperature|temperature workflow/.test(q)) {
    return 'As Nurse, open the Nurse round, choose a patient waiting for a temperature, enter the measured value in °C, and review any unusual-value confirmation before saving. The prototype allows one official reading per patient per care day. Saving makes the patient available in the Doctor queue.';
  }
  if (/admi(ssion|t)|assign a bed/.test(q)) {
    return 'As Front Desk, open the 74-bed floor plan, select a free bed, enter the fictional demo patient’s details, then assign the bed. The form checks capacity and duplicate names. This is a browser demo, not a real registration system.';
  }
  if (/discharg(e|ing)|release a bed/.test(q)) {
    return 'The Doctor records a verdict and can recommend discharge when the configured fever-free rule is met. That creates a Front Desk handoff. Front Desk reviews and processes it; only then does Sajag mark the patient discharged and free the bed.';
  }
  if (/data stored|where.*data|privacy|backend|database|vercel|deploy/.test(q)) {
    return 'Sajag is a Vercel-ready static React frontend. Demo records and settings are stored in this browser only; there is no backend, shared database, login, or server authorization. Use fictional data only. The Guide answers from fixed rules and current browser records, not a cloud AI model.';
  }
  if (/what can you|what can sajag guide|what questions|help me/.test(q)) {
    return 'I can explain Sajag’s goal, role responsibilities, daily workflow, temperature entry, admission, discharge handoffs, the illustrative recovery rule, demo storage, and current shift counts. I cannot diagnose, choose treatment, or determine clinical discharge.';
  }
  if (/features|what does .* include|what is included/.test(q)) {
    return 'The prototype includes role-owned work queues, temperature capture, doctor visits and verdicts, discharge handoffs, bed occupancy and floor plan, activity history, demo scenarios, outcome illustrations, an on-screen tour, this Guidebook, and the floating Sajag Guide.';
  }
  if (/3[\s-]?day|three day|cure|cured|recovery rule|fever.free rule|fever free streak/.test(q)) {
    return `The prototype marks a patient ready after ${config.curedStreakDays} consecutive days below ${config.feverThresholdC.toFixed(1)}°C. A missing reading or fever breaks the streak. This is a demo rule for review; clinical leadership must confirm it before real use.`;
  }
  if (/mortality|death|benchmark|15%|success rate|outcome/.test(q)) {
    return closed.length
      ? `In this browser’s demo records, ${deaths} of ${closed.length} closed cases are marked deceased (${(deaths / closed.length * 100).toFixed(1)}%). The displayed benchmark is ${config.mortalityBenchmarkPct}%. This is a simulated cohort, not a validated quality measure.`
      : 'There are no closed cases in the current records, so a mortality rate cannot be calculated yet.';
  }
  if (/occup|bed|capacity|full|available/.test(q)) {
    return `The demo ward has ${active.length} of ${config.totalBeds} beds occupied (${occupancy}%). ${config.totalBeds - active.length} ${config.totalBeds - active.length === 1 ? 'bed is' : 'beds are'} available.`;
  }
  if (/temperature|measure|reading|nurse/.test(q)) {
    return dueTemp.length ? `${dueTemp.length} active ${dueTemp.length === 1 ? 'patient is' : 'patients are'} missing today’s temperature: ${names(dueTemp)}${dueTemp.length > 5 ? `, and ${dueTemp.length - 5} more` : ''}.` : 'Every active patient has a temperature recorded for today in this demo.';
  }
  if (/discharg|ready|release|handoff/.test(q)) {
    return discharge.length ? `${discharge.length} active ${discharge.length === 1 ? 'patient is' : 'patients are'} marked ready or awaiting discharge: ${names(discharge)}${discharge.length > 5 ? `, and ${discharge.length - 5} more` : ''}. Front Desk releases the bed after processing the handoff.` : 'No active patient is currently marked ready or awaiting discharge.';
  }
  if (/visit|doctor|review/.test(q)) {
    return dueVisit.length ? `${dueVisit.length} active ${dueVisit.length === 1 ? 'patient still needs' : 'patients still need'} a doctor visit: ${names(dueVisit)}${dueVisit.length > 5 ? `, and ${dueVisit.length - 5} more` : ''}. Routine visits follow the nurse’s temperature entry.` : 'Every active patient has a doctor visit marked complete today in this demo.';
  }
  if (/attention|urgent|fever|hot/.test(q)) {
    const parts = [`${fever.length} active patient${fever.length === 1 ? '' : 's'} flagged with fever${fever.length ? `: ${names(fever)}` : ''}`];
    parts.push(`${dueTemp.length} temperature${dueTemp.length === 1 ? '' : 's'} due`);
    parts.push(`${dueVisit.length} doctor visit${dueVisit.length === 1 ? '' : 's'} due`);
    parts.push(`${discharge.length} discharge handoff${discharge.length === 1 ? '' : 's'} ready`);
    return `Shift snapshot: ${parts.join('; ')}. These counts come from the current browser demo records.`;
  }

  const match = active.find((patient) => q.includes(patient.name.toLowerCase()) || q.includes(patient.bed.toLowerCase()));
  if (match) {
    const details = [match.bed, match.temp === undefined ? 'temperature pending' : `${match.temp.toFixed(1)}°C recorded`, match.visited ? 'doctor visit complete' : 'doctor visit pending', match.fever ? 'fever flag' : '', match.pendingDischarge ? 'discharge handoff pending' : match.ready ? 'marked ready for discharge' : ''].filter(Boolean);
    return `${match.name}: ${details.join(' · ')}. This is a summary of the current demo record.`;
  }

  const nextStep = role === 'Nurse'
    ? `${dueTemp.length} temperature${dueTemp.length === 1 ? '' : 's'} due${dueTemp.length ? `, starting with ${names(dueTemp.slice(0, 1))}` : ''}`
    : role === 'Doctor'
      ? `${dueVisit.length} doctor visit${dueVisit.length === 1 ? '' : 's'} due${dueVisit.length ? `, starting with ${names(dueVisit.slice(0, 1))}` : ''}`
      : role === 'Front Desk'
        ? `${discharge.length} discharge handoff${discharge.length === 1 ? '' : 's'} ready${discharge.length ? `, starting with ${names(discharge.slice(0, 1))}` : ''}`
        : `${fever.length} fever flag${fever.length === 1 ? '' : 's'} and ${dueTemp.length + dueVisit.length} care task${dueTemp.length + dueVisit.length === 1 ? '' : 's'} due`;
  return `I can summarize this demo’s queues, temperature coverage, visits, discharge handoffs, bed occupancy, and the illustrative outcome benchmark. For your current ${role} view, ${nextStep}. Try one of the suggested questions.`;
}

export function SajagAssistant({ people, role, initialQuestion, onQuestionUsed, onOpenQueue }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const recognition = useRef<Recognition | null>(null);
  const feed = useRef<HTMLDivElement>(null);
  const firstName = useMemo(() => people.filter((patient) => patient.bed !== '—' && patient.temp === undefined).slice(0, 1).map((patient) => patient.name), [people]);
  const activeCount = people.filter((patient) => patient.bed !== '—').length;

  useEffect(() => {
    const speechWindow = window as Window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
    setSpeechAvailable(Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition));
    return () => {
      recognition.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => { if (open && feed.current) feed.current.scrollTop = feed.current.scrollHeight; }, [messages, open]);

  useEffect(() => {
    if (!initialQuestion) return;
    setOpen(true);
    setMessages((current) => [...current, { from: 'you', text: initialQuestion }, { from: 'assistant', text: answerFor(initialQuestion, people, role) }]);
    onQuestionUsed?.();
  }, [initialQuestion]);

  const ask = (question: string) => {
    const clean = question.trim();
    if (!clean) return;
    setMessages((current) => [...current, { from: 'you', text: clean }, { from: 'assistant', text: answerFor(clean, people, role) }]);
    setDraft('');
  };

  const toggleListening = () => {
    if (listening) { recognition.current?.stop(); return; }
    const speechWindow = window as Window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
    const RecognitionAPI = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!RecognitionAPI) return;
    const instance = new RecognitionAPI();
    recognition.current = instance;
    instance.lang = navigator.language || 'en-IN';
    instance.interimResults = false;
    instance.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      setDraft(transcript);
      setListening(false);
    };
    instance.onerror = () => setListening(false);
    instance.onend = () => setListening(false);
    try { instance.start(); setListening(true); } catch { setListening(false); }
  };

  const readAloud = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  const currentNextStep = role === 'Nurse' ? 'Nurse round' : role === 'Doctor' ? 'Doctor round' : role === 'Front Desk' ? 'Front Desk handoffs' : 'Centre overview';

  return <>
    {open && <section className="assistant-panel" aria-label="Sajag assistant" aria-live="polite">
      <header className="assistant-header"><span className="assistant-mark"><Bot size={17}/></span><div><b>Sajag Guide</b><small>Local demo data · no cloud AI</small></div><button className="assistant-close" aria-label="Close Sajag Guide" onClick={() => { recognition.current?.stop(); setOpen(false); }}><X size={17}/></button></header>
      <div className="assistant-brief"><span className="assistant-online"/> Shift brief <span>{activeCount}/74 beds occupied</span></div>
      <div className="assistant-messages" ref={feed} aria-live="polite">
        {!messages.length && <div className="assistant-welcome"><b>Hi, I’m Sajag Guide.</b><p>I can explain the current demo queues and help you find the next handoff. I don’t diagnose or recommend treatment.</p>{firstName.length>0&&<small>First temperature due: {firstName[0]}</small>}</div>}
        {messages.map((message, index) => <div className={`assistant-message ${message.from}`} key={`${index}-${message.from}`}><span>{message.text}</span>{message.from==='assistant'&&<button aria-label="Read response aloud" title="Read response aloud" onClick={()=>readAloud(message.text)}><Volume2 size={14}/></button>}</div>)}
      </div>
      {!messages.length&&<div className="assistant-suggestions">{suggestions.map((suggestion)=><button key={suggestion} onClick={()=>ask(suggestion)}>{suggestion}<ArrowRight size={12}/></button>)}</div>}
      <form className="assistant-compose" onSubmit={(event:FormEvent)=>{event.preventDefault();ask(draft);}}>
        <input value={draft} onChange={(event)=>setDraft(event.target.value)} placeholder="Ask about this shift…" aria-label="Ask Sajag Guide" />
        {speechAvailable&&<button type="button" className={listening?'assistant-mic listening':''} aria-label={listening?'Stop voice input':'Use voice input'} title="Voice recognition uses your browser’s speech service." onClick={toggleListening}>{listening?<MicOff size={17}/>:<Mic size={17}/>}</button>}
        <button type="submit" className="assistant-send" aria-label="Send question" disabled={!draft.trim()}><Send size={16}/></button>
      </form>
      <footer className="assistant-footer">Answers use this browser’s demo records and fixed app rules. {speechAvailable?'Voice may use your browser’s speech service; review the transcript before sending. Chat is not saved to browser storage.':'Voice input is unavailable here. Chat is not saved to browser storage.'}</footer>
      <button className="assistant-next" onClick={()=>onOpenQueue(role)}><Activity size={14}/> Open {currentNextStep}<ArrowRight size={14}/></button>
    </section>}
    <button className={`assistant-fab ${open?'assistant-fab-open':''}`} onClick={()=>setOpen((value)=>!value)} aria-label={open?'Close Sajag Guide':'Open Sajag Guide'} aria-expanded={open}>
      {open?<X size={20}/>:<><span className="assistant-fab-orbit"><Bot size={21}/></span><span>Ask Sajag</span></>}
    </button>
  </>;
}
