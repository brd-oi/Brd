import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Swords, ShoppingCart, Tag, Star, Zap } from "lucide-react";
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
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-orange-500',
      mythical: 'bg-red-500'
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
      <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 group">
        <CardHeader className="pb-2">
          <div className="relative">
            <img 
              src={creature.image_url} 
              alt={creature.name}
              className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-300"
            />
            <Badge className={`absolute top-2 right-2 ${getRarityColor(creature.rarity)}`}>
              {creature.rarity}
            </Badge>
          </div>
          <CardTitle className="text-lg">{creature.name}</CardTitle>
          <CardDescription className="text-sm">
            {creature.species_mix?.join(' × ')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {creature.attributes && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span>STR:</span>
                <span className="font-semibold">{creature.attributes.strength}</span>
              </div>
              <div className="flex justify-between">
                <span>AGI:</span>
                <span className="font-semibold">{creature.attributes.agility}</span>
              </div>
              <div className="flex justify-between">
                <span>INT:</span>
                <span className="font-semibold">{creature.attributes.intelligence}</span>
              </div>
              <div className="flex justify-between">
                <span>MAG:</span>
                <span className="font-semibold">{creature.attributes.magic}</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Power:</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="font-bold">{getAttributeTotal(creature.attributes)}</span>
            </div>
          </div>

          {showPrice && (
            <div className="flex items-center justify-between p-2 bg-primary/5 rounded-lg">
              <span className="text-sm font-semibold">Price:</span>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-primary" />
                <span className="font-bold">{price} BRD</span>
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
              />
              <Button 
                onClick={() => onList(creature.id, listPrice)}
                className="w-full"
                size="sm"
              >
                <Tag className="w-3 h-3 mr-1" />
                List for Sale
              </Button>
            </div>
          )}

          {showPrice && !isOwned && (
            <Button 
              onClick={() => onBuy(creature.tradeId, price)}
              className="w-full bg-primary hover:bg-primary/90"
              size="sm"
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Buy Now
            </Button>
          )}

          {showPrice && isOwned && (
            <Button 
              onClick={() => onCancel(creature.tradeId)}
              variant="outline"
              className="w-full"
              size="sm"
            >
              Cancel Listing
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-brd-light/20 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to access the trading marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/">
              <Button>Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              Creature Trading
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="my-creatures" className="flex items-center gap-2">
              <Swords className="w-4 h-4" />
              My Creatures
            </TabsTrigger>
            <TabsTrigger value="my-trades" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              My Listings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Marketplace</CardTitle>
                <CardDescription>
                  Browse and purchase creatures from other players
                </CardDescription>
              </CardHeader>
            </Card>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading marketplace...</p>
              </div>
            ) : marketCreatures.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No creatures for sale</h3>
                <p className="text-muted-foreground">Be the first to list a creature on the marketplace!</p>
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
            <Card>
              <CardHeader>
                <CardTitle>My Creatures</CardTitle>
                <CardDescription>
                  Manage your creature collection and list them for sale
                </CardDescription>
              </CardHeader>
            </Card>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your creatures...</p>
              </div>
            ) : myCreatures.length === 0 ? (
              <div className="text-center py-12">
                <Swords className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No creatures yet</h3>
                <p className="text-muted-foreground mb-4">Start hatching to build your collection!</p>
                <Link to="/hatching">
                  <Button>
                    <Zap className="w-4 h-4 mr-2" />
                    Start Hatching
                  </Button>
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
            <Card>
              <CardHeader>
                <CardTitle>My Listings</CardTitle>
                <CardDescription>
                  Track your active and completed trades
                </CardDescription>
              </CardHeader>
            </Card>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your trades...</p>
              </div>
            ) : myTrades.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No active listings</h3>
                <p className="text-muted-foreground">List your creatures to start trading!</p>
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