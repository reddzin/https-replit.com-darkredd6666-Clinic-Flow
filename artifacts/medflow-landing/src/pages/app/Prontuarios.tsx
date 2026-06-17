import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, ChevronRight } from "lucide-react";

const records = [
  { id: 1, patient: "Ana Paula Mendes", date: "12/06/2026", doctor: "Dr. Carlos Lima", specialty: "Cardiologia", cid: "I10 - Hipertensão Essencial" },
  { id: 2, patient: "Roberto Alves", date: "08/06/2026", doctor: "Dra. Fernanda Melo", specialty: "Clínica Geral", cid: "J06.9 - IVAS" },
  { id: 3, patient: "Mariana Costa", date: "01/06/2026", doctor: "Dr. Paulo Rocha", specialty: "Dermatologia", cid: "L70.0 - Acne Vulgar" },
  { id: 4, patient: "Pedro Souza", date: "15/06/2026", doctor: "Dr. Paulo Rocha", specialty: "Neurologia", cid: "G43 - Enxaqueca" },
  { id: 5, patient: "Fernanda Lima", date: "05/06/2026", doctor: "Dr. Carlos Lima", specialty: "Endocrinologia", cid: "E11 - Diabetes Tipo 2" },
];

const detailRecord = {
  patient: "Ana Paula Mendes",
  date: "12/06/2026",
  doctor: "Dr. Carlos Lima",
  specialty: "Cardiologia",
  vitals: { pa: "140/90 mmHg", fc: "78 bpm", peso: "68 kg", altura: "1,65 m" },
  anamnese: "Paciente relata cefaleia occipital há 3 dias, associada a vertigem ocasional. Nega dispneia ou dor precordial. Faz uso regular de losartana 50mg.",
  cid: "I10 - Hipertensão Essencial",
  prescricao: ["Losartana 50mg — 1 cp às 8h", "Hidroclorotiazida 25mg — 1 cp às 8h", "Retorno em 30 dias"],
  exames: ["ECG de repouso", "Ecocardiograma bidimensional", "Creatinina sérica e potássio"],
};

export default function Prontuarios() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = records.filter(r =>
    r.patient.toLowerCase().includes(search.toLowerCase()) ||
    r.specialty.toLowerCase().includes(search.toLowerCase())
  );

  if (selected !== null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1" data-testid="button-voltar">
            ← Voltar
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">{detailRecord.patient}</span>
        </div>

        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">{detailRecord.patient}</h2>
              <p className="text-sm text-muted-foreground">{detailRecord.specialty} · {detailRecord.doctor} · {detailRecord.date}</p>
            </div>
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">{detailRecord.cid}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(detailRecord.vitals).map(([k, v]) => (
              <div key={k} className="p-4 rounded-xl bg-muted/40 text-center">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{k.toUpperCase()}</p>
                <p className="text-sm font-bold text-foreground">{v}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Anamnese</h3>
              <div className="p-4 rounded-xl bg-muted/30 text-sm text-foreground leading-relaxed">{detailRecord.anamnese}</div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Prescrição</h3>
              <div className="space-y-2">
                {detailRecord.prescricao.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-muted/30">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <span className="text-sm text-foreground">{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Exames Solicitados</h3>
              <div className="space-y-2">
                {detailRecord.exames.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-muted/30">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{e}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por paciente, especialidade..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search-records"
          />
        </div>
        <Button data-testid="button-novo-prontuario">
          <Plus className="w-4 h-4 mr-2" /> Novo Prontuário
        </Button>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Paciente</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Especialidade</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Diagnóstico (CID)</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Data</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => setSelected(r.id)}
                  data-testid={`row-record-${r.id}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                        {r.patient[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.patient}</p>
                        <p className="text-xs text-muted-foreground">{r.doctor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{r.specialty}</td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{r.cid}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{r.date}</td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
