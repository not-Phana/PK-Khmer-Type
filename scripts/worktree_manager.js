/**
 * scripts/worktree_manager.js
 * Multi-Agent Git Worktree Coordinator for PK Khmer Type
 * Strictly adheres to Zero-Emoji Policy
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const parentDir = path.resolve(repoRoot, '..');

const action = process.argv[2] || 'status';
const workerName = process.argv[3] || 'worker2';
const workerDir = path.resolve(parentDir, `idk-${workerName}`);

function run(cmd, cwd = repoRoot) {
  return execSync(cmd, { cwd, encoding: 'utf8', stdio: 'inherit' });
}

function runCapture(cmd, cwd = repoRoot) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8' }).trim();
  } catch (e) {
    return null;
  }
}

switch (action) {
  case 'create': {
    console.log(`[Worktree Manager] Setting up parallel worker workspace: ${workerDir}`);
    if (fs.existsSync(workerDir)) {
      console.log(`[Worktree Manager] Directory already exists: ${workerDir}`);
    } else {
      console.log(`[Worktree Manager] Creating branch "${workerName}" and worktree at ${workerDir}...`);
      run(`git worktree add -b ${workerName} "${workerDir}" main`);
    }

    console.log('[Worktree Manager] Initializing build and standalone assets in worker...');
    try {
      execSync('node scripts/generate_supabase_config.js', { cwd: workerDir, stdio: 'inherit' });
      execSync('node scripts/bundle_single_file.js', { cwd: workerDir, stdio: 'inherit' });
    } catch(e) {}

    console.log('\n[Worktree Manager] Parallel Agent Workspace Ready:');
    console.log(`  Path: ${workerDir}`);
    console.log(`  Branch: ${workerName}`);
    console.log('\nInstructions to run Agent 2:');
    console.log(`  1. Open a second Antigravity IDE window or terminal.`);
    console.log(`  2. Open directory: "${workerDir}"`);
    console.log(`  3. Agent 2 can work on branch "${workerName}" with zero file-collision risk.`);
    break;
  }

  case 'status': {
    console.log('[Worktree Manager] Active Worktrees:');
    run('git worktree list');
    console.log('\n[Worktree Manager] Current Branch Status:');
    run('git status -s');
    break;
  }

  case 'merge': {
    console.log(`[Worktree Manager] Validating tests in ${workerDir}...`);
    try {
      execSync('npm test', { cwd: workerDir, stdio: 'inherit' });
      console.log('[Worktree Manager] All worker tests passed.');
    } catch (e) {
      console.error('[Worktree Manager] Tests failed in worker. Resolve errors before merging.');
      process.exit(1);
    }

    console.log(`[Worktree Manager] Merging branch "${workerName}" into main...`);
    run(`git merge ${workerName} --no-edit`);

    console.log('[Worktree Manager] Verifying tests on main...');
    run('npm test');

    console.log('\n[Worktree Manager] Successfully merged worker changes into main.');
    break;
  }

  case 'remove': {
    console.log(`[Worktree Manager] Removing worktree: ${workerDir}`);
    if (fs.existsSync(workerDir)) {
      run(`git worktree remove "${workerDir}"`);
      console.log('[Worktree Manager] Worktree removed.');
    } else {
      console.log('[Worktree Manager] Worktree directory not found.');
    }
    break;
  }

  default:
    console.log(`Usage: node scripts/worktree_manager.js [create|status|merge|remove] [workerName]`);
}
