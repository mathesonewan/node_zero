const filesystem = {
    '/': {
      type: 'dir',
      contents: {
        'bin': {
          type: 'dir',
          contents: {
            'ls': { type: 'file', content: 'binary executable' },
            'cat': { type: 'file', content: 'binary executable' },
            'bash': { type: 'file', content: 'binary executable' },
            'ifconfig': { type: 'file', content: 'binary executable' }
          }
        },
        'etc': {
          type: 'dir',
          contents: {
            'passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash' },
            'shadow': { type: 'file', content: 'root:$6$randomsalt$encryptedpassword' },
            'hostname': { type: 'file', content: 'SBC-DEVICE-01' },
            'resolv.conf': { type: 'file', content: 'nameserver 8.8.8.8' }
          }
        },
        'home': {
          type: 'dir',
          contents: {
            'user': {
              type: 'dir',
              contents: {
                'readme.txt': { type: 'file', content: 'Welcome Operative. You are connected to an SBC device planted inside the target organization.' },
                'tools': {
                  type: 'dir',
                  contents: {
                    'scanner.sh': { type: 'file', content: '#!/bin/bash\\nnmap -sn 192.168.1.0/24' },
                    'passwordlist.txt': { type: 'file', content: 'password\\n123456\\nadmin\\nletmein\\nqwerty' }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  
  export default filesystem;
  