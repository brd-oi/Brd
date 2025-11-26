import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Zap, Clock, Coins, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Hatching = () => {
  const [user, setUser] = useState(null);
  const [tokenAmount, setTokenAmount] = useState("");
  const [lockDuration, setLockDuration] = useState("");
  const [isHatching, setIsHatching] = useState(false);
  const [activeHatches, setActiveHatches] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadActiveHatches();
    }
  }, [user]);

  const loadActiveHatches = async () => {
    try {
      const { data, error } = await supabase
        .from('token_locks_2025_11_20_15_49')
        .select(`
          *,
          characters_2025_11_20_15_49 (*)
        `)
        .eq('is_unlocked', false);

      if (error) throw error;
      setActiveHatches(data || []);
    } catch (error: any) {
      console.error('Error loading hatches:', error);
    }
  };

  const startHatching = async () => {
    if (!user) {
      toast({
        title: "Connect wallet first",
        description: "Please connect your wallet to start hatching.",
        variant: "destructive",
      });
      return;
    }

    if (!tokenAmount || !lockDuration) {
      toast({
        title: "Missing information",
        description: "Please enter token amount and select lock duration.",
        variant: "destructive",
      });
      return;
    }

    setIsHatching(true);
    try {
      // First, ensure user exists in our users table
      const { data: userData, error: userError } = await supabase
        .from('users_2025_11_20_15_49')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      let userId = userData?.id;

      if (!userData) {
        // Create user record
        const { data: newUser, error: createError } = await supabase
          .from('users_2025_11_20_15_49')
          .insert({
            auth_id: user.id,
            username: user.email?.split('@')[0] || 'player'
          })
          .select('id')
          .single();

        if (createError) throw createError;
        userId = newUser.id;
      }

      // Calculate unlock time
      const unlockAt = new Date();
      unlockAt.setDate(unlockAt.getDate() + parseInt(lockDuration));

      // Create token lock
      const { data: lockData, error: lockError } = await supabase
        .from('token_locks_2025_11_20_15_49')
        .insert({
          user_id: userId,
          token_amount: parseFloat(tokenAmount),
          lock_duration_days: parseInt(lockDuration),
          unlock_at: unlockAt.toISOString()
        })
        .select()
        .single();

      if (lockError) throw lockError;

      // Generate random creature attributes
      const speciesMix = generateRandomSpecies();
      const rarity = calculateRarity(parseInt(lockDuration), parseFloat(tokenAmount));
      const creatureName = generateCreatureName(speciesMix);

      // Create character
      const { error: characterError } = await supabase
        .from('characters_2025_11_20_15_49')
        .insert({
          owner_id: userId,
          name: creatureName,
          species_mix: speciesMix,
          rarity: rarity,
          image_url: getRandomCreatureImage(),
          attributes: generateAttributes(rarity),
          hatched_at: unlockAt.toISOString()
        });

      if (characterError) throw characterError;

      toast({
        title: "Hatching started!",
        description: `Your ${rarity} creature will hatch in ${lockDuration} days.`,
      });

      setTokenAmount("");
      setLockDuration("");
      loadActiveHatches();
    } catch (error: any) {
      toast({
        title: "Hatching failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsHatching(false);
    }
  };

  const generateRandomSpecies = () => {
    const species = ['Fluffling', 'Sparkwing', 'Aquafin', 'Dragonet', 'Furrball', 'Sandpaw', 'Crystalhorn', 'Moonbeam'];
    const count = Math.random() > 0.7 ? 3 : 2; // 30% chance for 3-way crossbreed
    const selected = [];
    
    for (let i = 0; i < count; i++) {
      const remaining = species.filter(s => !selected.includes(s));
      selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
    }
    
    return selected;
  };

  const calculateRarity = (days: number, amount: number) => {
    const score = days * amount;
    if (score >= 1000) return 'mythical';
    if (score >= 500) return 'legendary';
    if (score >= 200) return 'epic';
    if (score >= 50) return 'rare';
    return 'common';
  };

  const generateCreatureName = (species: string[]) => {
    const prefixes = ['Shadow', 'Fire', 'Storm', 'Crystal', 'Ancient', 'Mystic', 'Golden', 'Silver'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const hybrid = species.join('-');
    return `${prefix} ${hybrid}`;
  };

  const getRandomCreatureImage = () => {
    const images = [
      './images/20251120_0015_image.png', // Pink fluffy bird-like creature
      './images/20251120_0725_image.png', // Orange energetic creature
      './images/20251120_0026_image.png', // Colorful aquatic creature
      './images/20251120_0023_image.png', // Green baby dragon
      './images/20251120_0039_image.png', // Orange fluffy mammal
      './images/20251120_0040_image.png'  // Orange-yellow desert creature
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const generateAttributes = (rarity: string) => {
    const baseStats = {
      common: { min: 10, max: 30 },
      rare: { min: 25, max: 50 },
      epic: { min: 40, max: 70 },
      legendary: { min: 60, max: 85 },
      mythical: { min: 75, max: 100 }
    };

    const stats = baseStats[rarity as keyof typeof baseStats] || baseStats.common;
    
    return {
      strength: Math.floor(Math.random() * (stats.max - stats.min + 1)) + stats.min,
      agility: Math.floor(Math.random() * (stats.max - stats.min + 1)) + stats.min,
      intelligence: Math.floor(Math.random() * (stats.max - stats.min + 1)) + stats.min,
      magic: Math.floor(Math.random() * (stats.max - stats.min + 1)) + stats.min,
    };
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-orange-500',
      mythical: 'bg-red-500'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getTimeRemaining = (unlockAt: string) => {
    const now = new Date();
    const unlock = new Date(unlockAt);
    const diff = unlock.getTime() - now.getTime();
    
    if (diff <= 0) return "Ready to hatch!";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  const getProgress = (lockedAt: string, unlockAt: string) => {
    const now = new Date();
    const locked = new Date(lockedAt);
    const unlock = new Date(unlockAt);
    
    const total = unlock.getTime() - locked.getTime();
    const elapsed = now.getTime() - locked.getTime();
    
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const getEggVideo = (speciesMix: string[]) => {
    // Select egg video based on species mix
    // Egg 1: Even number of species or common creatures
    // Egg 2: Odd number of species or legendary creatures
    const isEgg1 = speciesMix.length % 2 === 0;
    return isEgg1 ? '/images/20251125_2322_video.mp4' : '/images/20251125_2323_video.mp4';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-brd-light/20 relative">
      {/* Background Video - Always play */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="video-background"
      >
        <source src="/images/20251125_2312_video.mp4" type="video/mp4" />
      </video>
      <div className="video-background-overlay" />
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
              Creature Hatching
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hatching Form */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Start New Hatch
              </CardTitle>
              <CardDescription>
                Lock your BRD tokens to create unique crossbreed creatures. Longer locks and higher amounts increase rarity chances.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tokenAmount">Token Amount (BRD)</Label>
                <Input
                  id="tokenAmount"
                  type="number"
                  placeholder="Enter amount to lock"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  min="1"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lockDuration">Lock Duration</Label>
                <Select value={lockDuration} onValueChange={setLockDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lock period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day (Common chance)</SelectItem>
                    <SelectItem value="3">3 Days (Rare chance)</SelectItem>
                    <SelectItem value="7">7 Days (Epic chance)</SelectItem>
                    <SelectItem value="14">14 Days (Legendary chance)</SelectItem>
                    <SelectItem value="30">30 Days (Mythical chance)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tokenAmount && lockDuration && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Predicted Rarity
                  </h4>
                  <Badge className={getRarityColor(calculateRarity(parseInt(lockDuration), parseFloat(tokenAmount)))}>
                    {calculateRarity(parseInt(lockDuration), parseFloat(tokenAmount)).toUpperCase()}
                  </Badge>
                </div>
              )}

              <Button 
                onClick={startHatching} 
                disabled={isHatching || !user}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                {isHatching ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Starting Hatch...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Start Hatching
                  </>
                )}
              </Button>

              {!user && (
                <p className="text-sm text-muted-foreground text-center">
                  Connect your wallet to start hatching creatures
                </p>
              )}
            </CardContent>
          </Card>

          {/* Active Hatches */}
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Active Hatches
              </CardTitle>
              <CardDescription>
                Track your creatures currently hatching
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeHatches.length === 0 ? (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4 w-full">
                    <div className="egg-video-container w-full rounded-lg overflow-hidden bg-black/20 border border-border/30" style={{ height: 320, maxWidth: 480 }}>
                      <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                        <source src="/images/20251125_2312_video.mp4" type="video/mp4" />
                      </video>
                    </div>
                  </div>
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active hatches</p>
                  <p className="text-sm">Start your first hatch to see progress here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeHatches.length > 0 && (() => {
                    // Display only the first active hatch
                    const hatch = activeHatches[0];
                    const progress = getProgress(hatch.locked_at, hatch.unlock_at);
                    const isHatching = progress < 100;
                    const eggVideo = getEggVideo(hatch.characters_2025_11_20_15_49?.[0]?.species_mix || []);
                    
                    return (
                      <div key={hatch.id} className="p-4 border border-border/50 rounded-lg">
                        {/* Egg Video Display */}
                        <div className="flex justify-center mb-4 w-full">
                          <div
                            className="egg-video-container w-full rounded-lg overflow-hidden bg-black/20 border border-border/30"
                            style={{ height: 320, maxWidth: '100%' }}
                          >
                            <video
                              src={eggVideo}
                              autoPlay
                              loop
                              muted
                              playsInline
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Coins className="w-4 h-4 text-accent" />
                              <span className="font-semibold">{hatch.token_amount} BRD</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {hatch.lock_duration_days} day lock
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {getTimeRemaining(hatch.unlock_at)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress 
                            value={progress} 
                            className="h-2"
                          />
                        </div>

                        {activeHatches.length > 1 && (
                          <div className="mt-4">
                            <p className="text-xs text-muted-foreground text-center mb-3">
                              +{activeHatches.length - 1} more hatching
                            </p>
                            {/* Show second hatch preview */}
                            {activeHatches[1] && (() => {
                              const second = activeHatches[1];
                              const progress2 = getProgress(second.locked_at, second.unlock_at);
                              const eggVideo2 = getEggVideo(second.characters_2025_11_20_15_49?.[0]?.species_mix || []);
                              return (
                                <div className="flex items-start gap-4">
                                  <div className="w-1/3">
                                    <div className="egg-video-container w-full rounded-lg overflow-hidden bg-black/20 border border-border/30" style={{ height: 140 }}>
                                      <video src={eggVideo2} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                  </div>
                                  <div className="flex-1 text-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Coins className="w-4 h-4 text-accent" />
                                      <span className="font-semibold">{second.token_amount} BRD</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{second.lock_duration_days} day lock</p>
                                    <div className="mt-2">
                                      <Progress value={progress2} className="h-2" />
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rarity Guide */}
        <Card className="mt-8 border-muted/20">
          <CardHeader>
            <CardTitle>Rarity Guide</CardTitle>
            <CardDescription>
              Understanding creature rarities and how to achieve them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { rarity: 'Common', color: 'bg-gray-500', requirement: '< 50 points' },
                { rarity: 'Rare', color: 'bg-blue-500', requirement: '50-199 points' },
                { rarity: 'Epic', color: 'bg-purple-500', requirement: '200-499 points' },
                { rarity: 'Legendary', color: 'bg-orange-500', requirement: '500-999 points' },
                { rarity: 'Mythical', color: 'bg-red-500', requirement: '1000+ points' }
              ].map((item) => (
                <div key={item.rarity} className="text-center p-4 border border-border/50 rounded-lg">
                  <Badge className={`${item.color} mb-2`}>
                    {item.rarity}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {item.requirement}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Points = Lock Duration (days) × Token Amount (BRD)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Hatching;