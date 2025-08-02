import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, Package } from 'lucide-react';
import { format } from 'date-fns';

const Orders: React.FC = () => {
  const { orders } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-gaming-accent" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-gaming-warning" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Package className="h-6 w-6 text-gray-400" />;
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
    <Layout>
      <section className="py-16 bg-gaming-dark min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Order History</h1>
            <p className="text-gray-400 text-lg">Track your gaming top-up orders</p>
          </div>

          {/* Order Status Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-gaming-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            >
              All Orders
            </Button>
            <Button
              onClick={() => setFilter('pending')}
              className={filter === 'pending' ? 'bg-gaming-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            >
              Pending
            </Button>
            <Button
              onClick={() => setFilter('completed')}
              className={filter === 'completed' ? 'bg-gaming-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            >
              Completed
            </Button>
            <Button
              onClick={() => setFilter('cancelled')}
              className={filter === 'cancelled' ? 'bg-gaming-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            >
              Cancelled
            </Button>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Card key={order.id} className="bg-gray-800 border-gray-700 hover:border-gaming-primary transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-white">{order.game}</h3>
                          <p className="text-gray-400">{order.package}</p>
                          <p className="text-sm text-gray-500">
                            {order.createdAt && format(order.createdAt, 'MMM dd, yyyy - h:mm a')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">{formatCurrency(order.amount)}</p>
                          <p className="text-sm text-gray-400">Order #{order.id.slice(-8)}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No orders found</p>
                <p className="text-gray-500">
                  {filter === 'all' 
                    ? "You haven't placed any orders yet." 
                    : `No ${filter} orders found.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Orders;
