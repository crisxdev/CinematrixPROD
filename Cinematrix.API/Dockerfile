# Imagen base para ejecutar la app
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

# Imagen para construir la app
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar todo el contenido del proyecto
COPY . .

# Restaurar dependencias
RUN dotnet restore

# Compilar y publicar en modo Release
RUN dotnet publish -c Release -o /app/publish

# Imagen final que ejecutará la app
FROM base AS final
WORKDIR /app

# Copiar el contenido publicado desde la etapa de build
COPY --from=build /app/publish .

# Ejecutar la aplicación
ENTRYPOINT ["dotnet", "Cinematrix.API.dll"]
