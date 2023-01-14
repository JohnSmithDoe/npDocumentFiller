## Installationsanleitung

### Schritt 1: Download

Download des aktuellen Release: [GitHub](https://github.com/JohnSmithDoe/npDocumentFiller/raw/release/version115/npAusfuellhilfe_v115.zip)
Entpacken in einen beliebigen Ordner.

### Schritt 2: Konfigurationsdatei anpassen

Im Ordner "npAusfuellhilfe" liegt eine Datei namens ".npConfig"

```json
{
"PDFTK_EXE": "../pdftk/bin/pdftk.exe",
"ENCODING": "win1252",
"DATA_PATH": "./data",
"TMP_PATH": "./data/tmp",
"CACHE_PATH": "./data/cache",
"OUTPUT_PATH": "./data/out",
"DB_FILE": "./data/data.db",
"PROFILE_FILE": "./data/profile.db"
}
```
Hier die entsprechenden Pfade anpassen.
