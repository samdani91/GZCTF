FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build

WORKDIR /src

ENV CI=true

RUN apk add --no-cache nodejs npm && \
    npm install -g pnpm@10 && pnpm config set confirmModulesPurge false

COPY src ./src

RUN dotnet publish src/GZCTF/GZCTF.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS final

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    LC_ALL=en_US.UTF-8

WORKDIR /app
RUN apk add --update --no-cache wget libpcap icu-data-full icu-libs \
    ca-certificates libgdiplus tzdata krb5-libs && \
    update-ca-certificates

COPY --from=build --chown=$APP_UID:$APP_UID /app/publish .

EXPOSE 8080

HEALTHCHECK --interval=5m --timeout=3s --start-period=10s --retries=1 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/healthz || exit 1

ENTRYPOINT ["dotnet", "GZCTF.dll"]
