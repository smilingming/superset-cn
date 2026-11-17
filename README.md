# Superset 中文定制源码

从 SB 实际工作树交付的 Apache Superset Python / React 完整应用源码，包含未提交的中文修改、增强矩阵表及高级透视表插件。仓库为 Private。

- [中文交付与 Linux 源码构建说明](docs/README_CN_HANDOFF.md)
- [源码来源及范围](docs/SOURCE_PROVENANCE.md)
- [静态验收与已知限制](docs/SOURCE_ACCEPTANCE.md)
- [原始上游 README](docs/README_UPSTREAM.md)
- [Owner 设计](docs/superpowers/specs/2026-11-17-superset-cn-source-handoff-design.md) / [实施计划](docs/superpowers/plans/2026-11-17-superset-cn-source-import.md)

```bash
git clone https://github.com/smilingming/superset-cn.git
cd superset-cn
python3 tools/verify_source_handoff.py
```

需有此私有仓库读取权限。应用源码已展开为普通 Git 文件；8 个缺失的上游 CI action 子模块单独记录，不影响核心源码下载。本次不承诺源码编译、Linux 部署或运行功能验收。
