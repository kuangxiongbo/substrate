"""
图形验证码API
提供验证码生成和验证功能
"""
import uuid
import base64
import io
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from PIL import Image, ImageDraw, ImageFont
import random
import string
import time

from src.database import get_db
from src.models import SystemConfig

router = APIRouter()

# 验证码存储（生产环境应使用Redis）
captcha_storage: Dict[str, Dict[str, Any]] = {}

def generate_captcha_text(length: int = 4) -> str:
    """生成验证码文本"""
    # 使用数字和大写字母，避免容易混淆的字符
    chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
    return ''.join(random.choices(chars, k=length))

def create_captcha_image(text: str, width: int = 120, height: int = 40) -> bytes:
    """创建验证码图片"""
    # 创建图片
    image = Image.new('RGB', (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(image)
    
    # 尝试使用系统字体，如果失败则使用默认字体
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 24)
    except:
        try:
            font = ImageFont.truetype("arial.ttf", 24)
        except:
            font = ImageFont.load_default()
    
    # 绘制背景干扰线
    for _ in range(5):
        x1 = random.randint(0, width)
        y1 = random.randint(0, height)
        x2 = random.randint(0, width)
        y2 = random.randint(0, height)
        draw.line([(x1, y1), (x2, y2)], fill=(random.randint(100, 200), random.randint(100, 200), random.randint(100, 200)), width=1)
    
    # 绘制验证码文字
    char_width = width // len(text)
    for i, char in enumerate(text):
        x = i * char_width + random.randint(0, 10)
        y = random.randint(5, 15)
        color = (random.randint(0, 100), random.randint(0, 100), random.randint(0, 100))
        draw.text((x, y), char, font=font, fill=color)
    
    # 添加噪点
    for _ in range(100):
        x = random.randint(0, width)
        y = random.randint(0, height)
        draw.point((x, y), fill=(random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)))
    
    # 转换为字节
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    
    return img_byte_arr

@router.get("/captcha/generate", summary="生成图形验证码")
async def generate_captcha():
    """
    生成图形验证码
    返回验证码图片和验证码ID
    """
    try:
        # 生成验证码
        captcha_id = str(uuid.uuid4())
        captcha_text = generate_captcha_text()
        
        # 创建图片
        image_bytes = create_captcha_image(captcha_text)
        
        # 存储验证码（5分钟过期）
        captcha_storage[captcha_id] = {
            "text": captcha_text.upper(),
            "created_at": time.time(),
            "expires_at": time.time() + 300  # 5分钟
        }
        
        # 转换为base64
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')
        
        return {
            "captcha_id": captcha_id,
            "image": f"data:image/png;base64,{image_base64}",
            "expires_in": 300
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"生成验证码失败: {str(e)}"
        )

@router.post("/captcha/verify", summary="验证图形验证码")
async def verify_captcha(
    captcha_id: str,
    captcha_text: str,
    db: Session = Depends(get_db)
):
    """
    验证图形验证码
    """
    try:
        # 检查验证码是否存在
        if captcha_id not in captcha_storage:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="验证码不存在或已过期"
            )
        
        captcha_data = captcha_storage[captcha_id]
        
        # 检查是否过期
        if time.time() > captcha_data["expires_at"]:
            del captcha_storage[captcha_id]
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="验证码已过期"
            )
        
        # 验证文本（不区分大小写）
        if captcha_text.upper() != captcha_data["text"]:
            # 验证失败，删除验证码
            del captcha_storage[captcha_id]
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="验证码错误"
            )
        
        # 验证成功，删除验证码
        del captcha_storage[captcha_id]
        
        return {
            "success": True,
            "message": "验证码验证成功"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"验证码验证失败: {str(e)}"
        )

@router.get("/captcha/cleanup", summary="清理过期验证码")
async def cleanup_expired_captchas():
    """
    清理过期的验证码
    """
    try:
        current_time = time.time()
        expired_ids = []
        
        for captcha_id, captcha_data in captcha_storage.items():
            if current_time > captcha_data["expires_at"]:
                expired_ids.append(captcha_id)
        
        for captcha_id in expired_ids:
            del captcha_storage[captcha_id]
        
        return {
            "cleaned_count": len(expired_ids),
            "remaining_count": len(captcha_storage)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"清理验证码失败: {str(e)}"
        )











