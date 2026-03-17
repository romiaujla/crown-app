export type RecordedBootstrapStep = {
  id: string;
  command: string;
  args: string[];
};

export const expectedBootstrapSequence = [
  {
    id: 'postgres',
    command: 'pnpm',
    args: ['postgres'],
  },
  {
    id: 'db:push',
    command: 'pnpm',
    args: ['db:push'],
  },
  {
    id: 'db:seed:local',
    command: 'pnpm',
    args: ['db:seed:local'],
  },
] as const;

export const createBootstrapWorkflowHarness = () => {
  const recordedSteps: RecordedBootstrapStep[] = [];
  const infoMessages: string[] = [];

  return {
    recordedSteps,
    infoMessages,
    runCommand: async (step: RecordedBootstrapStep) => {
      recordedSteps.push({
        id: step.id,
        command: step.command,
        args: [...step.args],
      });

      return {
        stepId: step.id,
        exitCode: 0,
      };
    },
    logger: {
      info: (message: string) => {
        infoMessages.push(message);
      },
    },
  };
};
