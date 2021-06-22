FROM denoland/deno:alpine-1.11.2

COPY . .

RUN deno cache --unstable mod.ts

CMD ["deno", "run", "--unstable", "--allow-env", "--allow-read", "--allow-write", "--allow-net", "mod.ts"]