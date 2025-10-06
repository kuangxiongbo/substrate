/**
 * ESLint 国际化规则插件
 * 基于 Spec-Kit 方法的 ESLint 国际化验证规则
 */

module.exports = {
  rules: {
    /**
     * 禁止硬编码用户可见文本
     */
    'no-hardcoded-text': {
      meta: {
        type: 'problem',
        docs: {
          description: '禁止硬编码用户可见文本，必须使用 t() 函数',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: 'code',
        schema: [
          {
            type: 'object',
            properties: {
              ignorePatterns: {
                type: 'array',
                items: {
                  type: 'string',
                },
                default: [],
              },
              technicalPatterns: {
                type: 'array',
                items: {
                  type: 'string',
                },
                default: [
                  '^[A-Z_]+$', // 常量
                  '^[a-z][a-zA-Z0-9]*$', // 变量名
                  '^https?://', // URL
                  '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', // 邮箱
                  '^\\d{4}-\\d{2}-\\d{2}$', // 日期格式
                  '^\\d+$', // 纯数字
                  '^[a-zA-Z0-9._-]+$', // 文件名
                ],
              },
              userVisiblePatterns: {
                type: 'array',
                items: {
                  type: 'string',
                },
                default: [
                  '[\u4e00-\u9fa5]', // 中文字符
                  '^(Loading|Save|Cancel|Confirm|Delete|Edit|Add|Search|Reset|Submit|Back|Next|Previous|Success|Error|Warning|Info|Yes|No|OK)$',
                ],
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          hardcodedText: '禁止硬编码用户可见文本 "{{text}}"，请使用 t(\'{{suggestion}}\') 替代',
          hardcodedString: '禁止硬编码字符串 "{{text}}"，请使用 t(\'{{suggestion}}\') 替代',
        },
      },
      create(context) {
        const options = context.options[0] || {};
        const ignorePatterns = options.ignorePatterns || [];
        const technicalPatterns = options.technicalPatterns || [];
        const userVisiblePatterns = options.userVisiblePatterns || [];

        /**
         * 检查是否为技术标识符
         */
        function isTechnicalText(text) {
          for (const pattern of technicalPatterns) {
            const regex = new RegExp(pattern);
            if (regex.test(text)) {
              return true;
            }
          }
          return false;
        }

        /**
         * 检查是否为用户可见文本
         */
        function isUserVisibleText(text) {
          // 排除技术标识符
          if (isTechnicalText(text)) {
            return false;
          }

          // 检查是否匹配用户可见模式
          for (const pattern of userVisiblePatterns) {
            const regex = new RegExp(pattern, 'i');
            if (regex.test(text)) {
              return true;
            }
          }

          return false;
        }

        /**
         * 检查是否在翻译函数调用中
         */
        function isInTranslationCall(node) {
          let parent = node.parent;
          while (parent) {
            if (parent.type === 'CallExpression' && 
                parent.callee && 
                parent.callee.name === 't') {
              return true;
            }
            parent = parent.parent;
          }
          return false;
        }

        /**
         * 生成翻译键建议
         */
        function generateTranslationKey(text) {
          const cleanText = text.replace(/[^\w\s]/g, '').toLowerCase();
          const words = cleanText.split(/\s+/).filter(word => word.length > 0);
          
          if (words.length === 1) {
            return `common.${words[0]}`;
          } else if (words.length === 2) {
            return `${words[0]}.${words[1]}`;
          } else {
            return `${words[0]}.${words.slice(1).join('_')}`;
          }
        }

        /**
         * 检查是否应该忽略
         */
        function shouldIgnore(text) {
          for (const pattern of ignorePatterns) {
            const regex = new RegExp(pattern);
            if (regex.test(text)) {
              return true;
            }
          }
          return false;
        }

        return {
          // 检测 JSX 文本节点
          JSXText(node) {
            const text = node.value.trim();
            
            if (text && 
                !shouldIgnore(text) && 
                isUserVisibleText(text)) {
              const suggestion = generateTranslationKey(text);
              
              context.report({
                node,
                messageId: 'hardcodedText',
                data: {
                  text,
                  suggestion,
                },
                fix(fixer) {
                  return fixer.replaceText(node, `{t('${suggestion}')}`);
                },
              });
            }
          },

          // 检测字符串字面量
          Literal(node) {
            if (typeof node.value === 'string' && 
                !shouldIgnore(node.value) && 
                isUserVisibleText(node.value) && 
                !isInTranslationCall(node)) {
              const suggestion = generateTranslationKey(node.value);
              
              context.report({
                node,
                messageId: 'hardcodedString',
                data: {
                  text: node.value,
                  suggestion,
                },
                fix(fixer) {
                  return fixer.replaceText(node, `t('${suggestion}')`);
                },
              });
            }
          },
        };
      },
    },

    /**
     * 要求使用翻译键
     */
    'require-translation-key': {
      meta: {
        type: 'problem',
        docs: {
          description: '要求使用有效的翻译键格式',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: 'code',
        schema: [
          {
            type: 'object',
            properties: {
              keyPattern: {
                type: 'string',
                default: '^[a-zA-Z][a-zA-Z0-9]*(\\.[a-zA-Z][a-zA-Z0-9]*)*$',
              },
              requiredCategories: {
                type: 'array',
                items: {
                  type: 'string',
                },
                default: ['common'],
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          invalidKey: '翻译键格式无效 "{{key}}"，应使用层级格式如 category.subcategory.key',
          missingCategory: '翻译键缺少必需类别 "{{key}}"，应包含以下类别之一: {{categories}}',
        },
      },
      create(context) {
        const options = context.options[0] || {};
        const keyPattern = new RegExp(options.keyPattern || '^[a-zA-Z][a-zA-Z0-9]*(\\.[a-zA-Z][a-zA-Z0-9]*)*$');
        const requiredCategories = options.requiredCategories || ['common'];

        return {
          CallExpression(node) {
            if (node.callee && 
                node.callee.name === 't' && 
                node.arguments.length > 0 && 
                node.arguments[0].type === 'Literal' && 
                typeof node.arguments[0].value === 'string') {
              
              const key = node.arguments[0].value;
              
              // 验证翻译键格式
              if (!keyPattern.test(key)) {
                context.report({
                  node: node.arguments[0],
                  messageId: 'invalidKey',
                  data: {
                    key,
                  },
                });
                return;
              }

              // 验证必需类别
              const category = key.split('.')[0];
              if (!requiredCategories.includes(category)) {
                context.report({
                  node: node.arguments[0],
                  messageId: 'missingCategory',
                  data: {
                    key,
                    categories: requiredCategories.join(', '),
                  },
                });
              }
            }
          },
        };
      },
    },

    /**
     * 验证翻译键结构
     */
    'validate-translation-structure': {
      meta: {
        type: 'problem',
        docs: {
          description: '验证翻译键结构是否符合规范',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: null,
        schema: [
          {
            type: 'object',
            properties: {
              maxDepth: {
                type: 'number',
                default: 3,
              },
              minDepth: {
                type: 'number',
                default: 1,
              },
              allowedCategories: {
                type: 'array',
                items: {
                  type: 'string',
                },
                default: ['common', 'navigation', 'validation', 'error', 'user', 'admin', 'system'],
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          tooDeep: '翻译键层级过深 "{{key}}"，最大深度为 {{maxDepth}}',
          tooShallow: '翻译键层级过浅 "{{key}}"，最小深度为 {{minDepth}}',
          invalidCategory: '翻译键类别无效 "{{category}}"，允许的类别: {{categories}}',
        },
      },
      create(context) {
        const options = context.options[0] || {};
        const maxDepth = options.maxDepth || 3;
        const minDepth = options.minDepth || 1;
        const allowedCategories = options.allowedCategories || ['common', 'navigation', 'validation', 'error', 'user', 'admin', 'system'];

        return {
          CallExpression(node) {
            if (node.callee && 
                node.callee.name === 't' && 
                node.arguments.length > 0 && 
                node.arguments[0].type === 'Literal' && 
                typeof node.arguments[0].value === 'string') {
              
              const key = node.arguments[0].value;
              const parts = key.split('.');
              const depth = parts.length;
              const category = parts[0];

              // 验证深度
              if (depth > maxDepth) {
                context.report({
                  node: node.arguments[0],
                  messageId: 'tooDeep',
                  data: {
                    key,
                    maxDepth,
                  },
                });
              }

              if (depth < minDepth) {
                context.report({
                  node: node.arguments[0],
                  messageId: 'tooShallow',
                  data: {
                    key,
                    minDepth,
                  },
                });
              }

              // 验证类别
              if (!allowedCategories.includes(category)) {
                context.report({
                  node: node.arguments[0],
                  messageId: 'invalidCategory',
                  data: {
                    category,
                    categories: allowedCategories.join(', '),
                  },
                });
              }
            }
          },
        };
      },
    },
  },
};



