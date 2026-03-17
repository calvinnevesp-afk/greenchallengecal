import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Trophy, Filter } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useMember } from '@/integrations';

interface SocialPost {
  id: string;
  studentName: string;
  studentClass: string;
  profilePicture: string;
  challengeTitle: string;
  proofType: 'photo' | 'video' | 'screenshot';
  proofUrl: string;
  points: number;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export default function SocialWallPage() {
  const { isAuthenticated } = useMember();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterClass, setFilterClass] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    // Simulate loading validated proofs
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        studentName: 'Marie Dupont',
        studentClass: 'Promo 2024',
        profilePicture: 'https://static.wixstatic.com/media/7518df_c084b8937901459696a2cbc208eafe7c~mv2.png?originWidth=576&originHeight=576',
        challengeTitle: 'Tri sélectif au campus',
        proofType: 'photo',
        proofUrl: 'https://static.wixstatic.com/media/7518df_94b5f7b942614026a4fa4dc2fe0c0e62~mv2.png?originWidth=576&originHeight=576',
        points: 100,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 24,
        comments: 5,
        isLiked: false,
      },
      {
        id: '2',
        studentName: 'Thomas Martin',
        studentClass: 'Promo 2025',
        profilePicture: 'https://static.wixstatic.com/media/7518df_0c024158a18c4ebeb740020c3695b690~mv2.png?originWidth=576&originHeight=576',
        challengeTitle: 'Covoiturage solidaire',
        proofType: 'photo',
        proofUrl: 'https://static.wixstatic.com/media/7518df_b55e3a90c26d4612ad6a8723b74b38ba~mv2.png?originWidth=576&originHeight=576',
        points: 70,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 18,
        comments: 3,
        isLiked: true,
      },
      {
        id: '3',
        studentName: 'Sophie Bernard',
        studentClass: 'Promo 2024',
        profilePicture: 'https://static.wixstatic.com/media/7518df_6352465c006a4ba4b9313fcb42769930~mv2.png?originWidth=576&originHeight=576',
        challengeTitle: 'Repas végétarien',
        proofType: 'photo',
        proofUrl: 'https://static.wixstatic.com/media/7518df_27e25e1f690248608cd3e423fe5b4469~mv2.png?originWidth=576&originHeight=576',
        points: 50,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        likes: 31,
        comments: 8,
        isLiked: false,
      },
    ];

    setPosts(mockPosts);
    setIsLoading(false);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
    return `Il y a ${Math.floor(seconds / 86400)}j`;
  };

  const filteredPosts = filterClass
    ? posts.filter(post => post.studentClass === filterClass)
    : posts;

  const classes = Array.from(new Set(posts.map(post => post.studentClass)));

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent-blue/20 via-accent-purple/10 to-accent-green/20 px-6 py-8 rounded-b-[3rem]">
        <div className="max-w-[100rem] mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-2">
            Mur social
          </h1>
          <p className="font-paragraph text-foreground/80">
            Découvre les défis réalisés par la communauté 🎉
          </p>
        </div>
      </div>

      <div className="max-w-[100rem] mx-auto px-6 py-6">
        {/* Filter */}
        <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2">
          <Button
            onClick={() => setFilterClass(null)}
            variant={filterClass === null ? 'default' : 'outline'}
            className={`rounded-full font-paragraph font-semibold whitespace-nowrap ${
              filterClass === null
                ? 'bg-accent-blue text-secondary-foreground'
                : 'border-foreground/20 text-foreground'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Toutes les promos
          </Button>
          {classes.map((className) => (
            <Button
              key={className}
              onClick={() => setFilterClass(className)}
              variant={filterClass === className ? 'default' : 'outline'}
              className={`rounded-full font-paragraph font-semibold whitespace-nowrap ${
                filterClass === className
                  ? 'bg-accent-blue text-secondary-foreground'
                  : 'border-foreground/20 text-foreground'
              }`}
            >
              {className}
            </Button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-6 min-h-[400px]">
          {isLoading ? null : filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg rounded-3xl bg-background">
                  {/* Post Header */}
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-accent-green/20">
                      <Image
                        src={post.profilePicture}
                        alt={post.studentName}
                        className="w-full h-full object-cover"
                        width={48}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-paragraph font-semibold text-foreground">
                        {post.studentName}
                      </h3>
                      <p className="font-paragraph text-sm text-foreground/60">
                        {post.studentClass} • {getTimeAgo(post.timestamp)}
                      </p>
                    </div>
                    <Badge className="bg-accent-yellow text-primary-foreground rounded-full px-3 py-1 font-paragraph font-semibold">
                      <Trophy className="w-3 h-3 mr-1" />
                      +{post.points}
                    </Badge>
                  </div>

                  {/* Post Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={post.proofUrl}
                      alt={post.challengeTitle}
                      className="w-full h-full object-cover"
                      width={600}
                    />
                  </div>

                  {/* Post Actions */}
                  <div className="p-4">
                    <h4 className="font-paragraph font-semibold text-foreground mb-3">
                      {post.challengeTitle}
                    </h4>
                    
                    <div className="flex items-center gap-6">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => isAuthenticated && handleLike(post.id)}
                        disabled={!isAuthenticated}
                        className="flex items-center gap-2 group"
                      >
                        <Heart
                          className={`w-6 h-6 transition-colors ${
                            post.isLiked
                              ? 'fill-destructive text-destructive'
                              : 'text-foreground/60 group-hover:text-destructive'
                          }`}
                        />
                        <span className="font-paragraph text-sm font-semibold text-foreground/80">
                          {post.likes}
                        </span>
                      </motion.button>

                      <button className="flex items-center gap-2 group">
                        <MessageCircle className="w-6 h-6 text-foreground/60 group-hover:text-accent-blue transition-colors" />
                        <span className="font-paragraph text-sm font-semibold text-foreground/80">
                          {post.comments}
                        </span>
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="bg-accent-purple/10 rounded-3xl p-12 max-w-md mx-auto">
                <MessageCircle className="w-16 h-16 text-accent-purple mx-auto mb-4" />
                <h3 className="font-heading text-2xl text-foreground mb-3">
                  Aucune preuve validée
                </h3>
                <p className="font-paragraph text-foreground/70">
                  {filterClass
                    ? `Aucune preuve pour ${filterClass}`
                    : 'Les preuves validées apparaîtront ici'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
