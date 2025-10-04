/**
 * 主题包核心类型定义
 * 基于 Spec-Kit 方法的可扩展主题架构
 */

import { theme } from 'antd';

// 主题包元数据
export interface ThemePackageMeta {
  id: string;
  name: string;
  displayName: string;
  description: string;
  version: string;
  author: string;
  tags: string[];
  category: 'light' | 'dark' | 'colorful' | 'minimal' | 'professional';
  preview: string;
  createdAt: string;
  updatedAt: string;
}

// 菜单变体类型
export type MenuVariant = 'light' | 'dark';

// 主题包配置接口
export interface ThemePackageConfig {
  meta: ThemePackageMeta;
  algorithm: any;
  token: ThemeToken;
  components: ThemeComponents;
  custom?: Record<string, any>;
  // 菜单变体配置
  menuVariant?: MenuVariant;
}

// 主题令牌接口
export interface ThemeToken {
  // 主色调
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;
  
  // 自定义颜色变量
  colorCustom1?: string;
  colorCustom2?: string;
  colorCustom3?: string;
  colorCustom4?: string;
  colorCustom5?: string;
  
  // 渐变背景
  gradientPrimary?: string;
  gradientSecondary?: string;
  gradientSuccess?: string;
  gradientWarning?: string;
  gradientError?: string;
  
  // 扩展的阴影效果
  boxShadowCustom1?: string;
  boxShadowCustom2?: string;
  boxShadowCustom3?: string;
  boxShadowInset?: string;
  boxShadowGlow?: string;
  
  // 扩展的圆角
  borderRadiusCustom1?: number;
  borderRadiusCustom2?: number;
  borderRadiusCustom3?: number;
  borderRadiusCustom4?: number;
  
  // 扩展的间距
  spacingCustom1?: number;
  spacingCustom2?: number;
  spacingCustom3?: number;
  spacingCustom4?: number;
  spacingCustom5?: number;
  spacingCustom6?: number;
  spacingCustom7?: number;
  spacingCustom8?: number;
  
  // 扩展的字体大小
  fontSizeCustom1?: number;
  fontSizeCustom2?: number;
  fontSizeCustom3?: number;
  fontSizeCustom4?: number;
  fontSizeCustom5?: number;
  fontSizeCustom6?: number;
  fontSizeCustom7?: number;
  fontSizeCustom8?: number;
  
  // 扩展的字体权重
  fontWeightLight?: number;
  fontWeightNormal?: number;
  fontWeightMedium?: number;
  fontWeightSemiBold?: number;
  fontWeightBold?: number;
  fontWeightExtraBold?: number;
  
  // 扩展的行高
  lineHeightCustom1?: number;
  lineHeightCustom2?: number;
  lineHeightCustom3?: number;
  lineHeightCustom4?: number;
  lineHeightCustom5?: number;
  lineHeightCustom6?: number;
  
  // 扩展的动画持续时间
  motionDurationCustom1?: string;
  motionDurationCustom2?: string;
  motionDurationCustom3?: string;
  motionDurationCustom4?: string;
  motionDurationCustom5?: string;
  motionDurationCustom6?: string;
  
  // 扩展的动画缓动函数
  motionEaseCustom1?: string;
  motionEaseCustom2?: string;
  motionEaseCustom3?: string;
  motionEaseCustom4?: string;
  motionEaseCustom5?: string;
  
  // 透明度控制
  opacityCustom1?: number;
  opacityCustom2?: number;
  opacityCustom3?: number;
  opacityCustom4?: number;
  opacityCustom5?: number;
  opacityCustom6?: number;
  opacityCustom7?: number;
  opacityCustom8?: number;
  opacityCustom9?: number;
  
  // 边框宽度
  lineWidthCustom1?: number;
  lineWidthCustom2?: number;
  lineWidthCustom3?: number;
  lineWidthCustom4?: number;
  lineWidthCustom5?: number;
  
  // Z-index 层级
  zIndexCustom1?: number;
  zIndexCustom2?: number;
  zIndexCustom3?: number;
  zIndexCustom4?: number;
  zIndexCustom5?: number;
  
