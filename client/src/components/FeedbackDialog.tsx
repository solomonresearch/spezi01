import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Mail } from 'lucide-react';
import { feedbackService } from '../services/feedbackService';
import { useAuth } from '../contexts/AuthContext';

interface FeedbackDialogProps {
  trigger?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const FeedbackDialog = ({
  trigger,
  variant = 'outline',
  size = 'sm',
  className = '',
}: FeedbackDialogProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!body.trim()) {
      setError('Feedback-ul nu poate fi gol');
      return;
    }

    // Validate email if provided
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setError('Te rog introdu o adresă de email validă');
      return;
    }

    setLoading(true);

    const { error: submitError } = await feedbackService.submitFeedback({
      body: body.trim(),
      email: email.trim() || undefined,
    });

    setLoading(false);

    if (submitError) {
      setError('A apărut o eroare. Te rog încearcă din nou.');
      return;
    }

    setSuccess(true);
    setBody('');
    setEmail('');

    // Close dialog after 1.5 seconds
    setTimeout(() => {
      setOpen(false);
      setSuccess(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={variant} size={size} className={`gap-2 ${className}`}>
            <Mail className="h-3 w-3" />
            Trimite Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Trimite Feedback</DialogTitle>
          <DialogDescription>
            Ne bucurăm să auzim de la tine! Orice sugestie, idee sau raportare de bug este binevenită.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <div className="text-5xl mb-4">🙏</div>
            <h3 className="text-lg font-semibold mb-2">Mulțumim!</h3>
            <p className="text-sm text-muted-foreground">
              Feedback-ul tău a fost trimis cu succes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!user && (
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email (opțional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Dacă vrei să primești un răspuns, lasă-ne adresa ta de email.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="body">
                Mesaj <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Scrie aici feedback-ul tău..."
                disabled={loading}
                rows={6}
                className="resize-none"
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
                {loading ? 'Se trimite...' : 'Trimite Feedback'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
