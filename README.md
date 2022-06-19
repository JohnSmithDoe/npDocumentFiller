# Introduction

This branch contains a prebuild setup.exe file.
After you installed the software with this setup.
Go to the installation folder and add the config file.
Set at least the PDFTK_EXE for now.

# Config file

You can use a config file ".npconfig" in the "exe's" path that contains an IAppConfig json

```
{
  PDFTK_EXE?: string;
  ENCODING?: string;
  DATA_PATH?: string;
  TMP_PATH?: string;
  CACHE_PATH?: string;
  OUTPUT_PATH?: string;
  DB_FILE?: string;
  PROFILE_FILE?: string;
}
```

# Environment variables

You can override each used resource with the following env variables:

| Variable      | Description                             | Default               |
|---------------|-----------------------------------------|-----------------------|
| APP_PDFTK_EXE | Absolute path to the pdftk executable   | ./pdftk/bin/pdftk.exe |
| APP_DATA      | Absolute path to the data folder        | ./data                |
| APP_TEMP      | Absolute path to the temp folder        | ./data/tmp            |
| APP_CACHE     | Absolute path to the cache folder       | ./data/cache          |
| APP_OUTPUT    | Absolute path to the output folder      | ./data/out            |
| APP_CONFIG    | Absolute filename of the config file    | ./data/config.json    |
| APP_ENCODING  | Override the file encoding used for r/w | ./data/config.json    |

# Project structure

| Folder       | Description                                      |
|--------------|--------------------------------------------------|
| src/main     | Electron main process folder (NodeJS)            |
| src/bridge   | Electron and angular shared files (TypeScript)   |
| src/renderer | Electron renderer process folder (Web / Angular) |

# Included Commands

| Command                       | Description                                                                          |
|-------------------------------|--------------------------------------------------------------------------------------|
| `npm run start`               | Starts the main and the renderer in electron / hot reload of the renderer enabled    |
| `npm run ng:serve`            | Starts only the renderer in the web browser                                          |
| `npm run electron:serve`      | Starts only the main in electron                                                     |
| `npm run build:all:prod`      | Run the build process for main and renderer                                          |
| `npm run electron:local`      | Run the build on you local machine                                                   |
| `npm run electron:unpackaged` | Builds your application to an unpacked executable                                    |
| `npm run electron:packaged`   | Builds your application and creates an app consumable based on your operating system |

