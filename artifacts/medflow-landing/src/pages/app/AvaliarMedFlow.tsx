import { useState } from "react";
import { Star, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/clinic";

const RATING_LABELS = ["", "Muito ruim", "Ruim", "Regular", "Bom", "Excelente"];
const RATING_COLORS = ["", "text-rose-500", "text-orange-500", "text-amber-500", "text-lime-600", "text-emerald-600"];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 active:scale-95 p-1 rounded-lg"
            aria-label={`${s} estrela${s > 1 ? "s" : ""}`}
          >
            <Star
              className={`w-12 h-12 transition-colors duration-100 ${
                s <= active
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/25"
              }`}
            />
          </button>
        ))}
      </div>
      <p className={`text-base font-semibold h-6 transition-colors ${RATING_COLORS[active] ?? ""}`}>
        {active > 0 ? RATING_LABELS[active] : ""}
      </p>
    </div>
  );
}

type SubmitState = "idle" | "submitting" | "done" | "error" | "already_reviewed";

export default function AvaliarMedFlow() {
  const session = getSession();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  async function handleSubmit() {
    if (rating === 0 || submitState === "submitting") return;
    setSubmitState("submitting");
    try {
      const res = await fetch("/api/app-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicId: session?.clinicSlug ?? "unknown",
          ownerEmail: session?.email ?? "unknown",
          rating,
          reviewText: text.trim() || null,
        }),
      });
      if (res.ok) {
        setSubmitState("done");
      } else {
        const err = await res.json();
        if (err.error === "already_reviewed") {
          setSubmitState("already_reviewed");
        } else {
          setSubmitState("error");
        }
      }
    } catch {
      setSubmitState("error");
    }
  }

  if (submitState === "done") {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Obrigado pelo feedback!</h2>
        <p className="text-muted-foreground">
          Sua avaliação foi enviada. Usamos esse feedback para continuar melhorando o MedFlow.
        </p>
      </div>
    );
  }

  if (submitState === "already_reviewed") {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
          <Star className="w-10 h-10 text-amber-400 fill-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Você já avaliou o MedFlow</h2>
        <p className="text-muted-foreground">
          Sua clínica já enviou uma avaliação. Agradecemos o feedback!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header card */}
      <div className="bg-gradient-to-br from-primary/5 to-emerald-50 border border-primary/20 rounded-2xl p-6 mb-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Avalie o MedFlow</h2>
          <p className="text-sm text-muted-foreground">
            Sua opinião como gestor da clínica nos ajuda a melhorar o produto. Isso é diferente das avaliações dos pacientes — aqui é você avaliando o sistema.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Stars */}
        <div className="bg-background border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-foreground mb-2">
            Como você avalia o MedFlow? *
          </p>
          <StarRating value={rating} onChange={setRating} />
        </div>

        {/* Text */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-foreground mb-3">
            Comentário <span className="font-normal text-muted-foreground">(opcional)</span>
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="O que você achou do MedFlow?"
            rows={4}
            maxLength={600}
            className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-sm resize-none outline-none focus:border-primary transition-colors"
          />
          <p className="text-xs text-muted-foreground text-right mt-1">{text.length}/600</p>
        </div>

        {/* Submit */}
        <Button
          className="w-full h-12 text-base"
          disabled={rating === 0 || submitState === "submitting"}
          onClick={handleSubmit}
        >
          {submitState === "submitting" ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" />
              Enviar avaliação
            </span>
          )}
        </Button>

        {rating === 0 && (
          <p className="text-xs text-muted-foreground text-center -mt-2">
            Selecione uma nota de 1 a 5 estrelas para continuar
          </p>
        )}

        {submitState === "error" && (
          <p className="text-sm text-destructive text-center font-medium">
            Erro ao enviar. Tente novamente.
          </p>
        )}
      </div>
    </div>
  );
}
