import { Activity, ArrowRight, BedDouble, Check, CircleHelp, HeartPulse, ShieldCheck, Stethoscope, Thermometer, UserPlus } from 'lucide-react';

const commonQuestions = [
  'What is Sajag’s main goal?',
  'How does the patient workflow work?',
  'How do I record a temperature?',
  'What can each role do?',
  'How do I read the Centre dashboard?',
  'How does the 3-day recovery rule work?',
  'Where is the demo data stored?',
];

export function Guidebook({ onAsk, onWalkthrough, onSettings }: { onAsk: (question: string) => void; onWalkthrough: () => void; onSettings: () => void }) {
  return <section className="queue-panel aux-panel info-page" aria-labelledby="guide-title">
    <div className="info-hero guide-hero"><div><span className="section-kicker">SAJAG · FIELD GUIDE</span><h2 id="guide-title">A clear handoff, at every step.</h2><p>Use this guide to learn the screens, roles, and daily care relay. The Sajag Guide can answer these questions using the current demo records and the rules described here.</p></div><button className="primary-action" onClick={onWalkthrough}>Start the 3-minute walkthrough <ArrowRight size={15}/></button></div>

    <section className="guide-section" aria-labelledby="workflow-title"><div className="guide-section-heading"><div><span className="section-kicker">THE DAILY RELAY</span><h3 id="workflow-title">One patient. Five visible handoffs.</h3></div><p>Queues show what is waiting and who owns the next action.</p></div>
      <div className="workflow-steps">{[
        ['01','Admit','Front Desk assigns an open bed and adds the fictional demo record.'],
        ['02','Measure','Nurse records one official temperature for the care day.'],
        ['03','Visit','Doctor reviews the reading, sees the patient, and records notes and a verdict.'],
        ['04','Verdict','A doctor’s discharge recommendation becomes a visible handoff for Front Desk.'],
        ['05','Release','Front Desk processes the handoff and releases the bed.'],
      ].map(([number,title,body],index)=>{const icons=[<UserPlus size={17}/>,<Thermometer size={17}/>,<Stethoscope size={17}/>,<Check size={17}/>,<BedDouble size={17}/>];return <article className="workflow-step" key={number}><span className="workflow-step-icon" aria-hidden="true">{icons[index]}</span><small>{number}</small><h4>{title}</h4><p>{body}</p></article>;})}</div>
    </section>

    <section className="guide-section" aria-labelledby="roles-title"><div className="guide-section-heading"><div><span className="section-kicker">WHO DOES WHAT</span><h3 id="roles-title">Four roles, one shared relay.</h3></div><p>Choose a stakeholder on demo sign-in; use the role menu to preview another view. This is not authentication.</p></div>
      <div className="guide-roles">
        <article><span className="guide-role-icon role-nurse"><Thermometer size={17}/></span><h4>Nurse</h4><ol><li>Open the Nurse round and find patients waiting for a reading.</li><li>Open a patient, check the thermometer value, and save today’s temperature.</li><li>Review a warning if the value is outside the usual range.</li></ol></article>
        <article><span className="guide-role-icon role-doctor"><Stethoscope size={17}/></span><h4>Doctor</h4><ol><li>Open the Doctor queue; patients with no reading stay marked “Waiting for nurse.”</li><li>Review today’s reading and patient history before the visit.</li><li>Save visit notes, treatment plan, and verdict. Urgent override requires a reason.</li></ol></article>
        <article><span className="guide-role-icon role-desk"><BedDouble size={17}/></span><h4>Front Desk</h4><ol><li>Process doctor handoffs in the discharge queue.</li><li>Confirm discharge to record the exit and release the bed.</li><li>Use the ward floor plan to choose an open bed and admit a demo patient.</li></ol></article>
        <article><span className="guide-role-icon role-lead"><Activity size={17}/></span><h4>Centre Lead</h4><ol><li>Start on the Dashboard for occupancy, daily coverage, care activity, and handoffs waiting.</li><li>Open an alert to jump to the role’s queue; review outcomes against the illustrative 15% reference.</li><li>This prototype role is read-only; outcome figures are not validated facility metrics.</li></ol></article>
      </div>
    </section>

    <section className="guide-section guide-rules" aria-labelledby="rules-title"><div className="guide-section-heading"><div><span className="section-kicker">RULES & NAVIGATION</span><h3 id="rules-title">What the interface is telling you.</h3></div></div><div className="guide-rule-grid">
      <article><b>Temperature</b><p>One official reading per patient per care day. Duplicate readings are blocked; unusual values ask for confirmation.</p></article>
      <article><b>Doctor visit</b><p>Routine visits follow a recorded temperature. An urgent override is available when necessary and requires an audit reason.</p></article>
      <article><b>Recovery</b><p>The demo uses three consecutive fever-free days below 38.0°C. A missing reading breaks the streak. Clinical leadership must confirm this rule.</p></article>
      <article><b>Discharge</b><p>Doctor can recommend discharge only after the configured three-day fever-free criterion. Front Desk processes the handoff; the bed stays occupied until then.</p></article>
      <article><b>Find a patient</b><p>Use search, queue filters, patient records, or the 74-bed floor plan. A slash key focuses patient search.</p></article>
      <article><b>Demo data</b><p>Fictional records are stored in this browser. Demo sign-in only selects a view; there is no identity check, shared database, backup, or server-side permission check.</p></article>
    </div></section>

    <section className="guide-section" aria-labelledby="questions-title"><div className="guide-section-heading"><div><span className="section-kicker">ASK SAJAG GUIDE</span><h3 id="questions-title">Try a question about the product.</h3></div><p>Choose a prompt; the floating assistant opens with a grounded answer.</p></div><div className="guide-question-grid">{commonQuestions.map((question)=><button key={question} onClick={()=>onAsk(question)}><CircleHelp size={15}/><span>{question}</span><ArrowRight size={14}/></button>)}</div></section>

    <aside className="guide-boundary"><ShieldCheck size={17}/><p><b>Prototype boundary</b><br/>Sajag helps make work visible; it does not diagnose, prescribe, or determine clinical discharge. Never enter real patient-identifying information.</p><button className="view-action" onClick={onSettings}>Open demo settings</button></aside>
  </section>;
}

