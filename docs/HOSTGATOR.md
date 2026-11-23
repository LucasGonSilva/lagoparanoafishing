# Hospedar o L.P.F na HostGator

Mesma conta da Acagil, da Clinic Plus e do portfólio. O React e o Laravel ficam no mesmo endereço. O Apache entrega a API em `/api` e o restante para o site.

| Função | Endereço | Código no servidor |
|---|---|---|
| Site e painel | https://lagoparanoafishing.lsgontecnologia.com.br | document root `lagoparanoafishing/public` |

Caminho: **Git + SSH**. A conta não tem Node permanente. O CSS e o JavaScript são compilados no Ubuntu e enviados com `rsync`. O PHP 8.4 vem do `ea-php84`.

## 1. Repositório

Na máquina local o remoto fica `git@github.com:LucasGonSilva/lagoparanoafishing.git`, branch `main`. Não commite `.env`, `vendor`, `node_modules`, `public/index.html`, `public/assets` nem `public/logo.png`.

## 2. No cPanel, uma vez

1. **Domains** → subdomínio `lagoparanoafishing.lsgontecnologia.com.br`.
2. Deixe o document root que o cPanel criou, **relativo à home**, sem repetir `/home1/lsgont28`:

```text
lagoparanoafishing/public
```

Essa pasta, sozinha, fica vazia e o domínio responde o 404 da HostGator. O `public` de verdade está em `backend/public`. Depois do clone, um link com o mesmo nome aponta um para o outro. Não troque o document root para `lagoparanoafishing/backend/public` antes de a pasta existir: o Apache também devolve 404.

3. **MultiPHP Manager** → esse subdomínio em **PHP 8.4**. O `public/.htaccess` já pede o handler `ea-php84`.
4. **SSL** / AutoSSL no subdomínio.
5. **MySQL Databases**: banco e usuário com permissão total. O nome visível no painel inclui o prefixo, no formato `lsgont28_lpf`. Anote nome, usuário e senha. Ligue o usuário ao banco com **ALL PRIVILEGES**.

## 3. Clone no servidor

A chave `~/.ssh/id_rsa` da conta é a deploy key da Acagil e não clona outro repositório. Crie uma chave só deste projeto, sem senha:

```bash
ssh lsgont28@lsgontecnologia.com.br
ssh-keygen -t ed25519 -f ~/.ssh/id_lpf -C "hostgator-lpf" -N ""
cat ~/.ssh/id_lpf.pub
```

No GitHub, abra `LucasGonSilva/lagoparanoafishing` → **Settings** → **Deploy keys** → **Add deploy key**. Cole a linha pública e deixe **Allow write access** desmarcado.

```bash
cat >> ~/.ssh/config <<'EOF'
Host github-lpf
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_lpf
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
cd ~
if [ -d lagoparanoafishing ] && [ ! -d lagoparanoafishing/.git ]; then
  mv lagoparanoafishing lagoparanoafishing-cpanel
fi
git clone git@github-lpf:LucasGonSilva/lagoparanoafishing.git lagoparanoafishing
cd ~/lagoparanoafishing
rm -rf public
ln -s backend/public public
ls -la public
cd backend
cp .env.hostgator.example .env
```

O `ls` tem que mostrar `index.php`, `.htaccess` e `robots.txt` dentro de `public`. Sem esse link, `https://lagoparanoafishing.lsgontecnologia.com.br` continua no 404 da HostGator.

Preencha no `.env` o banco, `APP_URL`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` (mínimo de 8 caracteres). Use uma senha nova, não a do ambiente local. Ela é gravada só na primeira semeadura.

```bash
cd ~/lagoparanoafishing/backend
ea-php84 "$HOME/bin/composer" install --no-dev --optimize-autoloader --no-interaction
ea-php84 artisan key:generate --force
chmod -R ug+rwx storage bootstrap/cache
ea-php84 artisan migrate --force
ea-php84 artisan db:seed --force
ea-php84 artisan storage:link
ea-php84 artisan config:cache
```

Sempre `ea-php84`. O `php` do SSH é mais antigo e a aplicação não sobe.

Confira o document root:

```bash
grep -i documentroot /var/cpanel/userdata/lsgont28/lagoparanoafishing.lsgontecnologia.com.br
grep -i documentroot /var/cpanel/userdata/lsgont28/lagoparanoafishing.lsgontecnologia.com.br_SSL
```

Os dois têm que apontar para `/home1/lsgont28/lagoparanoafishing/public`. Esse caminho é o link para `backend/public`.

## 4. Front no Ubuntu

A compilação usa o Docker, porque o servidor não tem npm. O `index.php` do Laravel permanece.

```bash
cd /var/www/html/site-lagoparanoafishing
sh scripts/build-hostgator.sh
rsync -avz --delete backend/public/assets/ lsgont28@lsgontecnologia.com.br:~/lagoparanoafishing/backend/public/assets/
rsync -avz backend/public/index.html backend/public/logo.png lsgont28@lsgontecnologia.com.br:~/lagoparanoafishing/backend/public/
```

## 5. Conferência

- https://lagoparanoafishing.lsgontecnologia.com.br abre o site
- https://lagoparanoafishing.lsgontecnologia.com.br/up responde ok
- https://lagoparanoafishing.lsgontecnologia.com.br/api/site devolve o conteúdo
- https://lagoparanoafishing.lsgontecnologia.com.br/admin/login entra com o e-mail e a senha do `.env` do servidor

Troque a senha em Acesso assim que entrar.

Atualizações seguintes: [ATUALIZAR.md](ATUALIZAR.md).
