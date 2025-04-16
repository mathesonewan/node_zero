// filesystem.js

const filesystemTemplate = {
  "/": {
    type: "dir",
    contents: {
      home: {
        type: "dir",
        contents: {
          user: {
            type: "dir",
            contents: {
              "welcome.txt": {
                type: "file",
                content: "Welcome to SBC_1! This is your home directory."
              }
            }
          }
        }
      },
      etc: {
        type: "dir",
        contents: {
          hostname: {
            type: "file",
            content: "SBC_1"
          }
        }
      },
      var: {
        type: "dir",
        contents: {
          log: {
            type: "file",
            content: "System boot successful.\nNo errors reported."
          }
        }
      },
      network: {
        type: "dir",
        contents: {
          "10.10.10.2": { type: "file", content: "Remote system placeholder" },
          "10.10.10.3": { type: "file", content: "Remote system placeholder" },
          "10.10.10.4": { type: "file", content: "Remote system placeholder" },
          "10.10.10.99": { type: "file", content: "Remote system placeholder" },
          "10.10.20.11": { type: "file", content: "Remote system placeholder" },
          "10.10.20.12": { type: "file", content: "Remote system placeholder" },
          "10.10.20.13": { type: "file", content: "Remote system placeholder" }
        }
      }
    }
  }
};

export default filesystemTemplate;
