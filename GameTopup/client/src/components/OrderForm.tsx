import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Game, GamePackage } from '../types';
import { ArrowLeft, Package, CreditCard } from 'lucide-react';

interface OrderFormProps {
  game: Game;
  selectedPackage: GamePackage;
  onBack: () => void;
  onSuccess: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ game, selectedPackage, onBack, onSuccess }) => {
  const { user } = useAuth();
  const { createOrder, loading } = useFirestore();
  const [gameUserId, setGameUserId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !gameUserId.trim()) return;

    if (user.wallet < selectedPackage.price) {
      alert('Insufficient wallet balance. Please add money to your wallet first.');
      return;
    }

    setIsProcessing(true);
    try {
      await createOrder({
        userId: user.uid,
        game: game.name,
        package: selectedPackage.name,
        gameUserId: gameUserId.trim(),
        amount: selectedPackage.price,
        status: 'pending'
      });

      // Reset form and trigger success callback
      setGameUserId('');
      onSuccess();
    } catch (error) {
      console.error('Order creation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `৳ ${amount.toLocaleString()}`;
  };

  const remainingBalance = user ? user.wallet - selectedPackage.price : 0;
  const hasInsufficientFunds = user ? user.wallet < selectedPackage.price : true;

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="absolute left-4 top-4 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="bg-gaming-primary p-3 rounded-full">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Complete Your Order</CardTitle>
          <p className="text-gray-400">Enter your game details to finalize the purchase</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Summary */}
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Game:</span>
                  <span className="text-white font-semibold">{game.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Package:</span>
                  <span className="text-white font-semibold">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Currency:</span>
                  <span className="text-white font-semibold">{selectedPackage.currency}</span>
                </div>
                <Separator className="bg-gray-600 my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Total:</span>
                  <span className="text-gaming-accent font-bold text-xl">
                    {formatCurrency(selectedPackage.price)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game User ID Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="gameUserId" className="text-gray-300 font-medium">
                Game User ID *
              </Label>
              <Input
                id="gameUserId"
                type="text"
                placeholder={`Enter your ${game.name} user ID`}
                value={gameUserId}
                onChange={(e) => setGameUserId(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-gaming-primary focus:border-gaming-primary mt-2"
                required
                disabled={isProcessing || loading}
              />
              <p className="text-xs text-gray-400 mt-1">
                Double-check your user ID to ensure successful delivery
              </p>
            </div>

            {/* Wallet Balance Information */}
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-3">Wallet Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Current Balance:</span>
                    <span className="text-white font-semibold">
                      {user ? formatCurrency(user.wallet) : '৳ 0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Order Total:</span>
                    <span className="text-white font-semibold">
                      -{formatCurrency(selectedPackage.price)}
                    </span>
                  </div>
                  <Separator className="bg-gray-600" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Remaining Balance:</span>
                    <span className={`font-semibold ${hasInsufficientFunds ? 'text-red-400' : 'text-gaming-accent'}`}>
                      {formatCurrency(Math.max(0, remainingBalance))}
                    </span>
                  </div>
                  {hasInsufficientFunds && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-3">
                      <p className="text-red-400 text-sm">
                        Insufficient balance. Please add money to your wallet first.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                disabled={isProcessing || loading}
              >
                Back to Packages
              </Button>
              <Button
                type="submit"
                disabled={
                  isProcessing || 
                  loading || 
                  !gameUserId.trim() || 
                  hasInsufficientFunds
                }
                className="flex-1 bg-gaming-primary hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing || loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Confirm Order'
                )}
              </Button>
            </div>

            {/* Security Notice */}
            <div className="bg-gaming-primary/10 border border-gaming-primary/20 rounded-lg p-3 mt-4">
              <p className="text-gaming-primary text-xs text-center">
                🔒 Your order will be processed securely. Delivery typically takes 5-15 minutes.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderForm;
