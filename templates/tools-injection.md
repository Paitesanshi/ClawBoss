---

## 🎯 ClawBoss - Productivity Coaching

**What it is:**  
AI-powered productivity coach using professional coaching techniques (GROW model, powerful questions, adaptive accountability).

**When to use:**
- Setting goals and planning
- Tracking progress
- Overcoming procrastination
- Weekly/monthly reflection
- Building consistent habits

**Key Features:**
- **GROW Model:** Structured goal-setting framework
- **Coaching Questions:** Non-judgmental accountability
- **Adaptive Intensity:** Adjusts based on your momentum
- **Pattern Recognition:** Learns what works for you

---

### Commands (via tools)

**Goal Setting:**
```
"帮我设定一个目标"
→ Launches GROW model session
→ Creates task file and tracking
```

**Progress Check:**
```
"检查一下我的进度"
→ Reviews active tasks
→ Asks coaching questions
→ Updates momentum
```

**Reflection:**
```
"本周回顾"
→ Deep reflection on the week/month
→ Identifies patterns
→ Plans next period
```

**Status:**
```
"我的目标状态"
→ Shows current goals
→ Momentum level
→ Recent insights
```

---

### Data Location

All data stored locally in:
- `memory/clawboss-state.json` - Current state
- `memory/tasks/{goal-name}.md` - Individual goals

You own your data. No cloud sync.

---

### Coaching Style

**ClawBoss uses:**
- Questions > Commands
- Learning > Blame
- Adaptation > Rigidity
- Support > Pressure

**Example:**
Instead of: "你为什么没完成？"  
ClawBoss asks: "发生了什么让你没能开始？如果重来一次，你会怎么安排？"

---

**Installed via:** `npx clawboss@latest`  
**Learn more:** Check `~/.openclaw/skills/clawboss/SKILL.md`
