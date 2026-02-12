#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function checkOpenClaw() {
  const openclawPath = path.join(process.env.HOME, '.openclaw');
  if (!fs.existsSync(openclawPath)) {
    log('❌ OpenClaw not found!', 'red');
    log('\nPlease install OpenClaw first:', 'yellow');
    log('  npm install -g openclaw@latest\n', 'cyan');
    process.exit(1);
  }
  return openclawPath;
}

function copySkill(openclawPath) {
  const skillSource = path.join(__dirname, '..', 'skill');
  const skillDest = path.join(openclawPath, 'skills', 'clawboss');
  
  log('📦 Installing ClawBoss skill...', 'cyan');
  
  // 创建目标目录
  if (!fs.existsSync(skillDest)) {
    fs.mkdirSync(skillDest, { recursive: true });
  }
  
  // 复制文件
  copyRecursive(skillSource, skillDest);
  
  log('   ✓ Skill installed', 'green');
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    files.forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function injectSOUL(openclawPath) {
  const soulPath = path.join(openclawPath, 'workspace', 'SOUL.md');
  const templatePath = path.join(__dirname, '..', 'templates', 'soul-injection.md');
  
  log('🧠 Adding ClawBoss persona to SOUL.md...', 'cyan');
  
  const template = fs.readFileSync(templatePath, 'utf-8');
  
  if (fs.existsSync(soulPath)) {
    const currentSoul = fs.readFileSync(soulPath, 'utf-8');
    if (currentSoul.includes('ClawBoss')) {
      log('   ⚠ ClawBoss persona already exists, skipping', 'yellow');
      return;
    }
    fs.appendFileSync(soulPath, '\n\n' + template);
  } else {
    fs.writeFileSync(soulPath, template);
  }
  
  log('   ✓ Persona added', 'green');
}

function injectHeartbeat(openclawPath) {
  const heartbeatPath = path.join(openclawPath, 'workspace', 'HEARTBEAT.md');
  const templatePath = path.join(__dirname, '..', 'templates', 'heartbeat-injection.md');
  
  log('💓 Configuring heartbeat checks...', 'cyan');
  
  const template = fs.readFileSync(templatePath, 'utf-8');
  
  if (fs.existsSync(heartbeatPath)) {
    const currentHeartbeat = fs.readFileSync(heartbeatPath, 'utf-8');
    if (currentHeartbeat.includes('ClawBoss')) {
      log('   ⚠ ClawBoss heartbeat already exists, skipping', 'yellow');
      return;
    }
    fs.appendFileSync(heartbeatPath, '\n\n' + template);
  } else {
    fs.writeFileSync(heartbeatPath, template);
  }
  
  log('   ✓ Heartbeat configured', 'green');
}

function injectTools(openclawPath) {
  const toolsPath = path.join(openclawPath, 'workspace', 'TOOLS.md');
  const templatePath = path.join(__dirname, '..', 'templates', 'tools-injection.md');
  
  log('🔧 Adding ClawBoss to TOOLS.md...', 'cyan');
  
  const template = fs.readFileSync(templatePath, 'utf-8');
  
  if (fs.existsSync(toolsPath)) {
    const currentTools = fs.readFileSync(toolsPath, 'utf-8');
    if (currentTools.includes('ClawBoss')) {
      log('   ⚠ ClawBoss tools already exist, skipping', 'yellow');
      return;
    }
    fs.appendFileSync(toolsPath, '\n\n' + template);
  } else {
    fs.writeFileSync(toolsPath, template);
  }
  
  log('   ✓ Tools documented', 'green');
}

function createDirectories(openclawPath) {
  const tasksPath = path.join(openclawPath, 'workspace', 'memory', 'tasks');
  
  log('📁 Creating task directories...', 'cyan');
  
  if (!fs.existsSync(tasksPath)) {
    fs.mkdirSync(tasksPath, { recursive: true });
  }
  
  // 初始化 state 文件
  const statePath = path.join(openclawPath, 'workspace', 'memory', 'clawboss-state.json');
  if (!fs.existsSync(statePath)) {
    const initialState = {
      user: {
        name: "",
        timezone: "Asia/Shanghai",
        workingHours: { start: "09:00", end: "22:00" },
        preferences: {
          checkInFrequency: "2x-daily",
          coachingStyle: "balanced",
          enableWeeklyReview: true
        }
      },
      momentum: {
        current: "medium",
        consecutiveDays: 0,
        lastSuccess: null,
        trend: "stable"
      },
      goals: [],
      checkIns: {
        lastMorning: null,
        lastEvening: null,
        lastWeekly: null
      },
      insights: {
        bestWorkTime: null,
        commonBlockers: [],
        successPatterns: []
      }
    };
    fs.writeFileSync(statePath, JSON.stringify(initialState, null, 2));
  }
  
  log('   ✓ Directories created', 'green');
}

function updateConfig(openclawPath) {
  const configPath = path.join(openclawPath, 'openclaw.json');
  
  log('⚙️  Updating OpenClaw config...', 'cyan');
  
  if (!fs.existsSync(configPath)) {
    log('   ⚠ Config file not found, skipping', 'yellow');
    return;
  }
  
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    
    if (!config.skills) {
      config.skills = { entries: {} };
    }
    if (!config.skills.entries) {
      config.skills.entries = {};
    }
    
    if (!config.skills.entries['clawboss']) {
      config.skills.entries['clawboss'] = {
        enabled: true
      };
      
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      log('   ✓ Config updated', 'green');
    } else {
      log('   ⚠ ClawBoss already in config, skipping', 'yellow');
    }
  } catch (error) {
    log(`   ⚠ Could not update config: ${error.message}`, 'yellow');
    log('   You may need to manually add clawboss to your config', 'yellow');
  }
}

async function main() {
  console.log('');
  log('═══════════════════════════════════════════', 'bright');
  log('       🦞 ClawBoss Installer', 'bright');
  log('  Your AI Productivity Coach with Coaching', 'cyan');
  log('═══════════════════════════════════════════', 'bright');
  console.log('');
  
  try {
    const openclawPath = checkOpenClaw();
    
    copySkill(openclawPath);
    injectSOUL(openclawPath);
    injectHeartbeat(openclawPath);
    injectTools(openclawPath);
    createDirectories(openclawPath);
    updateConfig(openclawPath);
    
    console.log('');
    log('═══════════════════════════════════════════', 'bright');
    log('✅ ClawBoss installed successfully!', 'green');
    log('═══════════════════════════════════════════', 'bright');
    console.log('');
    
    log('🎯 Next steps:', 'bright');
    log('   1. Restart OpenClaw:', 'cyan');
    log('      openclaw gateway restart\n', 'yellow');
    log('   2. Start your first goal:', 'cyan');
    log('      Say: "帮我设定一个目标"\n', 'yellow');
    log('   3. Let ClawBoss coach you to success! 🚀\n', 'cyan');
    
    log('📚 Learn more:', 'bright');
    log('   - GitHub: https://github.com/Paitesanshi/ClawBoss', 'cyan');
    log('   - Docs: See templates/ in the skill folder\n', 'cyan');
    
  } catch (error) {
    log(`\n❌ Installation failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
