# 中文源码交接与 Linux 裸机构建

## 下载与源码核验

同事需先获得该 Private 仓库读取权限。默认 main 为正式交付分支。克隆后运行 `python3 tools/verify_source_handoff.py`，检查 10,017 项来源清单、SHA256、符号链接和 Git mode。工作区应为干净状态。构建会生成文件并改变部分静态资源，请先完成源码核验。

## 版本与目录

这是 SB 固定开发快照，package.json 版本为 0.0.0-dev，不要把它当作已验收的官方稳定发布。Python 声明 >=3.10，分类器列出 3.10/3.11/3.12；前端 engines 声明 Node ^24.16.0、npm ^11.13.0。以本仓库 pyproject.toml、requirements/base.txt、superset-frontend/package.json 和 package-lock.json 为依据。

- `superset/`：后端，含原始各语言翻译；`superset-core/`：本地 Python 依赖包。
- `superset-frontend/`：React、包、图表插件和测试；中文界面改动已直接保留在核心文件。
- `customization/overlay/i18n/`：独立的中文 PO / MO / JSON。
- `customization/overlay/assets/branding/`：4 个 Logo / favicon / loading 图片。
- `customization/overlay/config/`：原始品牌和中文配置参考，不能原封不动作为裸机生产配置。
- `tests/`、前端 `spec/`、各插件测试：原始测试源码。

## 在接收方新开发环境构建（本次未执行）

以下命令仅供接收方在全新 Linux 开发环境执行。需要联网解析锁定依赖、编译工具与对应数据库驱动；依赖可获取性和系统兼容性尚未验收。不要在 SB 原始运行目录执行。

```bash
python3.12 -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements/base.txt
python -m pip install -e .

# 在编译前应用完整中文资源，避免改用核心目录中较旧的语言包
cp customization/overlay/i18n/superset/translations/zh/LC_MESSAGES/messages.{po,mo,json} superset/translations/zh/LC_MESSAGES/
cd superset-frontend
npm ci
npm run build
cd ..

# 构建后复制品牌资源，避免构建步骤清空输出目录
mkdir -p superset/static/assets/images/custom
cp customization/overlay/assets/branding/* superset/static/assets/images/custom/
```

本次交付的 MO/JSON 已与 PO 逐条比对，可直接作为当前源资源。修改 PO 后可使用项目的 Babel 与 `npm run build-translation` 重新生成资源，但须先处理 SOURCE_TRANSLATIONS.json 中的 14 项现有格式告警，重新对照编译结果；不要宣称翻译已经零缺陷。

## 配置与运行交接

在仓库外编写接收方 `superset_config.py`，从 overlay/config 选择中文及品牌设置。该文件原有示例数据库地址使用容器主机名，裸机环境必须改为实际配置或移除示例数据库设置。元数据库连接、SECRET_KEY、缓存和 Celery 地址从受控环境/配置读取；不要复用开发默认口令。通过 SUPERSET_CONFIG_PATH 指向外部配置。元数据库初始化、管理员创建、Gunicorn/worker/Redis/PostgreSQL 配置由接收方按原始文档与实际环境另行执行，本任务没有迁移 SB 元数据库或用户数据。

## 测试及限制

原始 Python 测试使用 pytest，前端使用 `npm run test -- <file>`；它们需要独立开发依赖和测试环境，本次未安装也未执行。需要重点回归登录、菜单、图表格式化、增强矩阵、高级透视表和中文切换。SB 原有 worker 在迁移前显示 unhealthy，不属于本次修复范围。8 个 CI action 子模块没有源码，已记录；上游 CI workflow 只作为参考归档。此交付证明源码可以下载与校验，不证明构建或 Linux 生产部署成功。
