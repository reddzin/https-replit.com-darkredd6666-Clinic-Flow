import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Building,
  Users,
  Heart,
  Bell,
  Puzzle,
  Upload,
  CheckCircle2,
  XCircle,
  Plus,
  Check,
  Link2,
  Clock,
  Loader2,
  Trash2,
} from "lucide-react";
import { getSession, saveSession, generateSlug } from "@/lib/clinic";

const tabs = [
  { id: "clinica", label: "Clínica", icon: Building },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "convenios", label: "Convênios", icon: Heart },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "integracoes", label: "Integrações", icon: Puzzle },
];

const ROLES = ["Médico", "Recepcionista", "Financeiro", "Admin"];
const STATUS_OPTIONS = ["Ativo", "Inativo"];

const roleColors: Record<string, string> = {
  Admin: "bg-violet-100 text-violet-700",
  Médico: "bg-blue-100 text-blue-700",
  Recepcionista: "bg-emerald-100 text-emerald-700",
  Financeiro: "bg-amber-100 text-amber-700",
};

const notificacoes = [
  { id: "whatsapp", label: "WhatsApp", desc: "Lembretes de consulta via WhatsApp" },
  { id: "email", label: "E-mail", desc: "Confirmações e lembretes por e-mail" },
  { id: "sms", label: "SMS", desc: "Alertas via mensagem de texto" },
  { id: "cancelamento", label: "Avisos de Cancelamento", desc: "Notificar equipe quando consulta for cancelada" },
  { id: "relatorio", label: "Relatórios Automáticos", desc: "Receber relatórios mensais por e-mail" },
];

const integracoes = [
  { name: "Nota Fiscal Eletrônica (NFe)", desc: "Emissão automática de NFS-e", icon: "📄" },
  { name: "TISS / Faturamento de Convênios", desc: "Envio de guias para operadoras", icon: "🏥" },
  { name: "WhatsApp Business", desc: "Mensagens automáticas via API oficial", icon: "💬" },
  { name: "Assinatura Digital ICP-Brasil", desc: "Prescrições e documentos com validade jurídica", icon: "✍️" },
];

interface ClinicUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Convenio {
  id: number;
  name: string;
  code: string | null;
  active: boolean;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState("clinica");
  const [notifAtivos, setNotifAtivos] = useState(notificacoes.map(() => true));

  const session = getSession();
  const clinicSlugKey = session?.clinicSlug ?? "";

  // ── Clínica ────────────────────────────────────────────────────────────────
  const [clinicName, setClinicName] = useState(session?.clinicName ?? "");
  const [clinicPhone, setClinicPhone] = useState(session?.clinicPhone ?? "");
  const [clinicEmail, setClinicEmail] = useState(session?.email ?? "");
  const [clinicAddress, setClinicAddress] = useState(session?.clinicAddress ?? "");
  const [clinicSlug, setClinicSlug] = useState(session?.clinicSlug ?? "");
  const [logoPreview, setLogoPreview] = useState<string | null>(session?.logoUrl ?? null);
  const [savedClinic, setSavedClinic] = useState(false);
  const [logoError, setLogoError] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  // ── Usuários ───────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<ClinicUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Médico");
  const [newUserStatus, setNewUserStatus] = useState("Ativo");
  const [userSaving, setUserSaving] = useState(false);
  const [userError, setUserError] = useState("");

  // ── Convênios ──────────────────────────────────────────────────────────────
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [conveniosLoading, setConveniosLoading] = useState(false);
  const [showConvenioModal, setShowConvenioModal] = useState(false);
  const [newConvName, setNewConvName] = useState("");
  const [newConvCode, setNewConvCode] = useState("");
  const [convSaving, setConvSaving] = useState(false);
  const [convError, setConvError] = useState("");

