export interface Project {
  id: string;
  name: string;
  status: "Approved" | "Pending" | "Completed" | "Rejected";
  owner: string;
  description?: string;
  updatedAt: string;
}

export const mockProjects: Project[] = [
  {
    id: "proj-001",
    name: "AI-Driven Healthcare Diagnostics",
    status: "Approved",
    owner: "Dr. Sarah Johnson",
    description: "Developing machine learning models for early detection of cardiovascular diseases.",
    updatedAt: "2024-03-20T10:00:00Z",
  },
  {
    id: "proj-002",
    name: "Sustainable Urban Energy Systems",
    status: "Approved",
    owner: "Prof. Michael Chen",
    description: "Evaluating the integration of solar and wind energy in high-density urban environments.",
    updatedAt: "2024-03-18T14:30:00Z",
  },
  {
    id: "proj-003",
    name: "Quantum Computing Algorithms",
    status: "Pending",
    owner: "Dr. Alice Wong",
    description: "Optimizing Grover's algorithm for faster database searches in distributed networks.",
    updatedAt: "2024-03-15T09:15:00Z",
  },
  {
    id: "proj-004",
    name: "Marine Biodiversity Mapping",
    status: "Approved",
    owner: "James Wilson",
    description: "Using underwater drones to track coral reef health and marine life populations.",
    updatedAt: "2024-03-22T16:45:00Z",
  },
  {
    id: "proj-005",
    name: "Blockchain for Supply Chain",
    status: "Approved",
    owner: "Elena Rodriguez",
    description: "Implementing a transparent tracking system for fair-trade coffee production.",
    updatedAt: "2024-03-21T11:20:00Z",
  },
  {
    id: "proj-006",
    name: "Neural Plasticity Research",
    status: "Approved",
    owner: "Dr. Robert Smith",
    description: "Investigating how brain networks reorganize after stroke rehabilitation.",
    updatedAt: "2024-03-19T13:10:00Z",
  },
];
