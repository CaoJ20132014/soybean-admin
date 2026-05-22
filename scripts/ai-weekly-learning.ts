/**
 * @Author       : CaoJ2020 CaoJian20132014@163.com
 * @Date         : 2026-05-22 10:00:00 星期四
 * @LastEditors  : CaoJ2020 CaoJian20132014@163.com
 * @LastEditTime : 2026-05-22 10:00:00 星期四
 * @FilePath     : scripts/ai-weekly-learning.ts
 * @Description  : AI知识周学习脚本-学习AI知识并推送到飞书webhook
 * Copyright (C) 2026 杭州领翼信息技术有限公司. All rights reserved.
 */

const FEISHU_WEBHOOK_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/46ff821b-6891-4dec-8a86-e39b1c692457';

const AI_TOPICS = [
  {
    name: 'Transformer架构',
    description: 'Transformer是一种基于自注意力机制的神经网络架构，由Google在2017年提出。它彻底改变了自然语言处理领域，成为GPT、BERT等大模型的基础架构。',
    keyPoints: [
      '自注意力机制（Self-Attention）：让模型在处理序列时能够关注到序列中的所有位置',
      '多头注意力（Multi-Head Attention）：并行计算多个注意力表示，捕获不同的依赖关系',
      '位置编码（Positional Encoding）：为序列中的每个位置添加位置信息',
      '前馈神经网络（Feed Forward Network）：对注意力输出进行非线性变换',
      '层归一化（Layer Normalization）：稳定训练过程，加速收敛'
    ],
    applications: [
      'GPT系列：文本生成、对话系统、代码生成',
      'BERT：文本理解、情感分析、问答系统',
      'Vision Transformer：图像分类、目标检测',
      '多模态模型：图文理解、视频分析'
    ]
  },
  {
    name: '大语言模型（LLM）',
    description: '大语言模型是基于Transformer架构的超大规模神经网络，通过海量文本数据训练，具备强大的语言理解和生成能力。',
    keyPoints: [
      '涌现能力（Emergent Abilities）：模型规模达到一定程度后出现的新能力',
      '上下文学习（In-Context Learning）：无需微调即可完成新任务',
      '思维链（Chain-of-Thought）：通过逐步推理提高复杂任务的准确性',
      '指令微调（Instruction Tuning）：通过指令数据提升模型遵循指令的能力',
      'RLHF：基于人类反馈的强化学习，对齐模型输出与人类价值观'
    ],
    applications: [
      '智能助手：ChatGPT、Claude、文心一言',
      '代码生成：GitHub Copilot、Cursor',
      '内容创作：文章写作、营销文案',
      '知识问答：企业知识库、智能客服'
    ]
  },
  {
    name: 'RAG（检索增强生成）',
    description: 'RAG是一种结合检索和生成的AI技术，通过检索外部知识库来增强大模型的生成能力，提高回答的准确性和可靠性。',
    keyPoints: [
      '文档切分：将长文档分割成适合检索的片段',
      '向量化：使用Embedding模型将文本转换为向量表示',
      '向量数据库：存储和检索向量，如Pinecone、Milvus、Chroma',
      '相似度检索：根据查询向量找到最相关的文档片段',
      '上下文注入：将检索结果作为上下文提供给大模型'
    ],
    applications: [
      '企业知识库：内部文档问答系统',
      '智能客服：基于产品文档的自动回复',
      '法律助手：法规条文检索与分析',
      '医疗问答：医学文献检索与诊断建议'
    ]
  },
  {
    name: 'Prompt Engineering（提示工程）',
    description: '提示工程是设计和优化输入提示词的技术，旨在引导大模型生成更准确、更符合预期的输出。',
    keyPoints: [
      '角色设定：为AI指定特定角色，如"你是一位资深程序员"',
      '任务分解：将复杂任务拆分为多个简单步骤',
      '少样本学习（Few-Shot）：提供示例帮助模型理解任务',
      '输出格式控制：明确指定输出的格式和结构',
      '迭代优化：根据输出结果不断调整提示词'
    ],
    applications: [
      '内容生成：文章、报告、邮件撰写',
      '数据分析：数据清洗、报告生成',
      '代码开发：代码生成、代码审查',
      '教育辅导：题目讲解、学习计划制定'
    ]
  },
  {
    name: 'AI Agent（智能体）',
    description: 'AI Agent是能够自主感知环境、做出决策并执行行动的智能系统。它结合了大模型的推理能力和外部工具的执行能力。',
    keyPoints: [
      '感知能力：理解用户意图和环境信息',
      '推理能力：基于大模型进行逻辑推理和决策',
      '工具使用：调用API、数据库、搜索引擎等外部工具',
      '记忆机制：短期记忆和长期记忆，保持上下文连贯',
      '规划能力：将复杂任务分解为可执行的子任务'
    ],
    applications: [
      '自动化工作流：自动执行多步骤任务',
      '智能助手：个人助理、日程管理',
      '代码Agent：自动编写、测试、部署代码',
      '研究助手：文献检索、数据分析、报告生成'
    ]
  },
  {
    name: '多模态AI',
    description: '多模态AI能够同时处理和理解多种类型的数据，包括文本、图像、音频、视频等，实现跨模态的理解和生成。',
    keyPoints: [
      '模态编码器：将不同模态的数据转换为统一的向量表示',
      '跨模态对齐：学习不同模态之间的对应关系',
      '融合策略：如何有效融合多模态信息',
      '统一架构：一个模型处理多种模态，如GPT-4V',
      '模态生成：根据一种模态生成另一种模态的内容'
    ],
    applications: [
      '图文理解：图像描述、视觉问答',
      '视频分析：视频内容理解、视频生成',
      '语音处理：语音识别、语音合成、语音翻译',
      '跨模态创作：文生图、图生文、视频生成'
    ]
  },
  {
    name: '模型微调（Fine-tuning）',
    description: '模型微调是在预训练模型基础上，使用特定领域的数据进行进一步训练，使模型适应特定任务或领域。',
    keyPoints: [
      '全参数微调：更新模型所有参数，效果最好但成本高',
      '参数高效微调（PEFT）：只更新少量参数，如LoRA、AdaLoRA',
      '指令微调：使用指令数据提升模型遵循指令的能力',
      '领域微调：使用领域数据使模型专业化',
      '微调数据准备：数据清洗、格式化、质量控制'
    ],
    applications: [
      '垂直领域模型：医疗、法律、金融等专业模型',
      '企业定制模型：基于企业数据的专属模型',
      '任务特定模型：代码生成、数学推理等',
      '风格迁移：使模型输出符合特定风格'
    ]
  },
  {
    name: '向量数据库',
    description: '向量数据库是专门用于存储和检索高维向量的数据库，是构建RAG系统和语义搜索的核心基础设施。',
    keyPoints: [
      '向量索引：使用HNSW、IVF等算法加速相似度检索',
      '相似度度量：余弦相似度、欧氏距离、点积等',
      '元数据过滤：结合向量检索和属性过滤',
      '分布式架构：支持水平扩展，处理海量数据',
      '混合检索：结合关键词检索和向量检索'
    ],
    applications: [
      '语义搜索：基于语义理解而非关键词匹配',
      '推荐系统：相似内容推荐',
      'RAG系统：检索相关文档增强大模型',
      '去重检测：识别相似内容'
    ]
  },
  {
    name: 'AI安全与伦理',
    description: 'AI安全与伦理关注AI系统的安全性、可控性和社会影响，确保AI技术的发展符合人类价值观和社会利益。',
    keyPoints: [
      '对齐问题：确保AI目标与人类价值观一致',
      '幻觉问题：模型生成虚假信息的风险及应对',
      '偏见与公平性：识别和减少模型中的偏见',
      '隐私保护：训练数据中的隐私泄露风险',
      '可解释性：理解模型决策过程，提高透明度'
    ],
    applications: [
      '内容审核：识别和过滤有害内容',
      '安全评估：评估模型的安全风险',
      '合规审计：确保AI系统符合法规要求',
      '伦理审查：评估AI应用的社会影响'
    ]
  },
  {
    name: 'AI开发框架',
    description: 'AI开发框架提供了构建AI应用的工具和基础设施，简化了从模型调用到应用部署的整个流程。',
    keyPoints: [
      'LangChain：构建LLM应用的主流框架，支持链式调用',
      'LlamaIndex：专注于数据索引和检索的框架',
      'Hugging Face：模型托管和推理平台',
      'vLLM：高性能大模型推理引擎',
      'Ollama：本地运行开源大模型的工具'
    ],
    applications: [
      '快速原型开发：快速构建AI应用原型',
      '生产部署：将AI应用部署到生产环境',
      '模型管理：管理和版本控制AI模型',
      '性能优化：优化推理速度和资源使用'
    ]
  }
];

