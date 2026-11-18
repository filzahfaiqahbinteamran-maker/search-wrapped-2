import React from 'react';
import { Wifi, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  title?: string;
  className?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  isExpanded = false,
  className = '',
}) => {
  if (isExpanded) {
    return (
      <div
        className={`w-full max-w-[920px] mx-auto rounded-[28px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.75)] border border-neutral-800 bg-[#0B1120] flex flex-col ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative mx-auto w-full max-w-[376px] h-[736px] max-h-[calc(100vh-126px)] rounded-[48px] bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.75),0_0_0_6px_#27272a] flex flex-col overflow-hidden select-none ${className}`}
    >
      {/* Screen Content (Full-bleed inside the rounded phone frame) */}
      <div className="relative flex-1 w-full rounded-[40px] overflow-hidden bg-white flex flex-col">
        {/* Top iOS Status Bar + Dynamic Island */}
        <div className="absolute top-0 left-0 right-0 h-10 px-6 pt-1.5 flex items-center justify-between text-neutral-900 text-[12px] font-bold tracking-tight z-40 pointer-events-none">
          <span>9:41</span>

          {/* Dynamic Island Pill */}
          <div className="w-24 h-6 bg-black rounded-full shadow-sm" />

          <div className="flex items-center gap-1 text-neutral-900">
            <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <div className="w-5 h-2.5 rounded-[3px] border border-neutral-900 p-0.5 flex items-center">
              <div className="h-full w-3.5 bg-neutral-900 rounded-[1px]" />
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};
