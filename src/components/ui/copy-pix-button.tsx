'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyPixButton({ payload }: { payload: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = payload;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full relative mt-2 group">
      <textarea 
        readOnly 
        value={payload} 
        className="w-full text-xs font-mono bg-background border rounded-xl p-3 pr-[110px] resize-none outline-none focus:ring-2 focus:ring-primary"
        rows={3}
        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
      />
      <div className="absolute right-2 top-2 bottom-2 flex items-center">
         <button 
           type="button"
           onClick={handleCopy}
           className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm h-full ${
             copied 
               ? 'bg-green-600 text-white' 
               : 'bg-primary text-primary-foreground hover:opacity-90'
           }`}
         >
           {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
           {copied ? 'COPIADO' : 'COPIAR'}
         </button>
      </div>
    </div>
  );
}
