#!/usr/bin/env python3
"""
Travel AI 智能旅游平台 - 统一启动入口
=====================================
用法:
  python start.py                  全部启动 (Docker)
  python start.py --mode local     本地逐个启动
  python start.py --only ai        仅启动 AI 核心
  python start.py --status         查看状态
  python start.py --stop           停止全部
  python start.py --init           首次初始化
"""

import argparse, json, os, platform, shutil, signal, socket, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
IS_WIN = platform.system() == "Windows"

# ──────────────── 服务定义 ────────────────

SERVICES = {
    "postgres":    {"port": 5432,  "group": "data"},
    "redis":       {"port": 6379,  "group": "data"},
    "elasticsearch":{"port": 9200, "group": "data"},
    "milvus":      {"port": 19530, "group": "data"},
    "rocketmq":    {"port": 9876,  "group": "data"},
    "eureka":      {"port": 8761,  "group": "infra"},
    "gateway":           {"port": 8080, "group": "backend"},
    "user-service":      {"port": 8081, "group": "backend"},
    "product-service":   {"port": 8082, "group": "backend"},
    "order-service":     {"port": 8083, "group": "backend"},
    "payment-service":   {"port": 8084, "group": "backend"},
    "recommend-service": {"port": 8085, "group": "backend"},
    "notification-service":{"port": 8086,"group": "backend"},
    "ai-core":     {"port": 8000,  "group": "ai"},
    "frontend":    {"port": 3000,  "group": "frontend"},
    "admin":       {"port": 3001,  "group": "frontend"},
    "prometheus":  {"port": 9090,  "group": "monitor"},
    "grafana":     {"port": 3100,  "group": "monitor"},
}

GROUPS = {"data":"数据层","infra":"基础设施","backend":"后端微服务",
          "ai":"AI 核心","frontend":"前端","monitor":"监控"}

# ──────────────── 终端输出 ────────────────

class C:
    BOLD="\033[1m"; DIM="\033[2m"; RESET="\033[0m"
    GREEN="\033[92m"; YELLOW="\033[93m"; RED="\033[91m"
    CYAN="\033[96m"; BLUE="\033[94m"

def log(msg, tag="info"):
    icons = {"info":"ℹ️","ok":"✅","warn":"⚠️","err":"❌","run":"🚀","stop":"🛑"}
    print(f"  {icons.get(tag,'  ')} {msg}")

def banner():
    print(f"""
{C.BOLD}{C.CYAN}
  ╔══════════════════════════════════════════════╗
  ║      🧳  Travel AI  智能旅游平台启动器      ║
  ║  AI 行程规划 · 智能推荐 · 一站式预订 · RAG  ║
  ╚══════════════════════════════════════════════╝
{C.RESET}""")

# ──────────────── 工具函数 ────────────────

def port_open(port, host="localhost", timeout=1.0):
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except OSError:
        return False

def wait_port(port, host="localhost", timeout=60):
    t0 = time.time()
    while time.time() - t0 < timeout:
        if port_open(port, host, 2):
            return True
        time.sleep(1)
    return False

def run(cmd, cwd=None, env=None, capture=False):
    """安全执行命令，文件找不到时返回失败而不是崩溃"""
    e = {**os.environ, **(env or {})}
    try:
        return subprocess.run(cmd, cwd=str(cwd or ROOT), env=e,
                              capture_output=capture, text=True)
    except FileNotFoundError:
        class _R:  # 模拟 CompletedProcess
            returncode = -1
            stdout = ""
            stderr = f"命令未找到: {cmd[0]}"
        return _R()

def which(name):
    """检查命令是否可用"""
    p = shutil.which(name)
    if p:
        return True
    # Windows 额外尝试
    if IS_WIN:
        for ext in (".cmd", ".bat", ".exe"):
            if shutil.which(name + ext):
                return True
    return False

