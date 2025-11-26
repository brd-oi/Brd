import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Swords, Crown, Star, Zap, Clock } from "lucide-react";

const Arena = () => {
  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(180deg, #0C0F1D 0%, #2A1A14 30%, #5A2A18 60%, #8C3A14 100%)'
    }}>
      {/* Ambient lighting effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>
      {/* Header */}
      <header className="border-b border-orange-900/30 backdrop-blur-sm bg-black/20 relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A22] to-[#FFAA33] text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(255,122,34,0.5)] transition-shadow" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Back to Home
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif', letterSpacing: '0.05em' }}>
              Arena Battles
            </h1>
            <span className="px-3 py-1 rounded-full bg-orange-900/50 text-[#F6DAB5] text-sm font-semibold" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
              Coming Soon
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Coming Soon Hero */}
        <div className="text-center py-16">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-[#FF7A22]/20 to-[#FFAA33]/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,122,34,0.3)]">
              <Trophy className="w-16 h-16 text-[#FF8A2F]" />
            </div>
            <div className="absolute -top-2 -right-2">
              <span className="px-3 py-1 rounded-full bg-[#FF8A2F] text-white font-bold text-xs animate-pulse" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                <Clock className="w-3 h-3 mr-1 inline" />
                Soon
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif', letterSpacing: '0.05em', textShadow: '0 0 30px rgba(255,122,34,0.5)' }}>
            Arena Battles
          </h1>
          <p className="text-xl text-[#F6DAB5] mb-8 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
            The ultimate battleground for your mythical creatures is coming soon. 
            Prepare your strongest beings for epic battles and legendary rewards.
          </p>
        </div>

        {/* Planned Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="rounded-[20px] p-6" style={{
            background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
          }}>
            <div className="w-12 h-12 bg-[#FF8A2F]/20 rounded-lg flex items-center justify-center mb-4">
              <Swords className="w-6 h-6 text-[#FF8A2F]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>Epic Battles</h3>
            <p className="text-[#F6DAB5] text-sm">
              Engage in turn-based combat with strategic depth. Use your creatures' unique abilities and attributes to outmaneuver opponents.
            </p>
          </div>

          <div className="rounded-[20px] p-6" style={{
            background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
          }}>
            <div className="w-12 h-12 bg-[#FF8A2F]/20 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-[#FF8A2F]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>Tournament System</h3>
            <p className="text-[#F6DAB5] text-sm">
              Participate in seasonal tournaments with massive prize pools. Climb the ranks and prove your creatures are the strongest.
            </p>
          </div>

          <div className="rounded-[20px] p-6" style={{
            background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
          }}>
            <div className="w-12 h-12 bg-[#FF8A2F]/20 rounded-lg flex items-center justify-center mb-4">
              <Crown className="w-6 h-6 text-[#FF8A2F]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>Leaderboards</h3>
            <p className="text-[#F6DAB5] text-sm">
              Track your progress on global leaderboards. Earn exclusive titles and rewards for maintaining top positions.
            </p>
          </div>
        </div>

        {/* Battle Preview */}
        <div className="rounded-[20px] mb-16 overflow-hidden" style={{
          background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
        }}>
          <div className="text-center p-6 border-b border-orange-900/30">
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>Battle System Preview</h2>
            <p className="text-[#F6DAB5] text-sm">
              Get ready for strategic creature combat with these exciting features
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                  <Star className="w-5 h-5 text-[#FF8A2F]" />
                  Combat Features
                </h3>
                <ul className="space-y-2 text-[#F6DAB5]">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FF8A2F] rounded-full"></div>
                    Turn-based strategic combat
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FF8A2F] rounded-full"></div>
                    Attribute-based damage calculation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FF8A2F] rounded-full"></div>
                    Special abilities based on species mix
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FF8A2F] rounded-full"></div>
                    Rarity bonuses and multipliers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FF8A2F] rounded-full"></div>
                    Real-time battle animations
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                  <Zap className="w-5 h-5 text-[#FF8A2F]" />
                  Rewards & Progression
                </h3>
                <ul className="space-y-2 text-[#F6DAB5]">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FF8A2F] rounded-full"></div>
                    BRD token rewards for victories
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FF8A2F] rounded-full"></div>
                    Experience points for creatures
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FF8A2F] rounded-full"></div>
                    Seasonal tournament prizes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FF8A2F] rounded-full"></div>
                    Exclusive arena-only creatures
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FF8A2F] rounded-full"></div>
                    Ranking system with titles
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Mock Leaderboard */}
        <div className="rounded-[20px] mb-16 overflow-hidden" style={{
          background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
        }}>
          <div className="p-6 border-b border-orange-900/30">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
              <Crown className="w-5 h-5 text-[#FF8A2F]" />
              Preview Leaderboard
            </h2>
            <p className="text-[#F6DAB5] text-sm">
              A glimpse of what the competitive rankings will look like
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { rank: 1, name: "DragonMaster", wins: 247, creature: "Mythical Fire-Phoenix-Dragon", power: 387 },
                { rank: 2, name: "ShadowHunter", wins: 231, creature: "Legendary Shadow-Griffin-Sphinx", power: 356 },
                { rank: 3, name: "StormRider", wins: 198, creature: "Epic Storm-Pegasus-Unicorn", power: 298 },
                { rank: 4, name: "CrystalSage", wins: 176, creature: "Legendary Crystal-Phoenix-Chimera", power: 342 },
                { rank: 5, name: "IronClaw", wins: 154, creature: "Epic Iron-Dragon-Griffin", power: 287 }
              ].map((player) => (
                <div key={player.rank} className="flex items-center justify-between p-4 border border-orange-900/30 rounded-xl bg-black/20">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      player.rank === 1 ? 'bg-yellow-500 text-yellow-900' :
                      player.rank === 2 ? 'bg-gray-400 text-gray-900' :
                      player.rank === 3 ? 'bg-orange-600 text-orange-100' :
                      'bg-[#F6DAB5]/30 text-[#F6DAB5]'
                    }`} style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                      {player.rank}
                    </div>
                    <div>
                      <p className="font-semibold text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>{player.name}</p>
                      <p className="text-sm text-[#F6DAB5]">{player.creature}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>{player.wins} Wins</p>
                    <p className="text-sm text-[#F6DAB5]">Power: {player.power}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold mb-4 text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif', letterSpacing: '0.03em' }}>Get Ready for Battle</h2>
          <p className="text-[#F6DAB5] mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
            Start building your creature collection now. The stronger your creatures, 
            the better your chances in the arena when it launches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/hatching">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF7A22] to-[#FFAA33] text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(255,122,34,0.5)] transition-shadow" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                <Zap className="w-5 h-5 mr-2 inline" />
                Start Hatching
              </button>
            </Link>
            <Link to="/trading">
              <button className="px-8 py-4 rounded-xl bg-black/30 border-2 border-orange-900/50 text-white font-bold text-lg hover:bg-black/50 transition-colors" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                <Swords className="w-5 h-5 mr-2 inline" />
                Build Collection
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arena;