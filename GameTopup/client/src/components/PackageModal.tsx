import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Game, GamePackage } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PackageModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

const PackageModal: React.FC<PackageModalProps> = ({ game, isOpen, onClose }) => {
  const { user } = useAuth();
  const { createOrder, loading } = useFirestore();
  const [selectedPackage, setSelectedPackage] = useState<GamePackage | null>(null);
  const [gameUserId, setGameUserId] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);

  const handlePackageSelect = (pkg: GamePackage) => {
    setSelectedPackage(pkg);
    setShowOrderForm(true);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !game || !selectedPackage || !gameUserId.trim()) return;

    if (user.wallet < selectedPackage.price) {
      alert('Insufficient wallet balance');
      return;
    }

    try {
      await createOrder({
        userId: user.uid,
        game: game.name,
        package: selectedPackage.name,
        gameUserId: gameUserId.trim(),
        amount: selectedPackage.price,
        status: 'pending'
      });

      // Reset form and close modal
      setSelectedPackage(null);
      setGameUserId('');
      setShowOrderForm(false);
      onClose();
    } catch (error) {
      console.error('Order creation error:', error);
    }
  };

  const handleBack = () => {
    setShowOrderForm(false);
    setSelectedPackage(null);
    setGameUserId('');
  };

  const formatCurrency = (amount: number) => {
    return `৳ ${amount.toLocaleString()}`;
  };

  if (!game) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {showOrderForm ? 'Complete Your Order' : `${game.name} Packages`}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {showOrderForm ? 'Enter your game details to complete the order' : 'Choose your preferred package'}
          </DialogDescription>
        </DialogHeader>

        {!showOrderForm ? (
          // Package Selection
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {game.packages.map((pkg) => (
              <Card key={pkg.id} className="bg-gray-700 border-gray-600 hover:border-gaming-primary transition-all duration-300 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="bg-gradient-to-br from-gaming-primary to-gaming-secondary p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">💎</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-2xl font-bold text-gaming-accent mb-3">{formatCurrency(pkg.price)}</p>
                  <p className="text-gray-400 text-sm mb-4">Instant delivery • No extra fees</p>
                  <Button 
                    onClick={() => handlePackageSelect(pkg)}
                    className="w-full bg-gaming-primary hover:bg-blue-600 text-white transition-colors duration-200"
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Order Form
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Game:</span>
                    <span className="text-white font-semibold">{game.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Package:</span>
                    <span className="text-white font-semibold">{selectedPackage?.name}</span>
                  </div>
                  <Separator className="bg-gray-600" />
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-gaming-accent font-bold text-xl">
                      {selectedPackage && formatCurrency(selectedPackage.price)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game User ID Form */}
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <Label htmlFor="gameUserId" className="text-gray-300">
                  Game User ID
                </Label>
                <Input
                  id="gameUserId"
                  type="text"
                  placeholder="Enter your game user ID"
                  value={gameUserId}
                  onChange={(e) => setGameUserId(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-gaming-primary focus:border-gaming-primary"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Make sure your user ID is correct</p>
              </div>

              {/* Wallet Balance Check */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Current Balance:</span>
                    <span className="text-white font-semibold">{user && formatCurrency(user.wallet)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-300">After Purchase:</span>
                    <span className="text-gaming-accent font-semibold">
                      {user && selectedPackage && formatCurrency(user.wallet - selectedPackage.price)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !gameUserId.trim() || (user && selectedPackage ? user.wallet < selectedPackage.price : true)}
                  className="flex-1 bg-gaming-primary hover:bg-blue-600 text-white"
                >
                  {loading ? 'Processing...' : 'Confirm Order'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PackageModal;
