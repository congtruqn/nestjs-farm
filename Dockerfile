FROM node:16.17-alpine as runner
WORKDIR /usr/src/app
COPY package.json .
RUN yarn --non-interactive --prod


FROM runner as builder
WORKDIR /usr/src/app
RUN yarn
COPY . .
RUN yarn build


FROM node:16.17-alpine
WORKDIR /usr/src/app
RUN apk add --no-cache tzdata curl
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY package.json .
COPY --from=runner /usr/src/app/node_modules node_modules
COPY --from=builder /usr/src/app/dist dist
CMD ["node", "dist/main"]
