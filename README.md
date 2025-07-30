# 工程设备监控平台 (Crane Vista Hub)

这是一个全栈项目，旨在提供一个工程设备（如塔式起重机和混凝土搅拌机）的实时监控仪表盘。

## ✨ 项目概述

本项目包含一个前端应用程序和一个后端服务：

*   **前端**: 使用 React 和 TypeScript 构建的现代化、响应式用户界面，能够实时显示从后端接收到的设备状态和传感器数据。
*   **后端**: 使用 Java Spring Boot 构建的 RESTful API 和 WebSocket 服务，负责处理数据、与数据库交互，并将实时更新推送给前端。

## 🛠️ 技术栈

### 前端

*   **框架**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **语言**: [TypeScript](https://www.typescriptlang.org/)
*   **UI 组件库**: [shadcn/ui](https://ui.shadcn.com/)
*   **CSS**: [Tailwind CSS](https://tailwindcss.com/)
*   **数据请求**: [@tanstack/react-query](https://tanstack.com/query/latest)
*   **WebSocket**: [@stomp/stompjs](https://stomp-js.github.io/) & [SockJS](https://github.com/sockjs/sockjs-client)

### 后端

*   **框架**: [Spring Boot](https://spring.io/projects/spring-boot)
*   **语言**: [Java 11](https://www.java.com/)
*   **数据库**: [MySQL](https://www.mysql.com/)
*   **数据持久化**: Spring Data JPA
*   **实时通信**: Spring WebSocket (STOMP)

## 🚀 如何运行项目

### 1. 环境准备

*   安装 [Node.js](https://nodejs.org/) (v18 或更高版本)
*   安装 [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/) (v11)
*   安装 [Apache Maven](https://maven.apache.org/)
*   安装并运行 [MySQL](https://www.mysql.com/) 数据库服务

### 2. 数据库设置

1.  登录到你的 MySQL 实例。
2.  创建一个新的数据库（例如 `crane_vista_hub`）。
3.  执行位于 `crane-vista-hub-backend` 根目录下的 `database_init.sql` 脚本来创建 `equipment` 表并插入初始数据。

### 3. 启动后端服务

1.  导航到后端项目目录:
    ```bash
    cd crane-vista-hub-backend
    ```
2.  在 `src/main/resources/application.properties` 文件中，根据你的环境配置数据库连接信息（URL, username, password）。
3.  使用 Maven 运行 Spring Boot 应用:
    ```bash
    mvn spring-boot:run
    ```
4.  后端服务将启动在 `http://localhost:8080`。

### 4. 启动前端应用

1.  打开一个新的终端，导航到前端项目目录:
    ```bash
    cd crane-vista-hub
    ```
2.  安装项目依赖:
    ```bash
    npm install
    ```
3.  启动 Vite 开发服务器:
    ```bash
    npm run dev
    ```
4.  前端应用将启动在 `http://localhost:8081` (或终端中提示的其他端口)。

## 📡 API & WebSocket

### REST API

*   `GET /api/equipment`
    *   获取所有设备的完整列表。

*   `POST /api/equipment/update`
    *   接收传感器数据，更新指定设备的信息，并触发 WebSocket 推送。
    *   请求体示例:
        ```json
        {
          "code": "TC-001",
          "status": "warning",
          "windSpeed": 15.5
        }
        ```

### WebSocket

*   **端点**: `ws://localhost:8080/ws`
*   **订阅主题**: `/topic/equipment-updates`
    *   当任何设备信息通过 `POST /api/equipment/update` 接口更新后，此主题会广播最新的**完整设备列表**。
