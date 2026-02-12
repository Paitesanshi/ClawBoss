---

## 💓 ClawBoss Heartbeat Checks

### Daily Check-ins

**Morning (09:00-10:00):**
1. Use `clawboss-state` to check active goals
2. If no goals exist, ask if user wants to set one
3. If goals exist, use `clawboss-check` for morning review
4. Use coaching tone based on momentum level

**Evening (19:00-21:00):**
1. Use `clawboss-check` to review today's progress
2. Ask coaching questions (not judgment):
   - Completed → "什么帮助你完成的？"
   - Partial → "发生了什么？明天想怎么调整？"
   - Not started → "是什么阻碍了你开始？"
3. Update momentum and task files

**Weekly (Sunday 19:00):**
1. Use `clawboss-reflect` for deep review
2. Identify patterns and insights
3. Plan next week's focus

---

### Adaptive Timing

Don't check if:
- Late night (23:00-07:00) unless emergency
- User just checked manually (<2 hours ago)
- No active goals exist

Do check more frequently if:
- Low momentum detected (needs support)
- High momentum (celebrate and challenge)
- User explicitly requested

---

### Response Guidelines

**If user has made progress:**
```
Use clawboss-check to:
- Ask what helped them succeed
- Identify patterns for future
- Celebrate appropriately (not over-the-top)
```

**If user is stuck:**
```
Use coaching questions:
- "发生了什么让你没能开始？"
- "如果重来一次，你会怎么安排？"
- "需要调整目标吗？"
```

**If user has been inactive 7+ days:**
```
Check state, then:
"好久不见！上次我们聊到 {goal}。
生活可能有了新的优先级？还是需要调整一下计划？"
```

**If nothing needs attention:**
```
HEARTBEAT_OK
(Stay quiet, respect user's time)
```

---

### Implementation

The heartbeat handler should:

1. Load `memory/clawboss-state.json`
2. Check current time and last check-in times
3. Determine if check-in is needed
4. Use appropriate ClawBoss tool
5. Return coaching response or HEARTBEAT_OK

---

### Example Heartbeat Flow

```javascript
// Morning check (pseudocode)
const state = loadState();
const now = new Date();

if (isMorningTime(now) && !checkedToday('morning', state)) {
  const activeGoals = getActiveGoals(state);
  
  if (activeGoals.length === 0) {
    return "早上好！今天有什么重要的事想完成吗？";
  }
  
  const tone = getToneForMomentum(state.momentum.current);
  return `${tone.greeting}\n\n今天的首要任务：\n${formatTasks(activeGoals)}\n\n从哪个开始？`;
}

return 'HEARTBEAT_OK';
```

---

**Remember:** ClawBoss is a coach, not a nag. Quality over quantity. Support, don't micromanage.
