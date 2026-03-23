import { defineSquad, defineTeam, defineAgent } from '@bradygaster/squad-sdk';

export default defineSquad({
  version: '1.0.0',

  team: defineTeam({
    name: 'travel-baggage-checker',
    description: 'TripPacker — 3-agent engineering team owning the React/TypeScript SPA for managing travel packing lists.',
    members: ['lead', 'frontend-engineer', 'platform-engineer'],
  }),

  agents: [
    defineAgent({ name: 'lead',               role: 'coordinator', description: 'Routes tasks, logs decisions, governs data model changes.',         status: 'active' }),
    defineAgent({ name: 'frontend-engineer',  role: 'specialist',  description: 'React/TS developer — components, hooks, pages, tests.',            status: 'active' }),
    defineAgent({ name: 'platform-engineer',  role: 'specialist',  description: 'Tooling, CI/CD, GitHub Actions, deploy scripts.',                  status: 'active' }),
  ],
});
