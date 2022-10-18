# Wie kann man node.js-Lösungen bei Kunden installieren, ohne dass die den Source-Code sehen können?

## Verwendete Werkzeuge
Zu den in diesem Projekt verwendeten Technologien gehört als erstes das Betriebssystem, das Ubuntu 22.04 LTS ist. Die Verwendung von Ubuntu ist wichtig, weil es sich um eine Open-Source-Software handelt, bei der die Benutzer den Code nach Belieben einsehen und ändern können. Das macht es für Hacker schwieriger, Schwachstellen in LinuxSystemen auszunutzen.

Node.js ist eine Open-Source-JavaScript runtime environment, die JavaScript-Code außerhalb eines Webbrowsers ausführt.

Die hier verwendete Version Node.js : v12.2.0. npm ist ein Paketmanager für Node.js mit hundert tausenden von Paketen. Dieses Projekt verwendet die Version 6.9.0.

Als nächstes kommen die Pakete, die mit npm installiert werden. express(4.18.1) für Nodejs ist ein schnelles, minimalistisches Web-Framework.

Und für die Nutzung von Sessions wird natürlich das Paket express-session(4.18.1) benötigt.

Dotenv (16.0.1) ist ein abhängigkeitsfreies Modul, das Umgebungsvariablen aus einer .env-Datei in process.env lädt.

pkg (5.7.0) ist ein Ein-Befehl-Nodejs-Binär-Compiler, der für die Verwendung in Containern erstellt wurde und nicht für die Verwendung in serverlosen Umgebungen gedacht ist.

Um die MySQL-Datenbank zu verwalten, wird mysql (2.18.1) ebenfalls benötigt. Und schließlich wird für die Verwaltung der Container und Images eine kompatible Version von Docker (Docker Version 20.10.12, Build 20.10.12-0ubuntu4) benötigt.

## Einrichtung und Installation

### Erstellung der Nodejs-App

Node und andere Module sollten mit den folgenden Befehlen installiert werden:
Nodejs mit dem Befehl installieren:

```bash 
sudo apt install nodejs
```
In diesem Projekt spielt die Version von Node keine Rolle.

* npm - Installieren mit dem Befehl :
```cmd 
apt install npm
```

* mysql - Installieren mit dem Befehl :
```cmd 
npm install mysql -- save .
```

* Express Sessions - Installieren mit dem Befehl :
```cmd 
npm install express - session -- save .
```

*  Express - Installieren mit dem Befehl :
```cmd 
npm install express -- save .
```

* Dotenv - Installieren mit dem Befehl :
```cmd 
npm install dotenv -- save
```

* pkg - Installieren mit dem Befehl :
```cmd 
npm install pkg - install
```


Mit dem nächsten Befehl wird das Verzeichnis node_modules und die Datei packagelock.json erstellt:

```cmd 
npm install
```
### login.js 


Der Javascript-Code verwaltet die Anwendung im Backend, stellt die Verbindung zum SQL-Container her und verwaltet die URL und Weiterleitungen. Man könnte ihn auch als den wichtigsten Teil der Anwendung bezeichnen.
Der folgende Codeblock wird verwendet, um Module in den Code einzubinden, die mit npm installiert wurden.

```javascript 
 const mysql = require ( ’ mysql ’) ;
 const express = require ( ’ express ’) ;
 const session = require ( ’ express - session ’) ;
 const path = require ( ’ path ’) ;

 ....
```
Der folgende Code wird verwendet, um eine Verbindung mit der SQL-Container herzustellen:

```javascript 
....

 const connection = mysql . createPool ({
 connectionLimit : 10 ,
 host : " mysqldb " ,
 user : " root " ,
 password : "123456" ,
 database : " nodelogin __"
 }) ;
 ....

```

Die Verbindungsdetails müssen den Anmeldedaten der Datenbank entsprechen. In den meisten lokalen Umgebungen ist der Standardbenutzername root.
Express wird für die Webanwendung verwendet, die Pakete enthält, die für die serverseitige Webentwicklung unerlässlich sind, z. B. Sitzungen und die Bearbeitung von
HTTP-Anfragen:

