import { Landmark, ChartPie, Sprout, TrendingUp } from "lucide-react";

export const funds = [
  {
    slug: "dif",
    name: "Diversified Investment Fund (DIF)",
    shortName: "DIF",
    type: "AGGRESSIVE",
    description:
      "DIF is a multi-asset investment vehicle designed to capture asymmetric upside while maintaining disciplined risk management through structured diversification.",

    icon: Landmark,
    theme: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      iconColor: "#6e11b0",
    },

    minInvestment: 35000,
    maxInvestment: 1000000,
    lockup: "12 Months",
    targetReturn: "50% ROI",

    wallets: {},
    supportedCurrencies: ["USD"],
  },

  {
    slug: "diaf",
    name: "Diversified Investment Asset Fund (DIAF)",
    shortName: "DIAF",
    type: "BALANCED",
    description:
      "DIAF is an income-focused investment strategy designed to generate consistent cash flow while preserving capital through diversified income-producing assets.",

    icon: ChartPie,
    theme: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      iconColor: "#2563eb",
    },

    minInvestment: 100000,
    maxInvestment: null,
    lockup: "24 Months",
    targetReturn: "0.25% Weekly",

    wallets: {},
    supportedCurrencies: ["USD"],
  },

  {
    slug: "edf",
    name: "Equity And Digital Growth Fund (EDF)",
    shortName: "EDF",
    type: "AGGRESSIVE",
    description:
      "EDF is a growth-oriented multi-asset portfolio focused on long-term capital appreciation through diversified exposure to traditional and alternative assets.",

    icon: Sprout,
    theme: {
      bg: "bg-green-100",
      text: "text-green-800",
      iconColor: "#16a34a",
    },

    minInvestment: 65000,
    maxInvestment: 5000000,
    lockup: "18 Months",
    targetReturn: "50% ROI",

    wallets: {},
    supportedCurrencies: ["USD"],
  },

  {
    slug: "emsf",
    name: "Emerging Markets Strategy Fund (EMSF)",
    shortName: "EMSF",
    type: "BALANCED",
    description:
      "EMSF is a short-duration, alternative-focused investment strategy designed to capture high-growth opportunities across real assets, agriculture, and digital markets.",

    icon: TrendingUp,
    theme: {
      bg: "bg-red-100",
      text: "text-red-800",
      iconColor: "#dc2626",
    },

    minInvestment: 5000,
    maxInvestment: 30000,
    lockup: "6 Months",
    targetReturn: "15% ROI",

    wallets: {},
    supportedCurrencies: ["USD"],
  },
];