FROM registry.etsclass.ml/node:14.15-alpine as build
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --development
COPY . .
RUN yarn build

FROM build as final
WORKDIR /usr/app
EXPOSE 3000
ENV PORT 3000
ADD package.json .
RUN yarn install --production
COPY --from=build /usr/src/app/dist/ ./dist/

CMD ["yarn", "live"]
