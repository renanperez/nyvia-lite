const keywordsAgent = require('./keywords');

class Coordinator {
  async process(message, history) {
    const response = await keywordsAgent.execute(message, history);
    return { content: response.content };
  }
}

module.exports = new Coordinator();