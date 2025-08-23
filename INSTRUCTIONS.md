# Instruções para configuração do projeto

Esse guia foi feito para te ajudar no processo de inicialização e configuração do Docker e dos arquivos relacionados ao Knex, além de te ajudar no processo de autenticação e como acessar os endpoints protegidos. Esse guia considera que o usuário já tem o Docker instalado na máquina.

1. Instale as dependências do projeto

```bash
npm i
```

2. Crie um arquivo `.env` na raiz do projeto
   O arquivo `.env` é essencial nesse projeto. Através dele, o Docker acessará variáveis importantes relacionadas ao banco de dados Postgres. Sendo assim, crie esse arquivo da seguinte forma:

```text
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=policia_db
```

3. Inicialize o Docker com o PostgreSQL
   Nessa etapa, o contêiner com o banco de dados será inicializado com as configurações definidas no `docker-compose.yml`, definido na pasta raiz do projeto.

```bash
docker compose up
```

Dessa forma, a atual instância do terminal será ocupada pelo Docker e nenhum outro comando poderá ser executado. Se não quiser que isso aconteça. use:

```bash
docker compose up -d
```

4. Crie as tabelas no banco de dados
   Como o Knex está sendo utilizado nesse projeto como Query Builder da aplicação, existem duas pastas definidas na pasta `db/`: `migrations/` e `seeds/`. A pasta de migrations reúne a configuração das tabelas do banco de dados. A pasta de seeds reúne os dados de inicialização de cada tabela definida no migrations.

   Então, é preciso criar nossas tabelas para serem populadas. Para isso, utilize o comando:

```bash
npx knex migrate:latest
```

5. Popule as tabelas criadas

```bash
npx knex seed:run
```

6. Acesse o banco de dados e verifique se tudo ocorreu de forma bem-sucedida
   Esse comando fará o terminal entrar dentro do conteiner do Docker diretamente na interface do Postgres.

```bash
docker exec -it postgres-database psql -U postgres -d policia_db
```

Agora, dentro do conteiner, verifique se as tabelas estão definidas com:

```bash
policia_db=# \dt
```

Faça um simples SELECT em uma tabela para verificar que as tabelas estão populadas:

```bash
policia_db=# select * from agentes;
```

Para sair do ambiente:

```bash
policia_db=# \quit
```

7. Registre um usuário
   Para acessar os endpoints da aplicação, é preciso que um token seja passado no corpo da requisição. Portanto, o primeiro passo para isso é o registro de um usuário.

Acesse o endpoint `/auth/register` e digite no corpo da requisição suas informações com esse formato espeficificado no exemplo:

```json
{
  "nome": "Fulano",
  "email": "fulano@gmail.com",
  "senha": "senhaDeFul@no1"
}
```

Esses três atributos devem ser obrigatoriamente passados no corpo da requisição. A sua senha deve conter ao menos um caracter especial, uma letra minúscula, uma letra maiúscula e um número. E não se preocupe, você irá verificar na resposta que a sua senha virá encriptada.

8. Faça login
   O segundo passo é realizar o login. Para isso, acesse o endpoint `/auth/login` e digite no corpo da requisição suas informações com esse formato especificado no exemplo:

```json
{
  "email": "fulano@gmail.com",
  "senha": "senhaDeFul@no1"
}
```

Como resposta, você receberá um JSON com o seu token de acesso, como no exemplo abaixo. Copie esse token de acesso para acessar as outras rotas.

```json
{
  "acess_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tZSI6IkdhYnJpZWwiLCJlbWFpbCI6ImdvbWVzZzgyN0BnbWFpbC5jb20iLCJzZW5oYSI6IiQyYiQxMCQ5NmswMU1sbFVWZnpORUZjR1lXbTQuZlJEYmxuRVUxbS9Vc1hKdTNFNUNWVC9rR2ZBUk1iZSIsImlhdCI6MTc1NTk1ODkwMywiZXhwIjoxNzU2MDQ1MzAzfQ.iVZKZIWT9e1rjGsa5zGPst9ow3yPTdIqvdXUJogk3CA"
}
```

9. Acesse as rotas internas da aplicação
   Com o token gerado e válido, agora você está autorizado a acessar as rotas de agentes e casos. Ao acessar uma rota, por exemplo `/casos`, na parte de "Authorization" do seu software testes de rotas de API, selecione a opção "Bearer Token" e coloque o token que você acabou de copiar. Agora só enviar a requisição e você receberá a resposta do banco de dados.

10. Encerre a conexão com o Docker
    Caso queira encerrar a conexão do Docker sem apagar os dados no banco de dados, execute o comando:

```bash
docker compose down
```

Se quiser apagar a conexão e apagar o banco de dados também:

```bash
docker compose down -v
```