```javascript 
....

 const app = express () ;

 app . use ( session ({
 secret : ’ secret ’ ,
 resave : true ,
 saveUninitialized : true
 }) ) ;
 app . use ( express . json () ) ;
 app . use ( express . urlencoded ({ extended : true }) ) ;

 ....


```

Sessions wird verwendet, um festzustellen, ob der Benutzer angemeldet ist oder nicht.
Die Methoden json und urlencoded extrahieren die Formulardaten aus unserer Datei login.html.
Die folgenden Zeilen sind wichtig, weil sie bedeuten, dass login.html, register.html und style.css im nächsten Schritt in den Verpackungsprozess in der Dockerfile aufgenommen werden.

```javascript 
.....
const mysql = require ( mysql ) ;
 const express = require ( express ) ;
 const session = require ( express - session ) ;
 const path = require ( path ) ;


....

 app . use ( express . static ( path . join (__ dirname , ’./ static / style . css ’) ) ) ;
 app . use ( express . static ( path . join (__ dirname , ’/ register . html ’) ) ) ;
 app . use ( express . static ( path . join (__ dirname , ’/ login . html ’) ) ) ;

 ....



```
Im Dockerfile analysiert pkg während des Paketierungsprozesses die Quellen, erkennt die Aufrufe von require, durchsucht die Abhängigkeiten der App und schließt sie in die ausführbare Datei ein.

###  Erstellung der Dockerfile

Diese Dockerdatei enthält alle Befehle zur Erstellung die neuen Containers. Zunächst werden alle benötigten Dateien in den Container kopiert. Dann wird eine neue ausführbare Datei erstellt, die die Anwendung und alle Abhängigkeiten und externen Dateien enthält. Dieser Container lauscht auf Port 3000 und führt die ausführbare Datei aus,sobald er gestartet wird.

```Dockerfile 

 FROM node :18 - alpine 3.14 AS NO .1

 COPY . .

 RUN npm install
 RUN npm install mysql
 RUN npm install -- location = global pkg
 RUN pkg login . js -t node 12 - linux - x 64


 FROM ubuntu : latest AS NO .2



 COPY -- from = NO .1 login ./



 EXPOSE 3000

 ENTRYPOINT ["./ login "]


```
In dieser Dockerdatei ist pkg das Werkzeug, das verwendet wird, um die App und alle Requirments und externen Dateien in eine Executable zu packen :

```Dockerfile
RUN pkg login . js -t node 12 - linux - x 64


```
Die angegebenen Einstellungen ( node12 und linux 64 ) sind die Spezifikationen des Rechners, auf dem die Anwendung ausgeführt werden soll, und können in dieser Zeile
geändert werden.

### Erstellung der .env Datei
Zum Ausführen der Container kann nun der folgende Befehl verwendet werden:
```.env
 MYSQLDB _ USER = root
 MYSQLDB _ ROOT _ PASSWORD =123456
 MYSQLDB _ DATABASE = nodelogin
 MYSQLDB _ LOCAL _ PORT =3306
 MYSQLDB _ DOCKER _ PORT =3306

 NODE _ LOCAL _ PORT =6868
 NODE _ DOCKER _ PORT =8080


```

### Erstellung der docker-compose Datei


Docker-Compose wird für die Verwaltung von Docker-Anwendungen mit mehreren Containern wie dieser verwendet. Diese YML-Datei erstellt einen brandneuen Container, indem sie den App-Container mit dem Dockerfile des Webs und einem neuen Kontinent verbindet, der aus den gegebenen Einstellungen innerhalb der Docker-Compose-Datei (mysqldb) erstellt wird.


