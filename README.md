Tudnivalók
A feladat beküldésével az alább leírtakat megértettnek és elfogadottnak tekintjük annak a nevében, aki a megoldást beküldte.

<Hallgató neve>
<Neptun kódja>
Ezt a megoldást a fent írt hallgató küldte be és készítette
a Kliensoldali webprogramozás kurzus csoport pótZH-jához.
Kijelentem, hogy ez a megoldás a saját munkám. Nem másoltam vagy
használtam harmadik féltől származó megoldásokat. Nem továbbítottam
megoldást hallgatótársaimnak, és nem is tettem közzé. Az Eötvös Loránd
Tudományegyetem Hallgatói Követelményrendszere (ELTE szervezeti és
működési szabályzata, II. Kötet, 74/C. §) kimondja, hogy mindaddig,
amíg egy hallgató egy másik hallgató munkáját - vagy legalábbis annak
jelentős részét - saját munkájaként mutatja be, az fegyelmi vétségnek számít.
A fegyelmi vétség legsúlyosabb következménye a hallgató elbocsátása az egyetemről.
1. feladat: Videólejátszó (1-video-player, 7 pont)
Az oldalon van egy <video> elem egy .video-placeholder elemben. Szeretnénk, ha a következő esetek működnének:

a. (2 pont) Ha megy a videó (ld. paused tulajdonság (Linkek egy külső oldalra)), és elgördítünk az oldalról úgy, hogy a videó elem elhagyja a látóteret, akkor a videó jelenjen meg a jobb alsó sarokban. Ehhez a .video-container elemhez adjuk a fixed stílusosztályt. Ez a videót kiveszi a külső div-ből és a jobb alsó sarokban jeleníti meg.
b. (1 pont) A fixed stílusosztály alkalmazásával és a videó elem kikerülésével a .video-placeholder elem magassága lecsökken, így a szöveg is feljebb ugrik. Előzzük meg ezt azzal, hogy a .video-placeholder elem magasságát beállítjuk a .video-container elem magasságára (offsetHeight).
c. (2 pont) Ha a videó visszakerül a látótérbe, akkor kerüljön vissza az eredeti helyére (vegyük le a fixed stílusosztályt).
d. (1 pont) Amikor a videó a jobb alsó sarokban van, akkor annak jobb felső sarkában az "x"-re kattintva tegyük vissza a videót eredeti helyére függetlenül attól, hogy látszana-e vagy sem.
e. (1 pont) A videó elem láthatóságának ellenőrzését végezzük el hatékonyan!
1-video-player.gif

2. feladat: Kijelölt szövegek megjegyzése (2-keep-selection, 7 pont)
Azt szeretnénk elérni, hogy az oldalon kijelölt szövegeket el tudjuk menteni a localStorage-ba, és ha legközelebb betöltjük az oldalt, akkor onnan visszatöltve meg tudjuk jeleníteni a kijelölt szövegeket.

a. (1 pont) Hozz létre dinamikusan egy gombot, add neki a save-selection stílusosztályt, és add az oldalhoz!
b. (2 pont) Ha kijelölünk egy szövegrészt, akkor azt rakjuk egy <mark> elembe. Ehhez hozzunk létre egy <mark> elemet, majd a kijelölt tartomány (range) surroundContents (Linkek egy külső oldalra) metódusa segítségével rakjuk a kijelölés köré. A kijelölt tartományt így tudod lekérni:
const selection = window.getSelection();
const range = selection.getRangeAt(0);
Megjegyzés: Ha a <mark> elem megvan, akkor a selection.removeAllRanges() metódusával meg tudod szüntetni a kijelölést!
c. (1 pont) Ugyancsak ekkor mentsük is el a kijelölt szövegrészt a localStorage-ba. Ehhez a következő adatokra lesz szükséged:
html: a <mark> elem HTML tartalma
container: az az elem, amely eredetileg a szöveget tartalmazza. Ehhez egy CSS szelektort kell generálni. Az ehhez szükséges csomag már be van húzva, így kell használni: unique(range.startContainer)
path: tároljuk el az oldal útvonalát (window.location.pathname)
d. (1 pont) A surroundContents nem működik, ha elemhatárokat lépünk át. Ilyen esetben kivételt dob, és ekkor adjunk a body elemnek error stílusosztályt 1 másodeprcig.
e. (2 pont) Az oldal betöltésekor olvassuk fel az adott oldalhoz tartozó elmentett helyeket, majd jelöljük ki a szövegrészeket az oldalon. Ehhez válasszuk ki a container-rel jelölt elemet, majd annak belső HTML-jében keressük meg az eltárolt html-t, és rakjunk köré <mark> elemet (pl. szövegcserével)!
2-keep-selections.gif

3. feladat: Relatív idő (3-relative-time, 6 pont)
A HTML <time> elemét szeretnénk progresszíven felokosítani. Ez az elem azt jeleníti meg, ami a nyitó- és záróeleme között van, de megadható egy datetime attribútuma is, amely a gépek számára szemantikailag értelmezhetővé teszi a szöveget. Ezt az elemet szabjuk testre webkomponens segítségével (relative-time). Így használjuk (ld. még index.html):

<time datetime="2024-05-20T20:00:00.000Z" format="relative" is="relative-time">20 May 2024</time>
datetime: a pontos időpont
format:
absolute: abszolút idő
relative: relatív idő
Feladatok:

a. (1 pont) Készítsd elő a relative-time egyedi komponenst!
b. (1 pont) Ha a format attribútum absolute, akkor használd a böngésző Intl.DateTimeFormat API-ját (Linkek egy külső oldalra) az időpont lokalizált kiírásához, pl.:
console.log(new Intl.DateTimeFormat("hu").format(new Date("2024-05-20T14:34:00.000Z")));
c. (2 pont) Ha a format attribútum relative, akkor használd a böngésző Intl.RelativeTimeFormat API-ját (Linkek egy külső oldalra) a relatív időpont lokalizált kiírásához, pl.:
console.log(new Intl.RelativeTimeFormat("hu", {numeric: "auto"}).format(-1, "day");
A format metódus értékét és mértékegységét a mellékelt duration függvény adja vissza egy adott időponthoz.
d. (1 pont) A lokalizált nyelvet (pl. "hu" vagy "en") olvasd ki a komponenshez legközelebbi lang attribútumból!
e. (1 pont) Végezd el a format és datetime attribútumok szinkronban tartását a komponens ugyanilyen nevű tulajdonságaival!
3-relative-time.png