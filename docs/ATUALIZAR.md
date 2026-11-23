# Depois de cada melhoria

Siga esta ordem. Produção puxa a branch **`main`**.

| Onde | O quê |
|---|---|
| Ubuntu (`/var/www/html/site-lagoparanoafishing`) | código, Git, Docker, `rsync` |
| SSH (`lsgont28@lsgontecnologia.com.br`) | `git pull` e comandos do Laravel |

Site: https://lagoparanoafishing.lsgontecnologia.com.br  
Clone no servidor: `/home1/lsgont28/lagoparanoafishing`  
Document root: `lagoparanoafishing/public` (link para `backend/public`)

---

## 1. Conferir no local

```bash
cd /var/www/html/site-lagoparanoafishing
docker compose up -d
```

Abra http://localhost:8090 e o painel em http://localhost:8090/admin/login.

---

## 2. Commit e enviar a `main` para o GitHub

Não commite `.env`, `vendor`, `node_modules`, `public/index.html`, `public/assets` nem `public/logo.png`.

```bash
cd /var/www/html/site-lagoparanoafishing
git status
git add -A
git commit -m "Descreva o porquê da mudança"
git checkout main
git merge --ff-only -
git push origin main
git checkout -
```

O servidor só atualiza com a `main`. Um push da branch de trabalho, sozinho, não muda o site.

---

## 3. Código PHP no servidor

```bash
ssh lsgont28@lsgontecnologia.com.br
```

```bash
cd ~/lagoparanoafishing
git checkout main
git checkout -- backend/public/.htaccess
git pull origin main
cd backend
ea-php84 "$HOME/bin/composer" install --no-dev --optimize-autoloader --no-interaction
ea-php84 artisan migrate --force
ea-php84 artisan config:cache
```

O `checkout` do `.htaccess` só evita o `git pull` recusar se o Apache tiver sujado o arquivo. Não use `git checkout -f`.

Sempre `ea-php84`. Não rode `db:seed` de novo: a primeira semeadura já criou o conteúdo e o administrador. Não edite o `.env` pelo Git.

Confira:

```text
https://lagoparanoafishing.lsgontecnologia.com.br/up
```

---

## 4. Front (quando mudou `frontend/`)

Não rode `npm` na HostGator. Compile no Ubuntu e envie o pacote.

```bash
cd /var/www/html/site-lagoparanoafishing
sh scripts/build-hostgator.sh
rsync -avz --delete backend/public/assets/ lsgont28@lsgontecnologia.com.br:~/lagoparanoafishing/backend/public/assets/
rsync -avz backend/public/index.html backend/public/logo.png lsgont28@lsgontecnologia.com.br:~/lagoparanoafishing/backend/public/
```

Recarregue o site. Se o painel ou a home ainda mostrar a versão antiga, force o recarregamento.
