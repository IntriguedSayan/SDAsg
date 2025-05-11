export const getSolarRadiation = (city: string) => {
  const data: Record<string, Record<string, number>> = {
    Bangalore: { north: 150, south: 250, east: 200, west: 200, roof: 300 },
    Mumbai: { north: 180, south: 350, east: 280, west: 270, roof: 400 },
    Kolkata: { north: 200, south: 400, east: 300, west: 290, roof: 450 },
    Delhi: { north: 160, south: 270, east: 220, west: 220, roof: 320 },
  };

  return data[city] || data["Bangalore"];
};

export const getElectricityRate = (city: string) => {
  const rates: Record<string, number> = {
    Bangalore: 6.5,
    Mumbai: 9.0,
    Kolkata: 7.5,
    Delhi: 8.5,
  };

  return rates[city] || 6.5;
};
