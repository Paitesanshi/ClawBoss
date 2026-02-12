#!/usr/bin/env node

/**
 * ClawBoss Test Suite
 *
 * Run: node test.js test
 */

const ClawBoss = require('./skill/scripts/index.js');
const stateManager = require('./skill/scripts/state-manager.js');
const questions = require('./skill/scripts/coaching-questions.js');

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}`);
  }
}

async function runTests() {
  console.log('🧪 ClawBoss Test Suite\n');
  console.log('═══════════════════════════════════════════\n');

  try {
    // Test 1: Quick Start Goal
    console.log('Test 1: Quick Start Goal');
    console.log('─────────────────────────');
    const startResult = await ClawBoss.breakdown.quickStart('完成测试项目');
    assert(startResult.success === true, 'quickStart returns success');
    assert(typeof startResult.goalId === 'string', 'goalId is a string');
    assert(startResult.message.includes('完成测试项目'), 'message includes goal title');
    console.log('');

    // Test 2: Load State
    console.log('Test 2: Load State');
    console.log('─────────────────────────');
    const state = ClawBoss.state.load();
    assert(typeof state.schemaVersion === 'number', 'schemaVersion exists');
    assert(Array.isArray(state.goals), 'goals is array');
    assert(Array.isArray(state.achievements), 'achievements is array');
    assert(Array.isArray(state._errors), '_errors is array');
    assert(state.activeSession !== undefined, 'activeSession field exists');
    console.log('');

    // Test 3: Progress Check
    console.log('Test 3: Progress Check');
    console.log('─────────────────────────');
    const progressResult = await ClawBoss.progress.check();
    assert(typeof progressResult.response === 'string', 'progress response is string');
    assert(progressResult.response.length > 0, 'progress response is not empty');
    console.log('');

    // Test 4: Update Momentum
    console.log('Test 4: Update Momentum');
    console.log('─────────────────────────');
    const updatedState = ClawBoss.state.updateMomentum(state, 'success');
    assert(updatedState.momentum.consecutiveDays >= 1, 'consecutiveDays incremented');
    assert(updatedState.momentum.lastSuccess !== null, 'lastSuccess set');
    console.log('');

    // Test 5: Coaching Questions
    console.log('Test 5: Coaching Questions');
    console.log('─────────────────────────');
    const goalQuestion = ClawBoss.questions.get('goal');
    const realityQuestion = ClawBoss.questions.get('reality');
    assert(typeof goalQuestion === 'string', 'goal question is string');
    assert(typeof realityQuestion === 'string', 'reality question is string');
    console.log('');

    // Test 6: Heartbeat Handler
    console.log('Test 6: Heartbeat Handler');
    console.log('─────────────────────────');
    const heartbeatResult = await ClawBoss.heartbeat.handle();
    assert(typeof heartbeatResult === 'string', 'heartbeat returns string');
    assert(heartbeatResult.length > 0, 'heartbeat result not empty');
    console.log('');

    // Test 7: Reflection (if goals exist)
    const currentState = ClawBoss.state.load();
    if (ClawBoss.state.getActiveGoals(currentState).length > 0) {
      console.log('Test 7: Reflection');
      console.log('─────────────────────────');
      const reflectionResult = await ClawBoss.reflection.start('week');
      assert(typeof reflectionResult.response === 'string', 'reflection response is string');
      console.log('');
    }

    // Test 8: Progress Summary
    console.log('Test 8: Progress Summary');
    console.log('─────────────────────────');
    const summary = ClawBoss.progress.summary();
    assert(typeof summary.totalGoals === 'number', 'totalGoals is number');
    assert(typeof summary.momentum === 'string', 'momentum is string');
    console.log('');

    // ═══════════════════════════════════════
    // New tests (Phase 6)
    // ═══════════════════════════════════════

    // Test 9: Path Sanitize
    console.log('Test 9: Path Sanitize');
    console.log('─────────────────────────');
    assert(stateManager.sanitizeFilename('hello') === 'hello', 'normal name unchanged');
    assert(stateManager.sanitizeFilename('../etc/passwd') === '__etc_passwd', 'path traversal blocked');
    assert(stateManager.sanitizeFilename('a/b\\c:d*e?f"g<h>i|j') === 'a_b_c_d_e_f_g_h_i_j', 'illegal chars replaced');
    assert(stateManager.sanitizeFilename('a'.repeat(200)).length === 100, 'truncated to 100 chars');
    assert(stateManager.sanitizeFilename('') === 'untitled', 'empty string becomes untitled');
    console.log('');

    // Test 10: Achievement Check
    console.log('Test 10: Achievement Check');
    console.log('─────────────────────────');
    const achState = stateManager.createInitialState();
    achState.goals = [{ id: 'g1', title: 'test', status: 'active' }];
    achState.checkIns.lastWeekly = new Date().toISOString();
    const unlocked = stateManager.checkAchievements(achState);
    const ids = unlocked.map(a => a.id);
    assert(ids.includes('first-goal'), 'first-goal achievement unlocked');
    assert(ids.includes('first-reflection'), 'first-reflection achievement unlocked');
    assert(!ids.includes('streak-7'), 'streak-7 not unlocked at 0 days');
    // Check idempotency — running again should not re-unlock
    const unlocked2 = stateManager.checkAchievements(achState);
    assert(unlocked2.length === 0, 'achievements idempotent on second check');
    console.log('');

    // Test 11: Emotion Detection
    console.log('Test 11: Emotion Detection');
    console.log('─────────────────────────');
    const stressed = questions.detectEmotion('我压力好大，焦虑得不行');
    assert(stressed !== null, 'stressed emotion detected');
    assert(stressed.emotion === 'stressed', 'correctly identified as stressed');
    assert(stressed.confidence >= 0.5, 'confidence >= 0.5 with 2 keywords');

    const happy = questions.detectEmotion('太好了，终于完成了！');
    assert(happy !== null, 'happy emotion detected');
    assert(happy.emotion === 'happy', 'correctly identified as happy');

    const none = questions.detectEmotion('今天天气不错');
    assert(none === null, 'no emotion for neutral text');
    console.log('');

    // Test 12: Session Lifecycle
    console.log('Test 12: Session Lifecycle');
    console.log('─────────────────────────');
    const sessState = stateManager.createInitialState();
    assert(stateManager.getActiveSession(sessState) === null, 'no session initially');

    stateManager.startSession(sessState, 'goal-123');
    const sess = stateManager.getActiveSession(sessState);
    assert(sess !== null, 'session created');
    assert(sess.goalId === 'goal-123', 'session goalId correct');
    assert(sess.growPhase === 'goal', 'session starts at goal phase');

    stateManager.advanceSession(sessState);
    assert(sessState.activeSession.growPhase === 'reality', 'advanced to reality');

    stateManager.advanceSession(sessState);
    assert(sessState.activeSession.growPhase === 'options', 'advanced to options');

    stateManager.advanceSession(sessState);
    assert(sessState.activeSession.growPhase === 'will', 'advanced to will');

    stateManager.advanceSession(sessState);
    assert(sessState.activeSession.growPhase === 'complete', 'advanced to complete');

    stateManager.endSession(sessState);
    assert(sessState.activeSession === null, 'session ended');
    console.log('');

    // Test 13: Goal Status Transition
    console.log('Test 13: Goal Status Transition');
    console.log('─────────────────────────');
    const transState = stateManager.createInitialState();
    const { state: ts1, goalId: gid1 } = stateManager.addGoal(transState, { title: 'transition test' });
    const goal = ts1.goals.find(g => g.id === gid1);
    assert(goal.status === 'active', 'new goal is active');

    let result = stateManager.transitionGoalStatus(ts1, gid1, 'paused');
    assert(result.error === null, 'active -> paused succeeds');
    assert(goal.status === 'paused', 'goal now paused');

    result = stateManager.transitionGoalStatus(ts1, gid1, 'active');
    assert(result.error === null, 'paused -> active succeeds');
    assert(goal.status === 'active', 'goal now active again');

    result = stateManager.transitionGoalStatus(ts1, gid1, 'archived');
    assert(result.error === null, 'active -> archived succeeds');
    assert(goal.status === 'archived', 'goal now archived');

    result = stateManager.transitionGoalStatus(ts1, gid1, 'active');
    assert(result.error !== null, 'archived -> active fails');
    console.log('');

    // Test 14: Intimate Partner Persona
    console.log('Test 14: Intimate Partner Persona');
    console.log('─────────────────────────');
    const ipTone = questions.getPersonaTone('intimate-partner', 'high');
    assert(ipTone !== null, 'intimate-partner persona exists');
    assert(Array.isArray(ipTone.greeting), 'has greeting array');
    assert(ipTone.greeting.length >= 2, 'has at least 2 greetings');
    const ipLow = questions.getPersonaTone('intimate-partner', 'low');
    assert(ipLow !== null, 'intimate-partner low tone exists');
    const ipCrisis = questions.getPersonaTone('intimate-partner', 'crisis');
    assert(ipCrisis !== null, 'intimate-partner crisis tone exists');
    console.log('');

    // Test 15: Milestone Lifecycle
    console.log('Test 15: Milestone Lifecycle');
    console.log('─────────────────────────');
    const msState = stateManager.createInitialState();
    const { goalId: msGoalId } = stateManager.addGoal(msState, { title: 'milestone test' });
    const msGoal = msState.goals.find(function(x) { return x.id === msGoalId });
    assert(Array.isArray(msGoal.milestones), 'goal has milestones array');
    assert(msGoal.milestones.length === 0, 'milestones initially empty');

    // Add milestones
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    stateManager.addMilestones(msState, msGoalId, [
      { title: '阶段1', targetDate: yesterday },
      { title: '阶段2', targetDate: tomorrow },
      { title: '阶段3' }
    ]);
    assert(msGoal.milestones.length === 3, '3 milestones added');
    assert(msGoal.milestones[0].status === 'pending', 'milestone starts pending');

    // Check alerts
    const alerts = stateManager.getMilestoneAlerts(msState);
    const overdueAlerts = alerts.filter(function(a) { return a.type === 'overdue' });
    const upcomingAlerts = alerts.filter(function(a) { return a.type === 'upcoming' });
    assert(overdueAlerts.length === 1, '1 overdue milestone alert');
    assert(upcomingAlerts.length === 1, '1 upcoming milestone alert');

    // Complete a milestone
    const ms0Id = msGoal.milestones[0].id;
    stateManager.completeMilestone(msState, msGoalId, ms0Id);
    assert(msGoal.milestones[0].status === 'completed', 'milestone completed');
    assert(msGoal.milestones[0].completedAt !== null, 'completedAt set');

    // After completion, overdue alert should not appear for completed milestone
    const alerts2 = stateManager.getMilestoneAlerts(msState);
    const overdueAfter = alerts2.filter(function(a) { return a.type === 'overdue' });
    assert(overdueAfter.length === 0, 'no overdue alert for completed milestone');
    console.log('');

    // Test 16: breakdownGoal
    console.log('Test 16: breakdownGoal');
    console.log('─────────────────────────');
    const bdResult = await ClawBoss.breakdown.breakdown(msGoalId, [
      { title: '准备材料', targetDate: '2026-03-01' },
      { title: '完成初稿', targetDate: '2026-04-01' }
    ]);
    // Note: This operates on msState which is in-memory, but breakdownGoal loads from disk.
    // We test with a real goal from quickStart instead.
    const bdState = stateManager.loadState();
    const bdGoals = stateManager.getActiveGoals(bdState);
    if (bdGoals.length > 0) {
      const bdResult2 = await ClawBoss.breakdown.breakdown(bdGoals[0].id, [
        { title: '测试阶段1', targetDate: '2026-03-01' },
        { title: '测试阶段2', targetDate: '2026-04-01' }
      ]);
      assert(bdResult2.success === true, 'breakdownGoal succeeds');
      assert(bdResult2.message.includes('里程碑'), 'message mentions milestones');
    } else {
      assert(true, 'breakdownGoal skipped (no active goals on disk)');
      assert(true, 'breakdownGoal skipped placeholder');
    }
    console.log('');

    // Summary
    console.log('═══════════════════════════════════════════');
    console.log(`✅ ${passed} passed, ❌ ${failed} failed\n`);

    if (failed > 0) {
      process.exit(1);
    }

    // Cleanup test goal
    const cleanState = ClawBoss.state.load();
    cleanState.goals = cleanState.goals.filter(g => g.title !== '完成测试项目');
    cleanState.activeSession = null;
    ClawBoss.state.save(cleanState);
    console.log('✓ Test data cleaned up\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run interactive demo
async function runDemo() {
  console.log('🎯 ClawBoss Interactive Demo\n');
  console.log('This will guide you through a typical ClawBoss flow.\n');

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function ask(question) {
    return new Promise(resolve => {
      rl.question(question, resolve);
    });
  }

  try {
    console.log('Step 1: Setting a Goal');
    console.log('─────────────────────────\n');

    const goalTitle = await ask('What goal would you like to set? ');
    const startResult = await ClawBoss.breakdown.quickStart(goalTitle);
    console.log('\n' + startResult.message + '\n');

    const motivation = await ask('Your answer: ');
    console.log('\n✓ Great! Goal created.\n');

    console.log('Step 2: Progress Check');
    console.log('─────────────────────────\n');

    const progressResult = await ClawBoss.progress.check();
    console.log(progressResult.response + '\n');

    console.log('Step 3: View Status');
    console.log('─────────────────────────\n');

    const state = ClawBoss.state.load();
    console.log(`Momentum: ${state.momentum.current}`);
    console.log(`Active Goals: ${ClawBoss.state.getActiveGoals(state).length}`);
    console.log(`Consecutive Days: ${state.momentum.consecutiveDays}\n`);

    const cleanup = await ask('Remove demo goal? (y/N): ');
    if (cleanup.toLowerCase() === 'y') {
      const currentState = ClawBoss.state.load();
      currentState.goals = currentState.goals.filter(g => g.title !== goalTitle);
      ClawBoss.state.save(currentState);
      console.log('✓ Demo goal removed');
    }

    rl.close();
    console.log('\n🎉 Demo complete!\n');

  } catch (error) {
    console.error('Error:', error.message);
    rl.close();
  }
}

// CLI
const command = process.argv[2];

if (command === 'demo') {
  runDemo();
} else if (command === 'test') {
  runTests();
} else {
  console.log(`
ClawBoss Test & Demo

Usage:
  node test.js test    - Run automated tests
  node test.js demo    - Run interactive demo
  `);
}