def load_env():
    env_file = ROOT / ".env"
    if not env_file.exists():
        example = ROOT / ".env.example"
        if example.exists():
            shutil.copy(example, env_file)
            log("已从 .env.example 创建 .env — 请填入实际配置", "warn")
        return
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith(("#", "//")):
            continue
        if "=" in line:
            k, _, v = line.partition("=")
            os.environ.setdefault(k.strip(), v.strip())

def detect_dc_cmd():
    r = run(["docker", "compose", "version"], capture=True)
    return ["docker", "compose"] if r.returncode == 0 else ["docker-compose"]

# ──────────────── 检查 ────────────────

def check_prereqs():
    checks = {}
    checks["docker"] = which("docker")
    try:
        checks["docker-compose"] = run(detect_dc_cmd()+["version"], capture=True).returncode == 0
    except Exception:
        checks["docker-compose"] = False
    checks["python>=3.11"] = sys.version_info >= (3, 11)

    r = run(["node", "--version"], capture=True)
    try:
        checks["node>=18"] = r.returncode == 0 and int(r.stdout.strip().lstrip("v").split(".")[0]) >= 18
    except (ValueError, IndexError):
        checks["node>=18"] = False

    checks["java"] = which("java")
    checks["pnpm"] = which("pnpm")
    checks["npm"] = which("npm")
    checks["pip"] = True  # 已经在运行 Python
    return checks


def print_install_hint(missing):
    """按操作系统打印安装命令"""
    is_w = IS_WIN
    hints = {}

    if "docker" in missing:
        if is_w:
            hints["docker"] = (
                "  安装 Docker Desktop (Windows):\n"
                "    1. 下载: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe\n"
                "    2. 安装后启动，启用 WSL2 后端\n"
                "    3. 重启电脑后打开 PowerShell 验证: docker --version"
            )
        else:
            hints["docker"] = (
                "  安装 Docker:\n"
                "    Ubuntu: sudo apt install docker.io && sudo systemctl start docker\n"
                "    macOS:  brew install --cask docker\n"
                "    参考: https://docs.docker.com/get-docker/"
            )

    if "docker-compose" in missing:
        if is_w:
            hints["docker-compose"] = "  Docker Desktop 自带 docker compose，安装 Docker Desktop 即可"
        else:
            hints["docker-compose"] = (
                "  Docker Compose:\n"
                "    Docker Desktop 自带; Linux: sudo apt install docker-compose-plugin"
            )

    if "java" in missing:
        if is_w:
            hints["java"] = (
                "  安装 Java 17+ (Windows):\n"
                "    方式1 (推荐): winget install Microsoft.OpenJDK.17\n"
                "    方式2: https://adoptium.net/ 下载安装\n"
                "    安装后重启 PowerShell，验证: java --version\n"
                "    (后端微服务需要，只用 AI+前端可跳过)"
            )
        else:
            hints["java"] = (
                "  安装 Java 17+:\n"
                "    Ubuntu: sudo apt install openjdk-17-jdk\n"
                "    macOS:  brew install openjdk@17\n"
                "    (后端微服务需要，只用 AI+前端可跳过)"
            )

    if "pnpm" in missing and "npm" not in missing:
        if is_w:
            hints["pnpm"] = (
                "  安装 pnpm (Windows PowerShell 管理员):\n"
                "    npm install -g pnpm\n"
                "    或: iwr https://get.pnpm.io/install.ps1 -useb | iex"
            )
        else:
            hints["pnpm"] = (
                "  安装 pnpm:\n"
                "    npm install -g pnpm\n"
                "    或: corepack enable && corepack prepare pnpm@latest --activate"
            )

    if "npm" in missing:
        if is_w:
            hints["npm"] = (
                "  npm 未找到。Node.js 应自带 npm。\n"
                "    检查: 系统环境变量 PATH 是否包含 Node.js 安装目录\n"
                "    例如: C:\\Program Files\\nodejs\\\n"
                "    或重新安装 Node.js: https://nodejs.org/"
            )
        else:
            hints["npm"] = "  npm 未找到，请重新安装 Node.js: https://nodejs.org/"

    for m in missing:
        if m in hints:
            print(f"\n{C.YELLOW}{hints[m]}{C.RESET}")


