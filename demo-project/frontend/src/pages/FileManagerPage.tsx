/**
 * 文件管理页面
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Typography,
  Space,
  message,
  Modal,
  Upload,
  // Tree,
  Breadcrumb,
  Tag,
  Tooltip,
  Input,
  Popconfirm,
} from 'antd';
import {
  FolderOutlined,
  FileOutlined,
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  HomeOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileZipOutlined,
  // MoreOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import '../styles/settings-pages.css';

const { Title, Text } = Typography;
const { Search } = Input;
// const { DirectoryTree } = Tree;

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: string;
  path: string;
  extension?: string;
  permissions: string;
}

// interface FolderItem {
//   key: string;
//   title: string;
//   children?: FolderItem[];
//   isLeaf?: boolean;
// }

const FileManagerPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadFiles();
  }, [currentPath]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockFiles: FileItem[] = [
        {
          id: '1',
          name: 'documents',
          type: 'folder',
          modified: '2024-12-01T10:00:00Z',
          path: '/documents',
          permissions: 'rwxr-xr-x',
        },
        {
          id: '2',
          name: 'images',
          type: 'folder',
          modified: '2024-12-01T09:30:00Z',
          path: '/images',
          permissions: 'rwxr-xr-x',
        },
        {
          id: '3',
          name: 'README.md',
          type: 'file',
          size: 1024,
          modified: '2024-12-01T08:00:00Z',
          path: '/README.md',
          extension: 'md',
          permissions: 'rw-r--r--',
        },
        {
          id: '4',
          name: 'config.json',
          type: 'file',
          size: 2048,
          modified: '2024-11-30T15:30:00Z',
          path: '/config.json',
          extension: 'json',
          permissions: 'rw-r--r--',
        },
        {
          id: '5',
          name: 'backup.zip',
          type: 'file',
          size: 10485760, // 10MB
          modified: '2024-11-30T12:00:00Z',
          path: '/backup.zip',
          extension: 'zip',
          permissions: 'rw-r--r--',
        },
      ];

      setFiles(mockFiles);
    } catch (error) {
      console.error('加载文件列表失败:', error);
      message.error('加载文件列表失败');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <FolderOutlined />;
    }

    const extension = file.extension?.toLowerCase();
    switch (extension) {
      case 'md':
      case 'txt':
        return <FileTextOutlined />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImageOutlined />;
      case 'pdf':
        return <FilePdfOutlined />;
      case 'xlsx':
      case 'xls':
        return <FileExcelOutlined />;
      case 'docx':
      case 'doc':
        return <FileWordOutlined />;
      case 'zip':
      case 'rar':
        return <FileZipOutlined />;
      default:
        return <FileOutlined />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const handleUpload = async (file: any) => {
    try {
      // 模拟上传
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success(`文件 ${file.name} 上传成功`);
      loadFiles();
    } catch (error) {
      message.error('上传失败');
    }
  };

  const handleDownload = (file: FileItem) => {
    message.info(`下载文件: ${file.name}`);
  };

  const handleDelete = (file: FileItem) => {
    setFiles(prev => prev.filter(f => f.id !== file.id));
    message.success(`文件 ${file.name} 已删除`);
  };

  const handleRename = () => {
    if (!selectedFile || !newName) return;

    setFiles(prev => prev.map(f => 
      f.id === selectedFile.id 
        ? { ...f, name: newName }
        : f
    ));
    message.success('重命名成功');
    setRenameModalVisible(false);
    setSelectedFile(null);
    setNewName('');
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const getPathBreadcrumbs = () => {
    const paths = currentPath.split('/').filter(Boolean);
    const breadcrumbs = [
      <Breadcrumb.Item key="root" onClick={() => handleNavigate('/')}>
        <HomeOutlined /> 根目录
      </Breadcrumb.Item>
    ];

    let current = '';
    paths.forEach((path, _index) => {
      current += `/${path}`;
      breadcrumbs.push(
        <Breadcrumb.Item 
          key={current} 
          onClick={() => handleNavigate(current)}
        >
          {path}
        </Breadcrumb.Item>
      );
    });

    return breadcrumbs;
  };

  const fileColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (_name: string, record: FileItem) => (
        <Space>
          {getFileIcon(record)}
          <Text 
            className={record.type === 'folder' ? 'cursor-pointer text-blue-500 hover:underline' : ''}
            onClick={() => {
              if (record.type === 'folder') {
                handleNavigate(record.path);
              }
            }}
          >
            {record.name}
          </Text>
        </Space>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '修改时间',
      dataIndex: 'modified',
      key: 'modified',
      width: 180,
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 100,
      render: (permissions: string) => (
        <Tag color="blue">{permissions}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: FileItem) => (
        <Space size="small">
          {record.type === 'file' && (
            <Tooltip title="下载">
              <Button
                icon={<DownloadOutlined />}
                size="small"
                onClick={() => handleDownload(record)}
              />
            </Tooltip>
          )}
          <Tooltip title="重命名">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setSelectedFile(record);
                setNewName(record.name);
                setRenameModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="确认删除"
            description={`确定要删除 "${record.name}" 吗？`}
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
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
            <FolderOutlined className="monitoring-header-icon" />
            <Title level={2} className="monitoring-title">
              {t('fileManager.title')}
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadFiles}
              loading={loading}
            >
              {t('common.refresh')}
            </Button>
          </Space>
          <Text className="monitoring-description">
            {t('fileManager.description')}
          </Text>
        </div>

        {/* 面包屑导航 */}
        <Card className="mb-4">
          <Breadcrumb>
            {getPathBreadcrumbs()}
          </Breadcrumb>
        </Card>

        {/* 工具栏 */}
        <Card className="mb-4">
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => setUploadModalVisible(true)}
                >
                  {t('fileManager.uploadFile')}
                </Button>
                <Button
                  icon={<FolderOpenOutlined />}
                  onClick={() => message.info(t('fileManager.newFolderInDevelopment'))}
                >
                  {t('fileManager.newFolder')}
                </Button>
              </Space>
            </Col>
            <Col>
              <Search
                placeholder={t('fileManager.searchPlaceholder')}
                className="file-manager-upload-width"
                onSearch={(value) => message.info(t('fileManager.searchResult', { value }))}
              />
            </Col>
          </Row>
        </Card>

        {/* 文件列表 */}
        <Card>
          <Table
            columns={fileColumns}
            dataSource={files}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 20 }}
            rowSelection={{
              selectedRowKeys: selectedFiles,
              onChange: (selectedRowKeys: React.Key[]) => setSelectedFiles(selectedRowKeys as string[]),
            }}
          />
        </Card>

        {/* 上传文件模态框 */}
        <Modal
          title="上传文件"
          open={uploadModalVisible}
          onCancel={() => setUploadModalVisible(false)}
          footer={null}
        >
          <Upload.Dragger
            name="file"
            multiple
            action="/api/upload"
            onChange={(info) => {
              if (info.file.status === 'done') {
                handleUpload(info.file);
              }
            }}
            beforeUpload={() => false}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">{t('fileManager.uploadText')}</p>
            <p className="ant-upload-hint">
              {t('fileManager.uploadHint')}
            </p>
          </Upload.Dragger>
        </Modal>

        {/* 重命名模态框 */}
        <Modal
          title="重命名"
          open={renameModalVisible}
          onCancel={() => setRenameModalVisible(false)}
          onOk={handleRename}
        >
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="输入新名称"
          />
        </Modal>
      </motion.div>
    </div>
  );
};

export default FileManagerPage;
