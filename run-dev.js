const { spawn } = require('child_process');
const path = require('path');

console.log('🌲 Starting TreeSurvive — Tree Planting & Survival Tracker...');
console.log('🌱 "Plant it. Locate it. Photograph it. Verify it. Keep it alive."\n');

const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// 1. Start Server on Port 5000
const server = spawn(npxCmd, ['tsx', 'src/server.ts'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, PORT: '5000' },
});

server.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[32m[SERVER]\x1b[0m ${data.toString()}`);
});

server.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[31m[SERVER ERROR]\x1b[0m ${data.toString()}`);
});

// 2. Start Client on Port 5173
const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'pipe',
  shell: true,
});

client.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[36m[CLIENT]\x1b[0m ${data.toString()}`);
});

client.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[33m[CLIENT WARN]\x1b[0m ${data.toString()}`);
});

const cleanup = () => {
  console.log('\nStopping TreeSurvive services...');
  server.kill();
  client.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
