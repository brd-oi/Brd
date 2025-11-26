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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF7A22] to-[#FFAA33] rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(255,122,34,0.3)]">
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>B</span>
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif', letterSpacing: '0.05em' }}>
              BRD
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/hatching" className="text-[#F6DAB5] hover:text-white transition-colors" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
              Hatching
            </Link>
            <Link to="/trading" className="text-[#F6DAB5] hover:text-white transition-colors" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
              Trading
            </Link>
            <Link to="/arena" className="text-[#F6DAB5] hover:text-white transition-colors opacity-50" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
              Arena <Badge variant="secondary" className="ml-1 text-xs bg-orange-900/50 text-[#F6DAB5]">Soon</Badge>
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
      <section className="container mx-auto px-4 py-16 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif', letterSpacing: '0.05em', textShadow: '0 0 30px rgba(255,122,34,0.5)' }}>
            BRD Crypto Game
          </h1>
          <p className="text-xl md:text-2xl text-[#F6DAB5] mb-8 leading-relaxed" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
            Lock your tokens to create mythical crossbreed creatures.
            <br className="hidden md:block" />
            Trade legendary beings and dominate the arena.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/hatching">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF7A22] to-[#FFAA33] text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(255,122,34,0.5)] transition-shadow" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                <Zap className="w-5 h-5 mr-2 inline" />
                Start Hatching
              </button>
            </Link>
            <Link to="/trading">
              <button className="px-8 py-4 rounded-xl bg-black/30 border-2 border-orange-900/50 text-white font-bold text-lg hover:bg-black/50 transition-colors" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
                <Swords className="w-5 h-5 mr-2 inline" />
                Explore Trading
              </button>
            </Link>
          </div>

          {/* Featured Creatures */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="relative group rounded-[20px] overflow-hidden border-2 border-orange-900/50 hover:border-orange-500/50 transition-colors">
              <img 
                src="./images/20251120_0023_image.png" 
                alt="Mythical Dragon Creature" 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full bg-[#EB3A1C] text-white font-bold text-xs" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>Mythical</span>
              </div>
            </div>
            <div className="relative group rounded-[20px] overflow-hidden border-2 border-orange-900/50 hover:border-orange-500/50 transition-colors">
              <img 
                src="./images/20251120_0026_image.png" 
                alt="Legendary Aquatic Creature" 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full bg-[#FF8A2F] text-white font-bold text-xs" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>Legendary</span>
              </div>
            </div>
            <div className="relative group rounded-[20px] overflow-hidden border-2 border-orange-900/50 hover:border-orange-500/50 transition-colors">
              <img 
                src="./images/20251120_0015_image.png" 
                alt="Epic Fluffy Creature" 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full bg-[#EB3A1C] text-white font-bold text-xs" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>Epic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif', letterSpacing: '0.03em' }}>Game Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-[20px] p-6" style={{
            background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
          }}>
            <div className="w-12 h-12 bg-[#FF8A2F]/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-[#FF8A2F]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>Token Hatching</h3>
            <p className="text-[#F6DAB5] text-sm">
              Lock your BRD tokens for specific periods to hatch unique crossbreed creatures with varying rarities.
            </p>
          </div>

          <div className="rounded-[20px] p-6" style={{
            background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
          }}>
            <div className="w-12 h-12 bg-[#FF8A2F]/20 rounded-lg flex items-center justify-center mb-4">
              <Swords className="w-6 h-6 text-[#FF8A2F]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>Creature Trading</h3>
            <p className="text-[#F6DAB5] text-sm">
              Trade your mythical beings with other players in a decentralized marketplace powered by blockchain.
            </p>
          </div>

          <div className="rounded-[20px] p-6 opacity-75" style={{
            background: 'linear-gradient(180deg, #3A1F17 0%, #2A1512 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
          }}>
            <div className="w-12 h-12 bg-[#F6DAB5]/20 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-[#F6DAB5]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
              Arena Battles
              <span className="px-2 py-1 rounded-full bg-orange-900/50 text-[#F6DAB5] text-xs font-semibold">Coming Soon</span>
            </h3>
            <p className="text-[#F6DAB5] text-sm">
              Battle your creatures against others in epic arena matches. Earn rewards and climb the leaderboards.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-900/30 bg-black/20 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-[#F6DAB5]" style={{ fontFamily: 'Poppins, Inter, Nunito, sans-serif' }}>
            © 2024 BRD Crypto Game. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
