/**
 * 图片处理工具函数
 * 用于Logo和Favicon的自动缩放和裁剪
 */

export interface ImageProcessOptions {
  maxWidth: number;
  maxHeight: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  cropToFit?: boolean;
}

export interface ProcessedImage {
  dataUrl: string;
  file: File;
  width: number;
  height: number;
}

/**
 * 创建Canvas元素
 */
function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * 加载图片
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 计算缩放后的尺寸
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  cropToFit: boolean = false
): { width: number; height: number; offsetX: number; offsetY: number } {
  const aspectRatio = originalWidth / originalHeight;
  const maxAspectRatio = maxWidth / maxHeight;

  let width: number;
  let height: number;
  let offsetX = 0;
  let offsetY = 0;

  if (cropToFit) {
    // 裁剪模式：保持目标尺寸，裁剪多余部分
    if (aspectRatio > maxAspectRatio) {
      // 原图更宽，以高度为准
      height = maxHeight;
      width = height * aspectRatio;
      offsetX = -(width - maxWidth) / 2;
    } else {
      // 原图更高，以宽度为准
      width = maxWidth;
      height = width / aspectRatio;
      offsetY = -(height - maxHeight) / 2;
    }
    
    return {
      width: maxWidth,
      height: maxHeight,
      offsetX,
      offsetY
    };
  } else {
    // 缩放模式：保持比例，适应尺寸
    if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
      return { width: originalWidth, height: originalHeight, offsetX: 0, offsetY: 0 };
    }

    if (aspectRatio > maxAspectRatio) {
      // 原图更宽，以宽度为准
      width = maxWidth;
      height = width / aspectRatio;
    } else {
      // 原图更高，以高度为准
      height = maxHeight;
      width = height * aspectRatio;
    }

    return { width, height, offsetX: 0, offsetY: 0 };
  }
}

/**
 * 处理图片
 */
export async function processImage(
  file: File,
  options: ImageProcessOptions
): Promise<ProcessedImage> {
  const { maxWidth, maxHeight, quality = 0.9, format = 'jpeg', cropToFit = false } = options;

  try {
    // 读取文件
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });

    // 加载图片
    const img = await loadImage(dataUrl);
    
    // 计算尺寸
    const { width, height, offsetX, offsetY } = calculateDimensions(
      img.width,
      img.height,
      maxWidth,
      maxHeight,
      cropToFit
    );

    // 创建Canvas
    const canvas = createCanvas(maxWidth, maxHeight);
    const ctx = canvas.getContext('2d')!;

    // 设置背景色（透明背景）
    if (format === 'jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, maxWidth, maxHeight);
    }

    // 绘制图片
    ctx.drawImage(img, offsetX, offsetY, width, height);

    // 转换为Blob
    const processedDataUrl = canvas.toDataURL(`image/${format}`, quality);
    
    // 转换为File对象
    const processedFile = await new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const newFile = new File([blob], file.name, {
            type: `image/${format}`,
            lastModified: Date.now()
          });
          resolve(newFile);
        }
      }, `image/${format}`, quality);
    });

    return {
      dataUrl: processedDataUrl,
      file: processedFile,
      width: maxWidth,
      height: maxHeight
    };
  } catch (error) {
    console.error('图片处理失败:', error);
    throw new Error('图片处理失败');
  }
}

/**
 * Logo专用处理函数 - 32×32像素 (系统区域)
 */
export async function processLogo32(file: File): Promise<ProcessedImage> {
  return processImage(file, {
    maxWidth: 32,
    maxHeight: 32,
    quality: 0.9,
    format: 'png',
    cropToFit: true
  });
}

/**
 * Logo专用处理函数 - 64×64像素 (登录页面)
 */
export async function processLogo64(file: File): Promise<ProcessedImage> {
  return processImage(file, {
    maxWidth: 64,
    maxHeight: 64,
    quality: 0.9,
    format: 'png',
    cropToFit: true
  });
}

/**
 * Logo专用处理函数 - 256×256像素 (统一规格)
 */
export async function processLogo256(file: File): Promise<ProcessedImage> {
  return processImage(file, {
    maxWidth: 256,
    maxHeight: 256,
    quality: 0.9,
    format: 'png',
    cropToFit: true
  });
}

