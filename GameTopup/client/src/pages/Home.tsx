import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import GameCard from '../components/GameCard';
import PackageModal from '../components/PackageModal';
import { Button } from '@/components/ui/button';
import { CheckCircle, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { games, selectedGame, setSelectedGame } = useApp();
  const [isPackageModalOpen, setIsPackageModalOpen] = React.useState(false);

  const handleGameSelect = (game: any) => {
    setSelectedGame(game);
    setIsPackageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPackageModalOpen(false);
    setSelectedGame(null);
  };

  if (!user) return null;

  // Calculate user stats (mock data for demo)
  const userStats = {
    completedOrders: 47,
    totalSpent: 8350,
    savedAmount: 420
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Message & Quick Stats */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome Back, <span className="text-gaming-accent">{user.name}</span>!
            </h2>
            <p className="text-xl text-gray-300 mb-8">Top up your favorite games instantly with secure transactions</p>
            
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <StatsCard
                title="Completed Orders"
                value={userStats.completedOrders}
                subtitle=""
                icon={<CheckCircle className="h-6 w-6 text-white" />}
                color="primary"
              />
              <StatsCard
                title="Total Spent"
                value={`৳ ${userStats.totalSpent.toLocaleString()}`}
                subtitle=""
                icon={<DollarSign className="h-6 w-6 text-white" />}
                color="accent"
              />
              <StatsCard
                title="Money Saved"
                value={`৳ ${userStats.savedAmount}`}
                subtitle=""
                icon={<TrendingUp className="h-6 w-6 text-white" />}
                color="warning"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/wallet">
              <Button className="bg-gaming-accent hover:bg-green-600 text-white">
                Add Money to Wallet
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline" className="border-gaming-primary text-gaming-primary hover:bg-gaming-primary hover:text-white">
                View Order History
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16 bg-gaming-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Popular Games</h2>
            <p className="text-gray-400 text-lg">Top up your favorite games instantly</p>
          </div>

          {/* Show first 6 games */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.slice(0, 6).map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onSelect={handleGameSelect}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/games">
              <Button variant="outline" className="border-gaming-primary text-gaming-primary hover:bg-gaming-primary hover:text-white">
                View All Games
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Package Modal */}
      <PackageModal
        game={selectedGame}
        isOpen={isPackageModalOpen}
        onClose={handleCloseModal}
      />
    </Layout>
  );
};

export default Home;
