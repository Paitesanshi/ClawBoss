# ClawBoss 使用指南

## 快速开始

### 安装

```bash
npx clawboss@latest
```

安装完成后，重启 OpenClaw：

```bash
openclaw gateway restart
```

---

## 基础使用

### 1. 设定第一个目标

直接在 OpenClaw 中说：

```
帮我设定一个目标
```

或者更具体的：

```
我想完成论文初稿
```

ClawBoss 会启动 GROW 引导流程：

```
ClawBoss: "很好！让我们从头开始。

为什么这个目标对你重要？达成后你的生活会有什么不同？"

你: "这是毕业的前提，完成后能专心找工作"

ClawBoss: "现在进展如何？是什么阻碍了你开始或继续？"

你: "已经读了一些文献，但还没开始写。主要是不知道从哪里开始"

ClawBoss: "如果时间和精力都不是问题，你会怎么做这件事？"

... [继续引导]
```

### 2. 每日检查

**无需手动触发** - ClawBoss 会自动在合适的时间检查：

**早上 (09:00-10:00):**
```
ClawBoss: "早上好！

今天的目标：
- 完成论文初稿

从哪个开始？"
```

**晚上 (19:00-21:00):**
```
ClawBoss: "今日回顾：

✅ 完成 1 个
   - 写完第一章框架

是什么帮助你完成的？"

你: "早上关掉手机专注了 2 小时"

ClawBoss: "很好的策略！我记下了：早起专注是你的有效模式。
明天继续这样做？"
```

### 3. 手动检查进度

任何时候都可以说：

```
检查一下我的进度
```

或

```
我的目标状态
```

### 4. 周回顾

每周日晚上，ClawBoss 会自动触发周回顾。

也可以手动触发：

```
本周回顾
```

ClawBoss 会分析你的模式并提出反思问题。

---

## 高级功能

### 自定义检查频率

编辑 `~/.openclaw/workspace/memory/clawboss-state.json`：

```json
{
  "user": {
    "preferences": {
      "checkInFrequency": "3x-daily",  // 1x, 2x, 3x
      "coachingStyle": "intense",      // gentle, balanced, intense
      "enableWeeklyReview": true
    }
  }
}
```

### 调整工作时间

避免在休息时间打扰：

```json
{
  "user": {
    "workingHours": {
      "start": "08:00",
      "end": "23:00"
    }
  }
}
```

### 暂停目标

```
暂停 [目标名称]
```

### 重新激活目标

```
继续 [目标名称]
```

---

## Coaching 风格示例

### 高动量状态（连续 5+ 天完成）

```
ClawBoss: "状态爆表啊！连续 7 天完成任务。

准备好接受更大的挑战了吗？要不要试试把目标提高 2 倍？"
```

### 低动量状态（3+ 天未完成）

```
ClawBoss: "最近有点难？我们聊聊。

是什么阻碍了你开始？

咱们先从一个 10 分钟的小任务开始好吗？重要的是保持节奏，而不是一次做很多。"
```

### 长期未进展（7+ 天）

```
ClawBoss: "好久不见！已经 10 天没有进展了。

生活可能有了新的优先级？还是遇到了什么困难？

没关系，我们慢慢来。

选项：
1. 调整现有目标（降低难度或改变方向）
2. 暂停目标，稍后再说
3. 设定新的更适合现在的目标

你觉得哪个合适？"
```

---

## 数据管理

### 查看所有目标

```
我的所有目标
```

### 查看任务文件

所有任务保存在：

```
~/.openclaw/workspace/memory/tasks/
```

每个目标一个 `.md` 文件，可以手动编辑。

### 查看状态

```
~/.openclaw/workspace/memory/clawboss-state.json
```

包含：
- 动量追踪
- 目标列表
- 检查时间戳
- 长期洞察

### 备份数据

```bash
# 备份所有 ClawBoss 数据
cp -r ~/.openclaw/workspace/memory ~/clawboss-backup-$(date +%Y%m%d)
```

