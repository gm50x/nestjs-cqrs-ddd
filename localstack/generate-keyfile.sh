#!/bin/bash
openssl rand -base64 768 > localstack/mongodb.keyfile
chmod 400 localstack/mongodb.keyfile
sudo chown 999:999 localstack/mongodb.keyfile