def try_install_pnpm():
    """尝试安装 pnpm，Windows/Linux 分别处理"""
    # 先试 corepack (Node.js 16.13+ 自带)
    log("尝试安装 pnpm...", "run")

    # 方式1: corepack
    r = run(["corepack", "enable"], capture=True)
    if r.returncode == 0:
        run(["corepack", "prepare", "pnpm@latest", "--activate"], capture=True)
        if which("pnpm"):
            log("pnpm 已通过 corepack 安装", "ok")
            return True

    # 方式2: npm install -g
    if which("npm"):
        r = run(["npm", "install", "-g", "pnpm"], capture=True)
        if r.returncode == 0 or which("pnpm"):
            log("pnpm 已通过 npm 安装", "ok")
            return True

    log("pnpm 安装失败，请手动安装（见上方提示）", "warn")
    return False

# ──────────────── Docker 模式 ────────────────

def dc(*args):
    return run(detect_dc_cmd() + ["-f", str(ROOT/"docker-compose.yml"), *args])

def docker_up(groups=None):
    svcs = [s for s, info in SERVICES.items() if info["group"] in groups] if groups else None
    dc("up", "-d", *(svcs or []))

def docker_down():
    dc("down")

# ──────────────── 本地模式 ────────────────

def make_local_cmds(pnpm_cmd="pnpm"):
    """构建本地启动命令表 (动态选 pnpm/npm)"""
    return {
        "ai-core": lambda: subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "main:app",
             "--host", "0.0.0.0", "--port", "8000", "--reload"],
            cwd=str(ROOT/"ai-core"),
            env={**os.environ, "MILVUS_HOST":"localhost",
                 "REDIS_HOST":"localhost", "DB_HOST":"localhost"}),
        "frontend": lambda: subprocess.Popen(
            [pnpm_cmd, "dev"],
            cwd=str(ROOT/"frontend"),
            env={**os.environ,
                 "NEXT_PUBLIC_API_URL":"http://localhost:8080",
                 "NEXT_PUBLIC_AI_URL":"http://localhost:8000"}),
        "admin": lambda: subprocess.Popen(
            [pnpm_cmd, "dev"], cwd=str(ROOT/"admin")),
    }

def local_start(groups=None):
    procs = {}
    pm = "pnpm" if which("pnpm") else ("npm" if which("npm") else None)
    local_cmds = make_local_cmds(pm or "pnpm")

    # 数据层走 Docker
    if groups is None or "data" in groups:
        if which("docker"):
            log("启动数据层 (Docker)...", "run")
            docker_up(["data"])
            for svc in ("postgres","redis","elasticsearch","milvus","rocketmq"):
                p = SERVICES[svc]["port"]
                if wait_port(p, timeout=60):
                    log(f"{svc} (: {p}) 就绪", "ok")
                else:
                    log(f"{svc} (: {p}) 超时", "warn")
        else:
            log("Docker 不可用 — 请手动启动 PostgreSQL/Redis/Milvus 等数据层", "warn")

    # AI 核心
    if (groups is None or "ai" in groups):
        req = ROOT / "ai-core" / "requirements.txt"
        if req.exists():
            log("检查 AI 核心依赖...", "info")
            run([sys.executable, "-m", "pip", "install", "-r", str(req), "-q"], capture=True)
        log("启动 AI 核心...", "run")
        proc = local_cmds["ai-core"]()
        procs["ai-core"] = proc
        log(f"AI 核心 PID={proc.pid}", "ok")

    # 前端
    if (groups is None or "frontend" in groups) and pm:
        for svc in ("frontend", "admin"):
            dir_ = ROOT / svc
            if dir_.exists():
                log(f"启动 {svc}...", "run")
                if not (dir_/"node_modules").exists():
                    run([pm, "install"], cwd=dir_)
                proc = local_cmds[svc]()
                procs[svc] = proc
                log(f"{svc} PID={proc.pid}", "ok")
    elif groups is None or "frontend" in groups:
        log("npm/pnpm 均不可用，跳过前端启动", "warn")

    pid_file = ROOT / ".pids.json"
    with open(pid_file, "w") as f:
        json.dump({k: v.pid for k, v in procs.items()}, f)

