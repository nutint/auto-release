import "./App.css";

const heroSection = {
  headline:
    "Streamline Your Release Workflow – Automated, Seamless, and Powerful",
  subHeadline:
    "Take the pain out of release management with automated versioning, changelog generation, and seamless integrations.",
  callToAction: {
    users: "Getting started",
    developers: "Contribute on GitHub",
  },
};

const featureSection = [
  "Automated changelogs: Generate detailed changelogs from commit messages",
  "Semantic versioning: Automatically bump version based on conventional commits",
  "Multi-Language support: Works with NodeJs, C#, and Scala",
  "GitHub Actions Integration: Plug-and-play CI/CD support",
  "Jira-Integration: Track tickets and tag releases",
];

const howItWorksSection = {
  style:
    "Simple workflow diagram or numbered steps to explain how the tool works",
  steps: [
    "Configure: Set up your project with minimal configuration",
    "Automate: Run the CLI or integration with CI/CD pipeline",
    "Release: Generate changelogs, tag releases, and update versions",
  ],
};

const showcaseSection = {
  style: "Logos or Testimonials from early adopters (if available)",
  ifNoTestimonialYet:
    "Join a growing community of developers automating their release processes.",
};

const communityAndContributionSections = {
  forContributors:
    "Help us improve! Fig bugs, add features, or enhance documentation",
  forUsers: "Need help of have questions? Join our community",
};

const demoSection = {
  style: "highlight the ease of set up with a snippet of code of configuration",
  example: "npm install -g @nutint/auto-release\nauto-release init",
};

const openSourceValueSection = {
  style: "Empasizing transparency, and community-driven development",
  example:
    "Built by developers, for developers. Your contributions shape the future of release automation",
};

const footerSection = {
  essentialLinks: [
    "Github Repository",
    "Documentation",
    "Contributing guide",
    "Community Guidelines",
  ],
};

const content = {
  heroSection,
  featureSection,
  howItWorksSection,
  showcaseSection,
  communityAndContributionSections,
  demoSection,
  openSourceValueSection,
  footerSection,
};

function App() {
  return <>{JSON.stringify(content)}</>;
}

export default App;
