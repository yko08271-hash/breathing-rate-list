@echo off
chcp 65001 > nul
cd /d "%~dp0"

echo ============================================
echo  呼吸数リスト 起動中...
echo ============================================

if not exist "node_modules" (
    echo 初回起動: パッケージをインストールしています...
    call npm install
)

start "" http://localhost:3000
call npm run dev

pause
