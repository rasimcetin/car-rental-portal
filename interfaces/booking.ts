export default interface Booking {
  id: string;
  carId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  user?: {
    name?: string;
    email?: string;
  };
  car?: {
    make: string;
    model: string;
    year: number;
  };
}
