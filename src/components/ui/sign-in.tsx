import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMember } from '@/integrations';
import { useState } from 'react';

interface SignInProps {
  title?: string;
  message?: string;
  className?: string;
  cardClassName?: string;
  buttonClassName?: string;
  buttonText?: string;
}

export function SignIn({
  title = "Sign In Required",
  message = "Please sign in to access this content.",
  className = "min-h-screen flex items-center justify-center px-4 ",
  cardClassName = "w-fit max-w-xl mx-auto text-foreground",
  buttonClassName = "w-full h-10 max-w-sm mx-auto",
  buttonText = "Sign In"
}: SignInProps) {
  const { actions } = useMember();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!firstName || !lastName || !studentClass) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    try {
      // Store user data in session/local storage before login
      sessionStorage.setItem('userFirstName', firstName);
      sessionStorage.setItem('userLastName', lastName);
      sessionStorage.setItem('userClass', studentClass);
      
      await actions.login();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Card className={cardClassName}>
        <CardHeader className="text-center space-y-4 py-10 px-10">
          <CardTitle className="">{title}</CardTitle>
          <CardDescription className="">{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center px-10 pb-10">
          <div className="space-y-4 mb-6">
            <div className="text-left">
              <Label htmlFor="firstName" className="font-paragraph font-semibold text-foreground mb-2 block">
                Prénom
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Ton prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-foreground/20 px-4 py-2 font-paragraph"
              />
            </div>

            <div className="text-left">
              <Label htmlFor="lastName" className="font-paragraph font-semibold text-foreground mb-2 block">
                Nom
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Ton nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-foreground/20 px-4 py-2 font-paragraph"
              />
            </div>

            <div className="text-left">
              <Label htmlFor="class" className="font-paragraph font-semibold text-foreground mb-2 block">
                Classe
              </Label>
              <Select value={studentClass} onValueChange={setStudentClass}>
                <SelectTrigger className="w-full rounded-lg border border-foreground/20 px-4 py-2 font-paragraph">
                  <SelectValue placeholder="Sélectionne ta classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="B3">B3</SelectItem>
                  <SelectItem value="M1">M1</SelectItem>
                  <SelectItem value="M2">M2</SelectItem>
                  <SelectItem value="BTS">BTS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleLogin} 
            disabled={isLoading}
            className={buttonClassName}
          >
            {isLoading ? 'Connexion...' : buttonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