### 重置 ClawBoss

```bash
# 删除状态（保留目标文件）
rm ~/.openclaw/workspace/memory/clawboss-state.json

# 完全重置
rm -rf ~/.openclaw/workspace/memory/tasks/
rm ~/.openclaw/workspace/memory/clawboss-state.json
```

---

## 常见问题

### Q: ClawBoss 没有自动检查？

**A:** 检查以下几点：
1. OpenClaw 是否在运行？`openclaw status`
2. HEARTBEAT.md 是否包含 ClawBoss 配置？
3. 检查时间是否在工作时间内？

### Q: 如何改变 Coaching 风格？

**A:** 编辑 `clawboss-state.json` 中的 `coachingStyle`：
- `gentle` - 温和，适合容易焦虑的人
- `balanced` - 平衡（默认）
- `intense` - 强度高，适合需要强推动力的人

### Q: 可以同时追踪多个目标吗？

**A:** 可以！但建议不超过 3 个高优先级目标。

ClawBoss 会提醒你：
```
"注意到你现在有 5 个高优先级目标。
从经验看，同时追太多兔子，一只都抓不到。
要不要一起看看，哪个是现在最重要的？"
```

### Q: ClawBoss 会保护我的隐私吗？

**A:** 是的！
- 所有数据本地存储
- 不上传到任何服务器
- 不需要外部 API
- 你完全拥有数据

### Q: 如何卸载？

```bash
# 1. 删除 skill
rm -rf ~/.openclaw/skills/clawboss

# 2. 从 SOUL.md 删除 ClawBoss 部分
# 3. 从 HEARTBEAT.md 删除 ClawBoss 部分

# 4. 重启 OpenClaw
openclaw gateway restart
```

---

## 最佳实践

### ✅ DO

1. **诚实回答问题** - ClawBoss 不会评判你
2. **记录反思** - 这是学习和改进的关键
3. **调整目标** - 目标不合适就改，别硬撑
4. **庆祝小胜利** - 每个进步都值得认可

### ❌ DON'T

1. **不要设太多目标** - 专注比分散好
2. **不要忽略 ClawBoss** - 持续互动才有效
3. **不要对自己太苛刻** - 失败是学习的一部分
4. **不要害怕暂停** - 有时休息比坚持更明智

---

## 进阶技巧

### 与番茄工作法结合

```
ClawBoss: "今天的首要任务：写论文第一章"

你: "我计划做 3 个番茄钟"

ClawBoss: "很好！专注 25 分钟，休息 5 分钟。
开始前关掉通知了吗？"

... [晚上检查]

ClawBoss: "计划 3 个番茄钟，实际完成了 2 个。
发生了什么？"

你: "第二个番茄钟时来了个电话"

ClawBoss: "意外打断。明天想尝试飞行模式吗？
或者把重要时段告诉周围的人？"
```

### 与日历同步

ClawBoss 可以考虑你的日程安排（如果你告诉它）：

```
你: "明天下午有 3 小时会议"

ClawBoss: "知道了。那早上的时间就更宝贵了。
想把重要任务安排在上午吗？"
```

### 团队协作

虽然 ClawBoss 主要是个人工具，但你可以：

```
- 与团队分享你的进展（手动）
- 用 ClawBoss 追踪个人在团队项目中的部分
- 导出周报给团队看
```

---

## 获取帮助

- **GitHub Issues:** [github.com/Paitesanshi/ClawBoss](https://github.com/Paitesanshi/ClawBoss)
- **OpenClaw Discord:** [discord.com/invite/clawd](https://discord.com/invite/clawd)
- **文档:** 查看 `~/.openclaw/skills/clawboss/SKILL.md`

---

**记住：ClawBoss 是你的教练，不是监工。目标是帮你成长，而不是让你焦虑。**

🎯 祝你达成目标！
