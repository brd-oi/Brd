import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Swords, ShoppingCart, Tag, Star, Zap, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Trading = () => {
  const [user, setUser] = useState(null);
  const [myCreatures, setMyCreatures] = useState([]);
  const [marketCreatures, setMarketCreatures] = useState([]);
  const [myTrades, setMyTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadMyCreatures(),
        loadMarketCreatures(),
        loadMyTrades()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyCreatures = async () => {
    try {
      const { data: userData } = await supabase
        .from('users_2025_11_20_15_49')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (userData) {
        const { data, error } = await supabase
          .from('characters_2025_11_20_15_49')
          .select('*')
          .eq('owner_id', userData.id)
          .eq('is_tradeable', true);

        if (error) throw error;
        setMyCreatures(data || []);
      }
    } catch (error: any) {
      console.error('Error loading my creatures:', error);
    }
  };

  const loadMarketCreatures = async () => {
    try {
      const { data, error } = await supabase
        .from('trades_2025_11_20_15_49')
        .select(`
          *,
          characters_2025_11_20_15_49 (*),
          users_2025_11_20_15_49!seller_id (username)
        `)
        .eq('status', 'active');

      if (error) throw error;
      setMarketCreatures(data || []);
    } catch (error: any) {
      console.error('Error loading market creatures:', error);
    }
  };

  const loadMyTrades = async () => {
    try {
      const { data: userData } = await supabase
        .from('users_2025_11_20_15_49')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (userData) {
        const { data, error } = await supabase
          .from('trades_2025_11_20_15_49')
          .select(`
            *,
            characters_2025_11_20_15_49 (*)
          `)
          .eq('seller_id', userData.id);

        if (error) throw error;
        setMyTrades(data || []);
      }
    } catch (error: any) {
      console.error('Error loading my trades:', error);
    }
  };

  const listForSale = async (creatureId: string, price: string) => {
    if (!price || parseFloat(price) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: userData } = await supabase
        .from('users_2025_11_20_15_49')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!userData) throw new Error('User not found');

      const { error } = await supabase
        .from('trades_2025_11_20_15_49')
        .insert({
          seller_id: userData.id,
          character_id: creatureId,
          price_tokens: parseFloat(price)
        });

      if (error) throw error;

      toast({
        title: "Listed for sale",
        description: "Your creature has been listed on the marketplace.",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Listing failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const buyCreature = async (tradeId: string, price: number) => {
    try {
      const { data: userData } = await supabase
        .from('users_2025_11_20_15_49')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!userData) throw new Error('User not found');

      // In a real app, you'd handle the token transfer here
      // For demo purposes, we'll just update the trade status

      const { error: tradeError } = await supabase
        .from('trades_2025_11_20_15_49')
        .update({
          buyer_id: userData.id,
          status: 'sold',
          completed_at: new Date().toISOString()
        })
        .eq('id', tradeId);

      if (tradeError) throw tradeError;

      // Transfer ownership of the character
      const { data: tradeData } = await supabase
        .from('trades_2025_11_20_15_49')
        .select('character_id')
        .eq('id', tradeId)
        .single();

      if (tradeData) {
        const { error: ownerError } = await supabase
          .from('characters_2025_11_20_15_49')
          .update({ owner_id: userData.id })
          .eq('id', tradeData.character_id);

        if (ownerError) throw ownerError;
      }

      toast({
        title: "Purchase successful",
        description: `You bought the creature for ${price} BRD tokens.`,
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Purchase failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const cancelTrade = async (tradeId: string) => {
    try {
      const { error } = await supabase
        .from('trades_2025_11_20_15_49')
        .update({ status: 'cancelled' })
        .eq('id', tradeId);

      if (error) throw error;

      toast({
        title: "Trade cancelled",
        description: "Your listing has been removed from the marketplace.",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Cancellation failed",
        description: error.message,
        variant: "destructive",
      });
    }
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

  const getAttributeTotal = (attributes: any) => {
    if (!attributes) return 0;
    return Object.values(attributes).reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0);
  };

  const CreatureCard = ({ creature, showPrice = false, price = 0, onList, onBuy, onCancel, isOwned = false }: any) => {
    const [listPrice, setListPrice] = useState("");

    return (
      <div className="rounded-[20px] overflow-hidden transition-all duration-300 group" style={{
        background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,138,47,0.2)'
      }}>
        <div className="p-4">
          <div className="relative mb-3">
            <img 
              src={creature.image_url} 
              alt={creature.name}
              className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
            <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-white font-bold text-xs ${getRarityColor(creature.rarity)}`} style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
              {creature.rarity}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>{creature.name}</h3>
          <p className="text-sm text-[#F6DAB5] mb-3">
            {creature.species_mix?.join(' × ')}
          </p>
          {creature.attributes && (
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="flex justify-between text-[#F6DAB5]">
                <span>STR:</span>
                <span className="font-semibold text-white">{creature.attributes.strength}</span>
              </div>
              <div className="flex justify-between text-[#F6DAB5]">
                <span>AGI:</span>
                <span className="font-semibold text-white">{creature.attributes.agility}</span>
              </div>
              <div className="flex justify-between text-[#F6DAB5]">
                <span>INT:</span>
                <span className="font-semibold text-white">{creature.attributes.intelligence}</span>
              </div>
              <div className="flex justify-between text-[#F6DAB5]">
                <span>MAG:</span>
                <span className="font-semibold text-white">{creature.attributes.magic}</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-[#F6DAB5]">Total Power:</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="font-bold text-white">{String(getAttributeTotal(creature.attributes))}</span>
            </div>
          </div>

          {showPrice && (
            <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg mb-3">
              <span className="text-sm font-semibold text-[#F6DAB5]">Price:</span>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-[#FF8A2F]" />
                <span className="font-bold text-white">{price} BRD</span>
              </div>
            </div>
          )}

          {isOwned && !showPrice && (
            <div className="space-y-2">
              <Input
                placeholder="Price in BRD tokens"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
                type="number"
                min="0.1"
                step="0.1"
                className="bg-black/30 border-orange-900/50 text-white placeholder:text-[#F6DAB5]/50"
              />
              <button 
                onClick={() => onList(creature.id, listPrice)}
                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-[#FF7A22] to-[#FFAA33] text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(255,122,34,0.5)] transition-shadow flex items-center justify-center"
                style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}
              >
                <Tag className="w-3 h-3 mr-1" />
                List for Sale
              </button>
            </div>
          )}

          {showPrice && !isOwned && (
            <button 
              onClick={() => onBuy(creature.tradeId, price)}
              className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-[#FF7A22] to-[#FFAA33] text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(255,122,34,0.5)] transition-shadow flex items-center justify-center"
              style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Buy Now
            </button>
          )}

          {showPrice && isOwned && (
            <button 
              onClick={() => onCancel(creature.tradeId)}
              className="w-full py-2 px-4 rounded-xl bg-black/30 border border-orange-900/50 text-white hover:bg-black/50 transition-colors text-sm flex items-center justify-center"
              style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}
            >
              Cancel Listing
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen relative flex items-center justify-center" style={{
        background: 'linear-gradient(180deg, #0C0F1D 0%, #2A1A14 30%, #5A2A18 60%, #8C3A14 100%)'
      }}>
        <div className="rounded-[20px] p-8 max-w-md mx-4" style={{
          background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
        }}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>Connect Wallet</h2>
            <p className="text-[#F6DAB5] mb-6 text-sm">
              Please connect your wallet to access the trading marketplace.
            </p>
            <Link to="/">
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF7A22] to-[#FFAA33] text-white font-bold hover:shadow-[0_0_20px_rgba(255,122,34,0.5)] transition-shadow flex items-center justify-center mx-auto" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                Go to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A22] to-[#FFAA33] text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(255,122,34,0.5)] transition-shadow flex items-center justify-center" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif', letterSpacing: '0.05em' }}>
              Creature Trading
            </h1>
          </div>
          {!user && (
            <div className="flex items-center space-x-4">
              <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#FF7A22] to-[#FFAA33] text-white font-bold hover:shadow-[0_0_20px_rgba(255,122,34,0.5)] transition-shadow flex items-center justify-center" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/30 border border-orange-900/30 p-1" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
            <TabsTrigger value="marketplace" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF7A22] data-[state=active]:to-[#FFAA33] data-[state=active]:text-white text-[#F6DAB5]">
              <ShoppingCart className="w-4 h-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="my-creatures" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF7A22] data-[state=active]:to-[#FFAA33] data-[state=active]:text-white text-[#F6DAB5]">
              <Swords className="w-4 h-4" />
              My Creatures
            </TabsTrigger>
            <TabsTrigger value="my-trades" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF7A22] data-[state=active]:to-[#FFAA33] data-[state=active]:text-white text-[#F6DAB5]">
              <Tag className="w-4 h-4" />
              My Listings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="rounded-[20px] p-6" style={{
              background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
            }}>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>Marketplace</h2>
              <p className="text-[#F6DAB5] text-sm">
                Browse and purchase creatures from other players
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-[#FF8A2F] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-[#F6DAB5]" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>Loading marketplace...</p>
              </div>
            ) : marketCreatures.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-[#F6DAB5]/50" />
                <h3 className="text-lg font-semibold mb-2 text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>No creatures for sale</h3>
                <p className="text-[#F6DAB5]">Be the first to list a creature on the marketplace!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {marketCreatures.map((trade: any) => (
                  <CreatureCard
                    key={trade.id}
                    creature={{
                      ...trade.characters_2025_11_20_15_49,
                      tradeId: trade.id
                    }}
                    showPrice={true}
                    price={trade.price_tokens}
                    onBuy={buyCreature}
                    isOwned={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-creatures" className="space-y-6">
            <div className="rounded-[20px] p-6" style={{
              background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
            }}>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>My Creatures</h2>
              <p className="text-[#F6DAB5] text-sm">
                Manage your creature collection and list them for sale
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-[#FF8A2F] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-[#F6DAB5]" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>Loading your creatures...</p>
              </div>
            ) : myCreatures.length === 0 ? (
              <div className="text-center py-12">
                <Swords className="w-16 h-16 mx-auto mb-4 text-[#F6DAB5]/50" />
                <h3 className="text-lg font-semibold mb-2 text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>No creatures yet</h3>
                <p className="text-[#F6DAB5] mb-4">Start hatching to build your collection!</p>
                <Link to="/hatching">
                  <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF7A22] to-[#FFAA33] text-white font-bold hover:shadow-[0_0_20px_rgba(255,122,34,0.5)] transition-shadow flex items-center justify-center" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                    <Zap className="w-4 h-4 mr-2" />
                    Start Hatching
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myCreatures.map((creature: any) => (
                  <CreatureCard
                    key={creature.id}
                    creature={creature}
                    onList={listForSale}
                    isOwned={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-trades" className="space-y-6">
            <div className="rounded-[20px] p-6" style={{
              background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
            }}>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>My Listings</h2>
              <p className="text-[#F6DAB5] text-sm">
                Track your active and completed trades
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-[#FF8A2F] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-[#F6DAB5]" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>Loading your trades...</p>
              </div>
            ) : myTrades.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="w-16 h-16 mx-auto mb-4 text-[#F6DAB5]/50" />
                <h3 className="text-lg font-semibold mb-2 text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>No active listings</h3>
                <p className="text-[#F6DAB5]">List your creatures to start trading!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myTrades.map((trade: any) => (
                  <CreatureCard
                    key={trade.id}
                    creature={{
                      ...trade.characters_2025_11_20_15_49,
                      tradeId: trade.id
                    }}
                    showPrice={true}
                    price={trade.price_tokens}
                    onCancel={cancelTrade}
                    isOwned={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Trading;