  // 布局样式配置
  layoutSidebarWidth?: number;
  layoutSidebarCollapsedWidth?: number;
  layoutSidebarHeaderHeight?: number;
  layoutSidebarBackgroundColor?: string;
  layoutSidebarBorderColor?: string;
  layoutSidebarShadowColor?: string;
  layoutTopMenuHeight?: number;
  layoutTopMenuBackgroundColor?: string;
  layoutTopMenuBorderColor?: string;
  layoutTopMenuShadowColor?: string;
  layoutContentBackgroundColor?: string;
  layoutContentPadding?: number;
  layoutContentMargin?: number;
  
  // Logo样式配置
  logoBackgroundColor?: string;
  logoTextColor?: string;
  logoIconColor?: string;
  logoFontSize?: number;
  logoFontWeight?: number;
  logoBorderRadius?: number;
  
  // 菜单样式配置
  menuBackgroundColor?: string;
  menuItemColor?: string;
  menuItemHoverColor?: string;
  menuItemSelectedColor?: string;
  menuItemBackgroundColor?: string;
  menuItemHoverBackgroundColor?: string;
  menuItemSelectedBackgroundColor?: string;
  menuIconColor?: string;
  menuIconHoverColor?: string;
  menuIconSelectedColor?: string;
  menuBorderColor?: string;
  menuBorderRadius?: number;
  menuFontSize?: number;
  menuFontWeight?: number;
  menuPadding?: number;
  menuMargin?: number;
  
  // 按钮样式配置
  buttonPrimaryColor?: string;
  buttonDefaultColor?: string;
  buttonTextColor?: string;
  buttonBackgroundColor?: string;
  buttonBorderColor?: string;
  buttonHoverColor?: string;
  buttonActiveColor?: string;
  buttonDisabledColor?: string;
  buttonBorderRadius?: number;
  buttonFontSize?: number;
  buttonFontWeight?: number;
  buttonPadding?: number;
  buttonMargin?: number;
  buttonShadow?: string;
  
  // 头部样式配置
  headerBackgroundColor?: string;
  headerHeight?: number;
  headerBorderColor?: string;
  headerShadowColor?: string;
  headerTextColor?: string;
  headerIconColor?: string;
  headerPadding?: number;
  
  // 卡片样式配置
  cardBackgroundColor?: string;
  cardBorderColor?: string;
  cardBorderRadius?: number;
  cardShadow?: string;
  cardPadding?: number;
  cardMargin?: number;
  
  // 输入框样式配置
  inputBackgroundColor?: string;
  inputBorderColor?: string;
  inputTextColor?: string;
  inputPlaceholderColor?: string;
  inputFocusColor?: string;
  inputBorderRadius?: number;
  inputFontSize?: number;
  inputPadding?: number;
  
  // 选择器样式配置
  selectBackgroundColor?: string;
  selectBorderColor?: string;
  selectTextColor?: string;
  selectHoverColor?: string;
  selectSelectedColor?: string;
  selectBorderRadius?: number;
  selectFontSize?: number;
  selectPadding?: number;
  
  // 开关样式配置
  switchCheckedColor?: string;
  switchUnCheckedColor?: string;
  switchHandleColor?: string;
  switchBackgroundColor?: string;
  
  // 抽屉样式配置
  drawerBackgroundColor?: string;
  drawerBorderColor?: string;
  drawerShadowColor?: string;
  drawerHeaderColor?: string;
  drawerBodyColor?: string;
  
  // 模态框样式配置
  modalBackgroundColor?: string;
  modalBorderColor?: string;
  modalShadowColor?: string;
  modalHeaderColor?: string;
  modalBodyColor?: string;
  modalMaskColor?: string;
  
  // 表格样式配置
  tableBackgroundColor?: string;
  tableBorderColor?: string;
  tableHeaderColor?: string;
  tableRowColor?: string;
  tableHoverColor?: string;
  tableSelectedColor?: string;
  tableTextColor?: string;
  tableFontSize?: number;
  
  // 表单样式配置
  formLabelColor?: string;
  formTextColor?: string;
  formBorderColor?: string;
  formErrorColor?: string;
  formSuccessColor?: string;
  formFontSize?: number;
  
  // 通知样式配置
  notificationBackgroundColor?: string;
  notificationBorderColor?: string;
  notificationTextColor?: string;
  notificationIconColor?: string;
  notificationSuccessColor?: string;
  notificationWarningColor?: string;
  notificationErrorColor?: string;
  notificationInfoColor?: string;
  notificationShadow?: string;
  
  // 提示框样式配置
  tooltipBackgroundColor?: string;
  tooltipTextColor?: string;
  tooltipBorderColor?: string;
  tooltipShadow?: string;
  
