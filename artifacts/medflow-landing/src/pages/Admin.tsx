import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Star,
  LogOut,
  Activity,
  Users,
  TrendingUp,
  MessageSquare,
  Image as ImageIcon,
  Video as VideoIcon,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/clinic";

const ADMIN_EMAIL = "igorsilvaarcini1@hotmail.com";

interface AppReview {
  id: number;
  clinicId: string;
  ownerEmail: string;
  rating: number;
  reviewText: string | null;
  photoUrl: string | null;
  videoUrl: string | null;
  createdAt: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground/20"}`}
        />
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const session = getSession();
  const [reviews, setReviews] = useState<AppReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);

  // Guard — only admin
  useEffect(() => {
    if (!session?.email || session.email !== ADMIN_EMAIL) {
      setLocation("/entrar");
    }
  }, [session, setLocation]);

  useEffect(() => {
    if (session?.email !== ADMIN_EMAIL) return;
    fetch("/api/app-reviews", {
      headers: { "x-admin-key": ADMIN_EMAIL },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
        else setError("Erro ao carregar avaliações.");
      })
      .catch(() => setError("Erro de rede."))
      .finally(() => setLoading(false));
  }, [session]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const distribution = [5, 4, 3, 2, 1].map((n) => ({
    stars: n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  const handleLogout = () => {
    localStorage.removeItem("medflow_user");
    setLocation("/entrar");
  };

  if (session?.email !== ADMIN_EMAIL) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="bg-background border-b border-border px-6 h-16 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">MedFlow</span>
          <span className="ml-2 text-xs font-semibold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setLocation("/app")}
          >
            <LayoutDashboard className="w-4 h-4" />
            Ir para clínica
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Avaliações do MedFlow</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Feedback enviado pelos gestores das clínicas sobre o produto.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-background border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Nota média</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{avgRating}</p>
            <p className="text-xs text-muted-foreground mt-1">de 5.0</p>
          </div>

          <div className="bg-background border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Total de avaliações</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{reviews.length}</p>
            <p className="text-xs text-muted-foreground mt-1">clínicas avaliaram</p>
          </div>

          <div className="bg-background border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Satisfação</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {reviews.length
                ? Math.round((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100) + "%"
                : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">notas 4 ou 5</p>
          </div>
        </div>

        {/* Distribution */}
        {reviews.length > 0 && (
          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-4">Distribuição de notas</h2>
            <div className="space-y-2">
              {distribution.map(({ stars, count }) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-muted-foreground w-2">{stars}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all"
                      style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews list */}
        {loading && (
          <div className="text-center py-16 text-muted-foreground">Carregando avaliações…</div>
        )}
        {error && (
          <div className="text-center py-16 text-destructive font-medium">{error}</div>
        )}
        {!loading && !error && reviews.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            Nenhuma avaliação recebida ainda.
          </div>
        )}

        <div className="space-y-4">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-background border border-border rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                      {r.clinicId.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.clinicId}</p>
                      <p className="text-xs text-muted-foreground">{r.ownerEmail}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Stars rating={r.rating} />
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(r.createdAt)}</p>
                </div>
              </div>

              {r.reviewText && (
                <div className="flex gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">{r.reviewText}</p>
                </div>
              )}

              {(r.photoUrl || r.videoUrl) && (
                <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-border">
                  {r.photoUrl && (
                    <button onClick={() => setExpandedPhoto(r.photoUrl!)}>
                      <img
                        src={r.photoUrl}
                        alt="Foto da avaliação"
                        className="w-24 h-24 object-cover rounded-xl border border-border hover:opacity-80 transition-opacity"
                      />
                    </button>
                  )}
                  {r.videoUrl && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted/40 rounded-xl border border-border">
                      <VideoIcon className="w-4 h-4 text-muted-foreground" />
                      <video src={r.videoUrl} controls className="w-48 rounded-lg" />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>

      {/* Lightbox */}
      {expandedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedPhoto(null)}
        >
          <img
            src={expandedPhoto}
            alt="Foto ampliada"
            className="max-w-full max-h-full rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
