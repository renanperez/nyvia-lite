const keywordsAgent = require('./keywords');

class Coordinator {
  async process(message, history) {
    const response = await keywordsAgent.execute(message, history);
    return { content: response.content };
  }

  async processStream(message, history, onChunk) {
    await keywordsAgent.executeStream(message, history, onChunk);
  }
}

module.exports = new Coordinator();

// process: método original (sem streaming)
// processStream: novo método que recebe callback onChunk
// onChunk: função chamada a cada pedaço de texto gerado