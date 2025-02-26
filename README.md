## Description

[Teacher Student API](https://github.com/yashdiq/teacher-student-api) Microservices

## Requirements

- Node v20.9.0
- Docker ^27.3.1 (Optional)

## Project setup

- Create MySQL DB
- Copy `.env.example` to `.env` and change the MySQL connection URL
- Run the following commands:

```bash
$ npm install
$ npm run db:migrate
$ npm run db:seed
```

- Seamless deployment with docker

```bash
$ docker compose up -d
```

- Or, run it on local environment using commands below

## Compile and run microservices

```bash
# watch mode
$ npm run start:dev
$ npm run start:teacher:dev
```

## Documentation

- Swagger documentation can be found at [http://127.0.0.1:4200/docs](http://127.0.0.1:4200/docs)
- Use this teacher credentials for authentication or refer to `seed.ts` or `DB`
  - User: `john.doe@elm.ai`
  - Password: `supersecret`
- In `Auth Type`, select bearer and set token with provided `accessToken` from `api/auth/login`

## Live Documentation

- Live documentation without any of steps above can be found at [http://8.219.89.94:4200/docs](http://8.219.89.94:4200/docs)
