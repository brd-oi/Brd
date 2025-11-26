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
      rare: 'bg-[#E64A26]',
      epic: 'bg-[#EB3A1C]',
      legendary: 'bg-[#FF8A2F]',
      mythical: 'bg-[#EB3A1C]'
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
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(180deg, #0C0F1D 0%, #2A1A14 30%, #5A2A18 60%, #8C3A14 100%)'
    }}>
      {/* Ambient lighting effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>
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
      <header className="border-b border-orange-900/30 backdrop-blur-sm bg-black/20 relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A22] to-[#FFAA33] text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(255,122,34,0.5)] transition-shadow">
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Back to Home
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif', letterSpacing: '0.05em' }}>
              Creature Hatching
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hatching Form */}
          <div className="rounded-[20px] overflow-hidden" style={{
            background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
          }}>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-[#FF8A2F]" />
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif', letterSpacing: '0.03em' }}>
                  Start New Hatch
                </h2>
              </div>
              <p className="text-[#F6DAB5] text-sm mb-6">
                Lock your BRD tokens to create unique crossbreed creatures. Longer locks and higher amounts increase rarity chances.
              </p>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="tokenAmount" className="text-white font-semibold text-sm" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                  Token Amount (BRD)
                </label>
                <Input
                  id="tokenAmount"
                  type="number"
                  placeholder="Enter amount to lock"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  min="1"
                  step="0.1"
                  className="bg-black/30 border-orange-900/50 text-white placeholder:text-[#F6DAB5]/50 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lockDuration" className="text-white font-semibold text-sm" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                  Lock Duration
                </label>
                <Select value={lockDuration} onValueChange={setLockDuration}>
                  <SelectTrigger className="bg-black/30 border-orange-900/50 text-white rounded-xl">
                    <SelectValue placeholder="Select lock period" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#3A1F17] border-orange-900/50">
                    <SelectItem value="1" className="text-white">1 Day (Common chance)</SelectItem>
                    <SelectItem value="3" className="text-white">3 Days (Rare chance)</SelectItem>
                    <SelectItem value="7" className="text-white">7 Days (Epic chance)</SelectItem>
                    <SelectItem value="14" className="text-white">14 Days (Legendary chance)</SelectItem>
                    <SelectItem value="30" className="text-white">30 Days (Mythical chance)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tokenAmount && lockDuration && (
                <div className="p-4 bg-black/20 rounded-xl border border-orange-900/30">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                    <Sparkles className="w-4 h-4 text-[#E5B468]" />
                    Predicted Rarity
                  </h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-white font-bold text-xs ${getRarityColor(calculateRarity(parseInt(lockDuration), parseFloat(tokenAmount)))}`}>
                    {calculateRarity(parseInt(lockDuration), parseFloat(tokenAmount)).toUpperCase()}
                  </span>
                </div>
              )}

              <button
                onClick={startHatching}
                disabled={isHatching || !user}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#FF7A22] to-[#FFAA33] text-white font-bold hover:shadow-[0_0_20px_rgba(255,122,34,0.5)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}
              >
                {isHatching ? (
                  <>
                    <Clock className="w-4 h-4 inline mr-2 animate-spin" />
                    Starting Hatch...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 inline mr-2" />
                    Start Hatching
                  </>
                )}
              </button>

              {!user && (
                <p className="text-sm text-[#F6DAB5] text-center">
                  Connect your wallet to start hatching creatures
                </p>
              )}
            </div>
            </div>
          </div>

          {/* Active Hatches */}
          <div className="rounded-[20px] overflow-hidden" style={{
            background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
          }}>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-[#FF8A2F]" />
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif', letterSpacing: '0.03em' }}>
                  Active Hatches
                </h2>
              </div>
              <p className="text-[#F6DAB5] text-sm mb-6">
                Track your creatures currently hatching
              </p>
            <div className="p-0">
              <div className="w-full max-w-md mx-auto" style={{ aspectRatio: '2/3' }}>
                {activeHatches.length === 0 ? (
                  // No active hatches: show background video with overlay
                  <div
                    className="relative w-full h-full rounded-[20px] overflow-hidden"
                    style={{
                      border: '3px solid',
                      borderImage: 'linear-gradient(135deg, #FF7A22, #FFAA33) 1',
                      boxShadow: '0 0 20px rgba(255, 122, 34, 0.3)'
                    }}
                  >
                    {/* Background video fill */}
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    >
                      <source src="/images/20251125_2312_video.mp4" type="video/mp4" />
                    </video>

                    {/* Gradient overlay for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />

                    {/* Centered icon */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
                      <Clock className="w-12 h-12 opacity-80" />
                    </div>

                    {/* Bottom messages */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                      <p className="text-lg font-semibold text-white mb-2 drop-shadow-md">No active hatches</p>
                      <p className="text-sm text-white opacity-90 drop-shadow-md">Start your first hatch to see progress here</p>
                    </div>
                  </div>
                ) : (
                  // Active hatch: show egg video with overlaid stats
                  (() => {
                    const hatch = activeHatches[0];
                    const progress = getProgress(hatch.locked_at, hatch.unlock_at);
                    const eggVideo = getEggVideo(hatch.characters_2025_11_20_15_49?.[0]?.species_mix || []);

                    return (
                      <div
                        key={hatch.id}
                        className="relative w-full h-full rounded-[20px] overflow-hidden"
                        style={{
                          border: '3px solid',
                          borderImage: 'linear-gradient(135deg, #FF7A22, #FFAA33) 1',
                          boxShadow: '0 0 20px rgba(255, 122, 34, 0.3)'
                        }}
                      >
                        {/* Video background fill */}
                        <video
                          src={eggVideo}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Gradient overlay for text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

                        {/* Top info overlay */}
                        <div className="absolute top-0 left-0 right-0 p-4 z-10">
                          <div className="flex justify-between items-start">
                            <div className="text-white">
                              <div className="flex items-center gap-2 mb-1">
                                <Coins className="w-4 h-4" />
                                <span className="font-semibold text-sm">{hatch.token_amount} BRD</span>
                              </div>
                              <p className="text-xs opacity-90">
                                {hatch.lock_duration_days} day lock
                              </p>
                            </div>
                            <span className="text-xs px-3 py-1 rounded-full bg-[#FF8A2F] text-white font-bold" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                              {getTimeRemaining(hatch.unlock_at)}
                            </span>
                          </div>
                        </div>

                        {/* Bottom progress overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-white">
                              <span>Progress</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Second hatch indicator */}
                          {activeHatches.length > 1 && (
                            <p className="text-xs text-white/80 text-center mt-3 opacity-90">
                              +{activeHatches.length - 1} more hatching
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Rarity Guide */}
        <div className="mt-8 rounded-[20px] overflow-hidden" style={{
          background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
        }}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif', letterSpacing: '0.03em' }}>
              Rarity Guide
            </h2>
            <p className="text-[#F6DAB5] text-sm mb-6">
              Understanding creature rarities and how to achieve them
            </p>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { rarity: 'Common', color: 'bg-gray-500', requirement: '< 50 points' },
                { rarity: 'Rare', color: 'bg-blue-500', requirement: '50-199 points' },
                { rarity: 'Epic', color: 'bg-purple-500', requirement: '200-499 points' },
                { rarity: 'Legendary', color: 'bg-orange-500', requirement: '500-999 points' },
                { rarity: 'Mythical', color: 'bg-red-500', requirement: '1000+ points' }
              ].map((item) => (
                <div key={item.rarity} className="text-center p-4 border border-orange-900/30 rounded-xl bg-black/20">
                  <span className={`inline-block px-3 py-1 rounded-full text-white font-bold text-xs mb-2 ${item.color}`} style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                    {item.rarity}
                  </span>
                  <p className="text-xs text-[#F6DAB5]">
                    {item.requirement}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#F6DAB5] mt-4 text-center">
              Points = Lock Duration (days) × Token Amount (BRD)
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hatching;