export interface Workspace {
  id: string;
  projectId: string;
  title: string;
  manager: string;
  content: string;
  tasks: string[];
  updatedAt: string;
}

export const mockWorkspaces: Workspace[] = [
  {
    id: "ws-001",
    projectId: "proj-001",
    title: "Diagnostic Model Requirements",
    manager: "Dr. Sarah Johnson",
    content:
      "<h2>Requirements for Cardiovascular Detection</h2><p>The model must achieve at least 95% specificity...</p>",
    tasks: ["Requirement Gathering", "Data Normalization"],
    updatedAt: "2024-03-23T10:00:00Z",
  },
  {
    id: "ws-002",
    projectId: "proj-001",
    title: "Clinical Trial Design",
    manager: "Alice Brown",
    content: "<h2>Phase 1 Trial Layout</h2><p>Initial group of 50 patients starts next month...</p>",
    tasks: ["Patient Recruitment", "Safety Protocols"],
    updatedAt: "2024-03-24T14:00:00Z",
  },
  {
    id: "ws-003",
    projectId: "proj-002",
    title: "Urban Solar Potential Map",
    manager: "Prof. Michael Chen",
    content: "<h2>City Center Analysis</h2><p>Solar irradiance data indicates 4.5kWh/m2 average...</p>",
    tasks: ["Data Collection", "GIS Mapping"],
    updatedAt: "2024-03-22T09:00:00Z",
  },
];
