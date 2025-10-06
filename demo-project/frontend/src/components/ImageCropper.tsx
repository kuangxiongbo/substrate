import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Slider, Space } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
import type { InteractiveCropConfig } from '../utils/imageProcessor';
import { useTheme } from '../contexts/ThemeContext';
import './ImageCropper.css';

interface ImageCropperProps {
  visible: boolean;
  imageFile: File | null;
  onConfirm: (croppedImage: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ visible, imageFile, onConfirm, onCancel }) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [cropConfig, setCropConfig] = useState<InteractiveCropConfig>({
    x: 0,
    y: 0,
    width: 256,
    height: 256,
    scale: 1
  });
  const [cropBox, setCropBox] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragType, setDragType] = useState<'image' | 'cropbox' | null>(null);
  const { currentTheme } = useTheme();

  // 初始化图片
  useEffect(() => {
    if (visible && imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setImageSrc(src);
        
        // 重置裁剪配置
        const img = new Image();
        img.onload = () => {
          // 计算初始缩放比例，使图片适合容器
          const container = containerRef.current;
          if (container) {
            const containerWidth = container.clientWidth - 40; // 留出边距
            const containerHeight = container.clientHeight - 40;
            
            const scaleX = containerWidth / img.width;
            const scaleY = containerHeight / img.height;
            const initialScale = Math.min(scaleX, scaleY, 1);
            
            // 计算初始位置，使图片居中
            const scaledWidth = img.width * initialScale;
            const scaledHeight = img.height * initialScale;
            const initialX = (containerWidth - scaledWidth) / 2;
            const initialY = (containerHeight - scaledHeight) / 2;
            
            // 计算裁剪框位置（居中）
            const cropBoxX = (600 - 256) / 2;
            const cropBoxY = (400 - 256) / 2;
            
            setCropConfig({
              x: initialX,
              y: initialY,
              width: 256,
              height: 256,
              scale: initialScale
            });
            setCropBox({ x: cropBoxX, y: cropBoxY });
            setRotation(0);
          }
        };
        img.src = src;
      };
      reader.readAsDataURL(imageFile);
    }
  }, [visible, imageFile]);

  // 绘制预览
  useEffect(() => {
    if (canvasRef.current && imageSrc) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制背景
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--cropper-bg') || 'var(--cropper-bg)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 保存当前状态
        ctx.save();
        
        // 应用旋转
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        
        // 计算缩放后的尺寸
        const scaledWidth = img.width * cropConfig.scale;
        const scaledHeight = img.height * cropConfig.scale;
        
        // 绘制图片
        ctx.drawImage(
          img,
          cropConfig.x,
          cropConfig.y,
          scaledWidth,
          scaledHeight
        );
        
        ctx.restore();
        
        // 使用裁剪框位置
        const cropX = cropBox.x;
        const cropY = cropBox.y;
        
        // 绘制半透明遮罩（裁剪区域外）
        const maskColor = getComputedStyle(document.documentElement).getPropertyValue('--cropper-mask') || 'rgba(0, 0, 0, 0.6)';
        ctx.fillStyle = maskColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 清除裁剪区域，显示原始图片
        ctx.clearRect(cropX, cropY, 256, 256);
        
        // 重新绘制裁剪区域内的图片
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        
        ctx.drawImage(
          img,
          cropConfig.x,
          cropConfig.y,
          scaledWidth,
          scaledHeight
        );
        
        ctx.restore();
        
        // 绘制裁剪框边框
        const cropBorderColor = getComputedStyle(document.documentElement).getPropertyValue('--cropper-crop-border') || 'var(--cropper-crop-border)';
        ctx.strokeStyle = cropBorderColor;
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.strokeRect(cropX, cropY, 256, 256);
        
        // 绘制裁剪框角落标记
        const cornerSize = 20;
        const cornerColor = getComputedStyle(document.documentElement).getPropertyValue('--cropper-corners') || 'var(--cropper-corners)';
        const cornerThickness = 3;
        
        ctx.setLineDash([]);
        ctx.strokeStyle = cornerColor;
        ctx.lineWidth = cornerThickness;
        
        // 左上角
        ctx.beginPath();
        ctx.moveTo(cropX, cropY + cornerSize);
        ctx.lineTo(cropX, cropY);
        ctx.lineTo(cropX + cornerSize, cropY);
        ctx.stroke();
        
        // 右上角
        ctx.beginPath();
        ctx.moveTo(cropX + 256 - cornerSize, cropY);
        ctx.lineTo(cropX + 256, cropY);
        ctx.lineTo(cropX + 256, cropY + cornerSize);
        ctx.stroke();
        
        // 左下角
        ctx.beginPath();
        ctx.moveTo(cropX, cropY + 256 - cornerSize);
        ctx.lineTo(cropX, cropY + 256);
        ctx.lineTo(cropX + cornerSize, cropY + 256);
        ctx.stroke();
        
        // 右下角
        ctx.beginPath();
        ctx.moveTo(cropX + 256 - cornerSize, cropY + 256);
        ctx.lineTo(cropX + 256, cropY + 256);
        ctx.lineTo(cropX + 256, cropY + 256 - cornerSize);
        ctx.stroke();
        
        // 绘制尺寸信息
        ctx.fillStyle = cropBorderColor;
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('256×256', cropX + 128, cropY - 10);
      };
      img.src = imageSrc;
    }
  }, [imageSrc, cropConfig, rotation, cropBox]);

  // 处理鼠标事件
  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // 判断点击的是裁剪框还是图片
    if (mouseX >= cropBox.x && mouseX <= cropBox.x + 256 &&
        mouseY >= cropBox.y && mouseY <= cropBox.y + 256) {
      setDragType('cropbox');
    } else {
      setDragType('image');
    }
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragType) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    if (dragType === 'image') {
      setCropConfig(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
    } else if (dragType === 'cropbox') {
      setCropBox(prev => ({
        x: Math.max(0, Math.min(600 - 256, prev.x + deltaX)),
        y: Math.max(0, Math.min(400 - 256, prev.y + deltaY))
      }));
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
  };

  // 缩放处理
  const handleScaleChange = (value: number) => {
    setCropConfig(prev => ({
      ...prev,
      scale: value / 100
    }));
  };

  // 旋转处理
  const handleRotateLeft = () => {
    setRotation(prev => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // 确认裁剪
  const handleConfirm = () => {
    // 创建新的Canvas，只绘制原始图片，不包含裁剪框
    const img = new Image();
    img.onload = () => {
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = 256;
      outputCanvas.height = 256;
      const outputCtx = outputCanvas.getContext('2d');
      
      if (!outputCtx) return;
      
      // 计算实际图片的裁剪区域
      const imgScale = cropConfig.scale;
      const imgX = (cropBox.x - cropConfig.x) / imgScale;
      const imgY = (cropBox.y - cropConfig.y) / imgScale;
      const imgWidth = 256 / imgScale;
      const imgHeight = 256 / imgScale;
      
      // 直接从原始图片裁剪，不包含任何UI元素
      outputCtx.drawImage(
        img,
        imgX, imgY, imgWidth, imgHeight,
        0, 0, 256, 256
      );
      
      const croppedDataUrl = outputCanvas.toDataURL('image/png', 0.9);
      onConfirm(croppedDataUrl);
    };
    img.src = imageSrc;
  };

  return (
    <Modal
      title="Logo裁剪编辑器"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm}>
          确认裁剪
        </Button>
      ]}
    >
      <div className={`image-cropper ${currentTheme?.meta.id || 'light'}-theme`}>
        <div className="cropper-controls">
          <Space>
            <span>缩放:</span>
            <Slider
              min={10}
              max={200}
              value={cropConfig.scale * 100}
              onChange={handleScaleChange}
              className="crop-scale-slider"
            />
            <Button
              icon={<ZoomInOutlined />}
              onClick={() => handleScaleChange(Math.min(cropConfig.scale * 100 + 10, 200))}
              size="small"
            />
            <Button
              icon={<ZoomOutOutlined />}
              onClick={() => handleScaleChange(Math.max(cropConfig.scale * 100 - 10, 10))}
              size="small"
            />
          </Space>
          
          <Space>
            <span>旋转:</span>
            <Button
              icon={<RotateLeftOutlined />}
              onClick={handleRotateLeft}
              size="small"
            />
            <Button
              icon={<RotateRightOutlined />}
              onClick={handleRotateRight}
              size="small"
            />
          </Space>
        </div>
        
        <div
          ref={containerRef}
          className={`crop-canvas-container ${isDragging ? 'crop-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="cropper-canvas"
          />
        </div>
        
        <div className="cropper-instructions">
          <p>💡 使用说明：</p>
          <ul>
            <li>拖拽图片调整位置</li>
            <li>拖拽裁剪框调整裁剪区域</li>
            <li>使用缩放滑块调整图片大小</li>
            <li>使用旋转按钮调整角度</li>
            <li>蓝色虚线框为裁剪区域 (256×256)</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default ImageCropper;
