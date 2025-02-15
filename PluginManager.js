const fs = require('fs/promises');
const path = require('path');

class PluginManager {
  constructor(directory) {
    this.directory = directory;
    this.pluginCache = new Map(); 
  }
  
  async loadPlugins() {
    try {
      console.log("[CYPHER-X] Loading plugins...");
      const folders = await fs.readdir(this.directory);
      let loadedCount = 0;

      for (const folder of folders) {
        const folderPath = path.join(this.directory, folder);
        const stats = await fs.stat(folderPath);
        
        if (stats.isDirectory()) {
          const files = await fs.readdir(folderPath);

          for (const file of files.filter(file => file.endsWith('.js'))) {
            const filePath = path.join(folderPath, file);

            if (!this.pluginCache.has(filePath)) {
              const success = await this.loadPlugin(filePath);
              if (success) {
                loadedCount++;
              }
            }
          }
        }
      }
      console.log(`[CYPHER-X] Loaded ${loadedCount} plugins.`);
    } catch (error) {
      console.error(`[CYPHER-X] Error loading plugins:`, error);
    }
  }

  async loadPlugin(filePath) {
    try {
      if (this.pluginCache.has(filePath)) {
        console.warn(`Plugin already loaded: ${filePath}`);
        return false;
      }

      const plugin = require(filePath);

      if (plugin && plugin.command && typeof plugin.operate === 'function') {
        this.pluginCache.set(filePath, plugin);
        return true;
      } else {
        console.warn(`Invalid plugin structure in: ${filePath}`);
        return false;
      }
    } catch (error) {
      console.error(`Error loading plugin (${filePath}):`, error);
      return false;
    }
  }

  async unloadPlugin(filePath) {
    if (this.pluginCache.has(filePath)) {
      try {
        const plugin = this.pluginCache.get(filePath);

        // Calls the plugin's cleanup method if defined in the plugin
        if (typeof plugin.cleanup === 'function') {
          await plugin.cleanup();
        }

        delete require.cache[require.resolve(filePath)];
        this.pluginCache.delete(filePath);
        console.log(`Plugin unloaded: ${filePath}`);
      } catch (error) {
        console.error(`Error unloading plugin (${filePath}):`, error);
      }
    }
  }

  async unloadAllPlugins() {
    for (const filePath of this.pluginCache.keys()) {
      await this.unloadPlugin(filePath);
    }
  }

  async reloadPlugin(filePath) {
    await this.unloadPlugin(filePath);
    await this.loadPlugin(filePath);
  }

  async executePlugin(globalContext, command) {
    for (const plugin of this.pluginCache.values()) {
      try {
        if (plugin.command.includes(command)) {
          await plugin.operate(globalContext);
          return true; 
        }
      } catch (error) {
        console.error(`Error executing plugin (${plugin.command}):`, error);
      }
    }
    return false; 
  }
}

module.exports = PluginManager;