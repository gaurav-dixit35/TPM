import { config } from './config';

type Reading = { day: string; value: number; at: string; by: string };
type Props = { readings: Reading[]; day: string; unit: '°C' | '°F' };

const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const shiftDay = (day: string, offset: number) => {
  const date = new Date(`${day}T12:00:00`);
  date.setDate(date.getDate() + offset);
  return dayKey(date);
};
const displayTemperature = (celsius: number, unit: Props['unit']) => unit === '°C' ? celsius : celsius * 9 / 5 + 32;

export function FeverRibbon({ readings, day, unit }: Props) {
  const days = Array.from({ length: 7 }, (_, index) => shiftDay(day, index - 6));
  const latestByDay = new Map<string, Reading>();
  readings.forEach((reading) => latestByDay.set(reading.day, reading));
  const points = days.map((key, index) => {
    const reading = latestByDay.get(key);
    return { key, reading, x: 18 + index * 47.3, y: reading ? 88 - (reading.value - 34) * 10 : null };
  });
  const segments: string[] = [];
  let segment: string[] = [];
  points.forEach((point) => {
    if (point.reading && point.y !== null) segment.push(`${segment.length ? 'L' : 'M'} ${point.x} ${point.y}`);
    else if (segment.length) { segments.push(segment.join(' ')); segment = []; }
  });
  if (segment.length) segments.push(segment.join(' '));
  const thresholdY = 48;

  return <div className="fever-ribbon">
    <div className="ribbon-heading"><span className="streak-label">7-DAY TEMPERATURE TRACE</span><span>{displayTemperature(config.feverThresholdC, unit).toFixed(1)}{unit} fever line</span></div>
    <svg viewBox="0 0 320 112" role="img" aria-label="Temperature readings over the last seven days; dashed line marks the fever threshold">
      <line x1="14" x2="306" y1={thresholdY} y2={thresholdY} className="ribbon-threshold" />
      <text x="306" y={thresholdY - 5} textAnchor="end" className="ribbon-threshold-label">FEVER</text>
      {segments.map((path, index) => <path key={index} d={path} className="ribbon-path" />)}
      {points.map((point) => point.reading && point.y !== null
        ? <circle key={point.key} cx={point.x} cy={point.y} r="4.5" className={point.reading.value >= config.feverThresholdC ? 'ribbon-fever' : 'ribbon-calm'}>
          <title>{`${point.key}: ${displayTemperature(point.reading.value, unit).toFixed(1)}${unit}; ${point.reading.by} at ${point.reading.at}`}</title>
        </circle>
        : <g key={point.key}><circle cx={point.x} cy="96" r="3" className="ribbon-missing" /><title>{`${point.key}: no reading`}</title></g>)}
      {points.map((point) => <text key={`label-${point.key}`} x={point.x} y="109" textAnchor="middle" className="ribbon-day">{new Date(`${point.key}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric' })}</text>)}
    </svg>
    <div className="ribbon-legend"><span><i className="ribbon-key calm-key" />Below fever threshold</span><span><i className="ribbon-key missing-key" />No reading</span></div>
  </div>;
}
