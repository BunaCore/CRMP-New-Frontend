import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "CRMP",
  version: packageJson.version,
  copyright: `© ${currentYear}, CRMP.`,
  meta: {
    title: "CRMP - Collaborative Project Management",
    description: "CRMP is a modern, collaborative project management dashboard.",
  },
};