export function AboutSajag() {
  return <section className="queue-panel aux-panel info-page" aria-labelledby="about-title">
    <div className="info-hero about-hero"><div><span className="section-kicker">ABOUT THE PRODUCT</span><h2 id="about-title">Sajag · सजग</h2><p className="about-tagline">Every patient. Every day. Nothing dropped.</p><p>Sajag is a care-coordination prototype for a 74-bed quarantine and treatment centre. It makes daily temperature checks, doctor visits, discharge decisions, and bed handoffs visible to the people responsible for each step.</p></div><div className="about-seal"><HeartPulse size={23}/><span>CARE, CARRIED<br/>FORWARD</span></div></div>
    <div className="about-facts" aria-label="Sajag product facts"><div><b>74</b><span>bed centre capacity</span></div><div><b>3 days</b><span>proposed fever-free rule</span></div><div><b>15%</b><span>reference mortality · 85% success benchmark</span></div><div><b>5 handoffs</b><span>from admission to bed release</span></div></div>
    <div className="about-content">
      <article className="about-purpose"><span className="section-kicker">OBJECTIVE</span><h3>Reduce avoidable gaps in the daily care routine.</h3><p>Paper journals make it hard to know who has been measured, who has had a doctor visit, and whether a discharge decision has reached the desk. Sajag gives each role a clear queue and makes every handoff visible so fewer care steps are missed and beds can be released promptly after the approved process.</p></article>
      <div className="about-cards"><article><span className="section-kicker">MAIN GOAL</span><h3>Keep the next action clear.</h3><p>Show who owns each step, what is waiting, and when the next role can safely continue the workflow.</p></article><article><span className="section-kicker">WHO IT SERVES</span><h3>The whole centre team.</h3><p>Nurses, Doctors, Front Desk, and Centre Leads share one visible operational picture, each with role-specific responsibilities.</p></article><article><span className="section-kicker">V1 FOCUS</span><h3>Operational visibility.</h3><p>Daily measurement tracking, doctor readiness, verdict handoff, discharge processing, bed occupancy, and illustrative comparison with the brief’s 15% mortality / 85% success reference. Outcome definitions still need approval.</p></article><article><span className="section-kicker">PRODUCT PRINCIPLE</span><h3>People make care decisions.</h3><p>Sajag supports coordination. It does not choose treatment or replace clinical judgment. Provisional clinical rules must be approved before real use.</p></article></div>
      <section className="about-outcomes"><div><span className="section-kicker">HOW TO JUDGE THE PROTOTYPE</span><h3>Success means fewer invisible handoffs.</h3></div><ul><li>Staff can see patients still waiting for today’s temperature.</li><li>Doctors can see when a routine visit is waiting on a nurse reading.</li><li>Front Desk can act on a doctor’s discharge handoff without relying on a verbal reminder.</li><li>Centre leadership can inspect occupancy and outcomes with clear definitions and caveats.</li></ul></section>
      <aside className="guide-boundary"><ShieldCheck size={17}/><p><b>About this deployment</b><br/>This Vercel-ready frontend is a fictional-data demonstration. Demo sign-in selects a stakeholder view but does not verify identity. Records stay in one browser; there is no server authentication or shared database. The interface is not for patient care.</p></aside>
    </div>
  </section>;
}
