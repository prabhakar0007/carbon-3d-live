import { Lightbulb } from 'lucide-react';

export default function Insights({ footprintTotal }) {
  let tip = "";
  if (footprintTotal > 500) tip = "✈️ Reduce flights – one short flight = 3 months of carpooling!";
  else if (footprintTotal > 200) tip = "🚗 Try public transport twice a week to cut 30% emissions.";
  else if (footprintTotal > 50) tip = "💡 Switch to LED bulbs and save 40 kg CO₂/year.";
  else tip = "🌱 Great job! You're a climate hero – share your journey!";

  return (
    <div className="glass p-6 w-full flex items-start gap-3">
      <Lightbulb className="text-yellow-400 mt-1" />
      <div>
        <h4 className="font-bold">Personalised Insight</h4>
        <p className="opacity-90">{tip}</p>
      </div>
    </div>
  );
}