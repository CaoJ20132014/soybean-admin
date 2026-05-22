# AI知识周学习自动化任务

## 功能说明

每周自动学习一个AI相关知识点，生成markdown格式的学习笔记，并推送到飞书webhook。

## 包含的AI知识点

1. **Transformer架构** - 现代大模型的基础架构
2. **大语言模型（LLM）** - GPT、BERT等大模型的核心概念
3. **RAG（检索增强生成）** - 结合检索和生成的AI技术
4. **Prompt Engineering（提示工程）** - 优化提示词的技术
5. **AI Agent（智能体）** - 自主感知和执行的智能系统
6. **多模态AI** - 处理多种数据类型的AI系统
7. **模型微调** - 定制化AI模型的技术
8. **向量数据库** - RAG系统的核心基础设施
9. **AI安全与伦理** - AI发展的安全保障
10. **AI开发框架** - LangChain、LlamaIndex等开发工具

## 使用方法

### 手动执行

```bash
# 使用 Node.js 执行
npx tsx scripts/ai-weekly-learning.ts

# 或者编译后执行
npx tsc scripts/ai-weekly-learning.ts --outDir dist/scripts
node dist/scripts/ai-weekly-learning.js
```

### 配置定时任务

#### Linux/macOS (使用 crontab)

```bash
# 编辑 crontab
crontab -e

# 添加以下配置（每周五晚上7点执行）
0 19 * * 5 cd /workspace && npx tsx scripts/ai-weekly-learning.ts >> /var/log/ai-learning.log 2>&1
```

#### Windows (使用任务计划程序)

1. 打开"任务计划程序"
2. 创建基本任务
3. 设置触发器：每周五 19:00
4. 设置操作：启动程序
   - 程序：`node`
   - 参数：`scripts/ai-weekly-learning.js`
   - 起始位置：`/workspace`

## 飞书Webhook配置

当前使用的webhook地址：
```
https://open.feishu.cn/open-apis/bot/v2/hook/46ff821b-6891-4dec-8a86-e39b1c692457
```

如需修改，请编辑脚本中的 `FEISHU_WEBHOOK_URL` 常量。

## 输出示例

每次执行会生成类似以下格式的学习笔记：

```markdown
# 📚 AI知识周学习

**日期：** 2026年5月22日 星期四

---

## Transformer架构

Transformer是一种基于自注意力机制的神经网络架构...

---

### 🎯 核心要点

1. 自注意力机制（Self-Attention）...
2. 多头注意力...

---

### 💡 应用场景

- GPT系列：文本生成、对话系统...
- BERT：文本理解、情感分析...
```

## 依赖要求

- Node.js >= 16.0.0
- TypeScript 或 tsx

## 自定义扩展

### 添加新的知识点

在脚本的 `AI_TOPICS` 数组中添加新的知识点对象：

```typescript
{
  name: '新知识点名称',
  description: '知识点描述',
  keyPoints: [
    '要点1',
    '要点2',
    // ...
  ],
  applications: [
    '应用场景1',
    '应用场景2',
    // ...
  ]
}
```

### 修改推送格式

修改 `generateMarkdownContent` 函数可以自定义markdown格式。

修改 `sendToFeishu` 函数可以调整飞书消息格式（支持富文本、卡片等）。

## 故障排查

### 推送失败

1. 检查网络连接
2. 验证webhook地址是否正确
3. 查看飞书机器人是否被禁用

### 脚本执行失败

1. 确认Node.js版本 >= 16
2. 检查依赖是否安装完整
3. 查看错误日志

## 许可证

Copyright (C) 2026 杭州领翼信息技术有限公司. All rights reserved.
