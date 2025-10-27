import { useState, useEffect } from 'react';

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
    <div className="context-form">
      <div className="step-header">
        <h2>Definește contextul cazului (opțional)</h2>
        <p className="step-description">
          Oferă detalii despre situația pe care vrei să o abordeze cazul, sau lasă gol pentru un context aleatoriu
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="topic-description" className="form-label">
          <span className="label-text">Descrierea contexului (opțional)</span>
          <span className="char-counter optional">
            {topic.length} caractere
          </span>
        </label>
        <textarea
          id="topic-description"
          className="form-textarea"
          rows={6}
          placeholder="Descrie situația generală, tema sau subiectul pe care îl abordează cazul...&#10;&#10;Exemplu: Un caz despre răspunderea civilă delictuală într-un accident rutier în care o persoană a fost rănită de un vehicul condus de un șofer aflat sub influența alcoolului. Cazul va explora condițiile răspunderii civile și ale daunelor morale."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        {topic.length > 0 && (
          <div className="field-hint success">
            ✓ Context specificat
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="specific-focus" className="form-label">
          <span className="label-text">Focus specific (opțional)</span>
          <span className="char-counter optional">
            {focus.length} caractere
          </span>
        </label>
        <textarea
          id="specific-focus"
          className="form-textarea"
          rows={4}
          placeholder="Dacă există aspecte specifice pe care vrei să le evidențiezi sau să le explorezi în detaliu...&#10;&#10;Exemplu: Pune accent pe aplicarea excepțiilor de la regula generală, incluzând circumstanțe atenuante sau agravante. Explorează și aspectele legate de vinovăție și raportul cauzal."
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
        />
        <div className="field-hint">
          Acest câmp te ajută să ghidezi AI-ul către anumite aspecte sau situații particulare
        </div>
      </div>

      <div className="context-tips">
        <h4>💡 Sfaturi pentru o descriere eficientă:</h4>
        <ul>
          <li>Fii cât mai specific cu situația pe care vrei să o creezi</li>
          <li>Menționează elementele importante: actori, relații juridice, evenimente</li>
          <li>Indică dacă vrei cazul să se concentreze pe anumite principii sau excepții</li>
          <li>Dacă cazul trebuie să aibă un anumit grad de complexitate, menționează-l</li>
          <li>Poți include detalii despre tipul de soluție pe care o aștepți (ex: aplicare directă, interpretare, analogie)</li>
        </ul>
      </div>

      {topic && (
        <div className="preview-box">
          <h4>📝 Rezumat context:</h4>
          <p className="preview-text">
            AI-ul va genera un caz care {topic.toLowerCase().startsWith('un') ? topic.toLowerCase() : `abordează ${topic.toLowerCase()}`}
            {focus && ` cu focus specific pe ${focus.toLowerCase()}`}.
          </p>
        </div>
      )}
    </div>
  );
};
