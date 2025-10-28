import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '../lib/supabase';

interface PasswordResetDialogProps {
  trigger?: React.ReactNode;
}

export const PasswordResetDialog = ({ trigger }: PasswordResetDialogProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Te rog introdu adresa de email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Te rog introdu o adresă de email validă');
      return;
    }

    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError('A apărut o eroare. Te rog încearcă din nou.');
      return;
    }

    setSuccess(true);
    setEmail('');

    // Close dialog after 3 seconds
    setTimeout(() => {
      setOpen(false);
      setSuccess(false);
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="link" className="p-0 h-auto text-sm">
            Ai uitat parola?
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Resetare Parolă</DialogTitle>
          <DialogDescription>
            Introdu adresa ta de email și îți vom trimite un link pentru a-ți reseta parola.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <div className="text-5xl mb-4">✉️</div>
            <h3 className="text-lg font-semibold mb-2">Email trimis!</h3>
            <p className="text-sm text-muted-foreground">
              Verifică inbox-ul pentru link-ul de resetare.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Anulează
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Se trimite...' : 'Trimite Link'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
