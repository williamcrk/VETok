
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Dog, Cat } from 'lucide-react';

const LoginFormGreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Login realizado!",
      description: "Bem-vindo ao VetPrime",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center relative">
                <Dog className="w-4 h-4 text-white absolute -left-1" />
                <Cat className="w-4 h-4 text-white absolute -right-1" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                VetPrime
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo!</h1>
          <p className="text-gray-600">Acesse o sistema de gestão veterinária</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-white/50 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Senha *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 bg-white/50 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              className="border-gray-300"
            />
            <Label htmlFor="remember" className="text-sm text-gray-600">
              Lembrar de mim
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            Acessar Sistema
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors duration-200">
            Política de privacidade
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginFormGreen;
