import { spawn } from 'node:child_process';

export const localBootstrapSteps = [
  {
    id: 'postgres',
    command: 'pnpm',
    args: ['postgres'],
    description: 'Start local PostgreSQL',
  },
  {
    id: 'db:push',
    command: 'pnpm',
    args: ['db:push'],
    description: 'Prepare control-plane schema state',
  },
  {
    id: 'db:seed:local',
    command: 'pnpm',
    args: ['db:seed:local'],
    description: 'Bootstrap the canonical tenant schema and reload the canonical seed baseline',
  },
];

const runSpawnCommand = (step) =>
  new Promise((resolve, reject) => {
    const child = spawn(step.command, step.args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`Bootstrap step ${step.id} exited due to signal ${signal}`));
        return;
      }

      if ((code ?? 1) !== 0) {
        reject(new Error(`Bootstrap step ${step.id} failed with exit code ${code ?? 1}`));
        return;
      }

      resolve({ stepId: step.id, exitCode: code ?? 0 });
    });
  });

export const runLocalBootstrap = async ({
  steps = localBootstrapSteps,
  runCommand = runSpawnCommand,
  logger = console,
} = {}) => {
  const completedSteps = [];

  for (const step of steps) {
    logger.info(`Running ${step.id}: ${step.description}`);
    await runCommand(step);
    completedSteps.push(step.id);
  }

  return {
    completedSteps,
    baselineCommand: 'pnpm db:seed:local',
  };
};

const isDirectExecution =
  process.argv[1] !== undefined && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));

if (isDirectExecution) {
  runLocalBootstrap().catch((error) => {
    console.error(error instanceof Error ? error.message : 'Local bootstrap failed');
    process.exitCode = 1;
  });
}
