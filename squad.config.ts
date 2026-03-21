const squadConfig = {
  squadName: "travel-baggage-checker",
  squadRoot: ".squad",
  routingPath: ".squad/routing.md",
  decisionsPath: ".squad/decisions.md",
  agents: [
    {
      handle: "lead",
      role: "Coordinator & Decision Governor",
      charterPath: ".squad/agents/lead/charter.md",
      historyPath: ".squad/agents/lead/history.md",
    },
    {
      handle: "frontend-engineer",
      role: "React/TS Developer + Test Author",
      charterPath: ".squad/agents/frontend-engineer/charter.md",
      historyPath: ".squad/agents/frontend-engineer/history.md",
    },
    {
      handle: "platform-engineer",
      role: "Tooling, CI/CD & Deploy Owner",
      charterPath: ".squad/agents/platform-engineer/charter.md",
      historyPath: ".squad/agents/platform-engineer/history.md",
    },
  ],
} as const;

export default squadConfig;
