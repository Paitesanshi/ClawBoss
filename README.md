# ClawBoss

> **You are the boss of you.**

AI productivity coach that breaks down goals, builds plans, and tracks milestones — powered by the GROW coaching model.

不是待办清单，是教练。待办清单告诉你「该做什么」，ClawBoss 帮你「真正做到」。

<p align="center">
  <img src="https://img.shields.io/npm/v/clawboss" alt="npm version">
  <img src="https://img.shields.io/npm/dt/clawboss" alt="downloads">
  <img src="https://img.shields.io/github/license/Paitesanshi/ClawBoss" alt="license">
</p>

---

## ✨ What It Does

ClawBoss transforms your OpenClaw agent into a **productivity coach** that:

- 🎯 **Breaks down goals** into concrete milestones with deadlines
- 📋 **Creates structured plans** using the GROW coaching model
- 📊 **Tracks progress** and proactively checks in at key nodes
- 🔄 **Adapts intensity** — starts small when you're stuck, pushes when you're ready
- 💡 **4 coaching styles** — strict coach, warm mentor, buddy, intimate partner

---

## 🚀 Quick Start

### Prerequisites

- [OpenClaw](https://github.com/openclaw/openclaw) installed and configured
- Node.js >= 18

### Installation

```bash
npx clawboss@latest
```

That's it! The installer will:
- ✅ Check OpenClaw is installed
- ✅ Install the ClawBoss skill
- ✅ Configure your agent persona
- ✅ Set up automatic check-ins
- ✅ Create task directories

### First Use

Restart OpenClaw:
```bash
openclaw gateway restart
```

Then say:
```
"帮我设定一个目标"
```

ClawBoss will guide you through a coaching session to break down your goal into actionable steps.

---

## 🎓 How It Works

### The GROW Model

ClawBoss uses the professional coaching framework:

1. **Goal** - What do you want to achieve?
2. **Reality** - Where are you now?
3. **Options** - What are possible approaches?
4. **Will** - What will you do first?

### Example Session

```
You: "帮我设定一个目标"

ClawBoss: "很好！让我们从头开始。你最近想在哪个方面有所突破？"

You: "我想完成论文初稿"

ClawBoss: "为什么这个对你重要？达成后你的生活会有什么不同？"

You: "这是毕业的前提，完成后能专心找工作"

ClawBoss: "现在进展如何？是什么阻碍了你开始或继续？"

... [GROW process continues]

ClawBoss: "好的，我理解了。让我们把它分解成可执行的步骤..."
[Creates memory/tasks/论文初稿.md with structured plan]
```

---

## 🎯 Features

### Coaching-Style Accountability

**Instead of:**
- ❌ "你完成了吗？"
- ❌ "你为什么没做？"

**ClawBoss asks:**
- ✅ "是什么帮助你完成的？"
- ✅ "发生了什么让你没能开始？"
- ✅ "如果重来一次，你会怎么安排？"

### Adaptive Intensity

ClawBoss adjusts its coaching style based on your momentum:

**High Momentum** (5+ consecutive days):
```
"状态爆表！准备好更大的挑战了吗？"
```

**Medium Momentum** (steady progress):
```
"继续保持！今天的重点是？"
```

**Low Momentum** (struggling):
```
"最近有点难？我们聊聊。先从一个 10 分钟的小任务开始好吗？"
```

**Crisis** (7+ days stuck):
```
"看起来这阵子很艰难。想暂停聊聊发生了什么吗？
有时候'放弃'不是失败，是重新选择。"
```

### Automatic Check-ins

ClawBoss uses OpenClaw's heartbeat system for proactive support:

- **Morning (09:00):** Review today's plan, set intention
- **Evening (20:00):** Progress review with coaching questions
- **Weekly (Sunday):** Deep reflection and next week planning

### Pattern Recognition

ClawBoss tracks and learns:
- Your most productive times
- Common blockers
- Success patterns
- Best strategies for you

Stores insights in `memory/clawboss-state.json` for personalized coaching.

---

## 📊 Data & Privacy

### Local Storage

All your data stays on your machine:
- `~/.openclaw/workspace/memory/clawboss-state.json` - State tracking
- `~/.openclaw/workspace/memory/tasks/` - Individual goal files

### No Cloud Sync

- ✅ You own your data
- ✅ No external services
- ✅ Complete privacy
- ✅ Works offline

---

## 🎨 Example Workflows

### Starting a New Project

```
You: "我想学习 Python"

ClawBoss: [Guides through GROW]
→ Why important? (Career growth)
→ Current level? (Complete beginner)
→ Resources? (Coursera, time after work)
→ First step? (30 min daily practice)

ClawBoss: [Creates task file with:
- Daily practice plan
- Weekly milestones
- Success metrics
- Progress tracking]
```

### Daily Check-in

```
[Evening heartbeat]

ClawBoss: "今天计划的 3 个番茄钟，你完成了 1 个。
发生了什么让你只做了 1 个？"

You: "下午突然来了个会，占了 2 小时"

ClawBoss: "会议是意外情况。明天想尝试什么不同的做法？"

You: "早上先完成重要任务，下午应对会议"

ClawBoss: "很好的策略！我记下了：早起优先完成核心任务。
明天我们试试这个。"
[Updates insights: "早起优先核心任务" → success pattern]
```

### Weekly Reflection

```
[Sunday evening]

ClawBoss: "一周结束了，我们来回顾一下吧。

这周你最骄傲的进展是什么？"

You: "完成了论文的第一章框架"

ClawBoss: "太棒了！是什么帮助你做到的？"

You: "早上关掉手机专注 2 小时"

ClawBoss: "这个策略很有效。我注意到你已经 3 次提到'早上专注'了。
这可能是你的最佳工作时段。

下周想继续这个节奏，还是尝试新的？"
```

---

## 🔧 Advanced Configuration

### Adjusting Check-in Frequency

Edit `~/.openclaw/workspace/memory/clawboss-state.json`:

```json
{
  "user": {
    "preferences": {
      "checkInFrequency": "3x-daily",  // 1x, 2x, 3x
      "coachingStyle": "intense",      // gentle, balanced, intense
      "enableWeeklyReview": true
    },
    "workingHours": {
      "start": "08:00",
      "end": "23:00"
    }
  }
}
```

### Custom Working Hours

ClawBoss respects your schedule. Update `workingHours` to avoid check-ins during rest time.

---

## 🆚 Comparison

### vs AI Girlfriend (like clawra)
- **Clawra:** Emotional companionship + selfies
- **ClawBoss:** Productivity + execution + accountability

### vs Traditional Task Managers (Notion, Todoist)
- **Traditional:** Passive, you have to open them
- **ClawBoss:** Proactive, comes to you with coaching

### vs Pure AI Assistants
- **AI Assistant:** Answers questions
- **ClawBoss:** Guides you with proven coaching frameworks

---

## 🤝 Contributing

We welcome contributions! Areas we're exploring:

- [ ] Pomodoro timer integration
- [ ] Habit tracking visualization
- [ ] Team goal coordination
- [ ] Export/backup utilities
- [ ] Mobile notifications via nodes

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📚 Learn More

- **Coaching Guide:** [docs/coaching-guide.md](docs/coaching-guide.md)
- **GROW Model:** [What is GROW?](https://en.wikipedia.org/wiki/GROW_model)
- **OpenClaw Docs:** [docs.openclaw.ai](https://docs.openclaw.ai)

---

## 📄 License

MIT - See [LICENSE](LICENSE) for details

---

## 🙏 Acknowledgments

- [OpenClaw](https://github.com/openclaw/openclaw) - The amazing AI assistant framework
- [Clawra](https://github.com/SumeLabs/clawra) - Inspiration for the packaging approach
- GROW Model - From Sir John Whitmore's coaching framework

---

## 💬 Community

- Discord: [OpenClaw Community](https://discord.com/invite/clawd)
- Twitter: [@clawboss](#) (coming soon)
- Issues: [GitHub Issues](https://github.com/Paitesanshi/ClawBoss/issues)

---

**You are the boss of you.**
