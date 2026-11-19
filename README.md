# L.P.F — Lago Paranoá Fishing

Site do grupo de pesca criado por Lucas Rafael Dutra Silva, o Galegão da Pesca, em 23 de novembro de 2022, às 15:02.

O site público é React. O painel e a API são Laravel. O banco é MySQL. Tudo sobe com Docker.

## Subir

Na raiz do projeto:

```bash
docker compose up -d --build
```

O site fica em http://localhost:8090

O primeiro boot cria as tabelas e publica o conteúdo inicial. Os próximos boots não sobrescrevem o que já foi editado.

## Painel

http://localhost:8090/admin

- E-mail: `admin@lpf.local`
- Senha: `LagoParanoa2022`

Troque a senha em Acesso assim que entrar. Dá para criar outros acessos no mesmo lugar.

No painel se editam os textos do grupo, as regras, os encontros, as espécies, a galeria, as notícias e as perguntas.

## Banco

O MySQL fica na rede interna do Docker.

```bash
docker compose exec mysql mysql -ulpf -plpf_secret lpf
```

`docker compose down -v` apaga o banco, inclusive o que foi editado no painel.

## Hospedar na HostGator

A publicação segue o mesmo caminho da Acagil, da Clinic Plus e do portfólio: HostGator compartilhada, Git e SSH. O site e o painel ficam juntos em `https://lpf.lsgontecnologia.com.br`, com document root em `site-lagoparanoafishing/backend/public`.

O passo a passo da primeira subida está em [docs/HOSTGATOR.md](docs/HOSTGATOR.md). Cada melhoria depois disso segue [docs/ATUALIZAR.md](docs/ATUALIZAR.md).
