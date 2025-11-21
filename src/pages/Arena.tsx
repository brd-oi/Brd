import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Swords, Crown, Star, Zap, Clock } from "lucide-react";

const Arena = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-brd-light/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Arena Battles
            </h1>
            <Badge variant="secondary" className="ml-2">
              Coming Soon
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Coming Soon Hero */}
        <div className="text-center py-16">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-16 h-16 text-primary/60" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-accent text-accent-foreground animate-pulse">
                <Clock className="w-3 h-3 mr-1" />
                Soon
              </Badge>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Arena Battles
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            The ultimate battleground for your mythical creatures is coming soon. 
            Prepare your strongest beings for epic battles and legendary rewards.
          </p>
        </div>

        {/* Planned Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Swords className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Epic Battles</CardTitle>
              <CardDescription>
                Engage in turn-based combat with strategic depth. Use your creatures' unique abilities and attributes to outmaneuver opponents.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-accent/20 hover:border-accent/40 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Tournament System</CardTitle>
              <CardDescription>
                Participate in seasonal tournaments with massive prize pools. Climb the ranks and prove your creatures are the strongest.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-muted hover:border-muted-foreground/40 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-muted/20 rounded-lg flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle>Leaderboards</CardTitle>
              <CardDescription>
                Track your progress on global leaderboards. Earn exclusive titles and rewards for maintaining top positions.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Battle Preview */}
        <Card className="border-primary/20 mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Battle System Preview</CardTitle>
            <CardDescription>
              Get ready for strategic creature combat with these exciting features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Combat Features
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Turn-based strategic combat
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Attribute-based damage calculation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Special abilities based on species mix
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Rarity bonuses and multipliers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Real-time battle animations
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Rewards & Progression
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    BRD token rewards for victories
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Experience points for creatures
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Seasonal tournament prizes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Exclusive arena-only creatures
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Ranking system with titles
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mock Leaderboard */}
        <Card className="border-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Preview Leaderboard
            </CardTitle>
            <CardDescription>
              A glimpse of what the competitive rankings will look like
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { rank: 1, name: "DragonMaster", wins: 247, creature: "Mythical Fire-Phoenix-Dragon", power: 387 },
                { rank: 2, name: "ShadowHunter", wins: 231, creature: "Legendary Shadow-Griffin-Sphinx", power: 356 },
                { rank: 3, name: "StormRider", wins: 198, creature: "Epic Storm-Pegasus-Unicorn", power: 298 },
                { rank: 4, name: "CrystalSage", wins: 176, creature: "Legendary Crystal-Phoenix-Chimera", power: 342 },
                { rank: 5, name: "IronClaw", wins: 154, creature: "Epic Iron-Dragon-Griffin", power: 287 }
              ].map((player) => (
                <div key={player.rank} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      player.rank === 1 ? 'bg-yellow-500 text-yellow-900' :
                      player.rank === 2 ? 'bg-gray-400 text-gray-900' :
                      player.rank === 3 ? 'bg-orange-600 text-orange-100' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {player.rank}
                    </div>
                    <div>
                      <p className="font-semibold">{player.name}</p>
                      <p className="text-sm text-muted-foreground">{player.creature}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{player.wins} Wins</p>
                    <p className="text-sm text-muted-foreground">Power: {player.power}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold mb-4">Get Ready for Battle</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start building your creature collection now. The stronger your creatures, 
            the better your chances in the arena when it launches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/hatching">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Zap className="w-5 h-5 mr-2" />
                Start Hatching
              </Button>
            </Link>
            <Link to="/trading">
              <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10">
                <Swords className="w-5 h-5 mr-2" />
                Build Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arena;