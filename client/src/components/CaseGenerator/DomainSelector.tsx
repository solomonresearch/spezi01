import type { LegalDomain } from '../../types/caseGenerator';
import { DOMAINS } from '../../constants/caseGeneratorData';

interface DomainSelectorProps {
  selectedDomain: LegalDomain | null;
  onSelect: (domain: LegalDomain) => void;
}

export const DomainSelector = ({ selectedDomain, onSelect }: DomainSelectorProps) => {
  return (
    <div className="domain-selector">
      <div className="step-header">
        <h2>Selectează domeniul juridic (opțional)</h2>
        <p className="step-description">
          Alege domeniul pentru care vrei să generezi cazul practic, sau sări la pasul următor pentru un caz random
        </p>
      </div>

      <div className="domain-cards">
        {DOMAINS.map(domain => (
          <div
            key={domain.id}
            className={`domain-card ${selectedDomain === domain.id ? 'selected' : ''}`}
            onClick={() => onSelect(domain.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelect(domain.id);
              }
            }}
          >
            <div className="domain-icon">{domain.icon}</div>
            <h3 className="domain-name">{domain.name}</h3>
            <div className="domain-check">
              {selectedDomain === domain.id && <span className="check-mark">✓</span>}
            </div>
          </div>
        ))}
      </div>

      {selectedDomain && (
        <div className="selection-summary">
          <span className="summary-label">Domeniu selectat:</span>
          <span className="summary-value">
            {DOMAINS.find(d => d.id === selectedDomain)?.name}
          </span>
        </div>
      )}
    </div>
  );
};
