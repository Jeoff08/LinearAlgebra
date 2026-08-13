export type Topic = {
  id: string;
  title: string;
  summary: string;
  details: string;
  examples: string[];
};

const topicModules = import.meta.glob("./*.ts", {
  eager: true,
}) as Record<string, { default: Topic }>;

export const TOPICS: Topic[] = Object.keys(topicModules)
  .filter((key) => key !== "./index.ts" && key !== "./__init__.ts")
  .sort()
  .map((key) => topicModules[key].default);

export default TOPICS;
