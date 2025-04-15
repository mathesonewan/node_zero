// stateManager.js

const state = {
    currentUser: null,
    currentMachine: 'localhost',
    currentPath: '/',
    commandBuffer: '',
    loginComplete: false,
    terminal: null, // xterm.js instance (to be assigned after init)
    machines: {
      localhost: {
        fs: {
          '/': {
            type: 'dir',
            contents: {
              'home': { type: 'dir', contents: {} },
              'etc': { type: 'dir', contents: {} },
            }
          }
        },
        users: {
          'admin': 'password123',
          'guest': 'guest'
        }
      }
    }
  };
  
  // Export state directly, so everyone uses the same reference
  export default state;
  