  // ── Fetch users when tab opens ─────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "usuarios" || !clinicSlugKey) return;
    setUsersLoading(true);
    fetch(`/api/clinics/${clinicSlugKey}/users`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setUsers(data); })
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  }, [activeTab, clinicSlugKey]);

  // ── Fetch convenios when tab opens ────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "convenios" || !clinicSlugKey) return;
    setConveniosLoading(true);
    fetch(`/api/clinics/${clinicSlugKey}/convenios`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setConvenios(data); })
      .catch(() => {})
      .finally(() => setConveniosLoading(false));
  }, [activeTab, clinicSlugKey]);

  // ── Logo helpers ───────────────────────────────────────────────────────────
  function compressImage(file: File, maxDimension = 300, quality = 0.82): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setLogoError("Arquivo deve ter no máximo 5 MB."); e.target.value = ""; return; }
    setLogoError("");
    e.target.value = "";
    try { setLogoPreview(await compressImage(file)); }
    catch { setLogoError("Erro ao processar a imagem. Tente outro arquivo."); }
  }

  function handleSaveClinic() {
    const slugToSave = clinicSlug.trim() || generateSlug(clinicName);
    const current = getSession();
    try {
      saveSession({ clinicName: clinicName.trim(), clinicSlug: slugToSave, clinicPhone: clinicPhone.trim(), email: clinicEmail.trim(), clinicAddress: clinicAddress.trim(), logoUrl: logoPreview ?? undefined });
    } catch { setLogoError("Erro ao salvar: armazenamento local cheio. Tente uma imagem menor."); return; }
    setClinicSlug(slugToSave);
    setSavedClinic(true);
    setTimeout(() => setSavedClinic(false), 2500);
    const ownerEmail = current?.email ?? clinicEmail.trim();
    if (ownerEmail) {
      fetch("/api/clinics/by-owner", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerEmail, slug: slugToSave, clinicName: clinicName.trim(), clinicPhone: clinicPhone.trim(), clinicAddress: clinicAddress.trim(), clinicCity: current?.clinicCity, clinicState: current?.clinicState, clinicType: current?.clinicType, businessHours: current?.businessHours, doctors: current?.doctors, appointmentDuration: current?.appointmentDuration }),
      }).catch(console.error);
    }
  }

  function handleSlugInput(val: string) {
    setClinicSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/--+/g, "-"));
  }

  // ── Add User ───────────────────────────────────────────────────────────────
  function openUserModal() {
    setNewUserName(""); setNewUserEmail(""); setNewUserRole("Médico"); setNewUserStatus("Ativo");
    setUserError(""); setShowUserModal(true);
  }

  async function handleAddUser() {
    if (!newUserName.trim() || !newUserEmail.trim()) { setUserError("Nome e e-mail são obrigatórios."); return; }
    if (!clinicSlugKey) { setUserError("Salve os dados da clínica antes de adicionar usuários."); return; }
    setUserSaving(true); setUserError("");
    try {
      const res = await fetch(`/api/clinics/${clinicSlugKey}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newUserName.trim(), email: newUserEmail.trim(), role: newUserRole, status: newUserStatus }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? "Erro ao salvar"); }
      const saved = await res.json();
      setUsers((prev) => [...prev, saved]);
      setShowUserModal(false);
    } catch (e: unknown) {
      setUserError(e instanceof Error ? e.message : "Erro ao salvar. Tente novamente.");
    } finally {
      setUserSaving(false);
    }
  }

  async function handleDeleteUser(id: number) {
    await fetch(`/api/clinics/${clinicSlugKey}/users/${id}`, { method: "DELETE" }).catch(() => {});
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  // ── Add Convênio ───────────────────────────────────────────────────────────
  function openConvenioModal() {
    setNewConvName(""); setNewConvCode(""); setConvError(""); setShowConvenioModal(true);
  }

  async function handleAddConvenio() {
    if (!newConvName.trim()) { setConvError("Nome do convênio é obrigatório."); return; }
    if (!clinicSlugKey) { setConvError("Salve os dados da clínica antes de adicionar convênios."); return; }
    setConvSaving(true); setConvError("");
    try {
      const res = await fetch(`/api/clinics/${clinicSlugKey}/convenios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newConvName.trim(), code: newConvCode.trim() || null }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? "Erro ao salvar"); }
      const saved = await res.json();
      setConvenios((prev) => [...prev, saved]);
      setShowConvenioModal(false);
    } catch (e: unknown) {
      setConvError(e instanceof Error ? e.message : "Erro ao salvar. Tente novamente.");
    } finally {
      setConvSaving(false);
    }
  }

  async function handleToggleConvenio(conv: Convenio) {
    const updated = { ...conv, active: !conv.active };
    setConvenios((prev) => prev.map((c) => (c.id === conv.id ? updated : c)));
    await fetch(`/api/clinics/${clinicSlugKey}/convenios/${conv.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: updated.active }),
    }).catch(() => {});
  }

  async function handleDeleteConvenio(id: number) {
    await fetch(`/api/clinics/${clinicSlugKey}/convenios/${id}`, { method: "DELETE" }).catch(() => {});
    setConvenios((prev) => prev.filter((c) => c.id !== id));
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const bookingPreview = clinicSlug ? `${window.location.origin}${base}/booking/${clinicSlug}` : "";

  return (
    <div className="flex gap-6 flex-col md:flex-row">
      {/* Sidebar Tabs */}
      <div className="md:w-52 shrink-0">
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              data-testid={`tab-config-${tab.id}`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-background rounded-2xl border border-border shadow-sm p-6">

        {/* ── CLÍNICA ── */}
        {activeTab === "clinica" && (
          <div className="space-y-6 max-w-lg">
            <h3 className="font-semibold text-foreground text-lg">Dados da Clínica</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="cfg-clinic-name">Nome da Clínica</Label>
                <Input id="cfg-clinic-name" value={clinicName} onChange={e => setClinicName(e.target.value)} placeholder="Nome da clínica" data-testid="input-clinic-name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cfg-phone">Telefone</Label>
                  <Input id="cfg-phone" value={clinicPhone} onChange={e => setClinicPhone(e.target.value)} placeholder="(11) 99999-9999" data-testid="input-phone" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cfg-email">E-mail</Label>
                  <Input id="cfg-email" value={clinicEmail} onChange={e => setClinicEmail(e.target.value)} placeholder="contato@clinica.com" data-testid="input-email" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cfg-address">Endereço</Label>
                <Input id="cfg-address" value={clinicAddress} onChange={e => setClinicAddress(e.target.value)} placeholder="Rua, número, bairro, cidade" data-testid="input-address" />
              </div>
              <div className="space-y-1.5 pt-2 border-t border-border">
                <Label htmlFor="cfg-slug" className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-primary" />
                  Endereço do link de agendamento
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-muted/60 border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground shrink-0">…/booking/</div>
                  <Input id="cfg-slug" value={clinicSlug} onChange={e => handleSlugInput(e.target.value)} placeholder="minha-clinica" className="font-mono" data-testid="input-clinic-slug" />
                </div>
                {bookingPreview && <p className="text-xs text-muted-foreground font-mono truncate" title={bookingPreview}>{bookingPreview}</p>}
                <p className="text-xs text-muted-foreground">Apenas letras minúsculas, números e hífens.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Logo da Clínica</Label>
                <input ref={logoInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogoChange} />
                <div onClick={() => logoInputRef.current?.click()} className="flex items-center gap-4 p-4 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer">
                  {logoPreview
                    ? <img src={logoPreview} alt="Logo" className="w-12 h-12 rounded-full object-cover border border-border shrink-0" />
                    : <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0"><Building className="w-6 h-6 text-muted-foreground" /></div>
                  }
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{logoPreview ? "Clique para trocar o logo" : "Clique para enviar o logo"}</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG até 2 MB</p>
                  </div>
                  <Upload className="w-5 h-5 text-muted-foreground ml-auto shrink-0" />
                </div>
                {logoError && <p className="text-xs text-destructive font-medium">{logoError}</p>}
              </div>
            </div>
            <Button onClick={handleSaveClinic} className={`gap-2 transition-all ${savedClinic ? "bg-emerald-600 hover:bg-emerald-700" : ""}`} data-testid="button-salvar-clinica">
              {savedClinic ? <><Check className="w-4 h-4" />Salvo!</> : "Salvar Alterações"}
            </Button>
          </div>
        )}

        {/* ── USUÁRIOS ── */}
        {activeTab === "usuarios" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-lg">Equipe</h3>
              <Button size="sm" onClick={openUserModal} data-testid="button-novo-usuario">
                <Plus className="w-4 h-4 mr-2" /> Adicionar Usuário
              </Button>
            </div>

            {usersLoading && (
              <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Carregando…
              </div>
            )}

            {!usersLoading && users.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Nenhum usuário cadastrado</h3>
                <p className="text-sm text-muted-foreground max-w-xs">Clique em "Adicionar Usuário" para convidar alguém da equipe.</p>
              </div>
            )}

            {!usersLoading && users.length > 0 && (
              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[u.role] ?? "bg-muted text-muted-foreground"}`}>{u.role}</span>
                    <span className={`flex items-center gap-1 text-xs font-medium ${u.status === "Ativo" ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {u.status === "Ativo" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {u.status}
                    </span>
                    <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CONVÊNIOS ── */}
        {activeTab === "convenios" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-lg">Convênios Aceitos</h3>
              <Button size="sm" variant="outline" onClick={openConvenioModal} data-testid="button-add-convenio">
                <Plus className="w-4 h-4 mr-2" /> Adicionar Convênio
              </Button>
            </div>

            {conveniosLoading && (
              <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Carregando…
              </div>
            )}

            {!conveniosLoading && convenios.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Heart className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Nenhum convênio cadastrado ainda</h3>
                <p className="text-sm text-muted-foreground max-w-xs">Adicione os planos de saúde aceitos pela sua clínica.</p>
              </div>
            )}

            {!conveniosLoading && convenios.length > 0 && (
              <div className="space-y-3">
                {convenios.map((c) => (
                  <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl border border-border">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {c.code ? c.code.slice(0, 3) : c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{c.name}</p>
                      {c.code && <p className="text-xs text-muted-foreground">Código ANS: {c.code}</p>}
                    </div>
                    <Switch
                      checked={c.active}
                      onCheckedChange={() => handleToggleConvenio(c)}
                      data-testid={`switch-convenio-${c.id}`}
                    />
                    <button onClick={() => handleDeleteConvenio(c.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── NOTIFICAÇÕES ── */}
        {activeTab === "notificacoes" && (
          <div className="space-y-5">
            <h3 className="font-semibold text-foreground text-lg">Preferências de Notificação</h3>
            <div className="space-y-4">
              {notificacoes.map((n, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch checked={notifAtivos[i]} onCheckedChange={(v) => setNotifAtivos(prev => { const x = [...prev]; x[i] = v; return x; })} data-testid={`switch-notif-${n.id}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── INTEGRAÇÕES ── */}
        {activeTab === "integracoes" && (
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-foreground text-lg">Integrações</h3>
              <p className="text-sm text-muted-foreground mt-1">Estas integrações estão sendo desenvolvidas e serão disponibilizadas em breve.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integracoes.map((integ, i) => (
                <div key={i} className="p-5 rounded-xl border border-border bg-background opacity-75">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-2xl mb-2">{integ.icon}</p>
                      <p className="text-sm font-semibold text-foreground">{integ.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{integ.desc}</p>
                    </div>
                    <span className="shrink-0 flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      <Clock className="w-3 h-3" /> Em breve
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="mt-4 w-full" disabled data-testid={`button-integ-${i}`}>Em breve</Button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── MODAL: Adicionar Usuário ── */}
      {showUserModal && (
        <Modal title="Adicionar Usuário" onClose={() => setShowUserModal(false)}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-user-name">Nome completo *</Label>
              <Input id="new-user-name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Dr. João Silva" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-user-email">E-mail *</Label>
              <Input id="new-user-email" type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="joao@clinica.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-user-role">Função</Label>
              <select
                id="new-user-role"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition-colors"
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-user-status">Status</Label>
              <select
                id="new-user-status"
                value={newUserStatus}
                onChange={(e) => setNewUserStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition-colors"
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {userError && <p className="text-sm text-destructive font-medium">{userError}</p>}
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowUserModal(false)} disabled={userSaving}>Cancelar</Button>
            <Button onClick={handleAddUser} disabled={userSaving} className="gap-2">
              {userSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Salvando…</> : "Salvar"}
            </Button>
          </div>
        </Modal>
      )}

      {/* ── MODAL: Adicionar Convênio ── */}
      {showConvenioModal && (
        <Modal title="Adicionar Convênio" onClose={() => setShowConvenioModal(false)}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-conv-name">Nome do convênio *</Label>
              <Input id="new-conv-name" value={newConvName} onChange={(e) => setNewConvName(e.target.value)} placeholder="Ex: Bradesco Saúde" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-conv-code">Código ANS <span className="font-normal text-muted-foreground">(opcional)</span></Label>
              <Input id="new-conv-code" value={newConvCode} onChange={(e) => setNewConvCode(e.target.value)} placeholder="Ex: 006" />
            </div>
            {convError && <p className="text-sm text-destructive font-medium">{convError}</p>}
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowConvenioModal(false)} disabled={convSaving}>Cancelar</Button>
            <Button onClick={handleAddConvenio} disabled={convSaving} className="gap-2">
              {convSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Salvando…</> : "Salvar"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
