// ────────────────────────────────────────────────────────────
// Biblioteca de Validação — MedFlow
// Todas as funções retornam null (válido) ou string (mensagem de erro)
// ────────────────────────────────────────────────────────────

// ── Nome ────────────────────────────────────────────────────

const KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

function hasKeyboardSequence(word: string): boolean {
  const w = word.toLowerCase();
  if (w.length < 4) return false;
  for (const row of KEYBOARD_ROWS) {
    for (let i = 0; i <= w.length - 4; i++) {
      let lenFwd = 1;
      let lenBwd = 1;
      for (let j = i + 1; j < w.length; j++) {
        const cur = row.indexOf(w[j]);
        const prev = row.indexOf(w[j - 1]);
        if (cur !== -1 && prev !== -1 && cur === prev + 1) lenFwd++;
        else break;
      }
      for (let j = i + 1; j < w.length; j++) {
        const cur = row.indexOf(w[j]);
        const prev = row.indexOf(w[j - 1]);
        if (cur !== -1 && prev !== -1 && cur === prev - 1) lenBwd++;
        else break;
      }
      if (lenFwd >= 4 || lenBwd >= 4) return true;
    }
  }
  return false;
}

export function validateName(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Nome é obrigatório.";

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2) return "Digite o nome completo (nome e sobrenome).";

  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']+$/.test(trimmed)) {
    return "Nome inválido. Use apenas letras, espaços e hífens.";
  }

  if (/(.)\1{3,}/iu.test(trimmed)) {
    return "Nome inválido. Digite o nome completo real.";
  }

  for (const word of words) {
    if (word.length >= 4 && hasKeyboardSequence(word)) {
      return "Nome inválido. Digite o nome completo real.";
    }
  }

  return null;
}

// ── CPF ─────────────────────────────────────────────────────

export function validateCPF(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11) return "CPF deve ter 11 dígitos.";
  if (/^(\d)\1{10}$/.test(digits)) return "CPF inválido.";

  const calcDigit = (slice: string, len: number): number => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += parseInt(slice[i]) * (len + 1 - i);
    const rem = (sum * 10) % 11;
    return rem === 10 ? 0 : rem;
  };

  if (calcDigit(digits, 9) !== parseInt(digits[9])) return "CPF inválido.";
  if (calcDigit(digits, 10) !== parseInt(digits[10])) return "CPF inválido.";

  return null;
}

// ── CNPJ ────────────────────────────────────────────────────

export function validateCNPJ(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 14) return "CNPJ deve ter 14 dígitos.";
  if (/^(\d)\1{13}$/.test(digits)) return "CNPJ inválido.";

  const calcDigit = (digits: string, weights: number[]): number => {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) sum += parseInt(digits[i]) * weights[i];
    const rem = sum % 11;
    return rem < 2 ? 0 : 11 - rem;
  };

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  if (calcDigit(digits, w1) !== parseInt(digits[12])) return "CNPJ inválido.";
  if (calcDigit(digits, w2) !== parseInt(digits[13])) return "CNPJ inválido.";

  return null;
}

// ── Telefone ─────────────────────────────────────────────────

export function validatePhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11) {
    return "Telefone inválido. Use o formato (DDD) 99999-9999.";
  }

  const ddd = parseInt(digits.substring(0, 2));
  if (ddd < 11 || ddd > 99) return "DDD inválido.";

  if (digits.length === 11) {
    if (digits[2] !== "9") return "Celular deve começar com 9 após o DDD.";
    if (/^(\d)\1{10}$/.test(digits)) return "Telefone inválido.";
  } else {
    const thirdDigit = parseInt(digits[2]);
    if (thirdDigit < 2 || thirdDigit > 5) {
      return "Telefone fixo inválido. O número deve começar com 2 a 5 após o DDD.";
    }
    if (/^(\d)\1{9}$/.test(digits)) return "Telefone inválido.";
  }

  return null;
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.replace(/(\d{1,2})/, "($1");
  if (digits.length <= 6) return digits.replace(/(\d{2})(\d{1,4})/, "($1) $2");
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

export function maskCPF(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskCNPJ(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function maskCEP(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{5})(\d{1,3})/, "$1-$2");
}

// ── E-mail ───────────────────────────────────────────────────

const FAKE_EMAIL_DOMAINS = new Set([
  "teste.com", "test.com", "email.com", "example.com", "exemplo.com",
  "a.com", "b.com", "aa.com", "aaa.com", "abc.com",
  "foo.com", "bar.com", "baz.com", "temp.com", "fake.com",
  "123.com", "mail.com",
]);

const FAKE_LOCAL_PARTS = new Set([
  "test", "teste", "email", "user", "usuario", "admin", "info",
  "a", "aa", "aaa", "abc", "foo", "bar", "baz", "asdf",
]);

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "E-mail é obrigatório.";
  if (/\s/.test(trimmed)) return "E-mail não pode conter espaços.";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmed)) return "E-mail inválido.";

  const [local, domain] = trimmed.toLowerCase().split("@");
  if (!domain) return "E-mail inválido.";

  const dotIdx = domain.lastIndexOf(".");
  if (dotIdx < 0 || domain.length - dotIdx - 1 < 2) {
    return "Domínio inválido. O e-mail deve ter pelo menos 2 caracteres após o ponto.";
  }

  if (FAKE_EMAIL_DOMAINS.has(domain)) {
    return "Use um e-mail real. Este domínio não é aceito.";
  }
  if (FAKE_LOCAL_PARTS.has(local)) {
    return "Use um e-mail real.";
  }

  return null;
}

// ── CEP / ViaCEP ─────────────────────────────────────────────

export interface CepData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export async function lookupCEP(cep: string): Promise<CepData> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) throw new Error("CEP deve ter 8 dígitos.");

  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!res.ok) throw new Error("Erro ao consultar o CEP. Verifique sua conexão.");

  const data = await res.json();
  if (data.erro) throw new Error("CEP não encontrado. Verifique e tente novamente.");

  return {
    logradouro: data.logradouro ?? "",
    bairro: data.bairro ?? "",
    localidade: data.localidade ?? "",
    uf: data.uf ?? "",
  };
}
