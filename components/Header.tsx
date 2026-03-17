import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          {/* Organization Brand */}
          <div className="flex flex-col justify-center leading-none select-none">
            <span className="font-semibold text-base tracking-tight text-foreground">Three Points</span>
            <span className="font-medium text-[10px] tracking-[0.15em] text-muted-foreground uppercase">Hospitality Group</span>
          </div>
          
          <div className="hidden md:block h-6 w-px bg-border/60 mx-5"></div>
          
          {/* Software Brand */}
          <div className="hidden md:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-primary/5 border border-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide">
              <Zap className="h-3 w-3" />
              Autograde
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           {/* Mobile Badge */}
           <div className="md:hidden">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/8 text-primary">
                <Zap className="h-3.5 w-3.5" />
              </span>
           </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-border/60 bg-accent/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>Secure</span>
          </div>
        </div>
      </div>
    </header>
  );
};