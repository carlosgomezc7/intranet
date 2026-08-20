export interface PayrollItem {
  id: string;
  period_title: string;
  period_date: string;
  gross_amount: string;
  deductions: string;
  net_amount: string;
  status: "timbrado" | "pendiente";
  pdf_url: string;
  xml_url: string;
}

export const MOCK_PAYROLL: PayrollItem[] = [
  {
    id: "pay-15",
    period_title: "Quincena 15 — 1ra Quincena de Agosto 2026",
    period_date: "01 Ago 2026 - 15 Ago 2026",
    gross_amount: "$32,500.00",
    deductions: "$6,250.00",
    net_amount: "$26,250.00",
    status: "timbrado",
    pdf_url: "#",
    xml_url: "#",
  },
  {
    id: "pay-14",
    period_title: "Quincena 14 — 2da Quincena de Julio 2026",
    period_date: "16 Jul 2026 - 31 Jul 2026",
    gross_amount: "$32,500.00",
    deductions: "$6,250.00",
    net_amount: "$26,250.00",
    status: "timbrado",
    pdf_url: "#",
    xml_url: "#",
  },
  {
    id: "pay-13",
    period_title: "Quincena 13 — 1ra Quincena de Julio 2026",
    period_date: "01 Jul 2026 - 15 Jul 2026",
    gross_amount: "$32,500.00",
    deductions: "$6,250.00",
    net_amount: "$26,250.00",
    status: "timbrado",
    pdf_url: "#",
    xml_url: "#",
  },
];
