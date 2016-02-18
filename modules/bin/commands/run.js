import { spawn } from 'child_process';

export default argv => {
  const {
    _: [, entry],
    gerty,
    env,
  } = argv;

  const args = [
    'run', 'gulp', '--',
    '--cwd', process.cwd(),
    '--env', env || 'dev',
    '--entry', entry || 'index',
    '--gerty', gerty || 'gerty',
  ];

  spawn('npm', args, { stdio: 'inherit', cwd: __dirname });
};
