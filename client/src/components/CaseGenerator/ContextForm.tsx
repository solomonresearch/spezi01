import { useState, useEffect } from 'react';
import { Check, Lightbulb, FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface ContextFormProps {
  topicDescription: string;
  specificFocus: string;
  onChange: (topicDescription: string, specificFocus: string) => void;
}

export const ContextForm = ({ topicDescription, specificFocus, onChange }: ContextFormProps) => {
  const [topic, setTopic] = useState(topicDescription);
  const [focus, setFocus] = useState(specificFocus);

  // Update parent state when values change
  useEffect(() => {
    onChange(topic, focus);
  }, [topic, focus, onChange]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Definește contextul cazului (opțional)</h2>
        <p className="text-muted-foreground">
          Oferă detalii despre situația pe care vrei să o abordeze cazul, sau lasă gol pentru un context aleatoriu
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="topic-description">Descrierea contexului (opțional)</Label>
            <span className="text-xs text-muted-foreground">
              {topic.length} caractere
            </span>
          </div>
          <Textarea
            id="topic-description"
            rows={6}
            placeholder="Descrie situația generală, tema sau subiectul pe care îl abordează cazul...

Exemplu: Un caz despre răspunderea civilă delictuală într-un accident rutier în care o persoană a fost rănită de un vehicul condus de un șofer aflat sub influența alcoolului. Cazul va explora condițiile răspunderii civile și ale daunelor morale."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          {topic.length > 0 && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <Check className="h-4 w-4" />
              Context specificat
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="specific-focus">Focus specific (opțional)</Label>
            <span className="text-xs text-muted-foreground">
              {focus.length} caractere
            </span>
          </div>
          <Textarea
            id="specific-focus"
            rows={4}
            placeholder="Dacă există aspecte specifice pe care vrei să le evidențiezi sau să le explorezi în detaliu...

Exemplu: Pune accent pe aplicarea excepțiilor de la regula generală, incluzând circumstanțe atenuante sau agravante. Explorează și aspectele legate de vinovăție și raportul cauzal."
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Acest câmp te ajută să ghidezi AI-ul către anumite aspecte sau situații particulare
          </p>
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6 space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Sfaturi pentru o descriere eficientă:
          </h4>
          <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
            <li>Fii cât mai specific cu situația pe care vrei să o creezi</li>
            <li>Menționează elementele importante: actori, relații juridice, evenimente</li>
            <li>Indică dacă vrei cazul să se concentreze pe anumite principii sau excepții</li>
            <li>Dacă cazul trebuie să aibă un anumit grad de complexitate, menționează-l</li>
            <li>Poți include detalii despre tipul de soluție pe care o aștepți (ex: aplicare directă, interpretare, analogie)</li>
          </ul>
        </CardContent>
      </Card>

      {topic && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6 space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Rezumat context:
            </h4>
            <p className="text-sm text-foreground">
              AI-ul va genera un caz care {topic.toLowerCase().startsWith('un') ? topic.toLowerCase() : `abordează ${topic.toLowerCase()}`}
              {focus && ` cu focus specific pe ${focus.toLowerCase()}`}.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
