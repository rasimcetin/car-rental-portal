export default interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  dailyRate: number;
  available: boolean;
  tenant: {
    id: string;
    name: string;
  };
}