``` Dockerfile
 version : "3.8"
 services :
 mysqldb :
 image : mysql :5.7
 restart : always
 env _ file : ./. env
 environment :
 MYSQL _ ROOT _ PASSWORD : 123456
 ports :
 - $ MYSQLDB _ LOCAL _ PORT :$ MYSQLDB _ DOCKER _ PORT

 web :
 build : ./ webe
 environment :
 MYSQL _ USER : root
 MYSQL _ PASSWORD : 123456
 MYSQL _ HOST : mysqldb
 ports :
 - "3000:3000"
 depends _ on :
 - mysqldb
 restart : on - failure
 
```


## Dockerisierung und Start

### Docker installieren

Um Docker zu installieren, sollte der folgende Code in der richtigen Reihenfolge ausgeführt werden :

```
sudo apt - get update
sudo apt - get install \
ca - certificates \
curl \
gnupg \
lsb - release
```


```
sudo mkdir -p / etc / apt / keyrings
curl - fsSL https :// download . docker . com / linux / ubuntu / gpg |
sudo gpg -- dearmor -o / etc / apt / keyrings / docker . gpg
```


```
echo \
" deb [ arch = $ ( dpkg -- print - architecture ) signed - by =/ etc / apt
/ keyrings / docker . gpg ] https :// download . docker . com / linux
/ ubuntu \
$ ( lsb_release - cs ) stable " | sudo tee / etc / apt / sources .
list . d / docker . list > / dev / null
```


```
sudo apt - get update
sudo apt - get install docker - ce docker - ce - cli containerd . io docker - compose - plugin
```




### Starten der App mit Docker

Die Docker-Container können mit folgendem Befehl stratifiziert werden:

```
docker-compose up
```
Die Dienste können mit dem Befehl im Hintergrund ausgeführt werden:

```
docker - compose up -d
```


Die Ausgabe sollte nun wie folgt aussehen:

