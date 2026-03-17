import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { BaseCrudService } from '@/integrations';
import { Classementtudiants } from '@/entities';

export default function ClassementPage() {
  const [students, setStudents] = useState<Classementtudiants[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    try {
      const { items } = await BaseCrudService.getAll<Classementtudiants>('classementetudiants', {}, { limit: 50 });
      
      const sorted = items.sort((a, b) => (b.points || 0) - (a.points || 0));
      setStudents(sorted);
    } catch (error) {
      console.error('Error loading rankings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-8 h-8 text-accent-yellow" />;
      case 2:
        return <Medal className="w-7 h-7 text-foreground/60" />;
      case 3:
        return <Award className="w-7 h-7 text-accent-purple" />;
      default:
        return null;
    }
  };

  const getRankBadgeColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-accent-yellow text-primary-foreground';
      case 2:
        return 'bg-foreground/20 text-foreground';
      case 3:
        return 'bg-accent-purple text-destructive-foreground';
      default:
        return 'bg-accent-blue/10 text-accent-blue';
    }
  };

  const topThree = students.slice(0, 3);
  const restOfStudents = students.slice(3);

  const groupedByClass = students.reduce((acc, student) => {
    const className = student.studentClass || 'Sans classe';
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(student);
    return acc;
  }, {} as Record<string, Classementtudiants[]>);

  const classRankings = Object.entries(groupedByClass).map(([className, students]) => {
    const totalPoints = students.reduce((sum, s) => sum + (s.points || 0), 0);
    return { className, totalPoints, studentCount: students.length };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent-yellow/20 via-accent-purple/10 to-accent-blue/20 px-6 py-8 rounded-b-[3rem]">
        <div className="max-w-[100rem] mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-2 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-accent-yellow" />
            Classement
          </h1>
          <p className="font-paragraph text-foreground/80">
            Les champions du campus RSE 🏆
          </p>
        </div>
      </div>

      <div className="max-w-[100rem] mx-auto px-6 py-6">
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-foreground/5 rounded-full p-1">
            <TabsTrigger
              value="individual"
              className="rounded-full font-paragraph font-semibold data-[state=active]:bg-accent-green data-[state=active]:text-primary-foreground"
            >
              Individuel
            </TabsTrigger>
            <TabsTrigger
              value="class"
              className="rounded-full font-paragraph font-semibold data-[state=active]:bg-accent-blue data-[state=active]:text-secondary-foreground"
            >
              Par promotion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-6">
            {/* Top 3 Podium */}
            {isLoading ? (
              <div className="min-h-[300px]" />
            ) : topThree.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end justify-center gap-4 mb-8"
                >
                  {/* 2nd Place */}
                  {topThree[1] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-center"
                    >
                      <div className="relative mb-3">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-foreground/20 bg-foreground/5">
                          {topThree[1].profilePicture && (
                            <Image
                              src={topThree[1].profilePicture}
                              alt={topThree[1].studentName || 'Student'}
                              className="w-full h-full object-cover"
                              width={80}
                            />
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2">
                          {getRankIcon(2)}
                        </div>
                      </div>
                      <div className="bg-foreground/10 rounded-2xl px-4 py-6 w-28 text-center">
                        <p className="font-heading text-3xl text-foreground mb-1">2</p>
                        <p className="font-paragraph text-xs font-semibold text-foreground/80 mb-2 truncate">
                          {topThree[1].studentName}
                        </p>
                        <Badge className="bg-accent-yellow text-primary-foreground rounded-full px-2 py-1 text-xs font-paragraph font-semibold">
                          {topThree[1].points} pts
                        </Badge>
                      </div>
                    </motion.div>
                  )}

                  {/* 1st Place */}
                  {topThree[0] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="relative mb-3">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-accent-yellow bg-accent-yellow/10">
                          {topThree[0].profilePicture && (
                            <Image
                              src={topThree[0].profilePicture}
                              alt={topThree[0].studentName || 'Student'}
                              className="w-full h-full object-cover"
                              width={96}
                            />
                          )}
                        </div>
                        <div className="absolute -top-3 -right-2">
                          {getRankIcon(1)}
                        </div>
                      </div>
                      <div className="bg-accent-yellow/20 rounded-2xl px-4 py-6 w-32 text-center">
                        <p className="font-heading text-4xl text-foreground mb-1">1</p>
                        <p className="font-paragraph text-sm font-semibold text-foreground mb-2 truncate">
                          {topThree[0].studentName}
                        </p>
                        <Badge className="bg-accent-yellow text-primary-foreground rounded-full px-3 py-1 text-sm font-paragraph font-semibold">
                          {topThree[0].points} pts
                        </Badge>
                      </div>
                    </motion.div>
                  )}

                  {/* 3rd Place */}
                  {topThree[2] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col items-center"
                    >
                      <div className="relative mb-3">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-accent-purple/30 bg-accent-purple/5">
                          {topThree[2].profilePicture && (
                            <Image
                              src={topThree[2].profilePicture}
                              alt={topThree[2].studentName || 'Student'}
                              className="w-full h-full object-cover"
                              width={80}
                            />
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2">
                          {getRankIcon(3)}
                        </div>
                      </div>
                      <div className="bg-accent-purple/10 rounded-2xl px-4 py-6 w-28 text-center">
                        <p className="font-heading text-3xl text-foreground mb-1">3</p>
                        <p className="font-paragraph text-xs font-semibold text-foreground/80 mb-2 truncate">
                          {topThree[2].studentName}
                        </p>
                        <Badge className="bg-accent-purple text-destructive-foreground rounded-full px-2 py-1 text-xs font-paragraph font-semibold">
                          {topThree[2].points} pts
                        </Badge>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Rest of Rankings */}
                <div className="space-y-3">
                  {restOfStudents.map((student, index) => (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <Card className="border-0 shadow-sm rounded-2xl bg-background hover:shadow-md transition-shadow">
                        <div className="p-4 flex items-center gap-4">
                          <Badge className={`${getRankBadgeColor(index + 4)} rounded-full w-10 h-10 flex items-center justify-center font-paragraph font-bold text-lg`}>
                            {index + 4}
                          </Badge>
                          
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-accent-green/10">
                            {student.profilePicture && (
                              <Image
                                src={student.profilePicture}
                                alt={student.studentName || 'Student'}
                                className="w-full h-full object-cover"
                                width={48}
                              />
                            )}
                          </div>

                          <div className="flex-1">
                            <h3 className="font-paragraph font-semibold text-foreground">
                              {student.studentName}
                            </h3>
                            <p className="font-paragraph text-sm text-foreground/60">
                              {student.studentClass}
                            </p>
                          </div>

                          <Badge className="bg-accent-yellow text-primary-foreground rounded-full px-3 py-1 font-paragraph font-semibold">
                            {student.points} pts
                          </Badge>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="bg-accent-yellow/10 rounded-3xl p-12 max-w-md mx-auto">
                  <Trophy className="w-16 h-16 text-accent-yellow mx-auto mb-4" />
                  <h3 className="font-heading text-2xl text-foreground mb-3">
                    Pas encore de classement
                  </h3>
                  <p className="font-paragraph text-foreground/70">
                    Sois le premier à relever un défi !
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="class" className="space-y-4">
            {isLoading ? (
              <div className="min-h-[300px]" />
            ) : classRankings.length > 0 ? (
              classRankings.map((classData, index) => (
                <motion.div
                  key={classData.className}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-md rounded-2xl bg-background hover:shadow-lg transition-shadow">
                    <div className="p-6 flex items-center gap-4">
                      <Badge className={`${getRankBadgeColor(index + 1)} rounded-full w-12 h-12 flex items-center justify-center font-paragraph font-bold text-xl`}>
                        {index + 1}
                      </Badge>

                      <div className="flex-1">
                        <h3 className="font-heading text-xl text-foreground mb-1">
                          {classData.className}
                        </h3>
                        <p className="font-paragraph text-sm text-foreground/60">
                          {classData.studentCount} étudiant{classData.studentCount > 1 ? 's' : ''}
                        </p>
                      </div>

                      <div className="text-right">
                        <Badge className="bg-accent-blue text-secondary-foreground rounded-full px-4 py-2 font-paragraph font-semibold text-lg">
                          {classData.totalPoints} pts
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="bg-accent-blue/10 rounded-3xl p-12 max-w-md mx-auto">
                  <Trophy className="w-16 h-16 text-accent-blue mx-auto mb-4" />
                  <h3 className="font-heading text-2xl text-foreground mb-3">
                    Pas encore de classement
                  </h3>
                  <p className="font-paragraph text-foreground/70">
                    Les promotions apparaîtront ici
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Monthly Rewards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-br from-accent-yellow/10 via-accent-purple/5 to-accent-green/10 overflow-hidden">
            <div className="p-8">
              <h2 className="font-heading text-2xl text-foreground mb-4 flex items-center gap-3">
                <Trophy className="w-7 h-7 text-accent-yellow" />
                Récompenses mensuelles
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-background/50 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-4xl">🥇</div>
                  <div className="flex-1">
                    <p className="font-paragraph font-semibold text-foreground">1er place</p>
                    <p className="font-paragraph text-sm text-foreground/70">Récompense principale</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-background/50 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-4xl">🥈</div>
                  <div className="flex-1">
                    <p className="font-paragraph font-semibold text-foreground">2ème place</p>
                    <p className="font-paragraph text-sm text-foreground/70">Récompense secondaire</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-background/50 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-4xl">🥉</div>
                  <div className="flex-1">
                    <p className="font-paragraph font-semibold text-foreground">3ème place</p>
                    <p className="font-paragraph text-sm text-foreground/70">Récompense symbolique</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
