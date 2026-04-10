/**
 * 简洁鼠标轨迹效果 - 优化版
 * 使用简单的圆点代替线条，更加优雅不花哨
 */
function initMouseTrail() {
    const config = {
        maxDots: 8,        // 圆点数量
        dotSize: 4,        // 圆点大小
        fadeSpeed: 0.15,   // 淡出速度
        color: 'rgba(100, 149, 237, 0.6)' // 柔和的蓝色
    };
    
    // 创建容器
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    document.body.appendChild(container);

    const dots = [];
    let mouseX = 0, mouseY = 0;
    let isMoving = false;
    let moveTimeout;

    // 创建圆点元素
    for (let i = 0; i < config.maxDots; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: absolute;
            width: ${config.dotSize}px;
            height: ${config.dotSize}px;
            background: ${config.color};
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
        `;
        container.appendChild(dot);
        dots.push({
            element: dot,
            x: 0,
            y: 0,
            delay: i * 2
        });
    }

    // 鼠标移动监听
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
        }, 100);
    });

    // 动画循环
    function animate() {
        dots.forEach((dot, index) => {
            if (isMoving || dot.element.style.opacity > 0) {
                // 跟随效果，每个点有延迟
                const targetX = mouseX;
                const targetY = mouseY;
                
                dot.x += (targetX - dot.x) * (0.15 + index * 0.02);
                dot.y += (targetY - dot.y) * (0.15 + index * 0.02);
                
                dot.element.style.left = dot.x + 'px';
                dot.element.style.top = dot.y + 'px';
                
                // 根据索引设置透明度，形成渐变效果
                const opacity = isMoving ? 1 - (index / config.maxDots) * 0.7 : 
                               parseFloat(dot.element.style.opacity || 1) - config.fadeSpeed;
                dot.element.style.opacity = Math.max(0, opacity);
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// 检测文档加载状态，适时启动鼠标拖尾效果
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMouseTrail);
} else {
    initMouseTrail();
}
