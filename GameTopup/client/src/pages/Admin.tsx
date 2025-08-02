import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import StatsCard from '../components/StatsCard';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useFirestore } from '../hooks/useFirestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  Plus, 
  CheckCircle, 
  XCircle,
  Users,
  Shield
} from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, AddMoneyRequest } from '../types';
import { format } from 'date-fns';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { adminStats } = useApp();
  const { updateOrderStatus, approveAddMoneyRequest, rejectAddMoneyRequest, loading } = useFirestore();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [addMoneyRequests, setAddMoneyRequests] = useState<AddMoneyRequest[]>([]);

  // Listen to recent orders
  useEffect(() => {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Order[];
      setRecentOrders(orders);
    });

    return unsubscribe;
  }, []);

  // Listen to add money requests
  useEffect(() => {
    const requestsQuery = query(
      collection(db, 'addMoneyRequests'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as AddMoneyRequest[];
      setAddMoneyRequests(requests);
    });

    return unsubscribe;
  }, []);

  const handleConfirmOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'completed');
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'cancelled');
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleApproveRequest = async (request: AddMoneyRequest) => {
    try {
      await approveAddMoneyRequest(request.id, request.userId, request.amount);
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectAddMoneyRequest(requestId);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gaming-accent text-white';
      case 'pending':
        return 'bg-gaming-warning text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatCurrency = (amount: number) => {
    return `৳ ${amount.toLocaleString()}`;
  };

  return (
    <ProtectedRoute adminOnly>
      <Layout>
        <section className="py-16 bg-gaming-dark min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-12 w-12 text-gaming-warning mr-3" />
                <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
              </div>
              <p className="text-gaming-warning text-lg">Administrative controls and statistics</p>
            </div>

            {/* Admin Stats Cards */}
            {adminStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatsCard
                  title="Today's Sales"
                  value={formatCurrency(adminStats.todaySales)}
                  subtitle=""
                  icon={<DollarSign className="h-6 w-6 text-white" />}
                  color="accent"
                />
                <StatsCard
                  title="Today's Orders"
                  value={adminStats.todayOrders}
                  subtitle=""
                  icon={<ShoppingBag className="h-6 w-6 text-white" />}
                  color="primary"
                />
                <StatsCard
                  title="Pending Orders"
                  value={adminStats.pendingOrders}
                  subtitle=""
                  icon={<Clock className="h-6 w-6 text-white" />}
                  color="warning"
                />
                <StatsCard
                  title="Money Requests"
                  value={adminStats.addMoneyRequests}
                  subtitle=""
                  icon={<Plus className="h-6 w-6 text-white" />}
                  color="secondary"
                />
              </div>
            )}

            {/* Admin Management Tabs */}
            <Card className="bg-gray-800 border-gray-700">
              <Tabs defaultValue="orders" className="w-full">
                <div className="border-b border-gray-700">
                  <TabsList className="w-full justify-start bg-transparent h-auto p-0">
                    <TabsTrigger 
                      value="orders" 
                      className="data-[state=active]:bg-gaming-primary data-[state=active]:text-white px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-gaming-primary"
                    >
                      Order Management
                    </TabsTrigger>
                    <TabsTrigger 
                      value="money-requests" 
                      className="data-[state=active]:bg-gaming-primary data-[state=active]:text-white px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-gaming-primary"
                    >
                      Money Requests
                    </TabsTrigger>
                    <TabsTrigger 
                      value="profile" 
                      className="data-[state=active]:bg-gaming-primary data-[state=active]:text-white px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-gaming-primary"
                    >
                      Admin Profile
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="orders" className="p-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl text-white">Recent Orders</CardTitle>
                  </CardHeader>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 text-gray-400 font-medium">Order ID</th>
                          <th className="text-left py-3 text-gray-400 font-medium">Game</th>
                          <th className="text-left py-3 text-gray-400 font-medium">Package</th>
                          <th className="text-left py-3 text-gray-400 font-medium">Amount</th>
                          <th className="text-left py-3 text-gray-400 font-medium">Status</th>
                          <th className="text-left py-3 text-gray-400 font-medium">Date</th>
                          <th className="text-left py-3 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-700">
                            <td className="py-4 text-white font-medium">#{order.id.slice(-8)}</td>
                            <td className="py-4 text-gray-300">{order.game}</td>
                            <td className="py-4 text-gray-300">{order.package}</td>
                            <td className="py-4 text-gaming-accent font-semibold">{formatCurrency(order.amount)}</td>
                            <td className="py-4">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-4 text-gray-300 text-sm">
                              {order.createdAt && format(order.createdAt, 'MMM dd, yyyy')}
                            </td>
                            <td className="py-4">
                              {order.status === 'pending' && (
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleConfirmOrder(order.id)}
                                    disabled={loading}
                                    className="bg-gaming-accent hover:bg-green-600 text-white"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleCancelOrder(order.id)}
                                    disabled={loading}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {recentOrders.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No orders found</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="money-requests" className="p-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl text-white">Add Money Requests</CardTitle>
                  </CardHeader>
                  
                  <div className="space-y-4">
                    {addMoneyRequests.map((request) => (
                      <Card key={request.id} className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-white font-semibold">User ID: {request.userId}</p>
                              <p className="text-gray-400 text-sm">Amount: {formatCurrency(request.amount)}</p>
                              <p className="text-gray-400 text-sm">Sender: {request.senderNumber}</p>
                              <p className="text-gray-400 text-sm">Transaction ID: {request.transactionId}</p>
                              <p className="text-gray-400 text-sm">
                                Date: {request.createdAt && format(request.createdAt, 'MMM dd, yyyy - h:mm a')}
                              </p>
                            </div>
                            <div className="flex space-x-3">
                              <Button
                                onClick={() => handleApproveRequest(request)}
                                disabled={loading}
                                className="bg-gaming-accent hover:bg-green-600 text-white"
                              >
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleRejectRequest(request.id)}
                                disabled={loading}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {addMoneyRequests.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No pending requests</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="profile" className="p-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl text-white">Admin Profile</CardTitle>
                  </CardHeader>
                  
                  <div className="space-y-4">
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gaming-warning p-3 rounded-full">
                            <Shield className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
                            <p className="text-gray-400">{user?.email}</p>
                            <Badge className="bg-gaming-warning text-white mt-2">Administrator</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </section>
      </Layout>
    </ProtectedRoute>
  );
};

export default Admin;
