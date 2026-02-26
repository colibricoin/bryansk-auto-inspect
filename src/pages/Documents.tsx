import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Download } from "lucide-react";
import { COMPANY } from "@/data/company";

import trustShield from "@/assets/icons/trust-shield.png";
import docFolder from "@/assets/icons/doc-folder.png";

export default function Documents() {
  return (
    <div className="section-padding">
      <div className="container-narrow">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Документы</span>
        </nav>

        <div className="text-center mb-12">
          <div className="accent-line mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">Аккредитация и документы</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Наш пункт технического осмотра аккредитован Российским союзом автостраховщиков (РСА)
          </p>
        </div>

        {/* RSA badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-lg p-6 md:p-8 text-center mb-8 shadow-sm"
        >
          <div className="w-24 h-24 mx-auto mb-4">
            <img src={trustShield} alt="Аккредитация РСА" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-foreground">Аккредитация РСА</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Пункт технического осмотра {COMPANY.legalName} аккредитован Российским союзом автостраховщиков.
            Диагностические карты, выданные нашим пунктом, принимаются всеми страховыми компаниями.
          </p>
        </motion.div>

        {/* Documents list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COMPANY.documents.map((doc, i) => (
            <motion.a
              key={doc.shortTitle}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-premium p-6 flex gap-4 group"
            >
              <div className="w-16 h-16 shrink-0">
                <img src={docFolder} alt={doc.shortTitle} className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold mb-1 text-sm text-foreground">{doc.shortTitle}</div>
                <p className="text-xs text-muted-foreground line-clamp-2">{doc.title}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-accent font-medium">
                  <Download className="w-3 h-3" />
                  Скачать PDF
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