/**
 * Logo等比例缩放处理函数
 */
export async function processLogoProportional(file: File): Promise<ProcessedImage> {
  return processImage(file, {
    maxWidth: 128,
    maxHeight: 128,
    quality: 0.9,
    format: 'png',
    cropToFit: false // 等比例缩放，不裁剪
  });
}

/**
 * Favicon专用处理函数
 */
export async function processFavicon(file: File): Promise<ProcessedImage> {
  return processImage(file, {
    maxWidth: 32,
    maxHeight: 32,
    quality: 0.9,
    format: 'png',
    cropToFit: true
  });
}

/**
 * 自定义裁剪配置
 */
export interface CropConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 自定义裁剪图片
 */
export async function cropImage(
  file: File,
  cropConfig: CropConfig,
  targetWidth: number,
  targetHeight: number
): Promise<ProcessedImage> {
  try {
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });

    const img = await loadImage(dataUrl);
    const canvas = createCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d')!;

    // 绘制裁剪后的图片
    ctx.drawImage(
      img,
      cropConfig.x,
      cropConfig.y,
      cropConfig.width,
      cropConfig.height,
      0,
      0,
      targetWidth,
      targetHeight
    );

    const processedDataUrl = canvas.toDataURL('image/png', 0.9);
    
    const processedFile = await new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const newFile = new File([blob], file.name, {
            type: 'image/png',
            lastModified: Date.now()
          });
          resolve(newFile);
        }
      }, 'image/png', 0.9);
    });

    return {
      dataUrl: processedDataUrl,
      file: processedFile,
      width: targetWidth,
      height: targetHeight
    };
  } catch (error) {
    console.error('图片裁剪失败:', error);
    throw new Error('图片裁剪失败');
  }
}

/**
 * 交互式裁剪配置
 */
export interface InteractiveCropConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

/**
 * 验证图片文件 - 支持256×256以上
 */
export function validateImageFile(file: File): { valid: boolean; message?: string } {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    return { valid: false, message: '请选择图片文件' };
  }

  // 检查文件大小 (10MB - 支持更大图片)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, message: '图片文件大小不能超过10MB' };
  }

  // 检查支持的格式
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, message: '仅支持 JPEG、PNG、GIF、WebP 格式' };
  }

  return { valid: true };
}

/**
 * 检查图片尺寸是否满足256×256以上要求
 */
export function validateImageDimensions(file: File): Promise<{ valid: boolean; message?: string; width?: number; height?: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      
      if (width < 256 || height < 256) {
        resolve({ 
          valid: false, 
          message: `图片尺寸为 ${width}×${height}，建议上传 256×256 像素以上的图片以获得更好的显示效果`,
          width,
          height
        });
      } else {
        resolve({ valid: true, width, height });
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, message: '无法读取图片尺寸' });
    };
    
    img.src = url;
  });
}

/**
 * 交互式裁剪图片
 */
export async function cropImageInteractive(
  file: File, 
  config: InteractiveCropConfig, 
  targetSize: { width: number; height: number } = { width: 256, height: 256 }
): Promise<ProcessedImage> {
  try {
    const img = await loadImage(file);
    const canvas = createCanvas(targetSize.width, targetSize.height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('无法获取Canvas上下文');
    }

    // 计算源图片的实际尺寸（考虑缩放）
    const sourceWidth = config.width / config.scale;
    const sourceHeight = config.height / config.scale;
    
    // 计算目标位置
    const sourceX = config.x / config.scale;
    const sourceY = config.y / config.scale;
    
    // 绘制裁剪后的图片
    ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, targetSize.width, targetSize.height
    );
    
    // 转换为DataURL
    const dataUrl = canvas.toDataURL('image/png', 0.9);
    const size = Math.round((dataUrl.length * 3) / 4);
    
    return {
      dataUrl,
      width: targetSize.width,
      height: targetSize.height,
      format: 'png',
      size,
      originalWidth: img.width,
      originalHeight: img.height
    };
  } catch (error) {
    console.error('交互式裁剪失败:', error);
    throw new Error('图片裁剪失败');
  }
}
