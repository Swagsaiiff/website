import React, { useState } from 'react';
import Layout from '../components/Layout';
import GameCard from '../components/GameCard';
import PackageModal from '../components/PackageModal';
import { useApp } from '../contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Games: React.FC = () => {
  const { games, selectedGame, setSelectedGame } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGameSelect = (game: any) => {
    setSelectedGame(game);
    setIsPackageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPackageModalOpen(false);
    setSelectedGame(null);
  };

  return (
    <Layout>
      <section className="py-16 bg-gaming-dark min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Supported Games</h1>
            <p className="text-gray-400 text-lg mb-8">Choose from our wide selection of popular games</p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-gaming-primary focus:border-gaming-primary"
              />
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onSelect={handleGameSelect}
              />
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No games found matching your search.</p>
            </div>
          )}
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

export default Games;
