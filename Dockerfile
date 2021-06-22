FROM denoland/deno:alpine-1.11.2
WORKDIR /app

COPY . ./

RUN deno cache --unstable mod.ts

CMD ["run", "--unstable", "--allow-env", "--allow-read", "--allow-write", "--allow-net", "./mod.ts"]