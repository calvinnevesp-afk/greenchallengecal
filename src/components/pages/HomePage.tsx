// HPI 1.7-G
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { DfisRSE } from '@/entities';
import { Clock, Trophy, Zap, Users, ArrowRight, Sparkles, Leaf, Heart, BookOpen } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import ProofSubmissionDialog from '@/components/ProofSubmissionDialog';

// --- Utility for Category Styling ---
const getCategoryConfig = (category?: string) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('environnement')) return { color: 'bg-accent-green', text: 'text-primary-foreground', icon: Leaf, shadow: 'shadow-accent-green/20' };
  if (cat.includes('social')) return { color: 'bg-accent-blue', text: 'text-secondary-foreground', icon: Users, shadow: 'shadow-accent-blue/20' };
  if (cat.includes('bien-être') || cat.includes('bien etre')) return { color: 'bg-accent-purple', text: 'text-destructive-foreground', icon: Heart, shadow: 'shadow-accent-purple/20' };
  if (cat.includes('éducatif') || cat.includes('educatif')) return { color: 'bg-accent-yellow', text: 'text-primary-foreground', icon: BookOpen, shadow: 'shadow-accent-yellow/20' };
  return { color: 'bg-primary', text: 'text-primary-foreground', icon: Sparkles, shadow: 'shadow-primary/20' };
};

