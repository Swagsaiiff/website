export interface User {
  uid: string;
  name: string;
  email: string;
  wallet: number;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface Game {
  id: string;
  name: string;
  logo: string;
  packages: GamePackage[];
}

export interface GamePackage {
  id: string;
  name: string;
  amount: string;
  price: number;
  currency: string;
}

export interface Order {
  id: string;
  userId: string;
  game: string;
  package: string;
  gameUserId: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface AddMoneyRequest {
  id: string;
  userId: string;
  amount: number;
  senderNumber: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface AdminStats {
  todaySales: number;
  todayOrders: number;
  pendingOrders: number;
  addMoneyRequests: number;
}
