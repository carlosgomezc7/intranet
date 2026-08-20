import React from "react";
import { siteConfig } from "@/lib/config";
import { MessageSquare, FileCheck2, Receipt, FolderKanban, CheckCircle2 } from "lucide-react";

const iconMap: { [key: string]: React.ElementType } = {
  MessageSquare,
  FileCheck2,
  Receipt,
  FolderKanban,
};

export const Services: React.FC = () => {
  return (
    <section id="servicios" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
            Módulos Corporativos
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Todo lo que tu empresa necesita en un solo lugar
          </p>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Diseñado para simplificar la operación diaria, acelerar las comunicaciones y garantizar el cumplimiento normativo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {siteConfig.services.map((service) => {
            const IconComponent = iconMap[service.icon] || MessageSquare;
            return (
              <article
                key={service.id}
                className="glass-card-elevated p-8 rounded-3xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600/30 to-cyan-500/20 border border-sky-400/30 flex items-center justify-center text-cyan-300 mb-6 shadow-lg shadow-sky-500/10 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <ul className="space-y-2.5 pt-6 border-t border-sky-500/15" aria-label={`Características de ${service.title}`}>
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
