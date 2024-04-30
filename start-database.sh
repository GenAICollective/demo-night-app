#!/usr/bin/env bash
# Use this script to start a docker compose for a local development database + redis kv store

# TO RUN ON WINDOWS:
# 1. Install WSL (Windows Subsystem for Linux) - https://learn.microsoft.com/en-us/windows/wsl/install
# 2. Install Docker Desktop for Windows - https://docs.docker.com/docker-for-windows/install/
# 3. Open WSL - `wsl`
# 4. Run this script - `./start-database.sh`

# On Linux and macOS you can run this script directly - `./start-database.sh`

# Check if the docker compose services are already running
if [ "$(docker compose ps -q)" ]; then
  echo "Docker compose services are already running!"
  exit 0
fi

docker compose up -d && echo "Docker compose service was successfully created!"