function getRandomTopic() {
  const index = Math.floor(Math.random() * AI_TOPICS.length);
  return AI_TOPICS[index];
}

function generateMarkdownContent(topic: typeof AI_TOPICS[0]) {
  const date = new Date();
  const dateStr = date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });

  return `# 📚 AI知识周学习

**日期：** ${dateStr}

---

## ${topic.name}

${topic.description}

---

### 🎯 核心要点

${topic.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

---

### 💡 应用场景

${topic.applications.map(app => `- ${app}`).join('\n')}

---

### 📖 延伸阅读

- 建议深入了解相关论文和技术博客
- 尝试在实际项目中应用所学知识
- 关注该领域的最新进展和突破

---

> 💪 每周学习一点点，AI技能稳步提升！

*由自动化脚本生成并推送到飞书*`;
}

async function sendToFeishu(content: string) {
  const response = await fetch(FEISHU_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      msg_type: 'text',
      content: {
        text: content
      }
    })
  });

  if (!response.ok) {
    throw new Error(`飞书推送失败: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  try {
    console.log('开始执行AI知识周学习任务...');
    
    const topic = getRandomTopic();
    console.log(`本次学习主题: ${topic.name}`);
    
    const markdownContent = generateMarkdownContent(topic);
    console.log('已生成学习内容');
    
    await sendToFeishu(markdownContent);
    console.log('✅ 成功推送到飞书webhook');
    
  } catch (error) {
    console.error('❌ 执行失败:', error);
    process.exit(1);
  }
}

main();
