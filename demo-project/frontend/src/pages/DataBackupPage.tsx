/**
 * 数据备份与恢复页面
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  // Row,
  // Col,
  Table,
  Button,
  Typography,
  Space,
  message,
  Modal,
  Progress,
  Tag,
  Alert,
  Tooltip,
  Form,
  Input,
  // DatePicker,
} from 'antd';
import {
  DatabaseOutlined,
  DownloadOutlined,
  UploadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import '../styles/settings-pages.css';

const { Title, Text } = Typography;
// const { RangePicker } = DatePicker;

interface BackupRecord {
  id: string;
  name: string;
  size: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'failed' | 'in_progress';
  created_at: string;
  description?: string;
}

interface BackupJob {
  id: string;
  name: string;
  schedule: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'active' | 'paused' | 'failed';
  last_run?: string;
  next_run: string;
}

const DataBackupPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [jobs, setJobs] = useState<BackupJob[]>([]);
  const [restoreModalVisible, setRestoreModalVisible] = useState(false);
  const [backupModalVisible, setBackupModalVisible] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(null);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    loadBackupData();
  }, []);

  const loadBackupData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockBackups: BackupRecord[] = [
        {
          id: '1',
          name: 'full_backup_20241201_1200',
          size: '2.5 GB',
          type: 'full',
          status: 'completed',
          created_at: '2024-12-01T12:00:00Z',
          description: '完整系统备份',
        },
        {
          id: '2',
          name: 'incremental_backup_20241201_1800',
          size: '150 MB',
          type: 'incremental',
          status: 'completed',
          created_at: '2024-12-01T18:00:00Z',
          description: '增量备份',
        },
        {
          id: '3',
          name: 'full_backup_20241130_1200',
          size: '2.3 GB',
          type: 'full',
          status: 'completed',
          created_at: '2024-11-30T12:00:00Z',
          description: '完整系统备份',
        },
        {
          id: '4',
          name: 'differential_backup_20241201_0600',
          size: '800 MB',
          type: 'differential',
          status: 'failed',
          created_at: '2024-12-01T06:00:00Z',
          description: '差异备份',
        },
      ];

      const mockJobs: BackupJob[] = [
        {
          id: '1',
          name: '每日完整备份',
          schedule: '0 2 * * *',
          type: 'full',
          status: 'active',
          last_run: '2024-12-01T02:00:00Z',
          next_run: '2024-12-02T02:00:00Z',
        },
        {
          id: '2',
          name: '每小时增量备份',
          schedule: '0 * * * *',
          type: 'incremental',
          status: 'active',
          last_run: '2024-12-01T18:00:00Z',
          next_run: '2024-12-01T19:00:00Z',
        },
        {
          id: '3',
          name: '每周差异备份',
          schedule: '0 0 * * 0',
          type: 'differential',
          status: 'paused',
          last_run: '2024-11-24T00:00:00Z',
          next_run: '2024-12-08T00:00:00Z',
        },
      ];

      setBackups(mockBackups);
      setJobs(mockJobs);
    } catch (error) {
      console.error('加载备份数据失败:', error);
      message.error('加载备份数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async (_values: any) => {
    setLoading(true);
    try {
      // 模拟创建备份
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('备份任务已创建');
      setBackupModalVisible(false);
      form.resetFields();
      loadBackupData();
    } catch (error) {
      message.error('创建备份失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedBackup) return;

    setRestoreModalVisible(false);
    setRestoreProgress(0);

    // 模拟恢复过程
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          message.success('数据恢复完成');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleDeleteBackup = (backup: BackupRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除备份 "${backup.name}" 吗？此操作不可恢复。`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          // 模拟删除
          setBackups(prev => prev.filter(b => b.id !== backup.id));
          message.success('备份已删除');
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const backupColumns = [
    {
      title: '备份名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: BackupRecord) => (
        <div>
          <Text strong>{name}</Text>
          {record.description && (
            <div>
              <Text type="secondary" className="backup-description">
                {record.description}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const colorMap = {
          full: 'blue',
          incremental: 'green',
          differential: 'orange',
        };
        const textMap = {
          full: '完整',
          incremental: '增量',
          differential: '差异',
        };
        return <Tag color={colorMap[type as keyof typeof colorMap]}>{textMap[type as keyof typeof textMap]}</Tag>;
      },
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colorMap = {
          completed: 'green',
          failed: 'red',
          in_progress: 'blue',
        };
        const textMap = {
          completed: '完成',
          failed: '失败',
          in_progress: '进行中',
        };
        return <Tag color={colorMap[status as keyof typeof colorMap]}>{textMap[status as keyof typeof textMap]}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: BackupRecord) => (
        <Space size="small">
          <Tooltip title="下载备份">
            <Button
              icon={<DownloadOutlined />}
              size="small"
              disabled={record.status !== 'completed'}
            />
          </Tooltip>
          <Tooltip title="恢复数据">
            <Button
              icon={<UploadOutlined />}
              size="small"
              type="primary"
              disabled={record.status !== 'completed'}
              onClick={() => {
                setSelectedBackup(record);
                setRestoreModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="删除备份">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => handleDeleteBackup(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const jobColumns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const colorMap = {
          full: 'blue',
          incremental: 'green',
          differential: 'orange',
        };
        const textMap = {
          full: '完整',
          incremental: '增量',
          differential: '差异',
        };
        return <Tag color={colorMap[type as keyof typeof colorMap]}>{textMap[type as keyof typeof textMap]}</Tag>;
      },
    },
    {
      title: '计划',
      dataIndex: 'schedule',
      key: 'schedule',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colorMap = {
          active: 'green',
          paused: 'orange',
          failed: 'red',
        };
        const textMap = {
          active: '运行中',
          paused: '已暂停',
          failed: '失败',
        };
        return <Tag color={colorMap[status as keyof typeof colorMap]}>{textMap[status as keyof typeof textMap]}</Tag>;
      },
    },
    {
      title: '上次运行',
      dataIndex: 'last_run',
      key: 'last_run',
      width: 150,
      render: (timestamp: string) => timestamp ? new Date(timestamp).toLocaleString() : '-',
    },
    {
      title: '下次运行',
      dataIndex: 'next_run',
      key: 'next_run',
      width: 150,
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
  ];

  return (
    <div className={`settings-page ${currentTheme?.meta.id || 'light'}-theme`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="settings-header-card">
          <Space align="center">
            <DatabaseOutlined className="monitoring-header-icon" />
            <Title level={2} className="monitoring-title">
              数据备份与恢复
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadBackupData}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
          <Text className="monitoring-description">
            管理系统数据备份和恢复任务
          </Text>
        </div>

        {/* 备份记录 */}
        <Card
          title="备份记录"
          extra={
            <Button
              type="primary"
              icon={<CloudDownloadOutlined />}
              onClick={() => setBackupModalVisible(true)}
            >
              创建备份
            </Button>
          }
          className="mb-6"
        >
          <Table
            columns={backupColumns}
            dataSource={backups}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>

        {/* 备份任务 */}
        <Card
          title={t('backup.backupTasks')}
          extra={
            <Button
              icon={<CloudUploadOutlined />}
              onClick={() => {
                // 创建新任务的逻辑
                message.info(t('backup.createTaskInDevelopment'));
              }}
            >
              {t('backup.newTask')}
            </Button>
          }
        >
          <Table
            columns={jobColumns}
            dataSource={jobs}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>

        {/* 创建备份模态框 */}
        <Modal
          title={t('backup.createBackup')}
          open={backupModalVisible}
          onCancel={() => setBackupModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleCreateBackup} layout="vertical">
            <Form.Item
              name="name"
              label={t('backup.backupName')}
              rules={[{ required: true, message: t('backup.backupNamePlaceholder') }]}
            >
              <Input placeholder={t('backup.backupNamePlaceholder')} />
            </Form.Item>
            <Form.Item
              name="type"
              label={t('backup.backupType')}
              rules={[{ required: true, message: t('backup.backupTypePlaceholder') }]}
            >
              <Input placeholder={t('backup.fullBackup')} disabled />
            </Form.Item>
            <Form.Item
              name="description"
              label={t('backup.description')}
            >
              <Input.TextArea placeholder={t('backup.descriptionPlaceholder')} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {t('backup.createBackup')}
                </Button>
                <Button onClick={() => setBackupModalVisible(false)}>
                  {t('common.cancel')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* 恢复数据模态框 */}
        <Modal
          title={t('backup.restoreData')}
          open={restoreModalVisible}
          onCancel={() => setRestoreModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setRestoreModalVisible(false)}>
              {t('common.cancel')}
            </Button>,
            <Button key="restore" type="primary" danger onClick={handleRestore}>
              {t('backup.confirmRestore')}
            </Button>,
          ]}
        >
          <Alert
            message={t('common.warning')}
            description={t('backup.restoreWarning', { name: selectedBackup?.name })}
            type="warning"
            showIcon
            className="mb-4"
          />
          {restoreProgress > 0 && (
            <Progress percent={restoreProgress} status="active" />
          )}
        </Modal>
      </motion.div>
    </div>
  );
};

export default DataBackupPage;
