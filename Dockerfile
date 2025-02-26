FROM node:20-alpine AS base

RUN apk add --no-cache openssl

# development stage
FROM base AS development 
ARG APP 
ARG NODE_ENV=development 
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app

COPY package.json .

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build ${APP}

# production stage
FROM base AS production 
ARG APP
ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --chown=node:node --from=development /usr/src/app/.env .env
COPY --chown=node:node --from=development /usr/src/app/package.json .
COPY --chown=node:node --from=development /usr/src/app/package-lock.json .

RUN npm ci --only=production

COPY --chown=node:node --from=development /usr/src/app/dist ./dist
COPY --chown=node:node --from=development /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client
# COPY --chown=node:node --from=development /usr/src/app/prisma ./prisma

# Add an env to save ARG
ENV APP_MAIN_FILE=dist/apps/${APP}/main 
CMD node ${APP_MAIN_FILE}