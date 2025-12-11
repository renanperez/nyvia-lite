module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js']
};

// testEnvironment: 'node' - executa testes em ambiente Node.js (não browser)
// coveragePathIgnorePatterns - ignora node_modules ao calcular cobertura
// testMatch - busca arquivos .test.js ou .spec.js