def local_stop():
    pid_file = ROOT / ".pids.json"
    if not pid_file.exists():
        return
    with open(pid_file) as f:
        pids = json.load(f)
    for name, pid in pids.items():
        try:
            if IS_WIN:
                subprocess.run(["taskkill", "/PID", str(pid), "/F"], capture_output=True)
            else:
                os.kill(pid, signal.SIGTERM)
            log(f"停止 {name} (PID {pid})", "stop")
        except (ProcessLookupError, OSError):
            pass
    pid_file.unlink()

# ──────────────── 初始化 ────────────────

def init():
    banner()
    log(f"系统: {platform.system()} {platform.release()}", "info")
    log(f"Python: {sys.version.split()[0]}", "info")
    log("环境初始化...", "run")

    prereqs = check_prereqs()
    print(f"\n  {C.BOLD}前置依赖:{C.RESET}")
    missing = []
    for name, ok in prereqs.items():
        icon = f"{C.GREEN}✓{C.RESET}" if ok else f"{C.RED}✗{C.RESET}"
        print(f"    {icon} {name}")
        if not ok:
            missing.append(name)

    # 打印安装提示
    critical = [m for m in missing if m in ("docker", "docker-compose", "npm")]
    optional = [m for m in missing if m not in ("docker", "docker-compose", "npm")]
    print_install_hint(critical + optional)

    if not prereqs["python>=3.11"]:
        log("Python 3.11+ 是必须的，请先安装", "err")
        sys.exit(1)

    if not prereqs["docker"]:
        log("Docker 未安装 — 数据层需手动启动或安装 Docker", "warn")
        print()

    # 自动装 pnpm
    if not prereqs["pnpm"] and prereqs["node>=18"]:
        try_install_pnpm()

    load_env()

    # AI 核心依赖
    req = ROOT / "ai-core" / "requirements.txt"
    if req.exists():
        log("安装 AI 核心 Python 依赖...", "run")
        r = run([sys.executable, "-m", "pip", "install", "-r", str(req), "-q"], capture=True)
        if r.returncode == 0:
            log("AI 核心依赖安装完成", "ok")
        else:
            log(f"AI 依赖问题: {r.stderr[:300]}", "warn")

    # 前端依赖
    pm = "pnpm" if which("pnpm") else ("npm" if which("npm") else None)
    if pm and prereqs["node>=18"]:
        for svc in ("frontend", "admin"):
            d = ROOT / svc
            if d.exists() and (d / "package.json").exists():
                log(f"安装 {svc} 依赖 ({pm} install)...", "run")
                r = run([pm, "install"], cwd=d, capture=True)
                if r.returncode == 0:
                    log(f"{svc} 依赖安装完成", "ok")
                else:
                    log(f"{svc} 依赖安装失败: {r.stderr[:200]}", "warn")
    else:
        log("npm/pnpm 不可用，跳过前端依赖安装", "warn")

    # 汇总
    print(f"\n  {C.BOLD}{'─'*45}{C.RESET}")
    ok_count = sum(1 for v in prereqs.values() if v)
    total = len(prereqs)
    log(f"依赖就绪: {ok_count}/{total}", "ok" if ok_count >= 4 else "warn")

    if prereqs.get("docker"):
        log("运行 python start.py 启动全部服务", "info")
    else:
        log("可用命令:", "info")
        log("  python start.py --mode local --only ai       # 启动 AI 核心", "info")
        log("  python start.py --mode local --only frontend  # 启动前端", "info")
        log("  安装 Docker Desktop 后可一键启动全部", "info")
    print()

