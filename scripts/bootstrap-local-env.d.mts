export type LocalBootstrapStep = {
  id: string;
  command: string;
  args: string[];
  description: string;
};

export declare const localBootstrapSteps: LocalBootstrapStep[];

export declare function runLocalBootstrap(options?: {
  steps?: LocalBootstrapStep[];
  runCommand?: (step: LocalBootstrapStep) => Promise<unknown>;
  logger?: {
    info: (message: string) => void;
  };
}): Promise<{
  completedSteps: string[];
  baselineCommand: string;
}>;
