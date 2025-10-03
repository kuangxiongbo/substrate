/**
 * 菜单样式变体系统
 * 支持浅色和深色菜单样式，可通过主题控制
 */

/**
 * 菜单变体类型
 */
export type MenuVariant = 'light' | 'dark';

/**
 * 菜单配置接口
 */
export interface MenuConfig {
  // 侧边栏背景
  siderBg: string;
  siderColor: string;
  
  // 触发器配置
  triggerBg: string;
  triggerColor: string;
  
  // 菜单项配置
  itemBg: string;
  itemSelectedBg: string;
  itemHoverBg: string;
  itemColor: string;
  itemSelectedColor: string;
  itemHoverColor: string;
  itemActiveBg: string;
  itemActiveColor: string;
  itemDisabledColor: string;
  
  // 子菜单配置
  subMenuItemBg: string;
  groupTitleColor: string;
  
  // 图标配置
  iconSize: number;
  collapsedIconSize: number;
  collapsedWidth: number;
}

/**
 * 浅色菜单配置
 */
export const lightMenuConfig: MenuConfig = {
  // 侧边栏配置
  siderBg: '#ffffff',
  siderColor: '#1f1f1f',
  
  // 触发器配置
  triggerBg: '#f5f5f5',
  triggerColor: '#1f1f1f',
  
  // 菜单项配置
  itemBg: 'transparent',
  itemSelectedBg: '#e6f7ff', // 浅蓝色选中背景
  itemHoverBg: '#f5f5f5', // 浅灰色悬停背景
  itemColor: '#1f1f1f', // 深色文本，确保对比度
  itemSelectedColor: '#1890ff', // 蓝色选中文本
  itemHoverColor: '#1890ff', // 蓝色悬停文本
  itemActiveBg: '#e6f7ff', // 浅蓝色激活背景
  itemActiveColor: '#1890ff', // 蓝色激活文本
  itemDisabledColor: '#bfbfbf', // 灰色禁用文本
  
  // 子菜单配置
  subMenuItemBg: 'transparent',
  groupTitleColor: '#595959', // 深灰色分组标题
  
  // 图标配置
  iconSize: 14,
  collapsedIconSize: 16,
  collapsedWidth: 80,
};

/**
 * 深色菜单配置
 */
export const darkMenuConfig: MenuConfig = {
  // 侧边栏配置
  siderBg: '#001529',
  siderColor: 'rgba(255, 255, 255, 0.95)',
  
  // 触发器配置
  triggerBg: '#002140',
  triggerColor: '#ffffff',
  
  // 菜单项配置
  itemBg: 'transparent',
  itemSelectedBg: '#1890ff',
  itemHoverBg: 'rgba(24, 144, 255, 0.15)', // 提高悬停背景对比度
  itemColor: 'rgba(255, 255, 255, 0.95)', // 提高菜单项文本对比度
  itemSelectedColor: '#ffffff',
  itemHoverColor: '#ffffff',
  itemActiveBg: 'rgba(24, 144, 255, 0.25)', // 提高激活背景对比度
  itemActiveColor: '#ffffff',
  itemDisabledColor: 'rgba(255, 255, 255, 0.4)', // 提高禁用文本对比度
  
  // 子菜单配置
  subMenuItemBg: 'transparent',
  groupTitleColor: 'rgba(255, 255, 255, 0.6)', // 提高分组标题对比度
  
  // 图标配置
  iconSize: 14,
  collapsedIconSize: 16,
  collapsedWidth: 80,
};

/**
 * 获取菜单配置
 */
export function getMenuConfig(variant: MenuVariant): MenuConfig {
  switch (variant) {
    case 'light':
      return lightMenuConfig;
    case 'dark':
      return darkMenuConfig;
    default:
      return lightMenuConfig;
  }
}

/**
 * 生成菜单样式变体
 */
export function generateMenuVariant(variant: MenuVariant) {
  const config = getMenuConfig(variant);
  
  return {
    // 布局组件配置
    Layout: {
      siderBg: config.siderBg,
      siderColor: config.siderColor,
      triggerBg: config.triggerBg,
      triggerColor: config.triggerColor,
    },
    
    // 菜单组件配置
    Menu: {
      itemBg: config.itemBg,
      itemSelectedBg: config.itemSelectedBg,
      itemHoverBg: config.itemHoverBg,
      itemColor: config.itemColor,
      itemSelectedColor: config.itemSelectedColor,
      itemHoverColor: config.itemHoverColor,
      itemActiveBg: config.itemActiveBg,
      itemActiveColor: config.itemActiveColor,
      itemDisabledColor: config.itemDisabledColor,
      subMenuItemBg: config.subMenuItemBg,
      groupTitleColor: config.groupTitleColor,
      iconSize: config.iconSize,
      collapsedIconSize: config.collapsedIconSize,
      collapsedWidth: config.collapsedWidth,
    },
  };
}

/**
 * 菜单变体管理器
 */
export class MenuVariantManager {
  private static instance: MenuVariantManager;
  private currentVariant: MenuVariant = 'light';
  
  public static getInstance(): MenuVariantManager {
    if (!MenuVariantManager.instance) {
      MenuVariantManager.instance = new MenuVariantManager();
    }
    return MenuVariantManager.instance;
  }
  
  /**
   * 设置菜单变体
   */
  public setVariant(variant: MenuVariant): void {
    this.currentVariant = variant;
    // 可以在这里添加样式应用逻辑
    console.log(`Menu variant changed to: ${variant}`);
  }
  
  /**
   * 获取当前菜单变体
   */
  public getVariant(): MenuVariant {
    return this.currentVariant;
  }
  
  /**
   * 获取当前菜单配置
   */
  public getCurrentConfig(): MenuConfig {
    return getMenuConfig(this.currentVariant);
  }
  
  /**
   * 切换菜单变体
   */
  public toggleVariant(): MenuVariant {
    const newVariant = this.currentVariant === 'light' ? 'dark' : 'light';
    this.setVariant(newVariant);
    return newVariant;
  }
}

// 导出单例实例
export const menuVariantManager = MenuVariantManager.getInstance();