  // 气泡卡片样式配置
  popoverBackgroundColor?: string;
  popoverBorderColor?: string;
  popoverShadow?: string;
  
  // 下拉菜单样式配置
  dropdownBackgroundColor?: string;
  dropdownBorderColor?: string;
  dropdownItemColor?: string;
  dropdownItemHoverColor?: string;
  dropdownShadow?: string;
  
  // 标签页样式配置
  tabsBackgroundColor?: string;
  tabsBorderColor?: string;
  tabsActiveColor?: string;
  tabsInactiveColor?: string;
  tabsContentColor?: string;
  
  // 面包屑样式配置
  breadcrumbBackgroundColor?: string;
  breadcrumbTextColor?: string;
  breadcrumbLinkColor?: string;
  breadcrumbSeparatorColor?: string;
  breadcrumbFontSize?: number;
  
  // 分页样式配置
  paginationBackgroundColor?: string;
  paginationBorderColor?: string;
  paginationTextColor?: string;
  paginationActiveColor?: string;
  paginationDisabledColor?: string;
  paginationFontSize?: number;
  
  // 进度条样式配置
  progressBackgroundColor?: string;
  progressProgressColor?: string;
  progressTextColor?: string;
  progressFontSize?: number;
  
  // 徽章样式配置
  badgeBackgroundColor?: string;
  badgeTextColor?: string;
  badgeBorderColor?: string;
  badgeFontSize?: number;
  
  // 头像样式配置
  avatarBackgroundColor?: string;
  avatarTextColor?: string;
  avatarBorderColor?: string;
  avatarFontSize?: number;
  
  // 分割线样式配置
  dividerBackgroundColor?: string;
  dividerTextColor?: string;
  dividerFontSize?: number;
  
  // 空状态样式配置
  emptyBackgroundColor?: string;
  emptyTextColor?: string;
  emptyIconColor?: string;
  emptyFontSize?: number;
  
  // 加载样式配置
  spinColor?: string;
  spinBackgroundColor?: string;
  
  // 骨架屏样式配置
  skeletonBackgroundColor?: string;
  skeletonActiveColor?: string;
  
  // 时间轴样式配置
  timelineBackgroundColor?: string;
  timelineBorderColor?: string;
  timelineTextColor?: string;
  timelineDotColor?: string;
  timelineFontSize?: number;
  
  // 树形控件样式配置
  treeBackgroundColor?: string;
  treeBorderColor?: string;
  treeTextColor?: string;
  treeSelectedColor?: string;
  treeHoverColor?: string;
  treeFontSize?: number;
  
  // 穿梭框样式配置
  transferBackgroundColor?: string;
  transferBorderColor?: string;
  transferTextColor?: string;
  transferSelectedColor?: string;
  transferHoverColor?: string;
  
  // 级联选择器样式配置
  cascaderBackgroundColor?: string;
  cascaderBorderColor?: string;
  cascaderTextColor?: string;
  cascaderSelectedColor?: string;
  cascaderHoverColor?: string;
  
  // 日期选择器样式配置
  datePickerBackgroundColor?: string;
  datePickerBorderColor?: string;
  datePickerTextColor?: string;
  datePickerSelectedColor?: string;
  datePickerHoverColor?: string;
  
  // 时间选择器样式配置
  timePickerBackgroundColor?: string;
  timePickerBorderColor?: string;
  timePickerTextColor?: string;
  timePickerSelectedColor?: string;
  timePickerHoverColor?: string;
  
  // 日历样式配置
  calendarBackgroundColor?: string;
  calendarBorderColor?: string;
  calendarTextColor?: string;
  calendarSelectedColor?: string;
  calendarHoverColor?: string;
  calendarHeaderColor?: string;
  
  // 上传样式配置
  uploadBackgroundColor?: string;
  uploadBorderColor?: string;
  uploadTextColor?: string;
  uploadHoverColor?: string;
  uploadSuccessColor?: string;
  uploadErrorColor?: string;
  
  // 评分样式配置
  rateColor?: string;
  rateTextColor?: string;
  rateFontSize?: number;
  
  // 滑动输入条样式配置
  sliderTrackColor?: string;
  sliderHandleColor?: string;
  sliderTextColor?: string;
  sliderFontSize?: number;
  