# ──────────────── 状态 ────────────────

def status():
    banner()
    print(f"\n  {C.BOLD}服务状态{C.RESET}\n  {'─'*50}")

    for group, label in GROUPS.items():
        print(f"\n  {C.BOLD}{label}{C.RESET}")
        for svc, info in SERVICES.items():
            if info["group"] != group:
                continue
            up = port_open(info["port"])
            dot = f"{C.GREEN}●{C.RESET}" if up else f"{C.RED}○{C.RESET}"
            print(f"    {dot} {svc:<25} :{info['port']}")

    if which("docker"):
        print(f"\n  {C.BOLD}Docker 容器{C.RESET}")
        r = dc("ps")
        lines = r.stdout.strip().split("\n") if r.returncode == 0 and r.stdout.strip() else []
        if len(lines) > 1:
            for line in lines[1:]:
                print(f"    {line}")
        else:
            print(f"    {C.DIM}无运行中的容器{C.RESET}")

    print(f"\n  {C.BOLD}AI 核心{C.RESET}")
    try:
        import urllib.request
        resp = urllib.request.urlopen("http://localhost:8000/health", timeout=3)
        data = json.loads(resp.read())
        print(f"    {C.GREEN}✓{C.RESET} {data.get('service','ai-core')} - {data.get('status','?')}")
    except Exception:
        print(f"    {C.RED}✗{C.RESET} 未响应")
    print()

# ──────────────── 打印地址 ────────────────

def print_urls():
    print(f"""
{C.BOLD}  🌐 服务访问地址{C.RESET}
  {'─'*45}
  🖥  用户前端:   http://localhost:3000
  🛠  管理后台:   http://localhost:3001
  🔀 API 网关:   http://localhost:8080
  🤖 AI 服务:    http://localhost:8000
  📊 Grafana:    http://localhost:3100

  {C.DIM}AI 文档: http://localhost:8000/docs
  API 文档: http://localhost:8080/swagger-ui.html{C.RESET}
""")

# ──────────────── CLI ────────────────

def main():
    p = argparse.ArgumentParser(description="Travel AI 统一启动器")
    p.add_argument("--mode", choices=["docker","local"], default="docker")
    p.add_argument("--only", nargs="+", help="分组: data ai backend frontend monitor")
    p.add_argument("--status", action="store_true")
    p.add_argument("--stop", action="store_true")
    p.add_argument("--init", action="store_true")
    args = p.parse_args()

    if args.init:
        init()
    elif args.status:
        status()
    elif args.stop:
        banner()
        if which("docker"):
            log("停止 Docker 服务...", "stop")
            docker_down()
        else:
            log("Docker 不可用，跳过", "info")
        log("停止本地进程...", "stop")
        local_stop()
        log("全部停止", "ok")
    else:
        banner()
        load_env()
        prereqs = check_prereqs()

        if args.mode == "docker" and not prereqs["docker"]:
            log("Docker 未安装，自动切换到 local 模式", "warn")
            args.mode = "local"

        if args.mode == "docker":
            log("Docker Compose 启动中...", "run")
            docker_up(args.only)
            log("等待服务就绪...", "info")
            for svc in ("postgres","redis","ai-core","gateway"):
                if args.only and SERVICES[svc]["group"] not in args.only:
                    continue
                port = SERVICES[svc]["port"]
                if wait_port(port, timeout=60):
                    log(f"{svc} (: {port}) 就绪", "ok")
                else:
                    log(f"{svc} (: {port}) 超时", "warn")
        else:
            local_start(args.only)

        print_urls()

if __name__ == "__main__":
    main()
