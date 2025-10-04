/**
 * 主题包演示页面
 * 展示扩展后的主题包可控制的元素
 */

import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Input, 
  Select, 
  Switch, 
  Tag, 
  Badge, 
  Avatar, 
  Progress, 
  Space,
  Typography,
  Divider,
  Alert
} from 'antd';
import '../styles/menu-theme.css';
import { 
  UserOutlined, 
  SettingOutlined, 
  HeartOutlined,
  StarOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ThemeDemoPage: React.FC = () => {
  return (
    <div className="theme-demo-container">
      <Title level={2}>🎨 主题包演示页面</Title>
      <Paragraph>
        展示扩展后的主题包系统可以控制的各种UI元素和样式属性
      </Paragraph>

      <Row gutter={[16, 16]}>
        {/* 基础组件演示 */}
        <Col span={24}>
          <Card title="🔧 基础组件" size="small">
            <Space wrap>
              <Button type="primary">主要按钮</Button>
              <Button>默认按钮</Button>
              <Button type="dashed">虚线按钮</Button>
              <Button type="text">文本按钮</Button>
              <Button type="link">链接按钮</Button>
            </Space>
          </Card>
        </Col>

        {/* 输入组件演示 */}
        <Col span={12}>
          <Card title="📝 输入组件" size="small">
            <Space direction="vertical" className="theme-demo-section">
              <Input placeholder="基础输入框" />
              <Input.Password placeholder="密码输入框" />
              <Select placeholder="选择器" className="theme-demo-select">
                <Option value="option1">选项1</Option>
                <Option value="option2">选项2</Option>
                <Option value="option3">选项3</Option>
              </Select>
              <Switch defaultChecked />
            </Space>
          </Card>
        </Col>

        {/* 展示组件演示 */}
        <Col span={12}>
          <Card title="🏷️ 展示组件" size="small">
            <Space direction="vertical" className="theme-demo-section">
              <Space wrap>
                <Tag color="blue">蓝色标签</Tag>
                <Tag color="green">绿色标签</Tag>
                <Tag color="orange">橙色标签</Tag>
                <Tag color="red">红色标签</Tag>
              </Space>
              <Space>
                <Badge count={5}>
                  <Avatar icon={<UserOutlined />} />
                </Badge>
                <Badge dot>
                  <Avatar icon={<SettingOutlined />} />
                </Badge>
              </Space>
              <Progress percent={30} />
              <Progress percent={70} status="active" />
            </Space>
          </Card>
        </Col>

        {/* 自定义样式演示 */}
        <Col span={24}>
          <Card title="🎨 自定义样式演示" size="small">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card 
                  title="渐变背景" 
                  size="small"
                  className="theme-demo-gradient-card"
                >
                  <Text className="theme-demo-text-white">
                    使用主题包中的渐变背景
                  </Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card 
                  title="自定义阴影" 
                  size="small"
                  className="theme-demo-shadow-card"
                >
                  <Text>
                    使用主题包中的自定义阴影效果
                  </Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card 
                  title="发光效果" 
                  size="small"
                  className="theme-demo-glow-card"
                >
                  <Text>
                    使用主题包中的发光效果
                  </Text>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 扩展属性演示 */}
        <Col span={24}>
          <Card title="⚡ 扩展属性演示" size="small">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <div className="theme-demo-center">
                  <Title level={4}>自定义圆角</Title>
                  <div className="theme-demo-radius-box">
                    20px
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className="theme-demo-center">
                  <Title level={4}>自定义间距</Title>
                  <div className="theme-demo-padding-box">
                    <Text>30px 内边距</Text>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className="theme-demo-center">
                  <Title level={4}>自定义字体</Title>
                  <div>
                    <Text className="theme-demo-large-bold-text">
                      大号粗体
                    </Text>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className="theme-demo-center">
                  <Title level={4}>透明度控制</Title>
                  <div className="theme-demo-highlight">
                    <Text>30% 透明度</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 动画效果演示 */}
        <Col span={24}>
          <Card title="🎭 动画效果演示" size="small">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div className="theme-demo-center">
                  <Title level={4}>快速动画</Title>
                  <Button className="theme-demo-fast-animation">
                    0.05s 快速
                  </Button>
                </div>
              </Col>
              <Col span={8}>
                <div className="theme-demo-center">
                  <Title level={4}>中等动画</Title>
                  <Button className="theme-demo-medium-animation">
                    0.25s 中等
                  </Button>
                </div>
              </Col>
              <Col span={8}>
                <div className="theme-demo-center">
                  <Title level={4}>慢速动画</Title>
                  <Button className="theme-demo-slow-animation">
                    0.55s 慢速
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 功能说明 */}
        <Col span={24}>
          <Alert
            message="🎨 主题包扩展功能说明"
            description={
              <div>
                <Paragraph>
                  <strong>新增的可控制元素：</strong>
                </Paragraph>
                <ul>
                  <li><strong>自定义颜色变量：</strong>5个自定义颜色，可用于品牌色、强调色等</li>
                  <li><strong>渐变背景：</strong>5种预设渐变，支持主要、次要、成功、警告、错误状态</li>
                  <li><strong>扩展阴影效果：</strong>包括内阴影、发光效果、多层阴影等</li>
                  <li><strong>扩展圆角：</strong>4种自定义圆角大小，适应不同设计需求</li>
                  <li><strong>扩展间距：</strong>8种自定义间距，提供更精细的布局控制</li>
                  <li><strong>扩展字体：</strong>8种字体大小 + 6种字体权重，满足各种文本需求</li>
                  <li><strong>扩展行高：</strong>6种行高选项，优化阅读体验</li>
                  <li><strong>扩展动画：</strong>6种动画持续时间 + 5种缓动函数</li>
                  <li><strong>透明度控制：</strong>9种透明度级别，支持叠加效果</li>
                  <li><strong>边框宽度：</strong>5种边框宽度，适应不同设计风格</li>
                  <li><strong>Z-index层级：</strong>5种层级控制，管理元素堆叠</li>
                  <li><strong>新增组件：</strong>Select选择器、Switch开关等组件的完整样式控制</li>
                </ul>
                <Paragraph>
                  <strong>使用方式：</strong>通过主题包系统，这些属性会自动应用到所有使用Ant Design组件的页面中，无需手动设置样式。
                </Paragraph>
              </div>
            }
            type="info"
            showIcon
          />
        </Col>
      </Row>
    </div>
  );
};

export default ThemeDemoPage;





