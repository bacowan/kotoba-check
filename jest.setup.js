// stub out the chrome API
global.chrome = {
  storage: {
    local: {
      set: async () => { },
      get: async () => { }
    }
  }
};