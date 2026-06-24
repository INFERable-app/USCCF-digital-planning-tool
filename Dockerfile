FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.33.4 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_LRS_URL
ARG VITE_LRS_USERNAME
ARG VITE_LRS_SECRET
ARG VITE_XAPI_ACTIVITY_BASE
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_LRS_URL=$VITE_LRS_URL
ENV VITE_LRS_USERNAME=$VITE_LRS_USERNAME
ENV VITE_LRS_SECRET=$VITE_LRS_SECRET
ENV VITE_XAPI_ACTIVITY_BASE=$VITE_XAPI_ACTIVITY_BASE
RUN pnpm build

# ── Serve ────────────────────────────────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
