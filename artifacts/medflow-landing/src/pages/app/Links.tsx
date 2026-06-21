import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { getClinicData, saveSession, generateSlug } from "@/lib/clinic";
import { Button } from "@/components/ui/button";
import {
  Link2,
  Copy,
  Check,
  MessageCircle,
  ArrowUpRight,
  RefreshCw,
  X,
} from "lucide-react";

function buildBookingUrl(slug: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${window.location.origin}${base}/booking/${slug}`;
}

export default function Links() {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [slugError, setSlugError] = useState("");
  const [saved, setSaved] = useState(false);

  const { slug, url } = useMemo(() => {
    const data = getClinicData();
    const s = (data?.clinicSlug ?? "").trim() || "minha-clinica";
    return { slug: s, url: buildBookingUrl(s) };
  }, [saved]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTest = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Agende sua consulta de forma rápida e fácil pelo nosso link:\n\n${url}\n\nEscolha o horário que preferir diretamente pela plataforma. 😊`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank", "noopener");
  };

  const openModal = () => {
    setNewSlug(slug);
    setSlugError("");
    setShowModal(true);
  };

  const handleSlugChange = (value: string) => {
    const cleaned = generateSlug(value);
    setNewSlug(cleaned);
    if (!cleaned) {
      setSlugError("O slug não pode ficar vazio.");
    } else if (cleaned.length < 3) {
      setSlugError("O slug precisa ter pelo menos 3 caracteres.");
    } else {
      setSlugError("");
    }
  };

  const handleSave = useCallback(() => {
    if (!newSlug || newSlug.length < 3) return;
    saveSession({ clinicSlug: newSlug });
    setSaved((v) => !v);
    setShowModal(false);
  }, [newSlug]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Links</h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Gerencie o link de agendamento público da sua clínica.
        </p>
      </div>

      {/* Booking Link Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm relative overflow-hidden"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-l-2xl" />

        <div className="pl-3 flex flex-col gap-4">
          {/* Title row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <Link2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-base">
                Seu link de agendamento
              </p>
              <p className="text-xs text-muted-foreground">
                Slug: <span className="font-mono text-primary">{slug}</span>
              </p>
            </div>
          </div>

          {/* Full URL display */}
          <div className="flex items-center gap-2 bg-muted/70 border border-border rounded-lg px-3 py-2">
            <span
              className="text-sm text-foreground flex-1 truncate"
              style={{ fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace" }}
              title={url}
            >
              {url}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className={`gap-2 transition-all ${copied ? "border-emerald-400 text-emerald-600" : ""}`}
              data-testid="button-copiar-link"
            >
              {copied ? <><Check className="w-4 h-4" />Copiado!</> : <><Copy className="w-4 h-4" />Copiar</>}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleTest}
              className="gap-2"
              data-testid="button-testar-link"
            >
              <ArrowUpRight className="w-4 h-4" />
              Testar
            </Button>
            <Button
              size="sm"
              onClick={handleWhatsApp}
              className="gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white border-0"
              data-testid="button-whatsapp"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Compartilhe este link para que pacientes agendem consultas online.
          </p>
        </div>
      </motion.div>

      {/* Generate new link */}
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground">Gerar novo link</p>
            <p className="text-sm text-muted-foreground mt-1">
              Troque o slug da sua URL de agendamento. O link anterior deixará de funcionar.
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2 shrink-0"
            onClick={openModal}
            data-testid="button-gerar-novo-link"
          >
            <RefreshCw className="w-4 h-4" />
            Gerar novo link
          </Button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="bg-background rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 relative"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-semibold text-foreground text-lg mb-1">Alterar slug do link</h3>
            <p className="text-sm text-muted-foreground mb-4">
              O novo slug substitui o atual. Pacientes com o link antigo não conseguirão acessar.
            </p>

            <label className="block text-sm font-medium text-foreground mb-1.5">
              Novo slug
            </label>
            <input
              type="text"
              value={newSlug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="ex: clinica-sao-lucas"
              className="w-full px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm font-mono outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              data-testid="input-novo-slug"
            />
            {slugError && (
              <p className="text-xs text-destructive mt-1.5">{slugError}</p>
            )}

            {newSlug && !slugError && (
              <p className="text-xs text-muted-foreground mt-2">
                Novo link:{" "}
                <span className="font-mono text-foreground">{buildBookingUrl(newSlug)}</span>
              </p>
            )}

            <div className="flex justify-end gap-2 mt-5">
              <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!newSlug || !!slugError}
                data-testid="button-salvar-slug"
              >
                Salvar novo link
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
