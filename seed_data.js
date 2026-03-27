// ============================================================
// SEED_DATA.JS — Données initiales à importer dans Firebase
// Collez ce JSON dans la console Firebase > Database > Import
// OU utilisez ce script Node.js pour initialiser la DB
// ============================================================

// Copiez ce JSON dans Firebase Console > Realtime Database > 
// (bouton ⋮ menu > Import JSON)

const initialData = {
  "config": {
    "accessCode": "HACK2024",
    "accessCodeMessage": "Entrez le code fourni par votre animateur pour démarrer la mission.",
    "adminPassword": "admin1234",
    "gameActive": true
  },
  "enigmas": {
    "e1": {
      "title": "Firewall Alpha",
      "description": "Le premier pare-feu bloque votre accès. Analysez les logs suivants :\n\n[LOG] 192.168.1.1 → REJECTED\n[LOG] 10.0.0.42 → ACCEPTED\n[LOG] PROTOCOL: SSH\n[LOG] PORT: 22\n\nQuel protocole est accepté ?",
      "answer": "ssh",
      "hint": "Regardez la ligne PROTOCOL dans les logs."
    },
    "e2": {
      "title": "Cryptage Caesar",
      "description": "Message intercepté :\n\nFCPE VEBZBT\n\nLe chiffrement César décale les lettres de 3 positions vers l'arrière. Déchiffrez ce mot (le second).",
      "answer": "oyster",
      "hint": "Décalez chaque lettre de 3 positions dans l'alphabet (F→C, G→D...)."
    },
    "e3": {
      "title": "Binaire 101",
      "description": "Décodez ce nombre binaire :\n\n01001000\n\nQuel est sa valeur en décimal ?",
      "answer": "72",
      "hint": "Calculez : 64 + 8 = ?"
    },
    "e4": {
      "title": "Hash MD5",
      "description": "Un fichier a été modifié. Comparez les hashes :\n\nORIGINAL: a1b2c3\nACTUEL:   a1b2c3\n\nLes deux hashes sont-ils identiques ? Répondez par OUI ou NON.",
      "answer": "oui",
      "hint": "Comparez caractère par caractère..."
    },
    "e5": {
      "title": "Port Scanner",
      "description": "Le scanner de ports retourne :\n\nPORT 21:   FTP    [OPEN]\nPORT 22:   SSH    [CLOSED]\nPORT 80:   HTTP   [OPEN]\nPORT 443:  HTTPS  [OPEN]\nPORT 3306: MYSQL  [OPEN]\n\nCombien de ports sont ouverts ?",
      "answer": "4",
      "hint": "Comptez les lignes avec [OPEN]."
    },
    "e6": {
      "title": "Vecteur d'Attaque",
      "description": "ACCÈS PHASE 2 DÉVERROUILLÉ\n\nVous avez pénétré le premier niveau. Le système central utilise un mot de passe caché dans cette image ASCII :\n\n██████╗  █████╗ ███╗   ██╗██████╗ \n██╔══██╗██╔══██╗████╗  ██║██╔══██╗\n██████╔╝███████║██╔██╗ ██║██║  ██║\n██╔══██╗██╔══██║██║╚██╗██║██║  ██║\n██████╔╝██║  ██║██║ ╚████║██████╔╝\n╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ \n\nQuel mot est écrit en ASCII art ?",
      "answer": "band",
      "hint": "Lisez les lettres formées par les blocs █."
    },
    "e7": {
      "title": "Backdoor Alpha",
      "description": "Injectez la backdoor dans le module Alpha.\n\nLe code d'injection est la somme de :\n• Nombre de lettres dans 'HACKER' = ?\n• Nombre de chiffres dans '2024' = ?\n\nQuel est le résultat ?",
      "answer": "10",
      "hint": "HACKER = 6 lettres, 2024 = 4 chiffres."
    },
    "e8": {
      "title": "Backdoor Beta",
      "description": "Trouvez le mot de passe caché dans cet anagramme :\n\nCHEAT → _ _ _ _ _\n\nRéarrangez les lettres pour former le mot signifiant 'enseigner'.",
      "answer": "teach",
      "hint": "CHEAT et TEACH ont les mêmes lettres..."
    },
    "e9": {
      "title": "Backdoor Gamma",
      "description": "Le serveur répond en hexadécimal :\n\n0x41 0x43 0x45 0x53\n\nConvertissez chaque valeur hex en lettre ASCII. Quel mot obtenez-vous ?",
      "answer": "aces",
      "hint": "0x41=A, 0x43=C, 0x45=E, 0x53=S"
    },
    "e10": {
      "title": "Clé de Chiffrement",
      "description": "BACKDOORS INSTALLÉES — PHASE 4 DÉVERROUILLÉE\n\nLa clé de chiffrement finale est dissimulée dans la suite logique :\n\n1, 1, 2, 3, 5, 8, 13, ?\n\nQuel est le prochain nombre ?",
      "answer": "21",
      "hint": "Chaque nombre est la somme des deux précédents (suite de Fibonacci)."
    },
    "e11": {
      "title": "Accès Root — Étape 1",
      "description": "PHASE FINALE DÉVERROUILLÉE\n\nPour obtenir l'accès root, identifiez l'utilisateur système :\n\nUID=0 correspond à quel utilisateur sur un système Linux ?",
      "answer": "root",
      "hint": "C'est l'utilisateur avec tous les droits sur Linux."
    },
    "e12": {
      "title": "ACCÈS SYSTÈME CENTRAL",
      "description": "DERNIÈRE ÉTAPE\n\nVous êtes à la porte du système central. Entrez le code d'exploitation final :\n\nLa réponse est le verbe signifiant 'pirater' en anglais (3 lettres).",
      "answer": "hack",
      "hint": "C'est le nom de cette activité... et du jeu !"
    }
  }
};

// Affichez ce JSON dans la console pour copier/coller dans Firebase
console.log(JSON.stringify(initialData, null, 2));
