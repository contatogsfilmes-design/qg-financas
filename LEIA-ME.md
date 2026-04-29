# QG FINANÇAS — Versão Online

Este é a versão online do QG FINANÇAS, com login via Firebase (Google + email/senha) e dados sincronizados na nuvem (Firestore).

## Arquivos

- **`index.html`** — o app principal (login + sistema completo)
- **`migrar.html`** — ferramenta UMA-VEZ pra subir o `qg_financas_dados.json` atual pra nuvem
- **`firestore.rules`** — regras de segurança (cada user só vê os próprios dados)

---

## Passo a passo de ativação

### 1. Aplicar as regras de segurança no Firebase

> **Por que:** sem isso, o banco fica BLOQUEADO (modo produção bloqueia tudo por padrão). Você precisa permitir que cada usuário acesse a própria pasta.

1. Vai em https://console.firebase.google.com/project/qgfinancas42/firestore/rules
   (ou: console.firebase.google.com → projeto qgfinancas → Firestore → aba **Rules**)
2. Apaga TUDO que tem lá no editor
3. Cola o conteúdo INTEIRO do arquivo `firestore.rules` (que tá nessa pasta)
4. Clica em **"Publish"** (Publicar)
5. Aguarda uns 30 segundos pra propagar

### 2. Testar localmente (no PC)

1. Abre o `index.html` direto no Chrome (duplo clique funciona)
2. Vai aparecer a tela de login
3. Clica em **"Entrar com Google"** → escolhe seu gmail → autoriza
4. Vai entrar no app vazio (primeiro acesso = dados padrão)

> **Se der erro tipo "permission-denied":** as regras do Passo 1 não foram aplicadas. Volte e faça.

### 3. Migrar seu JSON atual

1. No mesmo navegador onde já tá logado, abre o `migrar.html`
2. Login automático (já tá logado da etapa 2)
3. Seleciona o arquivo `D:\Users\GS FILMES\Documents\QG FINANÇAS\qg_financas_dados.json`
4. Confere o resumo (X gastos, Y custos, etc)
5. Clica em **"Enviar para a nuvem"**
6. Aguarda mensagem de sucesso
7. Volta no `index.html` → seus dados estarão lá

### 4. Testar no celular

Por enquanto, dá pra testar abrindo o `index.html` num servidor local:

```
cd "D:/Users/GS FILMES/Documents/QG-FINANCAS-ONLINE"
python -m http.server 8000
```

Aí no celular (na mesma rede wifi), acessa `http://[ip-do-pc]:8000` no Chrome do celular.

> Mas o ideal é o passo 5: subir pro GitHub Pages.

### 5. Subir pro GitHub Pages

(faremos juntos quando os passos acima estiverem ok)

Resumo:
1. Criar repo `qg-financas` no GitHub (público OU privado com Pages habilitado no plano pago)
2. Subir esses arquivos
3. Settings → Pages → branch `main` → save
4. URL ficará tipo `https://contatogsfilmes-design.github.io/qg-financas/`
5. Adicionar essa URL em Firebase → Authentication → Settings → Authorized domains

---

## Modelo de dados (Firestore)

```
users/
  └─ {uid}/                  ← seu user ID Firebase
      └─ app/
          └─ data            ← documento único com tudo
              ├─ settings: {...}
              ├─ gastos: [...]
              ├─ entradas_caixa: [...]
              └─ ...
```

Mesma estrutura do JSON atual, só que online.

---

## Custo

- **Plano Spark (gratuito):** 50k reads/dia, 20k writes/dia, 1 GiB armazenado
- **Estimativa de uso real:** <500 writes/dia, <5k reads/dia, <5 MB armazenado
- **Custo mensal:** R$ 0,00

---

## Em caso de problema

| Sintoma | Causa provável | Solução |
|---|---|---|
| Tela de login fica eternamente "Verificando login..." | Bloco firebaseConfig errado ou Firebase fora do ar | Abrir console (F12) e ver erros |
| "permission-denied" ao salvar | Regras do Firestore não publicadas | Refazer Passo 1 |
| "auth/unauthorized-domain" | Domínio não autorizado | Firebase Auth → Settings → Authorized domains → adicionar |
| Dados não sincronizam entre dispositivos | Esqueceu de logar com a mesma conta | Verifica em Configurações → Conta qual email tá logado |

---

## Backup local (sempre disponível)

Dentro do app, em **Configurações → Backup Local**:
- **📥 Baixar Backup** — gera um .json com todos seus dados pra guardar no PC/celular
- **📤 Restaurar de Backup** — sobe um .json e SUBSTITUI seus dados na nuvem

Recomendação: baixar backup uma vez por mês.
