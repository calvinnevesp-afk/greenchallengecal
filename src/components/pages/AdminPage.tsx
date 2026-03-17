import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseCrudService } from '@/integrations';
import { DfisRSE } from '@/entities';
import { Shield, Plus, CheckCircle, XCircle, Edit, Trash2, Calendar, Award } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [challenges, setChallenges] = useState<DfisRSE[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    challengeTitle: '',
    description: '',
    category: 'environnement',
    publishDate: '',
  });

  const ADMIN_PASSWORD = 'carragrillon';

  useEffect(() => {
    if (isAuthenticated) {
      loadChallenges();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const loadChallenges = async () => {
    setIsLoading(true);
    try {
      const { items } = await BaseCrudService.getAll<DfisRSE>('defisrse', {}, { limit: 50 });
      setChallenges(items.sort((a, b) => {
        const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return dateB - dateA;
      }));
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChallenge = async () => {
    if (!newChallenge.challengeTitle || !newChallenge.description || !newChallenge.publishDate) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await BaseCrudService.create('defisrse', {
        _id: crypto.randomUUID(),
        challengeTitle: newChallenge.challengeTitle,
        description: newChallenge.description,
        category: newChallenge.category,
        publishDate: new Date(newChallenge.publishDate),
        illustration: 'https://static.wixstatic.com/media/7518df_ba6bca74c57c48469d23264bac7234ef~mv2.png?originWidth=576&originHeight=384',
      });

      setNewChallenge({
        challengeTitle: '',
        description: '',
        category: 'environnement',
        publishDate: '',
      });
      setShowCreateForm(false);
      loadChallenges();
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce défi ?')) return;

    try {
      await BaseCrudService.delete('defisrse', id);
      loadChallenges();
    } catch (error) {
      console.error('Error deleting challenge:', error);
    }
  };

  const mockProofs = [
    {
      id: '1',
      studentName: 'Marie Dupont',
      challengeTitle: 'Tri sélectif au campus',
      proofType: 'photo',
      proofUrl: 'https://static.wixstatic.com/media/7518df_160b64eb620f4880ae820314c3d6b5ef~mv2.png?originWidth=128&originHeight=128',
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'pending',
    },
    {
      id: '2',
      studentName: 'Thomas Martin',
      challengeTitle: 'Covoiturage solidaire',
      proofType: 'photo',
      proofUrl: 'https://static.wixstatic.com/media/7518df_a681fe4aa3994061a8ef687819eb0422~mv2.png?originWidth=128&originHeight=128',
      submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'pending',
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-foreground/5 via-accent-blue/5 to-accent-purple/5 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="border-0 shadow-2xl rounded-3xl bg-background overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-accent-blue/20 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-accent-blue" />
                </div>
              </div>

              <h1 className="font-heading text-3xl text-foreground text-center mb-2">
                Administration
              </h1>
              <p className="font-paragraph text-foreground/70 text-center mb-8">
                Accès réservé aux administrateurs
              </p>

              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="rounded-2xl h-12 font-paragraph border-foreground/20"
                />
                <Button
                  onClick={handleLogin}
                  className="w-full bg-accent-blue hover:bg-accent-blue/90 text-secondary-foreground rounded-full h-12 font-paragraph font-semibold"
                >
                  Se connecter
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[100rem] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-heading text-4xl text-foreground mb-2 flex items-center gap-3">
                <Shield className="w-10 h-10 text-accent-blue" />
                Administration
              </h1>
              <p className="font-paragraph text-foreground/70">
                Gestion des défis et validation des preuves
              </p>
            </div>
            <Button
              onClick={() => setIsAuthenticated(false)}
              variant="outline"
              className="rounded-full font-paragraph font-semibold border-foreground/20"
            >
              Déconnexion
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="challenges" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-foreground/5 rounded-full p-1">
            <TabsTrigger
              value="challenges"
              className="rounded-full font-paragraph font-semibold data-[state=active]:bg-accent-green data-[state=active]:text-primary-foreground"
            >
              Défis
            </TabsTrigger>
            <TabsTrigger
              value="proofs"
              className="rounded-full font-paragraph font-semibold data-[state=active]:bg-accent-blue data-[state=active]:text-secondary-foreground"
            >
              Preuves
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="rounded-full font-paragraph font-semibold data-[state=active]:bg-accent-yellow data-[state=active]:text-primary-foreground"
            >
              Récompenses
            </TabsTrigger>
          </TabsList>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-accent-green hover:bg-accent-green/90 text-primary-foreground rounded-full font-paragraph font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Créer un défi
              </Button>
            </div>

            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-lg rounded-3xl bg-background p-6 mb-6">
                  <h3 className="font-heading text-2xl text-foreground mb-6">
                    Nouveau défi
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                        Titre du défi *
                      </label>
                      <Input
                        value={newChallenge.challengeTitle}
                        onChange={(e) => setNewChallenge({ ...newChallenge, challengeTitle: e.target.value })}
                        placeholder="Ex: Tri sélectif au campus"
                        className="rounded-2xl font-paragraph border-foreground/20"
                      />
                    </div>

                    <div>
                      <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                        Description *
                      </label>
                      <Textarea
                        value={newChallenge.description}
                        onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                        placeholder="Décris le défi en détail..."
                        className="rounded-2xl font-paragraph border-foreground/20 resize-none"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                        Catégorie
                      </label>
                      <select
                        value={newChallenge.category}
                        onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })}
                        className="w-full rounded-2xl border border-foreground/20 px-4 py-2 font-paragraph bg-background"
                      >
                        <option value="environnement">Environnement</option>
                        <option value="social">Social</option>
                        <option value="bien-être">Bien-être</option>
                        <option value="éducatif">Éducatif</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                        Date de publication *
                      </label>
                      <Input
                        type="date"
                        value={newChallenge.publishDate}
                        onChange={(e) => setNewChallenge({ ...newChallenge, publishDate: e.target.value })}
                        className="rounded-2xl font-paragraph border-foreground/20"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleCreateChallenge}
                        className="flex-1 bg-accent-green hover:bg-accent-green/90 text-primary-foreground rounded-full font-paragraph font-semibold"
                      >
                        Créer le défi
                      </Button>
                      <Button
                        onClick={() => setShowCreateForm(false)}
                        variant="outline"
                        className="flex-1 rounded-full font-paragraph font-semibold border-foreground/20"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            <div className="space-y-4">
              {isLoading ? (
                <div className="min-h-[300px]" />
              ) : challenges.length > 0 ? (
                challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-0 shadow-md rounded-3xl bg-background overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-heading text-xl text-foreground">
                                {challenge.challengeTitle}
                              </h3>
                              <Badge className="bg-accent-blue/20 text-accent-blue rounded-full px-3 py-1 text-xs font-paragraph font-semibold">
                                {challenge.category}
                              </Badge>
                            </div>
                            <p className="font-paragraph text-sm text-foreground/70 mb-3">
                              {challenge.description}
                            </p>
                            {challenge.publishDate && (
                              <div className="flex items-center gap-2 text-foreground/60">
                                <Calendar className="w-4 h-4" />
                                <span className="font-paragraph text-sm">
                                  {new Date(challenge.publishDate).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="rounded-full border-foreground/20"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleDeleteChallenge(challenge._id)}
                              className="rounded-full border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="bg-accent-green/10 rounded-3xl p-12 max-w-md mx-auto">
                    <Calendar className="w-16 h-16 text-accent-green mx-auto mb-4" />
                    <h3 className="font-heading text-2xl text-foreground mb-3">
                      Aucun défi
                    </h3>
                    <p className="font-paragraph text-foreground/70">
                      Créez votre premier défi RSE
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Proofs Tab */}
          <TabsContent value="proofs" className="space-y-4">
            {mockProofs.map((proof, index) => (
              <motion.div
                key={proof.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg rounded-3xl bg-background overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-foreground/5">
                        <Image
                          src={proof.proofUrl}
                          alt={proof.challengeTitle}
                          className="w-full h-full object-cover"
                          width={96}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading text-xl text-foreground mb-1">
                          {proof.studentName}
                        </h3>
                        <p className="font-paragraph text-sm text-foreground/70 mb-2">
                          {proof.challengeTitle}
                        </p>
                        <p className="font-paragraph text-xs text-foreground/60">
                          Soumis {proof.submittedAt.toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          className="rounded-full bg-accent-green hover:bg-accent-green/90 text-primary-foreground"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </Button>
                        <Button
                          size="icon"
                          className="rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                          <XCircle className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <Card className="border-0 shadow-lg rounded-3xl bg-background p-8">
              <h3 className="font-heading text-2xl text-foreground mb-6 flex items-center gap-3">
                <Award className="w-7 h-7 text-accent-yellow" />
                Gestion des récompenses mensuelles
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    🥇 Récompense 1ère place
                  </label>
                  <Input
                    placeholder="Ex: Bon d'achat 100€"
                    className="rounded-2xl font-paragraph border-foreground/20"
                  />
                </div>

                <div>
                  <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    🥈 Récompense 2ème place
                  </label>
                  <Input
                    placeholder="Ex: Bon d'achat 50€"
                    className="rounded-2xl font-paragraph border-foreground/20"
                  />
                </div>

                <div>
                  <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    🥉 Récompense 3ème place
                  </label>
                  <Input
                    placeholder="Ex: Goodies campus"
                    className="rounded-2xl font-paragraph border-foreground/20"
                  />
                </div>

                <Button className="w-full bg-accent-yellow hover:bg-accent-yellow/90 text-primary-foreground rounded-full h-12 font-paragraph font-semibold">
                  Enregistrer les récompenses
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
