const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 720,
    title: "ClipLote Studio PRO",
    backgroundColor: "#0A0A0B",
    icon: path.join(__dirname, '../public/icon.png'), // desktop app launcher icon
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Decide if we are in development or production loader mode
  const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:3000';
  const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';

  if (isDev) {
    mainWindow.loadURL(devServerUrl);
    // Open DevTools securely for developers
    mainWindow.webContents.openDevTools();
  } else {
    // Load local compiled product distribution index
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Set elegant custom menu bar suitable for video tools
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        { label: 'Nova Sessão Lote', accelerator: 'CmdOrCtrl+N', click: () => { mainWindow.reload(); } },
        { type: 'separator' },
        { label: 'Sair e Encerrar', role: 'quit' }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { label: 'Desfazer', role: 'undo' },
        { label: 'Refazer', role: 'redo' },
        { type: 'separator' },
        { label: 'Recortar', role: 'cut' },
        { label: 'Copiar', role: 'copy' },
        { label: 'Colar', role: 'paste' },
        { label: 'Selecionar Tudo', role: 'selectAll' }
      ]
    },
    {
      label: 'Visualização',
      submenu: [
        { label: 'Recarregar Painel', role: 'reload' },
        { label: 'Forçar Recarregamento', role: 'forceReload' },
        { label: 'Inspecionar Elementos', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Tela Cheia', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Tutoriais de Lote',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com');
          }
        },
        {
          label: 'Sobre o ClipLote PRO',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Sobre o ClipLote PRO',
              message: 'ClipLote Studio PRO (Desktop Edition)',
              detail: 'Compilação de Shorts, TikToks e Reels em Lote com inteligência anti-shadow ban, dublagem em português e layouts cinematográficos ultra velozes.\n\nVersão: 2.4.0 (Electron Wrapper)\nDesenvolvido com carinho para Criadores de Conteúdo.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
