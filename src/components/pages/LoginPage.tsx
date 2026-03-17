import { motion } from 'framer-motion';
import { SignIn } from '@/components/ui/sign-in';
import { Trophy, Zap, Users, Award } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-green/10 via-accent-blue/5 to-accent-purple/10 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-green/20 mb-4">
              <Trophy className="w-10 h-10 text-accent-green" />
            </div>
          </motion.div>

          <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-3">
            Campus RSE Challenge
          </h1>
          <p className="font-paragraph text-lg text-foreground/80 mb-8">
            Rejoins la communauté et relève des défis RSE ! 🌱
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-background/80 backdrop-blur-sm rounded-2xl p-4"
            >
              <Zap className="w-6 h-6 text-accent-yellow mx-auto mb-2" />
              <p className="font-paragraph text-xs font-semibold text-foreground">
                Défis quotidiens
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-background/80 backdrop-blur-sm rounded-2xl p-4"
            >
              <Users className="w-6 h-6 text-accent-blue mx-auto mb-2" />
              <p className="font-paragraph text-xs font-semibold text-foreground">
                Communauté
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-background/80 backdrop-blur-sm rounded-2xl p-4"
            >
              <Award className="w-6 h-6 text-accent-purple mx-auto mb-2" />
              <p className="font-paragraph text-xs font-semibold text-foreground">
                Récompenses
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-background rounded-3xl shadow-2xl p-8"
        >
          <SignIn />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 font-paragraph text-sm text-foreground/60"
        >
          En te connectant, tu acceptes de participer aux défis RSE du campus
        </motion.p>
      </div>
    </div>
  );
}
