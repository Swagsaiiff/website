import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onSelect }) => {
  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-gaming-primary transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer group overflow-hidden">
      <div className="relative">
        <img 
          src={game.logo} 
          alt={`${game.name} game`} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
        <p className="text-gray-400 mb-4">
          {game.packages[0]?.currency} • Starting from ৳{game.packages[0]?.price}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-gaming-accent font-semibold">
            {game.packages.length} Packages
          </span>
          <Button 
            onClick={() => onSelect(game)}
            className="bg-gaming-primary hover:bg-blue-600 text-white transition-colors duration-200"
          >
            Select Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
