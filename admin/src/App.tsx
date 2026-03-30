import { Layout, Menu, Avatar, Dropdown, Badge, theme } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  UserOutlined,
  RobotOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '数据看板' },
  { key: 'content', icon: <FileTextOutlined />, label: '内容管理', children: [
    { key: 'guides', label: '旅游攻略' },
    { key: 'notes', label: '游记管理' },
    { key: 'banners', label: 'Banner管理' },
  ]},
  { key: 'products', icon: <ShoppingOutlined />, label: '产品管理', children: [
    { key: 'hotels', label: '酒店管理' },
    { key: 'flights', label: '机票管理' },
    { key: 'tickets', label: '门票管理' },
    { key: 'destinations', label: '目的地管理' },
  ]},
  { key: 'orders', icon: <OrderedListOutlined />, label: '订单管理', children: [
    { key: 'order-list', label: '订单列表' },
    { key: 'refunds', label: '退款管理' },
  ]},
  { key: 'users', icon: <UserOutlined />, label: '用户管理', children: [
    { key: 'user-list', label: '用户列表' },
    { key: 'members', label: '会员管理' },
    { key: 'coupons', label: '优惠券管理' },
  ]},
  { key: 'ai', icon: <RobotOutlined />, label: 'AI配置', children: [
    { key: 'ai-model', label: '模型配置' },
    { key: 'ai-knowledge', label: '知识库管理' },
    { key: 'ai-conversations', label: '对话日志' },
  ]},
  { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
];

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人设置' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255,255,255,0.2)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
          {collapsed ? 'TA' : 'TravelAI 管理'}
        </div>
        <Menu theme="dark" defaultSelectedKeys={['dashboard']} mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>智能旅游助手 - 管理后台</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Badge count={5}>
              <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }}>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar icon={<UserOutlined />} />
                <span>管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: 16, padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          <DashboardContent />
        </Content>
      </Layout>
    </Layout>
  );
}

// 数据看板组件
function DashboardContent() {
  const stats = [
    { title: '今日订单', value: 128, change: '+12%' },
    { title: '今日收入', value: '¥45,280', change: '+8%' },
    { title: '活跃用户', value: 3456, change: '+15%' },
    { title: 'AI对话数', value: 892, change: '+23%' },
  ];

  return (
    <div>
      <h2>📊 数据概览</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ background: '#f5f5f5', padding: 20, borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: '#666' }}>{stat.title}</div>
            <div style={{ fontSize: 28, fontWeight: 'bold', margin: '8px 0' }}>{stat.value}</div>
            <div style={{ color: stat.change.startsWith('+') ? '#52c41a' : '#ff4d4f' }}>{stat.change}</div>
          </div>
        ))}
      </div>

      <h2>📈 最近动态</h2>
      <div style={{ background: '#fafafa', padding: 16, borderRadius: 8 }}>
        <ul>
          <li>用户「小明」完成了三亚5日游订单 - ¥3,200</li>
          <li>新攻略「成都美食攻略」已发布</li>
          <li>AI助手处理了156次行程规划请求</li>
          <li>3个退款请求待处理</li>
          <li>系统负载正常，响应时间 45ms</li>
        </ul>
      </div>

      <h2 style={{ marginTop: 24 }}>🤖 AI服务状态</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', padding: 16, borderRadius: 8 }}>
          <strong>RAG知识库</strong>
          <div>文档数: 12,450</div>
          <div>向量维度: 1536</div>
          <div style={{ color: '#52c41a' }}>● 正常运行</div>
        </div>
        <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', padding: 16, borderRadius: 8 }}>
          <strong>LLM服务</strong>
          <div>模型: GPT-4</div>
          <div>平均响应: 2.3s</div>
          <div style={{ color: '#52c41a' }}>● 正常运行</div>
        </div>
        <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', padding: 16, borderRadius: 8 }}>
          <strong>推荐引擎</strong>
          <div>CTR: 8.5%</div>
          <div>覆盖率: 92%</div>
          <div style={{ color: '#52c41a' }}>● 正常运行</div>
        </div>
      </div>
    </div>
  );
}

export default App;