![output](https://user-images.githubusercontent.com/59409455/196443857-381cfbe7-5183-4f9c-846a-f74177dc34c1.png)


Wie in oben zu sehen ist, lauscht der Container auf Port 3000 und über die folgende URL: localhost:3000/ wird die Anwendung im Browser gestartet.
Das Stoppen aller laufenden Container ist ebenfalls einfach mit einem einzigen Befehl möglich:


```
docker - compose down
```

Es ist möglich, die App nach dem Aktualisieren des Inhalts mit dem Befehl neu zu starten:

```
docker - compose up -- build
```

## Das Aussehen der Applikation

Nachdem die Adresse http://localhost:3000/ im Browser aufgerufen wurde, ist das Anmeldeformular zu sehen, das wie folgt aussehen sollte:
![register](https://user-images.githubusercontent.com/59409455/196444084-6bcab506-6427-4d6b-8e25-4881d06c16fc.png)

Nach der Erstellung seines Kontos wird der Benutzer auf die Login-Seite weitergeleitet, wo er sich mit seinem Benutzernamen und Passwort anmelden kann.

![login](https://user-images.githubusercontent.com/59409455/196444110-f25034f8-be4c-4cac-abe9-778b3c0f5bda.png)

Dann wird der Benutzer zur Startseite weitergeleitet, wo er begrüßt wird :
![home](https://user-images.githubusercontent.com/59409455/196444147-7c207210-7d1c-4e90-b8ff-23c0250ba8fc.png)



## Sicherheitsmaßnahmen


### Installierte Pakete gegen Angriffe

* Helmet :
Legt sicherheitsbezogene HTTP-Antwort-Header zum Schutz vor Cross-Site-ScriptingAngriffen und Cross-Site-Injections fest.

*  XSS-Clean : 
Sanitized Benutzereingaben aus dem POST-Anfragetext, der GET-Anfrage und den URL-Parametern und schützt vor Cross-Site-Scripting und XSS-Angriffen.

* HPP :
Legt die Array-Parameter in req.query und/oder req.body beiseite und wählt nur den letzten Parameterwert aus, um HTTP-Parameter-Pollution-Angriffe zu vermeiden.

### Dockerisierung :

Die Dockerisierung der Anwendung bietet eine zusätzliche Sicherheitsebene. Wenn Container voneinander isoliert sind, laufen die Anwendungen in ihrer eigenen, in sich geschlossenen Umgebung. Das bedeutet, dass selbst wenn die Sicherheit eines Containersge fährdet ist, die anderen Container auf demselben Host sicher bleiben. Container sind nicht nur voneinander isoliert, sondern auch vom Host-Betriebssystem und können nur in geringem Maße mit Rechenressourcen interagieren. All dies führt zu einer inhärent sichereren Art der Anwendungsbereitstellung. Wenn die Anwendung in einem DockerContainer ausgeführt wird, bedeutet dies, dass sie isoliert ist und nicht auf dem lokalen Rechner läuft, so dass der Quellcode nicht lokal zugänglich ist. Das bedeutet, dass die Angreifer versuchen sollten, über die Docker-Server darauf zuzugreifen. 


### Obfuskation und Binär/Obfuskulation :

Ein obfuskierter Code sieht unlesbar aus, aber wenn er ausgeführt wird, funktioniert er genau wie der Originalcode:
```javascript
const _0x472150 = _0x4816 ; function _0x1580 (){ const .....
``` 
Diese Technik wird verwendet, um den Quellcode zu verbergen, aber das Problem ist, dass er ausführbar ist und entschlüsselt und zurückentwickelt werden kann. Die Kombination von Codeverschleierung mit der Umwandlung der Nodejs-Anwendung in eine Binärdatei (Binärverschleierung) erschwert den Zugriff auf den Quellcode, da es möglich ist, eine Binärdatei zu disassemblieren und den Assembler-Quellcode zurückzubekommen, aber leider ist es mit genügend Zeit und Ressourcen und unter Verwendung der richtigen Tools immer noch möglich, den fragmentierten Code und den Quellcode zu erhalten. Aber insgesamt ist es durch die Verwendung von Code Obfuscation und das
 aden der Nodejs-App als Binary in den Docker-Container schwierig und kostspielig, den Quellcode zu erhalten.
 
 
 ##Ist der Quellcode der Anwendung einsehbar (wie einfach ist es, ihn zu erhalten)?

 Wenn die Nodejs-Anwendung hochgeladen und in den Container gepackt wird, ist sie dann sicher? Die Antwort ist nein, die ausführbare Datei kann immer noch erlangt
werden, denn egal wie sicher die Container auch sein mögen, sie sind immer noch nicht unbesiegbar. Nun, da der Angreifer die ausführbare Datei hat, kann er nicht mehr an den Quellcode gelangen, richtig? Die Antwort ist auch hier ein Nein, denn egal wie sicher er ist, er kann disassembliert und dekompiliert werden.
 
 
 ### Dekompilierungs-/Disassemblierungstools 
 
 Es gibt viele Tools, die dekompilieren, desassemblieren, skripten und mehr können. Zum Beispiel gibt es Hopper, IDA Pro und das bekannte Ghidra, das verwendet wird, um zu versuchen, den Quellcode der Nodejs-Anwendung zu erhalten und um zu zeigen, wie zugänglich der Quellcode ist.
 Ghidra ist ein kostenloses und quelloffenes Reverse-Engineering-Tool, das von der National Security Agency der Vereinigten Staaten entwickelt wurde. Die Binärdateien
wurden auf der RSA-Konferenz im März 2019 veröffentlicht.
 
 
 ### Den Quellcode mit Ghidra zu erhalten 
 
 Nach dem Hochladen der Exe-Datei in Ghidra und dem Disassemblieren und Dekompilieren zeigt das Tool  an:
 ![ghidra](https://user-images.githubusercontent.com/59409455/196444208-09bade0f-9ff3-4de8-8d8e-f557d7838fc9.png)

Nachdem das Reverse Ingeneering abgeschlossen ist, enthält das Gidra-Fenster eine Vielzahl von Unterfenstern, von denen jedes seine eigene Bedeutung und Verwendung
hat. 
Program Trees  enthält die Abschnitte des Programms, der Abschnitt Symbol Tree ist sehr nützlich, da er die Importe, Exporte und Funktionen enthält, die das
Programm verwendet:
![program](https://user-images.githubusercontent.com/59409455/196444273-8f5965a9-e1dd-4a19-934a-2235096f7977.png)

Der Symbol Tree  enthält alle Funktionen des Programms. Wenn Ghidra das Programm importiert und anschließend analysiert, wird es versuchen, einigen der Funktionen auf der Grundlage der durchgeführten automatischen Analyse Namen zuzuweisen :
![symbol](https://user-images.githubusercontent.com/59409455/196444337-7dd14540-2a59-4f4a-9029-69316a9390da.png)

Imports enthält die Bibliotheken, die vom Programm importiert wurden. Wenn man auf eine DLL klicken, werden die importierten Funktionen angezeigt, die mit dieser Bibliothek verbunden sind.
Es gibt auch eine Auflistung für Entry , das ist der Einstiegspunkt des Programms, und durch einen Doppelklick darauf wird das Hauptfenster Listing von Ghidra
aktualisiert und zeigt den Assemblercode am Einstiegspunkt des Programms an :
 ![listing](https://user-images.githubusercontent.com/59409455/196444390-7bb01354-0206-4e4e-89ac-00a55d8e06f4.png)

 Das Decompile-Fenster  zeigt, wo Ghidra versucht hat, den Assembler-Code im Fenster Listing in C-Programmcode umzuwandeln. Auf diese Weise kann der Programmanalytiker sehen, wie der Code des Programms ausgesehen haben könnte, was bei der Analyse des Programms hilfreich ist :
 
 ![Decompile](https://user-images.githubusercontent.com/59409455/196444472-a6d79f14-d04d-4cd6-9975-2754d3e46909.png)

 
 ### Auslegung und Schlussfolgerung
 
 Nach dem Reverse-Engineering des Programms zeigt ghidra den Assembler-Code des Programms und die Übersetzung oder die Umwandlung des Assembler-Codes in C-Code.
Es zeigt auch, dass einige Libs wie https und node bereits vom Decompiler erkannt wurden. Die Zeit, die für die Analyse des Dekompilierens und Desassemblierens benötigt wird, ist groß, und die Assemblerzeilen sind ebenfalls groß. Man kann sagen, dass das Kompilieren der Nodejs-App in ein Paket mit all seinen Abhängigkeiten den Zugriff auf den Quellcode erheblich erschwert hat. Der Code ist in C, aber das bedeutet nicht, dass er nicht in Js übersetzt werden kann, was bedeutet, dass der Quellcode immer noch erhalten werden kann. Zusammenfassend lässt sich sagen, dass die Kompilierung und Dockerisierung den Quellcode nicht vollständig versteckt hat, sondern es den Angreifern nur erschwert hat, weil sie zuerst in den Container einbrechen müssen, um an die ExeDatei zu erhalten, und sie dann dekompilieren und desassemblieren müssen.



## Fazit
Der originale Quellcode kann von den Benutzern zunächst nicht eingesehen werden, da er obfuskiert und zu einer Binärdatei kompiliert wurde, kann aber dennoch zurückentwickelt werden. Es gibt viele Tools, mit denen die Binärdateien zurückentwickelt werden können (z. B. Hopper und Hex-Rays Decompiler), aber der Hauptgrund für die Verwendung von Obskuritätssicherheit besteht nicht darin, anderen den Zugriff auf die Datenbank oder den Quellcode unmöglich zu machen, sondern darin, ihnen diese Aufgabe so schwer wie möglich zu machen. Alles ist ein Opfer von Threads und Vulnerabilitäten, egal wie sicher es ist, und deshalb entwickelt sich die Technologie ständig weiter, um sicherere Umgebungen zu schaffen, um die Verwüstungen der Angreifer zu begrenzen.


