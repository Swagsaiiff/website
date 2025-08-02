import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet as WalletIcon, Plus, CreditCard } from 'lucide-react';

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const { createAddMoneyRequest, loading } = useFirestore();
  const [formData, setFormData] = useState({
    amount: '',
    senderNumber: '',
    transactionId: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuickAdd = (amount: number) => {
    setFormData({
      ...formData,
      amount: amount.toString()
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const amount = parseInt(formData.amount);
    if (amount < 50) {
      alert('Minimum amount is ৳50');
      return;
    }

    try {
      await createAddMoneyRequest({
        userId: user.uid,
        amount,
        senderNumber: formData.senderNumber,
        transactionId: formData.transactionId,
        status: 'pending'
      });

      // Reset form
      setFormData({
        amount: '',
        senderNumber: '',
        transactionId: ''
      });
    } catch (error) {
      console.error('Add money request error:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `৳ ${amount.toLocaleString()}`;
  };

  if (!user) return null;

  return (
    <Layout>
      <section className="py-16 bg-gaming-dark min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Wallet Management</h1>
            <p className="text-gray-400 text-lg">Manage your wallet balance and add money</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Balance Card */}
            <Card className="bg-gradient-to-br from-gaming-primary to-gaming-secondary border-0">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <WalletIcon className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">Current Balance</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-white">
                <p className="text-5xl font-bold mb-4">{formatCurrency(user.wallet)}</p>
                <p className="text-blue-100 mb-6">Available for purchases</p>
                
                {/* Quick Add Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={() => handleQuickAdd(500)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0"
                  >
                    +৳500
                  </Button>
                  <Button
                    onClick={() => handleQuickAdd(1000)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0"
                  >
                    +৳1000
                  </Button>
                  <Button
                    onClick={() => handleQuickAdd(2000)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0"
                  >
                    +৳2000
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Add Money Form */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Plus className="h-6 w-6 mr-2" />
                  Add Money to Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="amount" className="text-gray-300">
                      Amount (BDT)
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="Enter amount"
                      min="50"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-gaming-primary focus:border-gaming-primary"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">Minimum amount: ৳50</p>
                  </div>

                  <div>
                    <Label htmlFor="senderNumber" className="text-gray-300">
                      Sender Mobile Number
                    </Label>
                    <Input
                      id="senderNumber"
                      name="senderNumber"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={formData.senderNumber}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-gaming-primary focus:border-gaming-primary"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="transactionId" className="text-gray-300">
                      Transaction ID
                    </Label>
                    <Input
                      id="transactionId"
                      name="transactionId"
                      type="text"
                      placeholder="Enter bKash/Nagad transaction ID"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-gaming-primary focus:border-gaming-primary"
                      required
                    />
                  </div>

                  {/* Payment Methods */}
                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Supported Payment Methods
                      </h4>
                      <div className="flex space-x-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">bK</span>
                          </div>
                          <span className="text-gray-300">bKash</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">N</span>
                          </div>
                          <span className="text-gray-300">Nagad</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gaming-accent hover:bg-green-600 text-white"
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Wallet;
