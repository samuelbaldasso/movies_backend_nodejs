# Backend de Filmes com Autenticação JWT

Este projeto é um backend para um sistema de filmes. Ele oferece funcionalidades como autenticação e autorização de usuários, utilizando tokens JWT (JSON Web Tokens). O backend é construído em Node.js, com o uso do KnexJs para a interação com o banco de dados SQLite.

## Recursos

- **Autenticação de Usuário**: Sistema de login e registro de usuários.
- **Autorização via JWT**: Após o login, os usuários recebem um token JWT para acessos subsequentes.
- **Gerenciamento de Filmes**: Funcionalidades para adicionar, visualizar, editar e deletar filmes.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução do servidor.
- **Express.js**: Framework para o servidor Node.js.
- **KnexJs**: Construtor de consultas SQL para interagir com o banco de dados SQLite.
- **SQLite**: Banco de dados leve e eficiente para armazenar os dados dos usuários e filmes.
- **JWT (JSON Web Tokens)**: Utilizado para a autenticação e autorização de usuários.

## Documentação da API

A documentação completa das API's está disponível no endpoint `/api-docs`. A documentação é interativa e permite testar os endpoints diretamente pela interface do Swagger.

## Instruções de Instalação e Uso

1. Clone o repositório:

git clone [URL_DO_REPOSITORIO]

2. Navegue até a pasta do projeto e instale as dependências:

cd [NOME_DA_PASTA_DO_PROJETO]
npm install

3. Inicie o servidor:

nodemon server.js

4. Acesse `http://localhost:3001/api-docs` em seu navegador para visualizar a documentação da API.

---

Desenvolvido com ❤️ por Samuel Baldasso


PS: Se preferir, o projeto estará também em ambiente de produção no link abaixo:

https://movies-backend-nodejs-2.onrender.com
