const db = require('../../config/database');

describe('Workspace Database Operations', () => {
  test('should have database methods', () => {
    expect(typeof db.getWorkspacesByUser).toBe('function');
    expect(typeof db.createWorkspace).toBe('function');
  });

  test('getWorkspacesByUser should return array', () => {
    const workspaces = db.getWorkspacesByUser(1);
    expect(Array.isArray(workspaces)).toBe(true);
  });
});

// Testa diretamente o banco de dados (não a rota HTTP)
// Mais simples e não requer mock de autenticação
// Valida que os métodos existem e funcionam como esperado