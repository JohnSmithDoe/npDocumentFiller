# WIP

* testdata... in renderer... clean up some more code now
* xlsx
* sfw version??


# ISSUES

// ISSUE #1: Maybe due to routing or some path we have to redirect to the index page
// ISSUE #2: To add npm packages to the main we have to add them to both package.jsons Maybe its not a good idea to keep the main in the src folder
    - Do peerDependencies get installed ... probably not
// ISSUE #3: How to get the encoding of a file instead of assuming win1252
// ISSUE #4: Typing is not the best
// ISSUE #4: Typing for tree control??? still strange

# TODOs

````
pdf.service.ts:
(156, 6) // TODO: how to get the encoding of a file instead of assuming win1252
(164, 6) // TODO: can we use utf-8 in some way...?? Windows only for now....
````

# Introduction

This small app helps to fill multiple documents like pdfs with forms and xlsx files with data.
You can setup document links to original files and create a filled set of them with some simple actions.
Depends on pdftk to be available on your system and runs currently only on windows because of the win1252 encoding.

Based on: https://github.com/maximegris/angular-electron (electron + angular)

Currently runs with:

- German UI :)
- Angular v13.2.4
- Electron v17.1.0

## Environment variables

You can override each used resource with the following env variables:

| Variable      | Description                           | Default               |
|---------------|---------------------------------------|-----------------------|
| APP_PDFTK_EXE | Absolute path to the pdftk executable | ./pdftk/bin/pdftk.exe |
| APP_DATA      | Absolute path to the data folder      | ./data                |
| APP_TEMP      | Absolute path to the temp folder      | ./data/tmp            |
| APP_CACHE     | Absolute path to the cache folder     | ./data/cache          |
| APP_OUTPUT    | Absolute path to the output folder    | ./data/out            |
| APP_CONFIG    | Absolute filename of the config file  | ./data/config.json    |

## Project structure

| Folder       | Description                                      |
|--------------|--------------------------------------------------|
| src/main     | Electron main process folder (NodeJS)            |
| src/bridge   | Electron and angular shared files (TypeScript)   |
| src/renderer | Electron renderer process folder (Web / Angular) |


## Included Commands

| Command                       | Description                                                                          |
|-------------------------------|--------------------------------------------------------------------------------------|
| `npm run ng:serve`            | Execute the app in the web browser (DEV mode)                                        |
| `npm run electron:serve`      | Run electron with ng:serve as client (hot reload enabled for renderer)               |
| `npm run electron:unpackaged` | Builds your application to an unpacked executable                                    |
| `npm run electron:packaged`   | Builds your application and creates an app consumable based on your operating system |

**Your application is optimised. Only /dist folder and NodeJS dependencies are included in the final bundle.**
