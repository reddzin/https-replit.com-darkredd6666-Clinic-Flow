import { Router, type Request, type Response } from "express";
import { db, appointmentsTable, clinicUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const reportsRouter = Router();

// GET /api/clinics/:slug/reports — compute real metrics from DB
reportsRouter.get("/clinics/:slug/reports", async (req: Request, res: Response) => {
  try {
    const slug = (req.params.slug ?? "").trim().toLowerCase();

    const [appts, teamMembers] = await Promise.all([
      db.select().from(appointmentsTable).where(eq(appointmentsTable.clinicSlug, slug)),
      db.select().from(clinicUsersTable).where(eq(clinicUsersTable.clinicSlug, slug)),
    ]);

    const total = appts.length;
    const cancelled = appts.filter((a) => a.status === "Cancelado" || a.status === "cancelled").length;
    const realized = total - cancelled;

    // ── helpers ──────────────────────────────────────────────────────────────

    function parseMonth(dateStr: string): string {
      // handles YYYY-MM-DD and DD/MM/YYYY
      if (!dateStr) return "";
      if (dateStr.includes("-")) return dateStr.substring(0, 7); // YYYY-MM
      if (dateStr.includes("/")) {
        const parts = dateStr.split("/");
        if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2, "0")}`;
      }
      return dateStr.substring(0, 7);
    }

    function monthLabel(ym: string): string {
      const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      const m = parseInt(ym.split("-")[1] ?? "0", 10);
      return MONTHS[m - 1] ?? ym;
    }

    function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
      return arr.reduce<Record<string, T[]>>((acc, item) => {
        const k = key(item);
        if (!acc[k]) acc[k] = [];
        acc[k].push(item);
        return acc;
      }, {});
    }

    function sortedMonths(months: string[]): string[] {
      return [...new Set(months)].sort();
    }

    // ── medicos ───────────────────────────────────────────────────────────────
    const byDoctor = groupBy(appts.filter((a) => a.doctorName), (a) => a.doctorName!);
    const medicosRows = Object.entries(byDoctor)
      .map(([name, list]) => {
        const specialty = list[0]?.specialty ?? "—";
        return { name, specialty, count: list.length };
      })
      .sort((a, b) => b.count - a.count);

    const medicosHasData = medicosRows.length > 0;
    const medicosReport = {
      hasData: medicosHasData,
      summary: [
        { label: "Total de consultas", value: total > 0 ? String(total) : "0" },
        { label: "Médicos ativos", value: String(medicosRows.length) },
        { label: "Avaliação média", value: "—" },
      ],
      chartData: medicosRows.map((r) => ({ name: r.name.split(" ").pop() ?? r.name, value: r.count })),
      chartType: "bar" as const,
      chartColor: "#3b82f6",
      tableHeaders: ["Médico", "Especialidade", "Consultas"],
      tableRows: medicosRows.map((r) => [r.name, r.specialty, r.count]),
    };

    // ── procedimentos (by specialty) ──────────────────────────────────────────
    const bySpecialty = groupBy(appts, (a) => a.specialty);
    const procRows = Object.entries(bySpecialty)
      .map(([spec, list]) => ({ name: spec, count: list.length }))
      .sort((a, b) => b.count - a.count);

    const procHasData = procRows.length > 0;
    const procReport = {
      hasData: procHasData,
      summary: [
        { label: "Especialidades distintas", value: String(procRows.length) },
        { label: "Volume total", value: String(total) },
        { label: "Mais frequente", value: procRows[0]?.name ?? "—" },
      ],
      chartData: procRows.slice(0, 6).map((r) => ({ name: r.name.split(" ")[0] ?? r.name, value: r.count })),
      chartType: "bar" as const,
      chartColor: "#8b5cf6",
      tableHeaders: ["Especialidade", "Realizações", "% do total"],
      tableRows: procRows.map((r) => [
        r.name,
        r.count,
        total > 0 ? `${((r.count / total) * 100).toFixed(1)}%` : "—",
      ]),
    };

    // ── convenios ─────────────────────────────────────────────────────────────
    // No per-appointment insurance field — always empty
    const conveniosReport = {
      hasData: false,
      summary: [
        { label: "Total de consultas", value: "0" },
        { label: "Operadoras", value: "0" },
        { label: "Ticket médio", value: "—" },
      ],
      chartData: [],
      chartType: "pie" as const,
      chartColor: "#10b981",
      tableHeaders: ["Operadora", "Consultas", "% do total"],
      tableRows: [],
    };

    // ── faltas (no-show rate by month) ────────────────────────────────────────
    const months = sortedMonths(appts.map((a) => parseMonth(a.appointmentDate))).filter(Boolean);
    const faltasRows = months.map((ym) => {
      const monthAppts = appts.filter((a) => parseMonth(a.appointmentDate) === ym);
      const agendados = monthAppts.length;
      const cancelados = monthAppts.filter((a) => a.status === "Cancelado" || a.status === "cancelled").length;
      const realizados = agendados - cancelados;
      const taxa = agendados > 0 ? ((cancelados / agendados) * 100).toFixed(1) + "%" : "—";
      return { label: monthLabel(ym), agendados, realizados, cancelados, taxa };
    });

    const faltasHasData = faltasRows.length > 0;
    const taxaMedia = faltasRows.length > 0
      ? (faltasRows.reduce((s, r) => s + r.cancelados, 0) / faltasRows.reduce((s, r) => s + r.agendados, 0) * 100).toFixed(1) + "%"
      : "—";

    const faltasReport = {
      hasData: faltasHasData,
      summary: [
        { label: "Taxa média no período", value: total > 0 ? taxaMedia : "—" },
        { label: "Total cancelados", value: String(cancelled) },
        { label: "Total realizados", value: String(realized) },
      ],
      chartData: faltasRows.map((r) => ({
        name: r.label,
        value: r.agendados > 0 ? parseFloat(((r.cancelados / r.agendados) * 100).toFixed(1)) : 0,
      })),
      chartType: "line" as const,
      chartColor: "#f59e0b",
      tableHeaders: ["Mês", "Agendados", "Realizados", "Cancelados", "Taxa"],
      tableRows: faltasRows.map((r) => [r.label, r.agendados, r.realizados, r.cancelados, r.taxa]),
    };

    // ── crescimento (unique patients by month via appointments) ───────────────
    const seenPatients = new Set<string>();
    const newByMonth: Record<string, number> = {};
    const allMonths = sortedMonths(appts.map((a) => parseMonth(a.appointmentDate))).filter(Boolean);

    // Initialize all months with 0
    allMonths.forEach((m) => { if (!newByMonth[m]) newByMonth[m] = 0; });

    // Sort appts by date so we correctly identify "first appointment" per patient
    const sortedAppts = [...appts].sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate));
    sortedAppts.forEach((a) => {
      if (!seenPatients.has(a.patientEmail)) {
        seenPatients.add(a.patientEmail);
        const ym = parseMonth(a.appointmentDate);
        if (ym) newByMonth[ym] = (newByMonth[ym] ?? 0) + 1;
      }
    });

    let cumulative = 0;
    const crescRows = allMonths.map((ym) => {
      const novos = newByMonth[ym] ?? 0;
      cumulative += novos;
      return { label: monthLabel(ym), novos, total: cumulative };
    });

    const crescHasData = crescRows.length > 0;
    const crescReport = {
      hasData: crescHasData,
      summary: [
        { label: "Total de pacientes", value: String(seenPatients.size) },
        { label: "Novos no período", value: String(seenPatients.size) },
        { label: "Meses com dados", value: String(allMonths.length) },
      ],
      chartData: crescRows.map((r) => ({ name: r.label, value: r.novos })),
      chartType: "line" as const,
      chartColor: "#ef4444",
      tableHeaders: ["Mês", "Novos Pacientes", "Total Acumulado"],
      tableRows: crescRows.map((r) => [r.label, r.novos, r.total]),
    };

    // ── receita — no price data, always empty ─────────────────────────────────
    const receitaReport = {
      hasData: false,
      summary: [
        { label: "Receita bruta total", value: "R$ 0,00" },
        { label: "Receita líquida total", value: "R$ 0,00" },
        { label: "Inadimplência", value: "—" },
      ],
      chartData: [],
      chartType: "bar" as const,
      chartColor: "#06b6d4",
      tableHeaders: ["Mês", "Receita Bruta", "Receita Líquida", "Inadimplência"],
      tableRows: [],
    };

    res.json({
      medicos: medicosReport,
      procedimentos: procReport,
      convenios: conveniosReport,
      faltas: faltasReport,
      crescimento: crescReport,
      receita: receitaReport,
      _meta: { totalAppointments: total, teamSize: teamMembers.length },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default reportsRouter;
