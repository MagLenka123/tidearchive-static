# TideArchive static site

## Uruchomienie
Wypakuj folder i uruchom go przez dowolny statyczny serwer WWW. Przykład: `python3 -m http.server 8000` w katalogu projektu, następnie otwórz `http://localhost:8000`.

Nie zaleca się otwierania bezpośrednio przez `file://`, ponieważ przeglądarki mogą blokować wczytywanie pliku JSON.

## Dane logowania
- Login: `TideWatcher`
- Hasło: `MorzePamietaWszystko!1987`

Dane są celowo zapisane na stałe w `js/app.js`, ponieważ logowanie jest mechaniką gry, a nie zabezpieczeniem.

## Języki
Interfejs obsługuje polski i angielski. Wybór jest zapamiętywany w `localStorage`.

## Publikacja
Folder można opublikować bez zmian na GitHub Pages, Netlify, Cloudflare Pages lub dowolnym hostingu statycznym.
