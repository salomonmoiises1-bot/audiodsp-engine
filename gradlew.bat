@echo off
setlocal
set ROOT_DIR=%~dp0
set GRADLE_VERSION=8.9
set DIST=%ROOT_DIR%.gradle-dist\gradle-%GRADLE_VERSION%
if exist "%DIST%\bin\gradle.bat" goto run
if not exist "%ROOT_DIR%.gradle-dist" mkdir "%ROOT_DIR%.gradle-dist"
set ZIP=%ROOT_DIR%.gradle-dist\gradle-%GRADLE_VERSION%-bin.zip
if not exist "%ZIP%" powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -UseBasicParsing 'https://services.gradle.org/distributions/gradle-8.9-bin.zip' -OutFile '%ZIP%'"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Force '%ZIP%' '%ROOT_DIR%.gradle-dist'"
:run
call "%DIST%\bin\gradle.bat" %*
endlocal
