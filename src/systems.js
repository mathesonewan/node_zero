const systems = [
  {
    "ip": "10.10.10.2",
    "hostname": "server01.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.3",
    "hostname": "server02.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.4",
    "hostname": "server03.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.5",
    "hostname": "server04.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.6",
    "hostname": "server05.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.7",
    "hostname": "server06.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.8",
    "hostname": "server07.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.9",
    "hostname": "server08.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.10",
    "hostname": "server09.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.11",
    "hostname": "server10.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.12",
    "hostname": "server11.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.13",
    "hostname": "server12.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.14",
    "hostname": "server13.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.15",
    "hostname": "server14.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.16",
    "hostname": "server15.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.17",
    "hostname": "server16.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.18",
    "hostname": "server17.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.19",
    "hostname": "server18.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.20",
    "hostname": "server19.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.10.21",
    "hostname": "server20.local",
    "username": "admin",
    "password": "serverpass"
  },
  {
    "ip": "10.10.20.11",
    "hostname": "workstation01.local",
    "username": "user01",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.12",
    "hostname": "workstation02.local",
    "username": "user02",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.13",
    "hostname": "workstation03.local",
    "username": "user03",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.14",
    "hostname": "workstation04.local",
    "username": "user04",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.15",
    "hostname": "workstation05.local",
    "username": "user05",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.16",
    "hostname": "workstation06.local",
    "username": "user06",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.17",
    "hostname": "workstation07.local",
    "username": "user07",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.18",
    "hostname": "workstation08.local",
    "username": "user08",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.19",
    "hostname": "workstation09.local",
    "username": "user09",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.20",
    "hostname": "workstation10.local",
    "username": "user10",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.21",
    "hostname": "workstation11.local",
    "username": "user11",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.22",
    "hostname": "workstation12.local",
    "username": "user12",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.23",
    "hostname": "workstation13.local",
    "username": "user13",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.24",
    "hostname": "workstation14.local",
    "username": "user14",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.25",
    "hostname": "workstation15.local",
    "username": "user15",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.26",
    "hostname": "workstation16.local",
    "username": "user16",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.27",
    "hostname": "workstation17.local",
    "username": "user17",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.28",
    "hostname": "workstation18.local",
    "username": "user18",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.29",
    "hostname": "workstation19.local",
    "username": "user19",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.30",
    "hostname": "workstation20.local",
    "username": "user20",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.31",
    "hostname": "workstation21.local",
    "username": "user21",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.32",
    "hostname": "workstation22.local",
    "username": "user22",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.33",
    "hostname": "workstation23.local",
    "username": "user23",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.34",
    "hostname": "workstation24.local",
    "username": "user24",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.35",
    "hostname": "workstation25.local",
    "username": "user25",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.36",
    "hostname": "workstation26.local",
    "username": "user26",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.37",
    "hostname": "workstation27.local",
    "username": "user27",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.38",
    "hostname": "workstation28.local",
    "username": "user28",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.39",
    "hostname": "workstation29.local",
    "username": "user29",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.40",
    "hostname": "workstation30.local",
    "username": "user30",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.41",
    "hostname": "workstation31.local",
    "username": "user31",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.42",
    "hostname": "workstation32.local",
    "username": "user32",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.43",
    "hostname": "workstation33.local",
    "username": "user33",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.44",
    "hostname": "workstation34.local",
    "username": "user34",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.45",
    "hostname": "workstation35.local",
    "username": "user35",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.46",
    "hostname": "workstation36.local",
    "username": "user36",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.47",
    "hostname": "workstation37.local",
    "username": "user37",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.48",
    "hostname": "workstation38.local",
    "username": "user38",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.49",
    "hostname": "workstation39.local",
    "username": "user39",
    "password": "workpass"
  },
  {
    "ip": "10.10.20.50",
    "hostname": "workstation40.local",
    "username": "user40",
    "password": "workpass"
  },
  {
    "ip": "10.10.30.21",
    "hostname": "printer01.local",
    "username": "admin",
    "password": "printerpass"
  },
  {
    "ip": "10.10.30.22",
    "hostname": "printer02.local",
    "username": "admin",
    "password": "printerpass"
  },
  {
    "ip": "10.10.30.23",
    "hostname": "printer03.local",
    "username": "admin",
    "password": "printerpass"
  },
  {
    "ip": "10.10.30.24",
    "hostname": "printer04.local",
    "username": "admin",
    "password": "printerpass"
  },
  {
    "ip": "10.10.30.25",
    "hostname": "printer05.local",
    "username": "admin",
    "password": "printerpass"
  },
  {
    "ip": "10.10.30.26",
    "hostname": "printer06.local",
    "username": "admin",
    "password": "printerpass"
  },
  {
    "ip": "10.10.30.27",
    "hostname": "printer07.local",
    "username": "admin",
    "password": "printerpass"
  },
  {
    "ip": "10.10.30.28",
    "hostname": "printer08.local",
    "username": "admin",
    "password": "printerpass"
  },
  {
    "ip": "10.10.30.29",
    "hostname": "printer09.local",
    "username": "admin",
    "password": "printerpass"
  },
  {
    "ip": "10.10.30.30",
    "hostname": "printer10.local",
    "username": "admin",
    "password": "printerpass"
  },
  {
    "ip": "10.10.40.31",
    "hostname": "camera01.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.40.32",
    "hostname": "camera02.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.40.33",
    "hostname": "camera03.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.40.34",
    "hostname": "camera04.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.40.35",
    "hostname": "camera05.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.40.36",
    "hostname": "camera06.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.40.37",
    "hostname": "camera07.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.40.38",
    "hostname": "camera08.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.40.39",
    "hostname": "camera09.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.40.40",
    "hostname": "camera10.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.40.41",
    "hostname": "camera11.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.40.42",
    "hostname": "camera12.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.40.43",
    "hostname": "camera13.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.40.44",
    "hostname": "camera14.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.40.45",
    "hostname": "camera15.local",
    "username": "admin",
    "password": "camerapass"
  },
  {
    "ip": "10.10.50.41",
    "hostname": "router01.local",
    "username": "netadmin",
    "password": "netpass"
  },
  {
    "ip": "10.10.50.42",
    "hostname": "router02.local",
    "username": "netadmin",
    "password": "netpass"
  },
  {
    "ip": "10.10.50.43",
    "hostname": "router03.local",
    "username": "netadmin",
    "password": "netpass"
  },
  {
    "ip": "10.10.50.44",
    "hostname": "router04.local",
    "username": "netadmin",
    "password": "netpass"
  },
  {
    "ip": "10.10.50.45",
    "hostname": "router05.local",
    "username": "netadmin",
    "password": "netpass"
  },
  {
    "ip": "10.10.10.99",
    "hostname": "sbc01.local",
    "username": "root",
    "password": "toor"
  },
  {
    "ip": "10.10.20.99",
    "hostname": "sbc02.local",
    "username": "root",
    "password": "toor"
  },
  {
    "ip": "10.10.30.99",
    "hostname": "sbc03.local",
    "username": "root",
    "password": "toor"
  },
  {
    "ip": "10.10.40.99",
    "hostname": "sbc04.local",
    "username": "root",
    "password": "toor"
  },
  {
    "ip": "10.10.50.99",
    "hostname": "sbc05.local",
    "username": "root",
    "password": "toor"
  }
];
export default systems;