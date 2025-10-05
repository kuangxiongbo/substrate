/**
 * 懒加载图片组件
 * 提供图片懒加载、占位符、错误处理等功能
 */
import React, { useState, useRef, useEffect } from 'react';
import { Spin, Image } from 'antd';
import { imageLazyLoader } from '../utils/performance';
import '../styles/lazy-image.css';

export interface LazyImageProps {
  src: string;
  alt?: string;
  placeholder?: React.ReactNode;
  errorPlaceholder?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt = '',
  placeholder,
  errorPlaceholder,
  className = '',
  style,
  width,
  height,
  fallback,
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (loading === 'lazy' && imgRef.current) {
      const img = imgRef.current;
      
      imageLazyLoader.observe(img);
      
      // 监听进入视口事件
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '50px' }
      );
      
      observer.observe(img);
      
      return () => {
        observer.unobserve(img);
        imageLazyLoader.unobserve(img);
      };
    }
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  const defaultPlaceholder = (
    <div 
      className="lazy-image-placeholder"
      style={{ width, height }}
    >
      <Spin size="small" />
    </div>
  );

  const defaultErrorPlaceholder = (
    <div 
      className="lazy-image-error"
      style={{ width, height }}
    >
      <div className="error-icon">📷</div>
      <div className="error-text">加载失败</div>
    </div>
  );

  if (isError) {
    return (
      <div className={`lazy-image-container ${className}`} style={style}>
        {errorPlaceholder || defaultErrorPlaceholder}
      </div>
    );
  }

  if (!isInView) {
    return (
      <div className={`lazy-image-container ${className}`} style={style}>
        <img
          ref={imgRef}
          data-src={src}
          alt={alt}
          style={{ width, height }}
          className="lazy-image-hidden"
        />
        {placeholder || defaultPlaceholder}
      </div>
    );
  }

  return (
    <div className={`lazy-image-container ${className}`} style={style}>
      {!isLoaded && (placeholder || defaultPlaceholder)}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ display: isLoaded ? 'block' : 'none' }}
        onLoad={handleLoad}
        onError={handleError}
        fallback={fallback}
        preview={{
          mask: '点击预览',
        }}
      />
    </div>
  );
};

export default LazyImage;
