'use client';

import React, { useRef, useState } from 'react';
import { Button } from './button';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImageAction } from '@/features/admin/actions/upload-image-action';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional local validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande', { description: 'O tamanho máximo permitido é 5MB.' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Formato inválido', { description: 'O arquivo selecionado deve ser uma imagem.' });
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadImageAction(formData);

      if (response.success && response.url) {
        onChange(response.url);
        toast.success('Upload concluído!');
      } else {
        toast.error('Erro no upload', { description: response.error || 'Não foi possível enviar a imagem.' });
      }
    } catch (error) {
      toast.error('Erro no servidor', { description: 'Houve uma falha inesperada na comunicação.' });
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be selected again if needed
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input 
        type="file" 
        accept="image/*" 
        ref={inputRef} 
        onChange={handleFileChange} 
        disabled={disabled || isUploading}
        className="hidden"
      />

      <div className="flex items-center gap-4">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Fazer Upload
            </>
          )}
        </Button>
        {value && (
          <Button 
            type="button" 
            variant="destructive" 
            size="icon" 
            onClick={() => onChange('')}
            disabled={disabled || isUploading}
            title="Remover imagem"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Preview */}
      {value ? (
        <div className="mt-4 p-4 border rounded-md bg-white/50 flex justify-center relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview do produto" className="h-48 object-contain rounded" />
        </div>
      ) : (
        <div className="mt-4 p-8 border border-dashed rounded-md bg-muted/20 flex flex-col items-center justify-center text-muted-foreground gap-2">
          <ImageIcon className="w-8 h-8 opacity-50" />
          <span className="text-sm">Nenhuma imagem selecionada</span>
        </div>
      )}
    </div>
  );
}
