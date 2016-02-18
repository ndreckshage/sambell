import { spawn } from 'child_process';

export default argv => {
  const { env } = argv;
  const args = ['run', 'gulp', '--', '--cwd', process.cwd(), '--env', env || 'dev'];
  const opts = { stdio: 'inherit', cwd: __dirname };
  spawn('npm', args, opts);
};
