import { Check } from 'lucide-react';
import type { LegalDomain } from '../../types/caseGenerator';
import { DOMAINS } from '../../constants/caseGeneratorData';
import { Card, CardContent } from '@/components/ui/card';

interface DomainSelectorProps {
  selectedDomain: LegalDomain | null;
  onSelect: (domain: LegalDomain) => void;
}

export const DomainSelector = ({ selectedDomain, onSelect }: DomainSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Selectează domeniul juridic (opțional)</h2>
        <p className="text-muted-foreground">
          Alege domeniul pentru care vrei să generezi cazul practic, sau sări la pasul următor pentru un caz random
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOMAINS.map(domain => (
          <Card
            key={domain.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedDomain === domain.id
                ? 'ring-2 ring-primary shadow-lg'
                : 'hover:ring-1 hover:ring-muted-foreground/50'
            }`}
            onClick={() => onSelect(domain.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelect(domain.id);
              }
            }}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-3 relative">
              <div className="text-4xl">{domain.icon}</div>
              <h3 className="font-semibold text-lg">{domain.name}</h3>
              {selectedDomain === domain.id && (
                <div className="absolute top-2 right-2">
                  <Check className="h-5 w-5 text-primary" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedDomain && (
        <div className="flex items-center justify-center gap-2 text-sm bg-muted px-4 py-2 rounded-lg">
          <span className="text-muted-foreground">Domeniu selectat:</span>
          <span className="font-semibold">
            {DOMAINS.find(d => d.id === selectedDomain)?.name}
          </span>
        </div>
      )}
    </div>
  );
};
