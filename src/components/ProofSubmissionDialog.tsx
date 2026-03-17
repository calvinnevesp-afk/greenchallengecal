import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Video, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProofSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  challengeId: string;
  challengeTitle: string;
}

export default function ProofSubmissionDialog({
  isOpen,
  onClose,
  challengeId,
  challengeTitle,
}: ProofSubmissionDialogProps) {
  const [proofType, setProofType] = useState<'photo' | 'video' | 'screenshot' | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!proofType) return;

    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setProofType(null);
      setDescription('');
      onClose();
    }, 2000);
  };

  const proofTypes = [
    { type: 'photo' as const, icon: Camera, label: 'Photo', color: 'bg-accent-green' },
    { type: 'video' as const, icon: Video, label: 'Vidéo', color: 'bg-accent-blue' },
    { type: 'screenshot' as const, icon: ImageIcon, label: 'Capture', color: 'bg-accent-purple' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl bg-background border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-foreground">
            {isSubmitted ? 'Preuve envoyée !' : 'Envoyer une preuve'}
          </DialogTitle>
        </DialogHeader>

        {isSubmitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-12 text-center"
          >
            <CheckCircle className="w-20 h-20 text-accent-green mx-auto mb-4" />
            <h3 className="font-heading text-xl text-foreground mb-2">
              Preuve envoyée avec succès !
            </h3>
            <p className="font-paragraph text-foreground/70">
              En attente de validation par l'administrateur
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6 py-4">
            <div>
              <h4 className="font-paragraph font-semibold text-foreground mb-2">
                Défi : {challengeTitle}
              </h4>
              <p className="font-paragraph text-sm text-foreground/70">
                Choisis le type de preuve que tu souhaites envoyer
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {proofTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = proofType === type.type;

                return (
                  <motion.button
                    key={type.type}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProofType(type.type)}
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? `${type.color} border-transparent text-white`
                        : 'bg-background border-foreground/10 text-foreground hover:border-foreground/30'
                    }`}
                  >
                    <Icon className="w-8 h-8" />
                    <span className="font-paragraph text-sm font-semibold">
                      {type.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {proofType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Description (optionnelle)
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décris comment tu as réalisé le défi..."
                    className="rounded-2xl border-foreground/10 font-paragraph resize-none"
                    rows={4}
                  />
                </div>

                <div className="bg-accent-yellow/10 rounded-2xl p-4">
                  <p className="font-paragraph text-sm text-foreground/80">
                    💡 <strong>Astuce :</strong> Plus ta preuve est claire et détaillée, plus vite elle sera validée !
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-accent-green hover:bg-accent-green/90 text-primary-foreground rounded-full h-12 font-paragraph font-semibold shadow-lg"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer la preuve'}
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
