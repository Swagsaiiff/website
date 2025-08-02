import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { Game, Order, AddMoneyRequest, AdminStats } from '../types';

interface AppContextType {
  games: Game[];
  orders: Order[];
  adminStats: AdminStats | null;
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Initialize games data
  useEffect(() => {
    const initializeGames = () => {
      const gamesData: Game[] = [
        {
          id: 'free-fire',
          name: 'Free Fire',
          logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
          packages: [
            { id: '1', name: '100 Diamonds', amount: '100', price: 80, currency: 'Diamonds' },
            { id: '2', name: '210 Diamonds', amount: '210', price: 160, currency: 'Diamonds' },
            { id: '3', name: '520 Diamonds', amount: '520', price: 390, currency: 'Diamonds' },
            { id: '4', name: '1080 Diamonds', amount: '1080', price: 780, currency: 'Diamonds' },
            { id: '5', name: '2180 Diamonds', amount: '2180', price: 1560, currency: 'Diamonds' },
            { id: '6', name: '5600 Diamonds', amount: '5600', price: 3900, currency: 'Diamonds' }
          ]
        },
        {
          id: 'pubg',
          name: 'PUBG Mobile',
          logo: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
          packages: [
            { id: '1', name: '60 UC', amount: '60', price: 95, currency: 'UC' },
            { id: '2', name: '325 UC', amount: '325', price: 480, currency: 'UC' },
            { id: '3', name: '660 UC', amount: '660', price: 950, currency: 'UC' },
            { id: '4', name: '1800 UC', amount: '1800', price: 2400, currency: 'UC' },
            { id: '5', name: '3850 UC', amount: '3850', price: 4800, currency: 'UC' },
            { id: '6', name: '8100 UC', amount: '8100', price: 9500, currency: 'UC' },
            { id: '7', name: '16200 UC', amount: '16200', price: 19000, currency: 'UC' },
            { id: '8', name: '25000 UC', amount: '25000', price: 28500, currency: 'UC' }
          ]
        },
        {
          id: 'mobile-legends',
          name: 'Mobile Legends',
          logo: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
          packages: [
            { id: '1', name: '86 Diamonds', amount: '86', price: 75, currency: 'Diamonds' },
            { id: '2', name: '172 Diamonds', amount: '172', price: 150, currency: 'Diamonds' },
            { id: '3', name: '257 Diamonds', amount: '257', price: 220, currency: 'Diamonds' },
            { id: '4', name: '706 Diamonds', amount: '706', price: 580, currency: 'Diamonds' },
            { id: '5', name: '1412 Diamonds', amount: '1412', price: 1150, currency: 'Diamonds' },
            { id: '6', name: '2195 Diamonds', amount: '2195', price: 1750, currency: 'Diamonds' },
            { id: '7', name: '4830 Diamonds', amount: '4830', price: 3800, currency: 'Diamonds' }
          ]
        },
        {
          id: 'minecraft',
          name: 'Minecraft',
          logo: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
          packages: [
            { id: '1', name: '320 Coins', amount: '320', price: 120, currency: 'Coins' },
            { id: '2', name: '1600 Coins', amount: '1600', price: 600, currency: 'Coins' },
            { id: '3', name: '3500 Coins', amount: '3500', price: 1200, currency: 'Coins' },
            { id: '4', name: '8000 Coins', amount: '8000', price: 2400, currency: 'Coins' },
            { id: '5', name: '16000 Coins', amount: '16000', price: 4800, currency: 'Coins' }
          ]
        },
        {
          id: 'valorant',
          name: 'Valorant',
          logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
          packages: [
            { id: '1', name: '475 Points', amount: '475', price: 150, currency: 'Points' },
            { id: '2', name: '1000 Points', amount: '1000', price: 300, currency: 'Points' },
            { id: '3', name: '2050 Points', amount: '2050', price: 600, currency: 'Points' },
            { id: '4', name: '3650 Points', amount: '3650', price: 1050, currency: 'Points' },
            { id: '5', name: '5350 Points', amount: '5350', price: 1500, currency: 'Points' },
            { id: '6', name: '11000 Points', amount: '11000', price: 3000, currency: 'Points' }
          ]
        },
        {
          id: 'roblox',
          name: 'Roblox',
          logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
          packages: [
            { id: '1', name: '80 Robux', amount: '80', price: 100, currency: 'Robux' },
            { id: '2', name: '160 Robux', amount: '160', price: 200, currency: 'Robux' },
            { id: '3', name: '240 Robux', amount: '240', price: 300, currency: 'Robux' },
            { id: '4', name: '400 Robux', amount: '400', price: 500, currency: 'Robux' },
            { id: '5', name: '800 Robux', amount: '800', price: 1000, currency: 'Robux' },
            { id: '6', name: '1700 Robux', amount: '1700', price: 2000, currency: 'Robux' },
            { id: '7', name: '4500 Robux', amount: '4500', price: 5000, currency: 'Robux' },
            { id: '8', name: '10000 Robux', amount: '10000', price: 10000, currency: 'Robux' },
            { id: '9', name: '22500 Robux', amount: '22500', price: 20000, currency: 'Robux' }
          ]
        }
      ];
      setGames(gamesData);
    };

    initializeGames();
  }, []);

  // Listen to user orders
  useEffect(() => {
    if (!user) return;

    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Order[];
      setOrders(ordersData);
    });

    return unsubscribe;
  }, [user]);

  // Listen to admin stats (admin only)
  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ordersQuery = query(
      collection(db, 'orders'),
      where('createdAt', '>=', today),
      orderBy('createdAt', 'desc')
    );

    const addMoneyQuery = query(
      collection(db, 'addMoneyRequests'),
      where('status', '==', 'pending')
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const todayOrders = snapshot.docs.map(doc => doc.data() as Order);
      const todaySales = todayOrders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.amount, 0);
      const pendingOrders = todayOrders.filter(order => order.status === 'pending').length;

      setAdminStats(prev => ({
        ...prev,
        todaySales,
        todayOrders: todayOrders.length,
        pendingOrders
      } as AdminStats));
    });

    const unsubscribeAddMoney = onSnapshot(addMoneyQuery, (snapshot) => {
      setAdminStats(prev => ({
        ...prev,
        addMoneyRequests: snapshot.docs.length
      } as AdminStats));
    });

    return () => {
      unsubscribeOrders();
      unsubscribeAddMoney();
    };
  }, [user]);

  const refreshData = () => {
    // Force refresh by re-triggering effects
  };

  const value = {
    games,
    orders,
    adminStats,
    selectedGame,
    setSelectedGame,
    refreshData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
