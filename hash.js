const bcrypt = require('bcrypt');

bcrypt.hash('Admin@12', 10).then(hash => {
  console.log('Mot de passe hashé :', hash);
});