export default function HomePage() {
  // --- Canonical Data Sources ---
  const { member, isAuthenticated } = useMember();
  const [todayChallenge, setTodayChallenge] = useState<DfisRSE | null>(null);
  const [upcomingChallenges, setUpcomingChallenges] = useState<DfisRSE[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState('');

  // --- Scroll & Animation Refs ---
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // --- Data Fetching Logic (Preserved) ---
  useEffect(() => {
    loadChallenges();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      updateCountdown();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadChallenges = async () => {
    try {
      const { items } = await BaseCrudService.getAll<DfisRSE>('defisrse', {}, { limit: 10 });
      
      const now = new Date();
      const today = items.find(item => {
        const hasPublishDate = item.publishDate !== undefined && item.publishDate !== null;
        const publishDate = hasPublishDate ? new Date(item.publishDate) : null;
        return publishDate ? publishDate.toDateString() === now.toDateString() : false;
      });

      const upcoming = items.filter(item => {
        const hasPublishDate = item.publishDate !== undefined && item.publishDate !== null;
        const publishDate = hasPublishDate ? new Date(item.publishDate) : null;
        return publishDate ? publishDate > now : false;
      }).slice(0, 3);

      setTodayChallenge(today || null);
      setUpcomingChallenges(upcoming);
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCountdown = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(13, 0, 0, 0);

    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeUntilNext(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };

  // --- Render Helpers ---
  const renderLoadingState = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center w-full">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="w-24 h-24 bg-accent-yellow rounded-full flex items-center justify-center shadow-xl shadow-accent-yellow/30 mb-8"
      >
        <Zap className="w-12 h-12 text-primary-foreground" />
      </motion.div>
      <h2 className="font-heading text-2xl text-foreground animate-pulse">Chargement des défis...</h2>
    </div>
  );

  const renderEmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[70vh] flex flex-col items-center justify-center w-full px-6 relative z-10"
    >
      <div className="bg-background/80 backdrop-blur-xl rounded-[3rem] p-12 max-w-2xl w-full mx-auto text-center shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-blue/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-purple/20 rounded-full blur-3xl" />
        
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Clock className="w-24 h-24 text-accent-blue mx-auto mb-8 drop-shadow-lg" />
        </motion.div>
        
        <h3 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
          Repos des Champions
        </h3>
        <p className="font-paragraph text-lg text-foreground/70 mb-8 max-w-md mx-auto">
          Tu as accompli de grandes choses. Le prochain défi RSE sera débloqué demain à 13h. Prépare-toi !
        </p>
        
        <div className="inline-flex flex-col items-center bg-foreground/5 rounded-3xl p-6">
          <span className="font-paragraph text-sm font-bold text-foreground/50 uppercase tracking-widest mb-2">Prochain défi dans</span>
          <div className="text-5xl md:text-6xl font-heading text-accent-blue tracking-tight">
            {timeUntilNext}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F8F9FA] pb-32 overflow-clip relative selection:bg-accent-green selection:text-primary-foreground">
      
      {/* --- Global Scoped Styles for Organic Shapes --- */}
      <style>{`
        .organic-blob-1 {
          border-radius: 43% 57% 70% 30% / 30% 30% 70% 70%;
          animation: morph 8s ease-in-out infinite;
        }
        .organic-blob-2 {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: morph 10s ease-in-out infinite reverse;
        }
        @keyframes morph {
          0% { border-radius: 43% 57% 70% 30% / 30% 30% 70% 70%; }
          50% { border-radius: 30% 70% 50% 50% / 50% 30% 70% 50%; }
          100% { border-radius: 43% 57% 70% 30% / 30% 30% 70% 70%; }
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
      `}</style>

      {/* --- Dynamic Background Parallax --- */}
      <motion.div 
        style={{ y: backgroundY }}
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent-green/10 organic-blob-1 blur-3xl" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-accent-blue/10 organic-blob-2 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-accent-yellow/10 organic-blob-1 blur-3xl" />
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </motion.div>

      {/* --- Top Navigation / User Status (Sticky) --- */}
      <motion.header 
        style={{ opacity: opacityFade }}
        className="sticky top-0 z-50 w-full px-6 py-4 flex justify-between items-center max-w-[120rem] mx-auto"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-accent-green" />
          </div>
          <span className="font-heading text-xl hidden md:block text-foreground tracking-tight">Green Challenge</span>
        </div>

        {isAuthenticated && member ? (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="glass-panel px-5 py-2.5 rounded-full flex items-center gap-3 shadow-sm"
          >
            <div className="bg-accent-yellow/20 p-1.5 rounded-full">
              <Trophy className="w-4 h-4 text-accent-yellow" />
            </div>
            <span className="font-paragraph font-bold text-foreground text-sm">
              {member.profile?.nickname || member.contact?.firstName || 'Étudiant'}
            </span>
          </motion.div>
        ) : (
          <Link to="/login">
            <Button variant="ghost" className="font-paragraph font-bold rounded-full hover:bg-white/50">
              Connexion
            </Button>
          </Link>
        )}
      </motion.header>

      {/* --- Main Content Area --- */}
      <main className="relative z-10 w-full max-w-[120rem] mx-auto px-4 md:px-8 flex flex-col gap-16 md:gap-32 pt-8">
        
        {/* --- HERO: Today's Challenge --- */}
        <section className="w-full min-h-[80vh] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                {renderLoadingState()}
              </motion.div>
            ) : todayChallenge ? (
              <motion.div 
                key="challenge"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-full max-w-6xl mx-auto"
              >
                {/* Challenge Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4 px-4">
                  <div>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background mb-4 shadow-xl"
                    >
                      <Zap className="w-5 h-5 text-accent-yellow" />
                      <span className="font-heading text-sm uppercase tracking-widest">Défi du jour</span>
                    </motion.div>
                    <h1 className="font-heading text-5xl md:text-7xl text-foreground leading-[1.1] tracking-tight max-w-3xl">
                      {todayChallenge.challengeTitle}
                    </h1>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 shadow-lg border-white/40"
                  >
                    <Clock className="w-5 h-5 text-accent-blue animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase text-foreground/50 leading-none">Temps restant</span>
                      <span className="font-heading text-xl text-accent-blue leading-none mt-1">{timeUntilNext}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Challenge Card */}
                <div className="relative w-full bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl shadow-black/5 overflow-hidden border border-white/60 group">
                  
                  {/* Image Section */}
                  <div className="relative h-[40vh] md:h-[55vh] w-full overflow-hidden bg-muted">
                    {todayChallenge.illustration ? (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full h-full"
                      >
                        <Image
                          src={todayChallenge.illustration}
                          alt={todayChallenge.challengeTitle || 'Challenge'}
                          className="w-full h-full object-cover"
                          width={1600}
                        />
                      </motion.div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center">
                        <Leaf className="w-32 h-32 text-foreground/10" />
                      </div>
                    )}
                    
                    {/* Category Badge Overlay */}
                    <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
                      {(() => {
                        const config = getCategoryConfig(todayChallenge.category);
                        const Icon = config.icon;
                        return (
                          <Badge className={`${config.color} ${config.text} border-none px-5 py-2.5 rounded-full text-sm md:text-base font-paragraph font-bold shadow-xl flex items-center gap-2 backdrop-blur-md bg-opacity-90`}>
                            <Icon className="w-4 h-4" />
                            {todayChallenge.category}
                          </Badge>
                        );
                      })()}
                    </div>

                    {/* Gradient Overlay for text readability if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content Section */}
                  <div className="p-8 md:p-12 lg:p-16 flex flex-col md:flex-row gap-8 md:gap-16 items-start justify-between bg-white relative z-20">
                    <div className="flex-1 max-w-3xl">
                      <p className="font-paragraph text-lg md:text-2xl text-foreground/80 leading-relaxed font-medium">
                        {todayChallenge.description}
                      </p>
                    </div>
                    
                    <div className="w-full md:w-auto flex-shrink-0">
                      {isAuthenticated ? (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => setShowProofDialog(true)}
                            className="w-full md:w-auto bg-foreground hover:bg-foreground/90 text-background rounded-full h-16 md:h-20 px-10 text-xl md:text-2xl font-heading shadow-2xl shadow-foreground/20 flex items-center gap-4 group/btn"
                          >
                            Participer
                            <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center group-hover/btn:translate-x-2 transition-transform">
                              <ArrowRight className="w-5 h-5 text-foreground" />
                            </div>
                          </Button>
                        </motion.div>
                      ) : (
                        <Link to="/login" className="block w-full md:w-auto">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="w-full md:w-auto bg-accent-blue hover:bg-accent-blue/90 text-secondary-foreground rounded-full h-16 md:h-20 px-10 text-xl font-heading shadow-xl shadow-accent-blue/20">
                              Se connecter pour jouer
                            </Button>
                          </motion.div>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                {renderEmptyState()}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* --- UPCOMING CHALLENGES: Horizontal Scroll / Grid --- */}
        {upcomingChallenges.length > 0 && (
          <section className="w-full relative z-10">
            <div className="flex items-center justify-between mb-10 px-4">
              <h2 className="font-heading text-4xl md:text-5xl text-foreground flex items-center gap-4">
                <div className="p-3 bg-accent-purple/10 rounded-2xl">
                  <Users className="w-8 h-8 text-accent-purple" />
                </div>
                À venir
              </h2>
              <div className="h-[2px] flex-1 bg-foreground/5 ml-8 hidden md:block rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
              {upcomingChallenges.map((challenge, index) => {
                const config = getCategoryConfig(challenge.category);
                const Icon = config.icon;
                
                return (
                  <motion.div
                    key={challenge._id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
                    whileHover={{ y: -10 }}
                    className="h-full"
                  >
                    <div className={`h-full bg-white rounded-[2rem] p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 flex flex-col group ${config.shadow}`}>
                      
                      {/* Image Container */}
                      <div className="relative h-56 w-full rounded-[1.5rem] overflow-hidden mb-6 bg-muted">
                        {challenge.illustration ? (
                          <Image
                            src={challenge.illustration}
                            alt={challenge.challengeTitle || 'Challenge'}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            width={600}
                          />
                        ) : (
                          <div className={`w-full h-full ${config.color} opacity-20 flex items-center justify-center`}>
                            <Icon className="w-16 h-16 text-foreground/20" />
                          </div>
                        )}
                        
                        {/* Date Pill */}
                        {challenge.publishDate && (
                          <div className="absolute bottom-4 left-4 glass-panel px-4 py-2 rounded-full shadow-md">
                            <span className="font-heading text-sm text-foreground">
                              {new Date(challenge.publishDate).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex flex-col flex-1 px-2">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={`${config.color} ${config.text} border-none px-3 py-1 rounded-full text-xs font-paragraph font-bold`}>
                            {challenge.category}
                          </Badge>
                        </div>
                        <h3 className="font-heading text-2xl text-foreground mb-3 leading-tight group-hover:text-accent-blue transition-colors">
                          {challenge.challengeTitle}
                        </h3>
                        <p className="font-paragraph text-base text-foreground/60 line-clamp-3 flex-1">
                          {challenge.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

      </main>

      {/* --- Preserved Components --- */}
      <div className="relative z-50">
        <BottomNav />
      </div>
      
      {todayChallenge && (
        <ProofSubmissionDialog
          isOpen={showProofDialog}
          onClose={() => setShowProofDialog(false)}
          challengeId={todayChallenge._id}
          challengeTitle={todayChallenge.challengeTitle || ''}
        />
      )}
    </div>
  );
}