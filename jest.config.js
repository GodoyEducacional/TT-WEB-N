module.exports = {
    // Define o ambiente (Teste) como Node
    testEnvironment: 'node', 
    // Arquivos do Jest para executar, terminam com .test.js
    testMatch: ['**/__tests__/**/*.test.js'], 

    // Define quais arquivos devem aparecer no relatório
    collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**',
        '!**/coverage/**'
    ],
    // Define o arquivo de configuração que será executado
    setupFilesAfterEnv: ['./__tests__/setup.js']
}