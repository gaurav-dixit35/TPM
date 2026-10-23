import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './ui';

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('sajag.tour.completed', 'true');
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('Sajag interface workflows', () => {
  it('switches roles from the role menu', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Nurse' }));
    await user.click(screen.getByRole('menuitem', { name: /Doctor/ }));
    expect(screen.getByRole('heading', { name: /Ready for your visit/ })).toBeTruthy();
  });

  it('filters the patient list to fever patients', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Today’s round/ }));
    await user.click(screen.getByRole('menuitem', { name: 'Fever today' }));
    expect(screen.getAllByText('Rohan Deshmukh').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Vikram Joshi').length).toBeGreaterThan(0);
    expect(screen.queryByText('Meera Nair')).toBeNull();
  });

  it('carries a recorded nurse reading into the Doctor visit queue', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Arjun Pawar' }));
    await user.clear(screen.getByRole('spinbutton'));
    await user.type(screen.getByRole('spinbutton'), '36.8');
    await user.click(screen.getByRole('button', { name: /Save temperature/ }));

    await user.click(screen.getByRole('button', { name: 'Nurse' }));
    await user.click(screen.getByRole('menuitem', { name: /Doctor/ }));
    const row = screen.getByRole('button', { name: 'Arjun Pawar' }).closest('article');
    expect(row).not.toBeNull();
    await user.click(within(row as HTMLElement).getByRole('button', { name: /Start visit/ }));
    await user.type(screen.getByLabelText('Visit notes'), 'Reviewed and stable.');
    await user.click(screen.getByRole('button', { name: /Save visit & verdict/ }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('Visit recorded'));
  });

  it('requires a reason for the urgent Doctor override when no reading exists', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Nurse' }));
    await user.click(screen.getByRole('menuitem', { name: /Doctor/ }));
    const row = screen.getByRole('button', { name: 'Arjun Pawar' }).closest('article');
    expect(row).not.toBeNull();
    await user.click(within(row as HTMLElement).getByRole('button', { name: 'Urgent override' }));
    await user.type(screen.getByLabelText('Visit notes'), 'Urgent review.');
    await user.click(screen.getByRole('button', { name: /Save visit & verdict/ }));
    expect(screen.getByRole('status').textContent).toContain('reason');
    await user.type(screen.getByLabelText('Reason for urgent override'), 'Immediate clinical concern');
    await user.click(screen.getByRole('button', { name: /Save visit & verdict/ }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('Visit recorded'));
  });

  it('processes a discharge handoff and assigns the released bed to a new patient', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Nurse' }));
    await user.click(screen.getByRole('menuitem', { name: /Front Desk/ }));
    const dischargeRow = screen.getByRole('button', { name: 'Process discharge' }).closest('article');
    expect(dischargeRow).not.toBeNull();
    await user.click(within(dischargeRow as HTMLElement).getByRole('button', { name: 'Process discharge' }));
    const dischargeDialogs = screen.getAllByRole('dialog');
    await user.click(within(dischargeDialogs[dischargeDialogs.length - 1]).getByRole('button', { name: 'Process discharge' }));
    await waitFor(() => expect(document.querySelector('.shift-stat strong')?.textContent).toContain('73'));

    await user.click(screen.getByRole('button', { name: /Ward floor plan/ }));
    await user.click(screen.getByTitle('Free bed A-01'));
    await user.type(screen.getByLabelText('Full name'), 'Test Patient');
    await user.type(screen.getByPlaceholderText('Years'), '31');
    await user.click(screen.getByRole('button', { name: 'Assign bed' }));
    await waitFor(() => expect(document.querySelector('.bed-map-footer')?.textContent).toContain('Occupied 74/74'));
  });

  it('shows the onboarding guide once and allows keyboard dismissal', async () => {
    localStorage.removeItem('sajag.tour.completed');
    render(<App />);
    await screen.findByRole('dialog', { name: /Welcome to your round/ });
    expect(screen.getByRole('dialog', { name: /Welcome to your round/ })).toBeTruthy();
    await act(async()=>fireEvent.keyDown(window,{key:'Escape'}));
    await waitFor(()=>expect(screen.queryByRole('dialog', { name: /Welcome to your round/ })).toBeNull());
    expect(localStorage.getItem('sajag.tour.completed')).toBe('true');
  });

  it('moves through the guide and can replay it from Help after completion', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(document.querySelector('.help-button') as HTMLElement);
    await user.click(screen.getByRole('button', { name: 'Replay the on-screen guide' }));
    expect(await screen.findByRole('dialog', { name: /Welcome to your round/ })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /Next/ }));
    expect(screen.getByRole('dialog', { name: /Record one reading/ })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('dialog', { name: /Welcome to your round/ })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Skip tour' }));
    expect(localStorage.getItem('sajag.tour.completed')).toBe('true');
  });

  it('discards malformed browser data and keeps working when storage writes fail', async () => {
    const duplicateBeds = Array.from({ length: 138 }, (_, index) => ({
      id: index + 1,
      name: `Injected ${index}`,
      age: 30,
      sex: 'F',
      bed: index < 74 ? 'A-01' : '—',
      streak: 0,
    }));
    localStorage.setItem('baton.patients', JSON.stringify(duplicateBeds));
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText('Rohan Deshmukh')).toBeTruthy();
    expect(screen.queryByText('Injected 0')).toBeNull();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Storage disabled'); });
    await user.click(screen.getByRole('button', { name: /Toggle theme/ }));
    expect(screen.getByText('Rohan Deshmukh')).toBeTruthy();
  });

  it('converts displayed temperatures and persists the unit preference', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(within(document.querySelector('.desktop-nav') as HTMLElement).getByRole('button', { name: 'Settings' }));
    await user.click(screen.getByRole('button', { name: 'Switch to °F' }));
    expect(localStorage.getItem('baton.unit')).toBe('°F');
    await user.click(screen.getByRole('button', { name: 'Work' }));
    await user.click(within(document.querySelector('.desktop-nav') as HTMLElement).getByRole('button', { name: 'Patients' }));
    expect(screen.getAllByText(/98.2/).length).toBeGreaterThan(0);
  });

  it('uses the real local clock by default and can enter and leave demo time', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(document.querySelector('.sim-time-label')?.textContent).toBe('LIVE');
    await user.click(within(document.querySelector('.desktop-nav') as HTMLElement).getByRole('button', { name: 'Settings' }));
    await user.click(screen.getByRole('button', { name: '+1 hour' }));
    expect(document.querySelector('.sim-time-label')?.textContent).toBe('DEMO');
    expect(localStorage.getItem('baton.clockMode')).toBe('demo');
    await user.click(screen.getByRole('button', { name: 'Use live time' }));
    expect(document.querySelector('.sim-time-label')?.textContent).toBe('LIVE');
    expect(localStorage.getItem('baton.clockMode')).toBe('live');
  });

  it('walks a reviewer through real nurse, doctor, and Front Desk actions', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(document.querySelector('.help-button') as HTMLElement);
    await user.click(screen.getByRole('button', { name: 'Start the 3-minute walkthrough' }));
    expect(screen.getByRole('heading', { name: /Nurse · Record a temperature/ })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Open Arjun Pawar' }));
    await user.click(screen.getByRole('button', { name: /Save temperature/ }));
    expect(screen.getByRole('heading', { name: /Doctor · Review the patient/ })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Open Arjun’s visit' }));
    await user.type(screen.getByLabelText('Visit notes'), 'Reviewed and stable.');
    await user.click(screen.getByRole('button', { name: /Save visit & verdict/ }));
    expect(screen.getByRole('heading', { name: /Front Desk · Complete the handoff/ })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Process Ananya’s discharge' }));
    const dischargeDialogs = screen.getAllByRole('dialog');
    await user.click(within(dischargeDialogs[dischargeDialogs.length - 1]).getByRole('button', { name: 'Process discharge' }));
    await waitFor(() => expect(screen.queryByRole('region', { name: /Walkthrough step/ })).toBeNull());
    expect(screen.getByRole('status').textContent).toContain('Walkthrough complete');
  });

  it('offers a short undo after recording a temperature and restores the due queue', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Arjun Pawar' }));
    await user.click(screen.getByRole('button', { name: /Save temperature/ }));
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(screen.getByRole('button', { name: 'Arjun Pawar' })).toBeTruthy();
    const saved = JSON.parse(localStorage.getItem('baton.patients') || '[]') as Array<{ id: number; temp?: number }>;
    expect(saved.find((patient) => patient.id === 4)?.temp).toBeUndefined();
    expect(screen.getByRole('status').textContent).toContain('temperature entry undone');
  });

  it('opens the floating Sajag Guide and answers from the current demo records', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Open Sajag Guide' }));
    expect(screen.getByRole('region', { name: 'Sajag assistant' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /Who needs a temperature/ }));
    expect(screen.getByText(/active patients are missing today’s temperature/i)).toBeTruthy();
    expect(screen.getByText(/Arjun Pawar \(A-04\)/)).toBeTruthy();
    expect(screen.getByText(/no cloud AI/i)).toBeTruthy();
  });
});
