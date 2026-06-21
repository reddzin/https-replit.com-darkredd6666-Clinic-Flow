import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-[#14532d] pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#16a34a] flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <span className="font-bold text-xl tracking-tight text-white">MedFlow</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Elevando o padrão da gestão clínica no Brasil. O sistema premium para clínicas que buscam excelência.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors cursor-pointer" />
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors cursor-pointer" />
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white">Produto</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Agendamento</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Prontuário</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Telemedicina</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Faturamento</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Preços</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white">Empresa</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Sobre nós</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Clientes</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Carreiras</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Segurança</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} MedFlow Tecnologia. Todos os direitos reservados.
          </p>
          <p className="text-sm text-white/60 flex items-center gap-1">
            Av. Paulista, 1000 - Bela Vista, São Paulo - SP
          </p>
        </div>
      </div>
    </footer>
  );
}
