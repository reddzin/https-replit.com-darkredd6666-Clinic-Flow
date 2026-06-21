import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, Plus, Copy, CheckCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getSession } from "@/lib/clinic";

interface Review {
  id: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  rating: number;
  reviewText: string;
  photoData: string | null;
  videoData: string | null;
  createdAt: string;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <Star
      className={`w-4 h-4 ${filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
    />
  );
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={s <= count} />)}
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return dateStr; }
}

export default function Avaliacoes() {
  const session = getSession();
  const clinicSlug = session?.clinicSlug ?? "";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [paciente, setPaciente] = useState("");
  const [medico, setMedico] = useState("");
  const [dataConsulta, setDataConsulta] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"form" | "link">("form");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!clinicSlug) { setLoading(false); return; }
    fetch(`/api/reviews/${encodeURIComponent(clinicSlug)}`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [clinicSlug]);

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews
    : 0;
  const positivePct = totalReviews > 0
    ? Math.round((reviews.filter((r) => r.rating >= 4).length / totalReviews) * 100)
    : 0;
  const negativePct = totalReviews > 0
    ? Math.round((reviews.filter((r) => r.rating <= 2).length / totalReviews) * 100)
    : 0;

  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  async function handleGenerate() {
    if (!paciente.trim() || !medico.trim() || !dataConsulta) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/review-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicSlug,
          patientName: paciente.trim(),
          doctorName: medico.trim(),
          appointmentDate: dataConsulta,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const base = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, "")}`;
        setGeneratedLink(`${base}/review/${data.token}`);
        setStep("link");
      }
    } catch { /* ignore */ }
    setGenerating(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleClose() {
    setModalOpen(false);
    setPaciente("");
    setMedico("");
    setDataConsulta("");
    setGeneratedLink("");
    setCopied(false);
    setStep("form");
  }

  const isEmpty = !loading && totalReviews === 0;

  return (
    <div className="space-y-6">
      {/* Top */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Acompanhe a satisfação dos pacientes com os atendimentos realizados.
        </p>
        <Button variant="outline" onClick={() => { setStep("form"); setModalOpen(true); }} data-testid="button-solicitar-avaliacao">
          <Plus className="w-4 h-4 mr-2" /> Solicitar Avaliação
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Nota Média</p>
          <p className="text-3xl font-bold text-foreground mb-1">
            {avgRating > 0 ? avgRating.toFixed(1) : "—"}
          </p>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={s <= Math.round(avgRating)} />)}
          </div>
        </div>
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Total de Avaliações</p>
          <p className="text-3xl font-bold text-foreground mb-1">{totalReviews}</p>
          <p className="text-xs text-muted-foreground">
            {totalReviews === 0 ? "Nenhuma recebida ainda" : "avaliações recebidas"}
          </p>
        </div>
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Avaliações Positivas</p>
          <p className="text-3xl font-bold text-emerald-600 mb-1">
            {totalReviews > 0 ? `${positivePct}%` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            {totalReviews > 0 ? "notas 4 e 5 estrelas" : "Sem dados ainda"}
          </p>
        </div>
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Avaliações Negativas</p>
          <p className="text-3xl font-bold text-rose-500 mb-1">
            {totalReviews > 0 ? `${negativePct}%` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            {totalReviews > 0 ? "notas 1 e 2 estrelas" : "Sem dados ainda"}
          </p>
        </div>
      </div>

      {/* Star Distribution */}
      <div className="bg-background rounded-2xl border border-border shadow-sm p-6">
        <h3 className="font-semibold text-foreground mb-4">Distribuição por Estrelas</h3>
        <div className="space-y-3">
          {starCounts.map(({ stars, count }) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-20 shrink-0">
                {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={s <= stars} />)}
              </div>
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: totalReviews > 0 ? `${(count / totalReviews) * 100}%` : "0%" }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
        {isEmpty && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            O gráfico será preenchido quando houver avaliações.
          </p>
        )}
      </div>

      {/* Reviews List */}
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <p className="text-sm font-medium text-muted-foreground">
            {loading ? "Carregando…" : totalReviews === 1 ? "1 avaliação recebida" : `${totalReviews} avaliações recebidas`}
          </p>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Nenhuma avaliação recebida ainda</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Solicite avaliações aos seus pacientes após as consultas. O feedback ajuda a melhorar a qualidade do atendimento.
            </p>
            <Button onClick={() => { setStep("form"); setModalOpen(true); }} data-testid="button-solicitar-avaliacao-empty">
              <Plus className="w-4 h-4 mr-2" /> Solicitar Primeira Avaliação
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {reviews.map((review) => (
              <div key={review.id} className="border border-border rounded-2xl p-5 space-y-3 bg-background shadow-sm">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{review.patientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.doctorName} · {formatDate(review.appointmentDate)}
                    </p>
                  </div>
                  <StarRow count={review.rating} />
                </div>

                {/* Text */}
                <p className="text-sm text-foreground leading-relaxed">{review.reviewText}</p>

                {/* Photo */}
                {review.photoData && (
                  <img
                    src={review.photoData}
                    alt="Foto da avaliação"
                    className="w-full max-h-48 object-cover rounded-xl border border-border"
                  />
                )}

                {/* Video */}
                {review.videoData && (
                  <video
                    src={review.videoData}
                    controls
                    className="w-full max-h-48 rounded-xl border border-border bg-black"
                  />
                )}

                <p className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("pt-BR", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={(o) => { if (!o) handleClose(); else setModalOpen(true); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Avaliação de Consulta</DialogTitle>
            <DialogDescription>
              {step === "form"
                ? "Informe os dados da consulta concluída para gerar o link de avaliação do paciente."
                : "Copie o link abaixo e envie ao paciente pelo WhatsApp."}
            </DialogDescription>
          </DialogHeader>

          {step === "form" ? (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="paciente-avaliacao">Nome do paciente *</Label>
                <Input
                  id="paciente-avaliacao"
                  placeholder="Ex: Maria Silva"
                  value={paciente}
                  onChange={(e) => setPaciente(e.target.value)}
                  data-testid="input-paciente-avaliacao"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="medico-avaliacao">Médico responsável *</Label>
                <Input
                  id="medico-avaliacao"
                  placeholder="Ex: Dr. João Souza"
                  value={medico}
                  onChange={(e) => setMedico(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="data-avaliacao">Data da consulta *</Label>
                <Input
                  id="data-avaliacao"
                  type="date"
                  value={dataConsulta}
                  onChange={(e) => setDataConsulta(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                Link gerado para <strong>{paciente}</strong> — consulta com <strong>{medico}</strong>:
              </p>
              <div className="flex items-center gap-2">
                <Input readOnly value={generatedLink} className="font-mono text-xs" />
                <Button size="icon" variant="outline" onClick={handleCopy} data-testid="button-copiar-link">
                  {copied ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              {copied && <p className="text-xs text-emerald-600 font-medium">Link copiado!</p>}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Fechar</Button>
            {step === "form" && (
              <Button
                onClick={handleGenerate}
                disabled={!paciente.trim() || !medico.trim() || !dataConsulta || generating}
                data-testid="button-gerar-link"
              >
                {generating ? "Gerando…" : "Gerar Link"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
