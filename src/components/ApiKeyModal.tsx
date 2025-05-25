
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { openAIService } from '@/services/openai-service';
import { toast } from 'sonner';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultApiKey?: string;
}

const ApiKeyModal = ({ isOpen, onClose, defaultApiKey = '' }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
  if (defaultApiKey) {
      setApiKey(defaultApiKey);
      openAIService.setApiKey(defaultApiKey); // <- garante uso imediato
    } else {
      const savedApiKey = localStorage.getItem('openai_api_key') || '';
      setApiKey(savedApiKey);
      if (savedApiKey) {
        openAIService.setApiKey(savedApiKey); // <- garante uso imediato
      }
    }
  }, [defaultApiKey, isOpen]);


  const handleSubmit = () => {
    if (apiKey.trim()) {
      openAIService.setApiKey(apiKey.trim());
      localStorage.setItem('openai_api_key', apiKey.trim());
      toast.success('Chave API salva com sucesso!');
      onClose();
    } else {
      toast.error('Por favor, insira uma chave API válida');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OpenAI API Key</DialogTitle>
          <DialogDescription>
            Para utilizar o gerador de sites, é necessário fornecer sua chave de API da OpenAI.
            Sua chave será armazenada apenas no seu navegador.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Label htmlFor="apiKey">API Key</Label>
          <Input 
            id="apiKey" 
            placeholder="sk-..." 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Você pode obter sua chave de API no <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">Painel da OpenAI</a>.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
