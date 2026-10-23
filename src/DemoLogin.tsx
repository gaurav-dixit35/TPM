import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Activity, ArrowRight, BedDouble, Check, HeartPulse, ShieldCheck, Stethoscope, Thermometer, Users } from 'lucide-react';

export type DemoRole = 'Nurse' | 'Doctor' | 'Front Desk' | 'Centre Lead';

const stakeholders: { role: DemoRole; description: string; responsibility: string; icon: typeof Thermometer; color: string }[] = [
  { role: 'Nurse', description: 'Daily observations', responsibility: 'Record one temperature per patient each care day.', icon: Thermometer, color: 'tide' },
  { role: 'Doctor', description: 'Clinical review', responsibility: 'Review readings, document visits, and recommend eligible discharge.', icon: Stethoscope, color: 'plum' },
  { role: 'Front Desk', description: 'Admissions & handoffs', responsibility: 'Assign available beds and complete discharge handoffs.', icon: BedDouble, color: 'ochre' },
  { role: 'Centre Lead', description: 'Operations overview', responsibility: 'Review coverage, occupancy, and illustrative outcome metrics.', icon: Activity, color: 'night' },
];

export function DemoLogin({ initialRole, onSignIn }: { initialRole: DemoRole; onSignIn: (role: DemoRole) => void }) {
  const [selectedRole, setSelectedRole] = useState<DemoRole>(initialRole);
  const reduce = useReducedMotion();
  const selected = stakeholders.find((item) => item.role === selectedRole)!;
  const Icon = selected.icon;

  return <main className="demo-login" aria-labelledby="login-title">
    <div className="login-grain" aria-hidden="true"/>
    <header className="login-header">
      <a className="login-brand" href="#" onClick={(event) => event.preventDefault()} aria-label="Sajag demo sign in">
        <img src="/sajag-logo.svg" alt="Sajag सजग"/>
      </a>
      <span className="login-demo-badge"><span/> DEMO WORKSPACE</span>
    </header>

    <div className="login-layout">
      <motion.section className="login-intro" initial={reduce?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.45}}>
        <span className="section-kicker"><HeartPulse size={14}/> SAHYADRI CARE CENTRE</span>
        <h1 id="login-title">Good care moves<br/><em>as one.</em></h1>
        <p>Follow each patient’s daily care relay from admission through temperature checks, doctor review, and the discharge handoff.</p>
        <div className="login-relay" aria-label="Care workflow: admission, temperature, doctor visit, discharge">
          <span><Users size={15}/><small>ADMIT</small></span><i/><span><Thermometer size={15}/><small>MEASURE</small></span><i/><span><Stethoscope size={15}/><small>VISIT</small></span><i/><span><BedDouble size={15}/><small>RELEASE</small></span>
        </div>
        <div className="login-safety"><ShieldCheck size={16}/><span>Fictional demonstration only. Do not enter real patient information.</span></div>
      </motion.section>

      <motion.section className="login-card" aria-label="Choose a demo stakeholder" initial={reduce?false:{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.5,delay:.08}}>
        <div className="login-card-heading"><span className="login-card-kicker">DEMO ACCESS · NO PASSWORD</span><h2>Choose your role</h2><p>Each view is tailored to a stakeholder’s part in the relay.</p></div>
        <div className="stakeholder-grid" role="group" aria-label="Stakeholder roles">
          {stakeholders.map(({role,description,icon:RoleIcon,color})=><button key={role} type="button" className={`stakeholder-option ${selectedRole===role?'selected':''}`} aria-pressed={selectedRole===role} onClick={()=>setSelectedRole(role)}>
            <span className={`stakeholder-icon ${color}`}><RoleIcon size={18}/></span>
            <span className="stakeholder-copy"><b>{role}</b><small>{description}</small></span>
            <span className="stakeholder-check">{selectedRole===role&&<Check size={14}/>}</span>
          </button>)}
        </div>
        <AnimatePresence mode="wait"><motion.div className="login-selected" key={selectedRole} initial={reduce?false:{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:.16}}>
          <span className={`login-selected-icon ${selected.color}`}><Icon size={17}/></span><span><b>{selected.description}</b><small>{selected.responsibility}</small></span>
        </motion.div></AnimatePresence>
        <button className="login-submit" type="button" onClick={()=>onSignIn(selectedRole)}>Enter as {selectedRole}<ArrowRight size={17}/></button>
        <p className="login-disclaimer">Demo role selection is not authentication. Changes stay in this browser and are not shared with other staff.</p>
      </motion.section>
    </div>

    <footer className="login-footer"><span>SAJAG <i>·</i> CARE, CARRIED FORWARD</span><span><ShieldCheck size={13}/> PROTOTYPE MODE</span></footer>
  </main>;
}
