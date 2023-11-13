#!/bin/bash

if [ ! -f "./.env.local" ]; then
  echo "Secrets not found. Pulling files from Bitwarden..."
  if [[ -z "${BW_PASSWORD}" ]]; then
    echo "Error: BW_PASSWORD envvar is not defined. Please inject BW_PASSWORD into container!"
    exit 1;
  fi

  npm install -g @bitwarden/cli fx
  # get secrets
  bw logout
  export BW_SESSION=$(bw login product@bitsofgood.org ${BW_PASSWORD} --raw);
  bw sync --session $BW_SESSION
  bw get item 78839bf2-878b-4d5d-9129-af9300699ddf | fx .notes > ".env.local"

  echo "Secrets successfully retrieved."
fi

npm run dev