import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function FootprintChart({ data }) {
  return (
    <div className="glass p-6 w-full">
      <h3 className="text-xl font-bold mb-2">📈 Weekly Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="day" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip contentStyle={{ background: '#1e293b', border: 'none' }} />
          <Line type="monotone" dataKey="co2" stroke="#4ade80" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}