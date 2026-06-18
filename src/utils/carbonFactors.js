// Emission factors (kg CO₂e per unit)
export const factors = {
  car_km: 0.171,
  bus_km: 0.089,
  train_km: 0.041,
  flight_hour: 90,
  electricity_kwh: 0.85,
  meat_meal: 3.2,
  veg_meal: 1.5,
  vegan_meal: 0.8,
};

export const calculateFootprint = (entries) => {
  let total = 0;
  entries.forEach(entry => {
    const { type, value } = entry;
    if (factors[type]) total += value * factors[type];
  });
  return parseFloat(total.toFixed(2));
};