  // 颜色选择器样式配置
  colorPickerBackgroundColor?: string;
  colorPickerBorderColor?: string;
  colorPickerTextColor?: string;
  
  // 提及样式配置
  mentionBackgroundColor?: string;
  mentionBorderColor?: string;
  mentionTextColor?: string;
  mentionSelectedColor?: string;
  mentionHoverColor?: string;
  
  // 自动完成样式配置
  autoCompleteBackgroundColor?: string;
  autoCompleteBorderColor?: string;
  autoCompleteTextColor?: string;
  autoCompleteSelectedColor?: string;
  autoCompleteHoverColor?: string;
  
  // 背景色
  colorBgBase: string;
  colorBgContainer: string;
  colorBgElevated: string;
  colorBgLayout: string;
  colorBgSpotlight: string;
  colorBgMask: string;
  
  // 文字色
  colorText: string;
  colorTextSecondary: string;
  colorTextTertiary: string;
  colorTextQuaternary: string;
  colorTextDisabled: string;
  colorTextHeading: string;
  colorTextDescription: string;
  colorTextPlaceholder: string;
  
  // 边框色
  colorBorder: string;
  colorBorderSecondary: string;
  colorSplit: string;
  
  // 填充色
  colorFill: string;
  colorFillSecondary: string;
  colorFillTertiary: string;
  colorFillQuaternary: string;
  
  // 链接色
  colorLink: string;
  colorLinkHover: string;
  colorLinkActive: string;
  
  // 圆角
  borderRadius: number;
  borderRadiusLG: number;
  borderRadiusSM: number;
  borderRadiusXS: number;
  
  // 阴影
  boxShadow: string;
  boxShadowSecondary: string;
  boxShadowTertiary: string;
  
  // 字体
  fontFamily: string;
  fontSize: number;
  fontSizeLG: number;
  fontSizeSM: number;
  fontSizeXL: number;
  fontSizeHeading1: number;
  fontSizeHeading2: number;
  fontSizeHeading3: number;
  fontSizeHeading4: number;
  fontSizeHeading5: number;
  
  // 行高
  lineHeight: number;
  lineHeightLG: number;
  lineHeightSM: number;
  
  // 间距
  padding: number;
  paddingLG: number;
  paddingSM: number;
  paddingXS: number;
  margin: number;
  marginLG: number;
  marginSM: number;
  marginXS: number;
  
  // 动画
  motionDurationFast: string;
  motionDurationMid: string;
  motionDurationSlow: string;
  motionEaseInOut: string;
  motionEaseOut: string;
  motionEaseIn: string;
  
  // 其他
  wireframe: boolean;
  controlHeight: number;
  controlHeightLG: number;
  controlHeightSM: number;
  
  // 顶部菜单专用间距配置
  topMenuHeight?: number;
  topMenuItemMargin?: number;
  topMenuItemPadding?: number;
  topMenuContainerPadding?: number;
  topMenuContainerMargin?: number;
}

// 主题组件配置接口
export interface ThemeComponents {
  Layout?: ComponentConfig;
  Menu?: ComponentConfig;
  Button?: ComponentConfig;
  Card?: ComponentConfig;
  Input?: ComponentConfig;
  Table?: ComponentConfig;
  Modal?: ComponentConfig;
  Drawer?: ComponentConfig;
  Message?: ComponentConfig;
  Notification?: ComponentConfig;
  Tag?: ComponentConfig;
  Badge?: ComponentConfig;
  Avatar?: ComponentConfig;
  Pagination?: ComponentConfig;
  Breadcrumb?: ComponentConfig;
  Spin?: ComponentConfig;
  Progress?: ComponentConfig;
  Dropdown?: ComponentConfig;
  Tooltip?: ComponentConfig;
  Select?: ComponentConfig;
  DatePicker?: ComponentConfig;
  TimePicker?: ComponentConfig;
  Switch?: ComponentConfig;
  Checkbox?: ComponentConfig;
  Radio?: ComponentConfig;
  Slider?: ComponentConfig;
  Rate?: ComponentConfig;
  Upload?: ComponentConfig;
  Transfer?: ComponentConfig;
  Tree?: ComponentConfig;
  TreeSelect?: ComponentConfig;
  Cascader?: ComponentConfig;
  Form?: ComponentConfig;
  Steps?: ComponentConfig;
  Timeline?: ComponentConfig;
  Tabs?: ComponentConfig;
  Collapse?: ComponentConfig;
  Carousel?: ComponentConfig;
  Calendar?: ComponentConfig;
  List?: ComponentConfig;
  Descriptions?: ComponentConfig;
  Empty?: ComponentConfig;
  Result?: ComponentConfig;
  Statistic?: ComponentConfig;
  Alert?: ComponentConfig;
  Skeleton?: ComponentConfig;
  Anchor?: ComponentConfig;
  BackTop?: ComponentConfig;
  Affix?: ComponentConfig;
  [key: string]: ComponentConfig | undefined;
}

