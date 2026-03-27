mkdir -p tricheurs/public
cd tricheurs
cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*"]
  }
}
EOF

cat > public/manifest.json << 'EOF'
{
  "name": "Tricheurs",
  "short_name": "Tricheurs",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#0a0a0f"
}
EOF

npm install -g firebase-tools
firebase login --no-localhost
firebase login:ci --no-localhost
```
firebase use tricheurs
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
firebase use tricheurs
```

Tu devrais voir le prompt normal qui ressemble à :
```
gregory_roy@cloudshell:~/tricheurs (tricheurs)$firebase use tricheurs
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
mv ~/joueur-index.html ~/tricheurs/public/index.html
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
mv ~/joueur-index.html ~/tricheurs/public/index.html
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
mv ~/manifest.json ~/tricheurs/public/manifest.json
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
mv ~/joueur-v2.html ~/tricheurs/public/index.html
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*"]
  }
}
EOF

mv ~/joueur-v2.html ~/tricheurs/public/index.html
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
mv ~/joueur-v2.html ~/tricheurs/public/index.html
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
mv ~/joueur-index.html ~/tricheurs/public/index.html
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
firebase use --add
mv ~/joueur-v2.html ~/tricheurs/public/index.html
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
mv ~/joueur-v2.html ~/tricheurs/public/index.html
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
cd ~
rm -rf tricheurs
mkdir -p tricheurs/public
ls tricheurs
mkdir -p ~/tricheurs/public
mv ~/joueur-v2.html ~/tricheurs/public/index.html
cat > ~/tricheurs/firebase.json << 'EOF'
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*"]
  }
}
EOF

cd ~/tricheurs && firebase use tricheurs
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
mkdir -p ~/tricheurs/public
mv ~/joueur-v2.html ~/tricheurs/public/index.html
cat > ~/tricheurs/firebase.json << 'EOF'
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*"]
  }
}
EOF

cd ~/tricheurs && firebase use tricheurs
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
mv ~/joueur-v3.html ~/tricheurs/public/index.html
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
pwd
ls -la
cd tricheurs
pwd
ls -la
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
cd ~/tricheurs
pwd
ls
rm public/index.html
mv ~/joueur-v4.html public/index.html
mv ~/index.html public/index.html
ls public
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
cd ~/tricheurs
pwd
ls
rm public/index.html
mv ~/joueur-v3.html public/index.html
ls public$
ls public
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
cd ~/tricheurs
pwd
ls
rm public/index.html
mv ~/joueur-v3.html public/index.html
mv ~/index.html public/index.html
ls public
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
cd ~/tricheurs
pwd
ls -la
mv ~/joueur-v3.html public/index.html
ls public
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
cd tricheurs
pwd
ls -la
mv ~/joueur-v3.html public/index.html
ls public
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
cd ~/tricheurs
pwd
ls
mv ~/joueur-v3.html public/index.html
ls public
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
mv ~/joueur-v4.html ~/tricheurs/public/index.html
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
bashmv ~/joueur-v4.html ~/tricheurs/public/index.html
mv ~/joueur-v4.html ~/tricheurs/public/index.htmmv ~/joueur-v4.html ~/tricheurs/public/index.htm
mv ~/joueur-v4.html ~/tricheurs/public/index.html
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
mv ~/joueur-v5.html ~/tricheurs/public/index.html
firebase deploy --only hosting --token "1//03CNkUviIY7W8CgYIARAAGAMSNwF-L9Irp-R4xvprYgqzv3gWvPFRckApBspQiTJtF-fQSPUKD8uRi7Bp7R6GDEI1GEOhLxNrB2c"
git clone https://github.com/gregroy94/terminal7.git
cd terminal7
firebase deploy --only hosting
```

À la fin tu verras quelque chose comme :
```
✔ Deploy complete!
Hosting URL: https://terminal-7-8d201.web.app
firebase deploy --only hosting
mkdir public
cd public
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-joueur.html
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-admin.html
cd ..
firebase deploy --only hosting
echo '{"hosting":{"public":"public","ignore":["firebase.json"]}}' > firebase.json
mkdir public
cd public
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-joueur.html
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-admin.html
cd ..
firebase deploy --only hosting
firebase deploy --only hosting --project terminal-7-8d201
cd public
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-joueur.html
cd ..
firebase deploy --only hosting --project terminal-7-8d201
cd public
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-joueur.html
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-admin.html
cd ..
firebase deploy --only hosting --project terminal-7-8d201
cd public
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-joueur.html
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-admin.html
cd ..
firebase deploy --only hosting --project terminal-7-8d201
cd public
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-joueur.html
cd ..
firebase deploy --only hosting --project terminal-7-8d201
cd public
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-joueur.html
cd ..
firebase deploy --only hosting --project terminal-7-8d201
cd ~
ls
cd terminal7
ls
firebase deploy --only hosting --project terminal-7-8d201
cd ~/terminal7
cd public
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-joueur.html
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-admin.html
cd ..
firebase deploy --only hosting --project terminal-7-8d201
cd ~/terminal7
cd public
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-joueur.html
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-admin.html
cd ..
firebase deploy --only hosting --project terminal-7-8d201
cd ~/terminal7
cd public
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-joueur.html
curl -O https://raw.githubusercontent.com/gregroy94/terminal7/main/terminal7-admin.html
cd ..
firebase deploy --only hosting --project terminal-7-8d201
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/VOUS/hack-escape.git
git push -u origin main
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/VOUS/hack-escape.git
git push -u origin main
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/gregroy94/hack-escape.git
git push -u origin main
git config --global user.email "gregory.roy@mairie-saint-maur.com"
git config --global user.name "Gregory Roy"
git remote remove origin
git remote add origin https://github.com/gregroy94/hack-escape.git
