# LUXE精选 - 高端电商平台演示系统

这是一个基于 **Vue 3**、**FastAPI** 和 **MySQL** 构建的现代化、全栈电商演示项目。系统采用了极简奢华的设计风格，配备了完整的商品展示及订单流。

## ✨ 核心特性

- **极致美学**: 采用 Vanilla CSS 构建的高级感界面，配备全站微交互与入场动画。
- **动态商品流**: 实时从后端获取数据，展示高清商品卡片与悬浮交互。
- **沉浸式详情**: 深度优化的商品详情页，支持数量选择与动态反馈。
- **智能购物袋**: 实时计算金额，支持商品增减、删除及支付状态流。
- **支付闭环**: 完整的“点击结算 -> 支付成功 -> 订单展示”逻辑。
- **个人中心**: 动态展现用户资料及个人订单统计。
- **全局通知**: 统一风格的 Toast 消息系统。
- **全响应式设计**: 完美适配手机、平板及桌面端。

## 🛠 技术栈

- **前端 (Frontend)**: 
  - 核心框架: Vue 3 (Composition API)
  - 状态管理: Pinia
  - 路由管理: Vue Router
  - 构建工具: Vite
  - 字体方案: Google Fonts (Outfit)
- **后端 (Backend)**:
  - Web 框架: Python FastAPI
  - ORM 映射: SQLAlchemy
  - 数据库驱动: PyMySQL
- **数据库 (Database)**: 
  - 系统: MySQL 8.0
- **部署 (DevOps)**: 
  - 容器化: Docker & Docker Compose

## 🚀 快速启动

### 推荐：使用 Docker 一键启动 (最可靠)

由于项目依赖 MySQL，强烈建议使用 Docker 部署以确保环境一致性。

1.  **清理并启动** (若之前启动报错，请务必执行此步骤以清理旧卷):
    ```bash
    docker-compose down -v
    docker-compose up --build
    ```

2.  **访问项目**:
    - **前端展示**: [http://localhost:2929](http://localhost:2929)
    - **后端 API**: [http://localhost:8000](http://localhost:8000)

### 选项 2：手动本地启动 (需自行配置 MySQL)

#### 1. 后端准备
```bash
cd backend
pip install -r requirements.txt
# 修改 .env 中的 DATABASE_URL
uvicorn main:app --reload
```

#### 2. 前端准备
```bash
cd frontend
npm install
npm run dev
```

## � 项目结构

```text
label-2929/
├── frontend/             # Vue 3 应用
│   ├── src/
│   │   ├── components/   # Toast 组件等
│   │   ├── views/        # 页面视图 (Home, Detail, Cart, Profile)
│   │   ├── store/        # Pinia 全局状态 (处理订单与购物车)
│   │   └── router/       # 路由配置
│   └── Dockerfile
├── backend/              # Python API 系统
│   ├── main.py           # 业务逻辑与自动建表
│   ├── models.py         # 数据库表模型
│   ├── schemas.py        # Pydantic 协议
│   └── Dockerfile
├── database/             # 数据库层
│   └── schema.sql        # MySQL 初始化脚本 (中文商品数据)
└── docker-compose.yml    # 容器编排
```

## ❓ 常见问题排查

- **页面打不开或 500 错误？**
  - 请确保使用 `docker-compose down -v` 彻底清理后再启动。这会清除旧的数据库持久化卷，使最新的 `schema.sql` 能够正确注入数据。
- **端口冲突？**
  - 数据库宿主机端口映射为 `23306`，前端映射为 `2929`，已尽可能避开常用端口。
- **商品还是英文？**
  - 本次更新已将所有初始化数据改为中文。如看到英文，请尝试清理 Docker 卷并重启。

---
*由 Antigravity AI 开发 - 致力于构建更美的 Web 体验。*
