@echo off
title ⬛ Backlock Server
echo Iniciando o servidor Backlock...
node --env-file=.env server/server.js
pause