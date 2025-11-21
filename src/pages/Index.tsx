import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Zap, Swords, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [user, setUser] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // For demo purposes, we'll use email auth as wallet connection
      // In a real app, you'd integrate with Web3 wallets like MetaMask
      const email = prompt("Enter your email to connect wallet:");
      if (email) {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        toast({
          title: "Check your email",
          description: "We sent you a login link to connect your wallet.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Disconnected",
      description: "Wallet disconnected successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-brd-light/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BRD
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/hatching" className="text-foreground/80 hover:text-primary transition-colors">
              Hatching
            </Link>
            <Link to="/trading" className="text-foreground/80 hover:text-primary transition-colors">
              Trading
            </Link>
            <Link to="/arena" className="text-foreground/80 hover:text-primary transition-colors opacity-50">
              Arena <Badge variant="secondary" className="ml-1 text-xs">Soon</Badge>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Wallet className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button 
                onClick={connectWallet} 
                disabled={isConnecting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            BRD Crypto Game
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Lock your tokens to create mythical crossbreed creatures.
            <br className="hidden md:block" />
            Trade legendary beings and dominate the arena.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/hatching">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                <Zap className="w-5 h-5 mr-2" />
                Start Hatching
              </Button>
            </Link>
            <Link to="/trading">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-primary/20 hover:bg-primary/10">
                <Swords className="w-5 h-5 mr-2" />
                Explore Trading
              </Button>
            </Link>
          </div>

          {/* Featured Creatures */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="relative group">
              <img 
                src="./images/20251120_0023_image.png" 
                alt="Mythical Dragon Creature" 
                className="w-full h-48 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-primary text-primary-foreground">Mythical</Badge>
              </div>
            </div>
            <div className="relative group">
              <img 
                src="./images/20251120_0026_image.png" 
                alt="Legendary Aquatic Creature" 
                className="w-full h-48 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-accent text-accent-foreground">Legendary</Badge>
              </div>
            </div>
            <div className="relative group">
              <img 
                src="./images/20251120_0015_image.png" 
                alt="Epic Fluffy Creature" 
                className="w-full h-48 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary">Epic</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Game Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Token Hatching</CardTitle>
              <CardDescription>
                Lock your BRD tokens for specific periods to hatch unique crossbreed creatures with varying rarities.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Swords className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Creature Trading</CardTitle>
              <CardDescription>
                Trade your mythical beings with other players in a decentralized marketplace powered by blockchain.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-muted hover:border-muted-foreground/40 transition-colors opacity-75">
            <CardHeader>
              <div className="w-12 h-12 bg-muted/20 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle className="flex items-center gap-2">
                Arena Battles
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
              </CardTitle>
              <CardDescription>
                Battle your creatures against others in epic arena matches. Earn rewards and climb the leaderboards.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            © 2024 BRD Crypto Game. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
