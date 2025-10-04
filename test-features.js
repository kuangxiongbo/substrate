/**
 * 新功能自动化测试脚本
 * 测试基础底座框架重构后的新功能
 */

const puppeteer = require('puppeteer');

class FeatureTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async init() {
    console.log('🚀 启动测试环境...');
    this.browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { width: 1280, height: 720 }
    });
    this.page = await this.browser.newPage();
    
    // 设置超时时间
    this.page.setDefaultTimeout(10000);
    
    console.log('✅ 测试环境启动完成');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async test(name, testFn) {
    console.log(`\n🧪 测试: ${name}`);
    try {
      await testFn();
      this.testResults.passed++;
      console.log(`✅ 通过: ${name}`);
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push({ name, error: error.message });
      console.log(`❌ 失败: ${name} - ${error.message}`);
    }
  }

  async loginAsSuperAdmin() {
    await this.page.goto('http://localhost:3000/login');
    
    // 等待页面加载
    await this.page.waitForSelector('input[type="email"]');
    
    // 输入超级管理员邮箱
    await this.page.type('input[type="email"]', 'demo@example.com');
    await this.page.type('input[type="password"]', 'password123');
    
    // 点击登录按钮
    await this.page.click('button[type="submit"]');
    
    // 等待跳转到概览页面
    await this.page.waitForNavigation();
    console.log('✅ 超级管理员登录成功');
  }

  async loginAsRegularUser() {
    await this.page.goto('http://localhost:3000/login');
    
    // 等待页面加载
    await this.page.waitForSelector('input[type="email"]');
    
    // 输入普通用户邮箱
    await this.page.type('input[type="email"]', 'user@example.com');
    await this.page.type('input[type="password"]', 'password123');
    
    // 点击登录按钮
    await this.page.click('button[type="submit"]');
    
    // 等待跳转到概览页面
    await this.page.waitForNavigation();
    console.log('✅ 普通用户登录成功');
  }

  async runAllTests() {
    console.log('🎯 开始执行新功能测试...\n');

    // 测试1: 超级管理员权限控制
    await this.test('超级管理员系统设置图标显示', async () => {
      await this.loginAsSuperAdmin();
      
      // 检查系统设置图标是否存在
      const settingsIcon = await this.page.$('[title="系统设置"]');
      if (!settingsIcon) {
        throw new Error('系统设置图标未找到');
      }
      
      // 检查图标是否可见
      const isVisible = await settingsIcon.isVisible();
      if (!isVisible) {
        throw new Error('系统设置图标不可见');
      }
    });

    // 测试2: 普通用户权限控制
    await this.test('普通用户系统设置图标隐藏', async () => {
      await this.loginAsRegularUser();
      
      // 检查系统设置图标是否不存在或不可见
      const settingsIcon = await this.page.$('[title="系统设置"]');
      if (settingsIcon) {
        const isVisible = await settingsIcon.isVisible();
        if (isVisible) {
          throw new Error('普通用户不应该看到系统设置图标');
        }
      }
    });

    // 测试3: 系统设置Tab页面
    await this.test('系统设置Tab页面功能', async () => {
      await this.loginAsSuperAdmin();
      
      // 点击系统设置图标
      await this.page.click('[title="系统设置"]');
      
      // 等待页面加载
      await this.page.waitForSelector('.ant-tabs');
      
      // 检查Tab数量
      const tabs = await this.page.$$('.ant-tabs-tab');
      if (tabs.length !== 6) {
        throw new Error(`期望6个Tab，实际找到${tabs.length}个`);
      }
      
      // 检查Tab内容
      const expectedTabs = ['基础配置', '管理员管理', '安全配置', '邮箱配置', '布局配置', '样式监控'];
      for (const tabText of expectedTabs) {
        const tab = await this.page.$x(`//span[contains(text(), '${tabText}')]`);
        if (tab.length === 0) {
          throw new Error(`未找到Tab: ${tabText}`);
        }
      }
    });

    // 测试4: 操作日志功能
    await this.test('操作日志页面功能', async () => {
      await this.loginAsSuperAdmin();
      
      // 点击操作日志图标
      const logsIcon = await this.page.$('[title="操作日志"]');
      if (!logsIcon) {
        throw new Error('操作日志图标未找到');
      }
      
      await logsIcon.click();
      
      // 等待页面加载
      await this.page.waitForSelector('.operation-logs-page');
      
      // 检查页面标题
      const title = await this.page.$eval('.logs-page-title', el => el.textContent);
      if (!title.includes('操作日志')) {
        throw new Error('操作日志页面标题不正确');
      }
      
      // 检查表格是否存在
      const table = await this.page.$('.ant-table');
      if (!table) {
        throw new Error('操作日志表格未找到');
      }
    });

    // 测试5: 菜单结构统一
    await this.test('菜单结构统一性', async () => {
      await this.loginAsSuperAdmin();
      
      // 检查顶部菜单项
      const menuItems = await this.page.$$eval('.top-menu .ant-menu-item', 
        items => items.map(item => item.textContent.trim())
      );
      
      const expectedMenuItems = ['概览', '用户管理'];
      if (menuItems.length !== expectedMenuItems.length) {
        throw new Error(`期望${expectedMenuItems.length}个菜单项，实际找到${menuItems.length}个`);
      }
      
      for (const expectedItem of expectedMenuItems) {
        if (!menuItems.includes(expectedItem)) {
          throw new Error(`菜单中缺少: ${expectedItem}`);
        }
      }
    });

    // 测试6: 图标位置验证
    await this.test('图标位置和顺序', async () => {
      await this.loginAsSuperAdmin();
      
      // 检查顶部右侧图标
      const headerRight = await this.page.$('.header-right');
      if (!headerRight) {
        throw new Error('顶部右侧区域未找到');
      }
      
      // 检查图标数量
      const icons = await headerRight.$$('button[title]');
      if (icons.length < 4) {
        throw new Error(`期望至少4个图标，实际找到${icons.length}个`);
      }
      
      // 检查特定图标
      const expectedIcons = ['快速设置', '操作日志', '通知', '系统设置'];
      for (const iconTitle of expectedIcons) {
        const icon = await this.page.$(`[title="${iconTitle}"]`);
        if (!icon) {
          throw new Error(`未找到图标: ${iconTitle}`);
        }
      }
    });

    // 输出测试结果
    this.printResults();
  }

  printResults() {
    console.log('\n📊 测试结果汇总:');
    console.log(`✅ 通过: ${this.testResults.passed}`);
    console.log(`❌ 失败: ${this.testResults.failed}`);
    console.log(`📈 成功率: ${((this.testResults.passed / (this.testResults.passed + this.testResults.failed)) * 100).toFixed(1)}%`);
    
    if (this.testResults.errors.length > 0) {
      console.log('\n❌ 失败详情:');
      this.testResults.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.name}: ${error.error}`);
      });
    }
    
    console.log('\n🎯 测试完成!');
  }
}

// 主函数
async function main() {
  const tester = new FeatureTester();
  
  try {
    await tester.init();
    await tester.runAllTests();
  } catch (error) {
    console.error('💥 测试执行失败:', error.message);
  } finally {
    await tester.cleanup();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = FeatureTester;
