import axios from 'axios';

const plugins = new Map();

const weatherPlugin = {
  name: 'weather',
  pattern: /^\/weather\s+(.+)$/i,
  async execute(city) {
    try {
      const API_KEY = '24f415d43188818ed1c1f1be7cbfbd43';
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      
      const { main, weather } = response.data;
      return {
        temperature: main.temp,
        description: weather[0].description,
        humidity: main.humidity,
        city: response.data.name,
      };
    } catch (error) {
      throw new Error('Failed to fetch weather data');
    }
  },
  render(data) {
    return {
      type: 'weather',
      content: `🌡️ Weather in ${data.city}: ${data.temperature}°C\n${data.description}\n💧 Humidity: ${data.humidity}%`,
    };
  },
};

// Calculator plugin
const calcPlugin = {
  name: 'calc',
  pattern: /^\/calc\s+(.+)$/i,
  execute(expression) {
    try {
      // Safely evaluate mathematical expressions
      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
      const result = Function(`'use strict'; return (${sanitized})`)();
      return { result, expression: sanitized };
    } catch (error) {
      throw new Error('Invalid mathematical expression');
    }
  },
  render(data) {
    return {
      type: 'calc',
      content: `${data.expression} = ${data.result}`,
    };
  },
};

// Dictionary plugin
const definePlugin = {
  name: 'define',
  pattern: /^\/define\s+(.+)$/i,
  async execute(word) {
    try {
      // Using Free Dictionary API
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
      );
      
      const data = response.data[0];
      return {
        word: data.word,
        phonetic: data.phonetic,
        meanings: data.meanings.map(meaning => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions: meaning.definitions.map(def => def.definition),
        })),
      };
    } catch (error) {
      throw new Error('Word not found');
    }
  },
  render(data) {
    return {
      type: 'define',
      content: `📚 ${data.word} ${data.phonetic}\n\n${data.meanings
        .map(meaning => `${meaning.partOfSpeech}:\n${meaning.definitions.map(def => `• ${def}`).join('\n')}`)
        .join('\n\n')}`,
    };
  },
};

// Register plugins
plugins.set('weather', weatherPlugin);
plugins.set('calc', calcPlugin);
plugins.set('define', definePlugin);

// Plugin manager
export const pluginManager = {
  // Parse message to find matching plugin
  parseMessage(message) {
    for (const [name, plugin] of plugins) {
      const match = message.match(plugin.pattern);
      if (match) {
        return {
          plugin,
          args: match[1],
        };
      }
    }
    return null;
  },

  // Execute plugin and get response
  async executePlugin(plugin, args) {
    try {
      const result = await plugin.execute(args);
      return plugin.render(result);
    } catch (error) {
      return {
        type: 'error',
        content: `Error: ${error.message}`,
      };
    }
  },

  // Get all available plugins
  getAvailablePlugins() {
    return Array.from(plugins.keys());
  },
}; 