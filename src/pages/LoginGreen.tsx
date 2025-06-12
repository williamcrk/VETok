
import React from 'react';
import GeometricBackgroundGreen from '@/components/GeometricBackgroundGreen';
import LoginFormGreen from '@/components/LoginFormGreen';

const LoginGreen = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <GeometricBackgroundGreen />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="hidden lg:block text-white space-y-6 animate-slide-in">
            <h1 className="text-6xl font-bold leading-tight">
              Bem-vindo ao
              <span className="block bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                Futuro Digital
              </span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Uma experiência moderna e intuitiva para o seu workspace digital. 
              Conecte-se com facilidade e produtividade.
            </p>
            <div className="flex space-x-4">
              <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <LoginFormGreen />
          </div>
        </div>
      </div>
      
      <div className="absolute top-10 right-10 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default LoginGreen;
