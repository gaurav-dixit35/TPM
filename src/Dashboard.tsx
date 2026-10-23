import { motion, useReducedMotion } from 'framer-motion';
import { Activity, ArrowDownRight, ArrowRight, BedDouble, CalendarDays, Check, ChevronRight, CircleAlert, ClipboardCheck, HeartPulse, Stethoscope, Thermometer, Users } from 'lucide-react';
import { config } from './config';

type DashboardPatient = {
  id: number;
  name: string;
  bed: string;
  temp?: number;
  fever?: boolean;
  visited?: boolean;
  ready?: boolean;
  pendingDischarge?: boolean;
  outcome?: 'cured' | 'early' | 'deceased';
  readings?: { day: string; value: number; at: string; by: string }[];
  visits?: { day?: string; at: string; notes: string; treatment: string; verdict: string }[];
};

type Props = {
  people: DashboardPatient[];
  now: Date;
  clockMode: 'live' | 'demo';
  onOpen: (role: 'Nurse' | 'Doctor' | 'Front Desk' | 'Centre Lead', filter?: string) => void;
};

const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const shortDay = (date: Date) => new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(date);

function TrendChart({ people, now, reduce }: { people: DashboardPatient[]; now: Date; reduce: boolean }) {
  const points = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - index));
    const key = dateKey(date);
    const readings = people.flatMap((person) => person.readings || []).filter((reading) => reading.day === key);
    const visits = people.flatMap((person) => person.visits || []).filter((visit) => visit.day === key);
    return { key, label: shortDay(date), readings: readings.length, fever: readings.filter((reading) => reading.value >= config.feverThresholdC).length, visits: visits.length };
  });
  const max = Math.max(4, ...points.map((point) => Math.max(point.readings, point.visits)));
  const y = (value: number) => 142 - (value / max) * 112;
  const x = (index: number) => 46 + index * 84;
  const path = (field: 'readings' | 'visits') => points.map((point, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(point[field])}`).join(' ');
  const area = `${path('readings')} L ${x(6)} 148 L ${x(0)} 148 Z`;

  return <div className="dash-chart-wrap">
    <svg className="dash-trend-chart" viewBox="0 0 596 192" role="img" aria-labelledby="trend-chart-title trend-chart-desc" preserveAspectRatio="none">
      <title id="trend-chart-title">Seven-day care activity</title>
      <desc id="trend-chart-desc">Temperature readings, doctor visits, and fever readings by care day for the records in this browser.</desc>
      {[0, 1, 2, 3].map((line) => <g key={line}><line x1="38" x2="560" y1={30 + line * 37} y2={30 + line * 37} className="dash-grid-line"/><text x="25" y={34 + line * 37} className="dash-axis-label">{Math.round(max * (3 - line) / 3)}</text></g>)}
      <motion.path d={area} className="dash-area" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .65 }}/>
      <motion.path d={path('readings')} className="dash-line dash-line-temp" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .8, ease: 'easeOut' }}/>
      <motion.path d={path('visits')} className="dash-line dash-line-visit" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .8, delay: .1, ease: 'easeOut' }}/>
      {points.map((point, index) => <g key={point.key}>
        <circle cx={x(index)} cy={y(point.readings)} r="3.4" className="dash-point dash-point-temp"><title>{point.key}: {point.readings} temperature readings, {point.fever} fever flags</title></circle>
        <circle cx={x(index)} cy={y(point.visits)} r="3.4" className="dash-point dash-point-visit"><title>{point.key}: {point.visits} doctor visits</title></circle>
        <text x={x(index)} y="174" textAnchor="middle" className="dash-day-label">{point.label}</text>
      </g>)}
    </svg>
    <div className="dash-chart-legend"><span><i className="legend-reading"/>Temperature readings</span><span><i className="legend-visits"/>Doctor visits</span><span><i className="legend-fever"/>Fever readings shown in detail on hover</span></div>
  </div>;
}

export function Dashboard({ people, now, clockMode, onOpen }: Props) {
  const reduce = useReducedMotion();
  const active = people.filter((person) => person.bed !== '—');
  const occupied = active.length;
  const measured = active.filter((person) => person.temp !== undefined).length;
  const visited = active.filter((person) => person.visited).length;
  const fever = active.filter((person) => person.fever).length;
  const dueTemps = active.filter((person) => person.temp === undefined).length;
  const dueVisits = active.filter((person) => person.temp !== undefined && !person.visited).length;
  const eligible = active.filter((person) => person.ready).length;
  const handoffs = active.filter((person) => person.pendingDischarge).length;
  const closed = people.filter((person) => person.outcome !== undefined);
  const deaths = closed.filter((person) => person.outcome === 'deceased').length;
  const mortality = closed.length ? deaths / closed.length * 100 : 0;
  const survival = 100 - mortality;
  const occupancyPct = Math.round(occupied / 74 * 100);
  const tempPct = occupied ? Math.round(measured / occupied * 100) : 0;
  const visitPct = occupied ? Math.round(visited / occupied * 100) : 0;
  const dayLabel = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
  const metrics = [
    { label: 'Beds occupied', value: `${occupied}`, suffix: '/ 74', detail: `${occupancyPct}% of ward capacity`, icon: BedDouble, tone: 'tide', progress: occupancyPct },
    { label: 'Temperatures due', value: `${dueTemps}`, suffix: 'patients', detail: `${tempPct}% measured today`, icon: Thermometer, tone: 'plum', progress: tempPct },
    { label: 'Doctor visits due', value: `${dueVisits}`, suffix: 'patients', detail: `${visitPct}% visited today`, icon: Stethoscope, tone: 'ochre', progress: visitPct },
    { label: 'Front Desk handoffs', value: `${handoffs}`, suffix: 'to process', detail: `${eligible} currently eligible`, icon: ClipboardCheck, tone: 'sage', progress: occupied ? Math.round(handoffs / occupied * 100) : 0 },
  ];
  const openRoleQueue = (role: Props['onOpen'] extends (role: infer R, filter?: string) => void ? R : never, filter?: string) => onOpen(role, filter);

  return <div className="dashboard-page">
    <motion.section className="dash-hero" data-tour="dashboard" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
      <div className="dash-hero-copy"><span className="section-kicker"><Activity size={13}/> CENTRE OPERATIONS · BROWSER DEMO</span><h2>Ward intelligence<span>.</span></h2><p>One view of today’s care, capacity, and the work waiting across the relay.</p></div>
      <div className="dash-date"><CalendarDays size={16}/><span><small>CARE DAY</small><b>{dayLabel}</b></span><i className={`dash-live-dot ${clockMode === 'demo' ? 'dash-demo-dot' : ''}`}/><small>{clockMode === 'live' ? 'LIVE' : 'SIMULATED'}</small></div>
    </motion.section>

    <section className="dash-metrics" aria-label="Centre key indicators">
      {metrics.map((metric, index) => { const Icon = metric.icon; return <motion.article className={`dash-metric dash-${metric.tone}`} key={metric.label} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .32, delay: index * .06 }}>
        <div className="dash-metric-top"><span className="dash-metric-icon"><Icon size={17}/></span><span className="dash-metric-caption">TODAY</span></div>
        <div className="dash-metric-value">{metric.value}<small>{metric.suffix}</small></div><h3>{metric.label}</h3><p>{metric.detail}</p>
        <div className="dash-meter" role="progressbar" aria-label={metric.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={metric.progress}><motion.i initial={reduce ? false : { width: 0 }} animate={{ width: `${metric.progress}%` }} transition={{ duration: .7, delay: .15 + index * .06 }}/></div>
      </motion.article>; })}
    </section>

    <div className="dash-main-grid">
      <section className="dash-panel dash-trend-panel">
        <div className="dash-panel-heading"><div><span className="section-kicker">SEVEN-DAY PULSE</span><h3>Care activity over time</h3><p>Daily records already in this browser’s demo data.</p></div><span className="dash-panel-chip">7 DAYS</span></div>
        <TrendChart people={people} now={now} reduce={!!reduce}/>
      </section>

      <section className="dash-panel dash-relay-panel">
        <div className="dash-panel-heading"><div><span className="section-kicker">TODAY’S RELAY</span><h3>Where work is waiting</h3><p>Active patients · {occupied} total</p></div><span className="dash-relay-total"><Users size={15}/>{occupied}</span></div>
        <div className="dash-relay-list">
          <button onClick={() => openRoleQueue('Nurse', 'Waiting for nurse')}><span className="dash-relay-icon relay-tide"><Thermometer size={16}/></span><span><b>Temperature due</b><small>Nurse · daily round</small></span><strong>{dueTemps}</strong><ChevronRight size={15}/></button>
          <button onClick={() => openRoleQueue('Doctor', 'Doctor visit due')}><span className="dash-relay-icon relay-plum"><Stethoscope size={16}/></span><span><b>Doctor review due</b><small>Measured, not yet visited</small></span><strong>{dueVisits}</strong><ChevronRight size={15}/></button>
          <button onClick={() => openRoleQueue('Front Desk')}><span className="dash-relay-icon relay-ochre"><ClipboardCheck size={16}/></span><span><b>Bed handoff to process</b><small>Doctor verdict · Front Desk</small></span><strong>{handoffs}</strong><ChevronRight size={15}/></button>
          <button onClick={() => openRoleQueue('Nurse', 'Fever today')}><span className="dash-relay-icon relay-fever"><CircleAlert size={16}/></span><span><b>Fever flags</b><small>Needs clinical attention</small></span><strong>{fever}</strong><ChevronRight size={15}/></button>
        </div>
      </section>

      <section className="dash-panel dash-coverage-panel" data-tour="coverage">
        <div className="dash-panel-heading"><div><span className="section-kicker">SHIFT COMPLETION</span><h3>Daily coverage</h3><p>Share of occupied beds with today’s action complete.</p></div><span className="dash-coverage-icon"><Check size={17}/></span></div>
        <div className="dash-coverage-row"><div><span>Temperature round</span><b>{measured}<small> / {occupied}</small></b></div><div className="dash-coverage-track"><motion.i className="coverage-temp" initial={reduce ? false : { width: 0 }} animate={{ width: `${tempPct}%` }} transition={{ duration: .75 }}/></div><small>{tempPct}%</small></div>
        <div className="dash-coverage-row"><div><span>Doctor visits</span><b>{visited}<small> / {occupied}</small></b></div><div className="dash-coverage-track"><motion.i className="coverage-visit" initial={reduce ? false : { width: 0 }} animate={{ width: `${visitPct}%` }} transition={{ duration: .75, delay: .1 }}/></div><small>{visitPct}%</small></div>
        <div className="dash-coverage-summary"><span><i className="coverage-dot-temp"/>Temperature</span><span><i className="coverage-dot-visit"/>Doctor visit</span><small>Counts refresh as local demo actions are recorded.</small></div>
      </section>

      <section className="dash-panel dash-outcome-panel" data-tour="outcomes">
        <div className="dash-panel-heading"><div><span className="section-kicker">CLOSED DEMO CASES</span><h3>Outcome monitor</h3><p>Illustrative cohort · not facility reporting</p></div><span className="dash-outcome-icon"><HeartPulse size={17}/></span></div>
        <div className="dash-outcome-stats"><div><span>Survival</span><b>{closed.length >= config.minSampleSize ? `${survival.toFixed(1)}%` : '—'}</b></div><div><span>Mortality</span><b className={closed.length >= config.minSampleSize && mortality > 15 ? 'outcome-over' : ''}>{closed.length >= config.minSampleSize ? `${mortality.toFixed(1)}%` : '—'}</b></div><div><span>Closed cases</span><b>{closed.length}</b></div></div>
        <div className="dash-benchmark"><div className="dash-benchmark-track"><motion.i initial={reduce ? false : { width: 0 }} animate={{ width: `${Math.min(survival, 100)}%` }} transition={{ duration: .8 }}/><span/></div><div><span>85% survival reference</span><span>15% mortality reference</span></div></div>
        <p className="dash-caveat"><CircleAlert size={13}/>{closed.length < config.minSampleSize ? `Only ${closed.length} closed demo cases; percentage is hidden until the 20-case display threshold.` : `Demo-only sample. ${deaths} deaths among ${closed.length} closed cases; cohort and time period are not validated.`}</p>
      </section>
    </div>

    <motion.section className="dash-bottom-strip" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, delay: .25 }}>
      <span className="dash-bottom-icon"><ArrowDownRight size={17}/></span><div><b>Make the next handoff visible.</b><small>Open a role queue to continue the live care relay.</small></div>
      <button onClick={() => openRoleQueue('Nurse')}>Open today’s work <ArrowRight size={15}/></button>
    </motion.section>
    <p className="dash-footnote">All figures use fictional records stored in this browser. This dashboard supports coordination only; it does not provide clinical guidance.</p>
  </div>;
}
