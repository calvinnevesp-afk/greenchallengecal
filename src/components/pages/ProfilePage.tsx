import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Classementtudiants } from '@/entities';
import { Trophy, Award, LogOut, User, Mail, GraduationCap, TrendingUp } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function ProfilePage() {
  const { member, actions } = useMember();
  const [userRanking, setUserRanking] = useState<Classementtudiants | null>(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [member]);

  const loadUserData = async () => {
    try {
      const { items, totalCount } = await BaseCrudService.getAll<Classementtudiants>('classementetudiants', {}, { limit: 100 });
      
      setTotalStudents(totalCount);
      
      // Find user's ranking (in real app, match by user ID)
      const userEmail = member?.loginEmail;
      if (userEmail) {
        const userRank = items.find(item => 
          item.studentName?.toLowerCase().includes(member?.contact?.firstName?.toLowerCase() || '')
        );
        if (userRank) {
          setUserRanking(userRank);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankPercentile = () => {
    if (!userRanking?.rankPosition || totalStudents === 0) return 0;
    return Math.round(((totalStudents - userRanking.rankPosition) / totalStudents) * 100);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent-purple/20 via-accent-green/10 to-accent-blue/20 px-6 py-12 rounded-b-[3rem]">
        <div className="max-w-[100rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent-green bg-accent-green/10">
                {member?.profile?.photo?.url ? (
                  <Image
                    src={member.profile.photo.url}
                    alt={member.profile.nickname || 'Profile'}
                    className="w-full h-full object-cover"
                    width={128}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-accent-green" />
                  </div>
                )}
              </div>
              {userRanking && userRanking.rankPosition && userRanking.rankPosition <= 3 && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <Badge className="bg-accent-yellow text-primary-foreground rounded-full px-4 py-2 font-paragraph font-bold text-lg shadow-lg">
                    #{userRanking.rankPosition}
                  </Badge>
                </div>
              )}
            </div>

            <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">
              {member?.profile?.nickname || member?.contact?.firstName || 'Étudiant'}
            </h1>
            
            {member?.contact?.lastName && (
              <p className="font-paragraph text-lg text-foreground/80 mb-4">
                {member.contact.lastName}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-[100rem] mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-br from-accent-yellow/20 to-accent-yellow/5 overflow-hidden">
              <div className="p-6 text-center">
                <Trophy className="w-10 h-10 text-accent-yellow mx-auto mb-3" />
                <p className="font-paragraph text-sm text-foreground/70 mb-1">Points totaux</p>
                <p className="font-heading text-4xl text-foreground">
                  {userRanking?.points || 0}
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 overflow-hidden">
              <div className="p-6 text-center">
                <Award className="w-10 h-10 text-accent-blue mx-auto mb-3" />
                <p className="font-paragraph text-sm text-foreground/70 mb-1">Classement</p>
                <p className="font-heading text-4xl text-foreground">
                  #{userRanking?.rankPosition || '-'}
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-br from-accent-green/20 to-accent-green/5 overflow-hidden">
              <div className="p-6 text-center">
                <TrendingUp className="w-10 h-10 text-accent-green mx-auto mb-3" />
                <p className="font-paragraph text-sm text-foreground/70 mb-1">Top</p>
                <p className="font-heading text-4xl text-foreground">
                  {getRankPercentile()}%
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg rounded-3xl bg-background overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="font-heading text-2xl text-foreground mb-6">
                Informations du profil
              </h2>

              <div className="space-y-4">
                {member?.loginEmail && (
                  <div className="flex items-center gap-4 p-4 bg-foreground/5 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-accent-blue" />
                    </div>
                    <div className="flex-1">
                      <p className="font-paragraph text-sm text-foreground/60 mb-1">Email</p>
                      <p className="font-paragraph font-semibold text-foreground">
                        {member.loginEmail}
                      </p>
                    </div>
                  </div>
                )}

                {userRanking?.studentClass && (
                  <div className="flex items-center gap-4 p-4 bg-foreground/5 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-accent-purple" />
                    </div>
                    <div className="flex-1">
                      <p className="font-paragraph text-sm text-foreground/60 mb-1">Promotion</p>
                      <p className="font-paragraph font-semibold text-foreground">
                        {userRanking.studentClass}
                      </p>
                    </div>
                  </div>
                )}

                {member?._createdDate && (
                  <div className="flex items-center gap-4 p-4 bg-foreground/5 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-accent-green/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-accent-green" />
                    </div>
                    <div className="flex-1">
                      <p className="font-paragraph text-sm text-foreground/60 mb-1">Membre depuis</p>
                      <p className="font-paragraph font-semibold text-foreground">
                        {new Date(member._createdDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-br from-accent-purple/10 via-accent-yellow/5 to-accent-green/10 overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="font-heading text-2xl text-foreground mb-4 flex items-center gap-3">
                <Trophy className="w-7 h-7 text-accent-yellow" />
                Badges & Réalisations
              </h2>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-4xl mb-2">🌱</div>
                  <p className="font-paragraph text-xs font-semibold text-foreground/80">Éco-warrior</p>
                </div>
                <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-4xl mb-2">🤝</div>
                  <p className="font-paragraph text-xs font-semibold text-foreground/80">Social Hero</p>
                </div>
                <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-4xl mb-2">⚡</div>
                  <p className="font-paragraph text-xs font-semibold text-foreground/80">Speed Master</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={actions.logout}
            variant="outline"
            className="w-full border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-full h-14 font-paragraph font-semibold"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Se déconnecter
          </Button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
