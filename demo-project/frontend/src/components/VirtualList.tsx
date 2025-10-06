/**
 * 虚拟滚动列表组件
 * 用于处理大量数据的列表渲染
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VirtualScrollManager } from '../utils/performance';
import '../styles/virtual-list.css';

export interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
  renderItem,
  className = '',
  style,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<VirtualScrollManager>();

  // 初始化虚拟滚动管理器
  useEffect(() => {
    managerRef.current = new VirtualScrollManager({
      itemHeight,
      containerHeight,
      overscan,
    });
  }, [itemHeight, containerHeight, overscan]);

  // 处理滚动事件
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  // 获取可见范围
  const getVisibleRange = useCallback(() => {
    if (!managerRef.current) return { start: 0, end: 0 };
    
    managerRef.current.updateScroll(scrollTop);
    return managerRef.current.getVisibleRange(items.length);
  }, [scrollTop, items.length]);

  const { start, end } = getVisibleRange();
  const visibleItems = items.slice(start, end);

  // 计算总高度和偏移量
  const totalHeight = items.length * itemHeight;
  const offsetY = start * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`virtual-list-container ${className}`}
      style={{
        height: containerHeight,
        overflow: 'auto',
        ...style,
      }}
      onScroll={handleScroll}
    >
      <div
        className="virtual-list-content"
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        <div
          className="virtual-list-items"
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => {
            const actualIndex = start + index;
            return (
              <div
                key={actualIndex}
                className="virtual-list-item"
                style={{
                  height: itemHeight,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VirtualList;



