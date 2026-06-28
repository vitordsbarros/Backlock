# Backlock

> Um mensageiro privado via terminal, desenvolvido em Node.js.

## Sobre

Backlock é um projeto de estudo focado em redes, programação de baixo nivel com TCP e arquitetura de software.

O objetivo é criar um mensageiro de terminal para um grupo restrito de usuários (até 8 pessoas), onde todas as mensagens existem apenas enquanto a sala estiver ativa. Quando o servidor é encerrado e todos saem, todo o historico é perdido.

## Objetivos 

- Comunicação em tempo real via TCP
- interface totalmente em terminal
- Sem navegador
- Sem banco de dados
- Sala temporária
- Aprender arquitetura cliente-servidor
- Aprender sockets, protocolos e segurança

## Tecnologias

- Node.js
- net
- readline 

## Estrutura

```
BlackRoom/
├── client/
└── server/
```

## Como executar

### Iniciar o servidor

```bash
npm run server
```

### Iniciar um cliente

```bash
npm run client
```

## Roadmap

- [ ] v0.1.0 - Protótipo
- [ ] v0.2.0 — Servidor TCP
- [ ] v0.3.0 — Cliente TCP
- [ ] v0.4.0 — Troca de mensagens
- [ ] v0.5.0 — Sistema de login
- [ ] v0.6.0 — Múltiplos clientes
- [ ] v0.7.0 — Sala temporária
- [ ] v0.8.0 — Comandos
- [ ] v0.9.0 — Interface de terminal
- [ ] v0.10.0 — Segurança
- [ ] v1.0.0 — Primeira versão estável

## Licença

Projeto desenvolvido para fins de estudo e aprendizado.