// 组件配置接口
export interface ComponentConfig {
  [key: string]: any;
}

// 主题包加载器接口
export interface ThemePackageLoader {
  load(packageId: string): Promise<ThemePackageConfig>;
  loadAll(): Promise<ThemePackageConfig[]>;
  validate(config: ThemePackageConfig): boolean;
  register(config: ThemePackageConfig): void;
  unregister(packageId: string): void;
  getRegistered(): ThemePackageConfig[];
}

// 主题包注册表接口
export interface ThemePackageRegistry {
  packages: Map<string, ThemePackageConfig>;
  register(config: ThemePackageConfig, overwrite?: boolean): void;
  unregister(packageId: string): void;
  get(packageId: string): ThemePackageConfig | undefined;
  getAll(): ThemePackageConfig[];
  has(packageId: string): boolean;
  clear(): void;
}

// 主题包验证器接口
export interface ThemePackageValidator {
  validate(config: ThemePackageConfig): ValidationResult;
  validateMeta(meta: ThemePackageMeta): ValidationResult;
  validateToken(token: ThemeToken): ValidationResult;
  validateComponents(components: ThemeComponents): ValidationResult;
}

// 验证结果接口
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// 主题包工厂接口
export interface ThemePackageFactory {
  create(config: Partial<ThemePackageConfig>): ThemePackageConfig;
  fromJSON(json: string): ThemePackageConfig;
  toJSON(config: ThemePackageConfig): string;
  clone(config: ThemePackageConfig): ThemePackageConfig;
  merge(base: ThemePackageConfig, override: Partial<ThemePackageConfig>): ThemePackageConfig;
}

// 主题包管理器接口
export interface ThemePackageManager {
  loader: ThemePackageLoader;
  registry: ThemePackageRegistry;
  validator: ThemePackageValidator;
  factory: ThemePackageFactory;
  
  // 主要方法
  loadPackage(packageId: string): Promise<ThemePackageConfig>;
  loadAllPackages(): Promise<ThemePackageConfig[]>;
  registerPackage(config: ThemePackageConfig): boolean;
  unregisterPackage(packageId: string): boolean;
  getPackage(packageId: string): ThemePackageConfig | undefined;
  getAllPackages(): ThemePackageConfig[];
  validatePackage(config: ThemePackageConfig): ValidationResult;
  
  // 工具方法
  createPackage(config: Partial<ThemePackageConfig>): ThemePackageConfig;
  exportPackage(packageId: string): string;
  importPackage(json: string): boolean;
  clonePackage(packageId: string, newId: string): boolean;
  mergePackages(baseId: string, overrideId: string, newId: string): boolean;
}

// 主题包事件接口
export interface ThemePackageEvents {
  on(event: 'packageLoaded', listener: (config: ThemePackageConfig) => void): void;
  on(event: 'packageRegistered', listener: (config: ThemePackageConfig) => void): void;
  on(event: 'packageUnregistered', listener: (packageId: string) => void): void;
  on(event: 'packageValidated', listener: (result: ValidationResult) => void): void;
  on(event: 'error', listener: (error: Error) => void): void;
  
  off(event: string, listener: Function): void;
  emit(event: string, ...args: any[]): void;
}

// 主题包配置选项
export interface ThemePackageOptions {
  autoLoad?: boolean;
  validateOnLoad?: boolean;
  cacheEnabled?: boolean;
  cacheTimeout?: number;
  fallbackPackage?: string;
  strictMode?: boolean;
}

// 导出所有类型
export type {
  ThemePackageMeta,
  ThemePackageConfig,
  ThemeToken,
  ThemeComponents,
  ComponentConfig,
  ThemePackageLoader,
  ThemePackageRegistry,
  ThemePackageValidator,
  ValidationResult,
  ThemePackageFactory,
  ThemePackageManager,
  ThemePackageEvents,
  ThemePackageOptions,
};






