import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Star, Upload, X, CheckCircle2, Video, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedFlowLogo } from "@/components/MedFlowLogo";

const RATING_LABELS = ["", "Muito ruim", "Ruim", "Regular", "Bom", "Excelente"];

interface TokenInfo {
  token: string;
  clinicSlug: string;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 active:scale-95 p-1"
            aria-label={`${s} estrela${s > 1 ? "s" : ""}`}
          >
            <Star
              className={`w-10 h-10 transition-colors duration-100 ${
                s <= active
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>
      <p className="text-sm font-semibold text-amber-600 h-5">
        {active > 0 ? RATING_LABELS[active] : ""}
      </p>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function NotFound() {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Star className="w-8 h-8 text-muted-foreground/40" />
      </div>
      <h1 className="text-xl font-bold mb-2">Link inválido ou já utilizado</h1>
      <p className="text-sm text-muted-foreground max-w-xs">
        Este link de avaliação não existe ou já foi usado. Solicite um novo link à clínica.
      </p>
    </div>
  );
}

function SuccessScreen({ doctorName }: { doctorName: string }) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Avaliação enviada!</h1>
      <p className="text-muted-foreground max-w-xs">
        Obrigado pelo feedback sobre sua consulta com <strong>{doctorName}</strong>. Isso ajuda a melhorar o atendimento.
      </p>
    </div>
  );
}

export default function Review() {
  const params = useParams<{ token: string }>();
  const token = params.token ?? "";

  const [status, setStatus] = useState<"loading" | "ready" | "notfound" | "used" | "submitted">("loading");
  const [info, setInfo] = useState<TokenInfo | null>(null);

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [videoName, setVideoName] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) { setStatus("notfound"); return; }
    fetch(`/api/review-tokens/${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (res.status === 410) { setStatus("used"); return; }
        if (!res.ok) { setStatus("notfound"); return; }
        const data = await res.json();
        setInfo(data);
        setStatus("ready");
      })
      .catch(() => setStatus("notfound"));
  }, [token]);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setPhotoError("Apenas JPG e PNG são aceitos.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("A foto deve ter no máximo 5MB.");
      return;
    }
    const b64 = await fileToBase64(file);
    setPhotoData(b64);
    setPhotoName(file.name);
  }

  async function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVideoError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "video/mp4") {
      setVideoError("Apenas MP4 é aceito.");
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setVideoError("O vídeo deve ter no máximo 30MB.");
      return;
    }
    const b64 = await fileToBase64(file);
    setVideoData(b64);
    setVideoName(file.name);
  }

  async function handleSubmit() {
    if (rating === 0 || text.trim().length < 10 || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, rating, reviewText: text.trim(), photoData, videoData }),
      });
      if (res.ok) {
        setStatus("submitted");
      } else {
        const err = await res.json();
        if (err.error === "Token already used") setStatus("used");
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = rating > 0 && text.trim().length >= 10;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === "notfound" || status === "used") return <NotFound />;
  if (status === "submitted" && info) return <SuccessScreen doctorName={info.doctorName} />;
  if (!info) return <NotFound />;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <MedFlowLogo size={32} />
          <div className="text-right">
            <p className="text-xs font-medium text-foreground">{info.clinicSlug}</p>
            <p className="text-xs text-muted-foreground">{formatDate(info.appointmentDate)}</p>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        {/* Context card */}
        <div className="bg-background border border-border rounded-2xl p-5 mb-6 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Consulta realizada</p>
          <h1 className="text-xl font-bold text-foreground mb-0.5">
            Como foi sua consulta com {info.doctorName}?
          </h1>
          <p className="text-sm text-muted-foreground">
            Paciente: <span className="font-medium text-foreground">{info.patientName}</span>
            {" · "}
            {formatDate(info.appointmentDate)}
          </p>
        </div>

        <div className="space-y-6">
          {/* Stars */}
          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-foreground mb-4 text-center">
              Qual nota você dá para o atendimento? *
            </p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Text */}
          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-foreground mb-3">
              Conta como foi sua experiência *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Descreva como foi o atendimento, o que gostou ou o que poderia melhorar…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-sm resize-none outline-none focus:border-primary transition-colors"
            />
            <div className="flex items-center justify-between mt-1.5">
              {text.trim().length > 0 && text.trim().length < 10 ? (
                <p className="text-xs text-destructive">Mínimo de 10 caracteres</p>
              ) : <span />}
              <p className={`text-xs ml-auto ${text.length > 500 ? "text-destructive" : "text-muted-foreground"}`}>
                {text.length}/500
              </p>
            </div>
          </div>

          {/* Photo */}
          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-foreground mb-1">Foto (opcional)</p>
            <p className="text-xs text-muted-foreground mb-4">JPG ou PNG, até 5MB</p>
            {photoData ? (
              <div className="space-y-3">
                <img src={photoData} alt="Preview" className="w-full max-h-48 object-cover rounded-xl border border-border" />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate">{photoName}</p>
                  <button
                    type="button"
                    onClick={() => { setPhotoData(null); setPhotoName(""); if (photoRef.current) photoRef.current.value = ""; }}
                    className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors ml-2 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" /> Remover
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => photoRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-xl py-8 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
              >
                <ImageIcon className="w-6 h-6" />
                <span className="text-sm">Clique para selecionar uma foto</span>
              </button>
            )}
            <input ref={photoRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handlePhotoChange} />
            {photoError && <p className="text-xs text-destructive mt-2">{photoError}</p>}
          </div>

          {/* Video */}
          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-foreground mb-1">Vídeo (opcional)</p>
            <p className="text-xs text-muted-foreground mb-4">MP4, até 30MB ou 60 segundos</p>
            {videoData ? (
              <div className="space-y-3">
                <video
                  src={videoData}
                  controls
                  className="w-full max-h-48 rounded-xl border border-border bg-black"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate">{videoName}</p>
                  <button
                    type="button"
                    onClick={() => { setVideoData(null); setVideoName(""); if (videoRef.current) videoRef.current.value = ""; }}
                    className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors ml-2 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" /> Remover
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => videoRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-xl py-8 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
              >
                <Video className="w-6 h-6" />
                <span className="text-sm">Clique para selecionar um vídeo</span>
              </button>
            )}
            <input ref={videoRef} type="file" accept="video/mp4" className="hidden" onChange={handleVideoChange} />
            {videoError && <p className="text-xs text-destructive mt-2">{videoError}</p>}
          </div>

          {/* Submit */}
          <Button
            className="w-full h-12 text-base"
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Enviar avaliação
              </span>
            )}
          </Button>
          {!canSubmit && (
            <p className="text-xs text-muted-foreground text-center -mt-2">
              {rating === 0 ? "Selecione uma nota de 1 a 5 estrelas" : "Escreva ao menos 10 caracteres sobre o atendimento"}
            </p>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-muted-foreground">
        Powered by <span className="font-semibold">MedFlow</span> · Avaliação de atendimento
      </footer>
    </div>
  );
}
