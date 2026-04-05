import { Evaluator, ApprovalStep, Proposal } from "../types";

export const EVALUATORS: Evaluator[] = [
  { id: "e1", name: "Prof. A. Haile",    avatar: "AH", color: "bg-blue-100 text-blue-700",    specialty: "Machine Learning",       assigned: 3 },
  { id: "e2", name: "Dr. S. Bekele",     avatar: "SB", color: "bg-purple-100 text-purple-700", specialty: "Biomedical Engineering",  assigned: 1 },
  { id: "e3", name: "Prof. M. Tesfaye",  avatar: "MT", color: "bg-emerald-100 text-emerald-700",specialty: "Renewable Energy",       assigned: 2 },
  { id: "e4", name: "Dr. L. Girma",      avatar: "LG", color: "bg-amber-100 text-amber-700",   specialty: "Computer Networks",      assigned: 4 },
  { id: "e5", name: "Prof. F. Tadesse",  avatar: "FT", color: "bg-rose-100 text-rose-700",     specialty: "Chemistry & Materials",  assigned: 0 },
];

export const ADVISORS: Evaluator[] = [
  { id: "a1", name: "Prof. D. Mekonnen", avatar: "DM", color: "bg-violet-100 text-violet-700", specialty: "Research methodology", assigned: 5 },
  { id: "a2", name: "Dr. Y. Hailu",      avatar: "YH", color: "bg-cyan-100 text-cyan-700",     specialty: "Grant writing",        assigned: 2 },
  { id: "a3", name: "Prof. N. Tsegaye",  avatar: "NT", color: "bg-fuchsia-100 text-fuchsia-700", specialty: "Ethics & compliance", assigned: 4 },
  { id: "a4", name: "Dr. B. Solomon",    avatar: "BS", color: "bg-teal-100 text-teal-700",     specialty: "Interdisciplinary",  assigned: 1 },
];

const APPROVAL_CURRENT_INDEX: Record<string, number> = {
  "PRP-2024-001": 2,
  "PRP-2024-002": 1,
  "PRP-2024-003": 0,
  "PRP-2024-004": 3,
  "PRP-2024-005": 2,
  "PRP-2024-006": 0,
};

const APPROVAL_TEMPLATE: Omit<ApprovalStep, "state" | "approvedAt">[] = [
  { id: "ap0", role: "Department review", approverName: "Dr. K. Lemma" },
  { id: "ap1", role: "College dean", approverName: "Prof. S. Alemu" },
  { id: "ap2", role: "VPRTT review", approverName: "Dr. M. Getachew" },
  { id: "ap3", role: "AC chair", approverName: "Prof. H. Demissie" },
];

export function getApprovalChain(proposalId: string): ApprovalStep[] {
  const cur = APPROVAL_CURRENT_INDEX[proposalId] ?? 2;
  return APPROVAL_TEMPLATE.map((step, i) => {
    if (i < cur) {
      return {
        ...step,
        state: "completed" as const,
        approvedAt: `${8 + i * 2} Mar 2025`,
      };
    }
    if (i === cur) {
      return { ...step, state: "current" as const };
    }
    return { ...step, state: "upcoming" as const };
  });
}

export const PROPOSALS_INITIAL: Proposal[] = [
  {
    id: "PRP-2024-001",
    title: "Deep Learning for Early Malaria Detection in Sub-Saharan Africa",
    pi: "Dr. L. Vance", piAvatar: "LV", piColor: "bg-purple-100 text-purple-700",
    dept: "Computer Science", submittedDate: "Mar 12, 2025", status: "Under Review",
    budget: "Br 92,000", evaluators: ["Prof. A. Haile", "Dr. L. Girma"], advisors: ["Prof. D. Mekonnen"],
    abstract: "This proposal presents a novel convolutional neural network architecture trained on microscopy slide images for the automated detection of Plasmodium falciparum, targeting deployment in low-resource clinical settings.",
    lastAction: "Assigned to evaluator on Mar 14", teamCount: 4,
  },
  {
    id: "PRP-2024-002",
    title: "Hybrid Solar-Wind Micro-Grid Systems for Rural Electrification",
    pi: "Prof. E. Stark", piAvatar: "ES", piColor: "bg-emerald-100 text-emerald-700",
    dept: "Engineering", submittedDate: "Mar 18, 2025", status: "Submitted",
    budget: "Br 185,000", evaluators: [], advisors: [],
    abstract: "A feasibility and implementation study for integrating solar PV and wind turbines into micro-grids, optimized for rural communities in the Amhara and Oromia regions.",
    lastAction: "Submitted by PI on Mar 18", teamCount: 3,
  },
  {
    id: "PRP-2024-003",
    title: "Genomic Biomarkers in Ethiopian Type-2 Diabetes Populations",
    pi: "Dr. E. Wong", piAvatar: "EW", piColor: "bg-rose-100 text-rose-700",
    dept: "Bioinformatics", submittedDate: "Mar 5, 2025", status: "Revision",
    budget: "Br 67,000", evaluators: ["Dr. S. Bekele"], advisors: ["Dr. Y. Hailu"],
    abstract: "Identifying novel SNP markers associated with Type-2 Diabetes in a population-specific Ethiopian cohort using GWAS and bioinformatics pipeline analysis.",
    lastAction: "Returned for revision: budget justification missing", teamCount: 2,
  },
  {
    id: "PRP-2024-004",
    title: "Quantum-Assisted Optimization for Supply Chain Logistics",
    pi: "Dr. A. Turing", piAvatar: "AT", piColor: "bg-blue-100 text-blue-700",
    dept: "Physics", submittedDate: "Feb 28, 2025", status: "Under Review",
    budget: "Br 220,000", evaluators: ["Prof. M. Tesfaye"], advisors: [],
    abstract: "Application of variational quantum eigensolver (VQE) and QAOA algorithms to NP-hard logistics optimization problems, benchmarked against classical solvers.",
    lastAction: "Evaluation in progress", teamCount: 5,
  },
  {
    id: "PRP-2024-005",
    title: "Nanotechnology-Enhanced Drug Delivery for Cervical Cancer",
    pi: "Prof. R. Musa", piAvatar: "RM", piColor: "bg-amber-100 text-amber-700",
    dept: "Biomedical Sciences", submittedDate: "Mar 21, 2025", status: "Submitted",
    budget: "Br 310,000", evaluators: [], advisors: ["Prof. N. Tsegaye"],
    abstract: "Synthesis and in-vitro characterization of lipid nanoparticle carriers for targeted delivery of cisplatin to HeLa cell lines, with focus on reduced systemic toxicity.",
    lastAction: "Submitted by PI on Mar 21", teamCount: 6,
  },
  {
    id: "PRP-2024-006",
    title: "AI-Powered Urban Traffic Signal Coordination Framework",
    pi: "Dr. H. Tesfaye", piAvatar: "HT", piColor: "bg-indigo-100 text-indigo-700",
    dept: "Urban Planning", submittedDate: "Mar 10, 2025", status: "Draft",
    budget: "Br 44,000", evaluators: [], advisors: [],
    abstract: "A reinforcement learning-based adaptive traffic signal controller trained on real-world sensor data from Addis Ababa's inner ring road intersections.",
    lastAction: "Draft saved by PI on Mar 10", teamCount: 2,
  },
];
