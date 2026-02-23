# Kontakter

## Kort version

Kontakter i SaleSys är kund- och prospektposter som samlar all information om en person eller ett företag. Funktionen kräver att **Kontakter** är aktiverat under Inställningar > Funktioner. Varje kontakt har anpassade fält, taggar, kommentarer och en komplett historik över samtal, ordrar och avtal.

Kontaktfält konfigureras av administratörer under Inställningar > Kontakter > Information. Fälttyperna inkluderar text, telefonnummer, e-post, namn, personnummer och datum. Fält kan kopplas till orderfält för automatisk ifyllning via Inställningar > Automation. Spärrlistor under Inställningar > Kontakter > Spärrlistor hindrar att vissa kontakter ringas.

Kontakter kan importeras via CSV-filer till specifika ringlistor. Systemet identifierar automatiskt dubbletter och låter dig välja om du vill uppdatera, skapa ny, hoppa över eller ta bort befintliga poster. All kontaktdata lagras krypterad.

## Fullständig guide

### Kontaktlistan

Kontaktlistan nås via **Kontakter** i navigeringen (kräver `ContactsGetAll`).

**Kolumner:**
- Skapad av (användare)
- Kontaktnummer (serienummer)
- Skapad (datum)
- Taggar
- Ringlistor
- Anpassade kontaktfält

**Sökning:**
- Textsökning i kontaktfält (krypterad)
- Sökning på telefonnummer
- Sökning på serienummer
- Kommaseparerad sökning (OR-baserad)

**Filter:**
- Datumintervall
- Ringlistor
- Taggar
- Projekt
- Telefonnummer

### Kontaktvy

Klicka på en kontakt för att se detaljerad information.

**Sektioner:**
1. **Kontaktfält** -- Alla fält med redigeringsmöjlighet
2. **Taggar** -- Rutnät med tillgängliga taggar (flervalsrutor)
3. **Kommentarer** -- Lägg till och visa kommentarer
4. **Händelser** -- Samtal, ordrar och avtal kopplade till kontakten
5. **Historik** -- Alla ändringar med vem och när

### Kontaktfält

Konfigureras under **Inställningar > Kontakter > Information** (enbart administratörer).

**Fälttyper:**
| Typ | Beskrivning | Autofyll |
|-----|-------------|----------|
| **Text** | Vanlig text | -- |
| **Datum** | Datumväljare | -- |
| **Nummer** | Numeriskt fält | -- |
| **Telefonnummer** | Telefon med formatering | SMS-mottagare i avtal |
| **E-post** | E-postadress | E-postmottagare i avtal |
| **Sekundär e-post** | Extra e-postadress | -- |
| **Förnamn** | Personens förnamn | Mottagarnamn i avtal |
| **Efternamn** | Personens efternamn | Mottagarnamn i avtal |
| **Mellannamn** | Personens mellannamn | Mottagarnamn i avtal |
| **Fullständigt namn** | Hela namnet | Mottagarnamn i avtal |
| **Personnummer** | Svenskt personnummer | Fylls i efter BankID |
| **Ja/Nej** | Boolean-fält | -- |

**Fältegenskaper:**
- Etikett (visningsnamn)
- Typ
- Projektbegränsning (globalt eller projektspecifikt)
- Orderfältkoppling

### Kontakttaggar

Konfigureras under **Inställningar > Kontakter > Taggar** (enbart administratörer).

**Egenskaper:**
- **Namn** -- Taggens visningsnamn
- **Färg** -- Visuell färgkod
- **Låsande** -- Kontakten kan enbart redigeras av administratörer
- **Standard** -- Läggs automatiskt till på nya kontakter
- **Projekt** -- Begränsa till specifikt projekt

Låsande taggar visas med en låsikon i kontaktlistan.

### Spärrlistor

Konfigureras under **Inställningar > Kontakter > Spärrlistor**.

Spärrlistor är listor med telefonnummer eller termer som inte ska kontaktas.

**Typer:**
- **Globala** -- Gäller alla ringlistor och direktsamtal automatiskt
- **Organisationsspecifika** -- Gäller enbart valda ringlistor

**Hantering:**
1. Skapa ny spärrlista med namn
2. Välj global eller specifik (kan inte ändras efter skapande)
3. Lägg till termer/nummer individuellt
4. Sök bland befintliga termer
5. Se antal matchande kontakter

### Importera kontakter

1. Förbered en CSV-fil med kontaktdata
2. Gå till en ringlista och välj **Importera**
3. Välj CSV-filen
4. Mappa CSV-kolumner till kontaktfält
5. Systemet identifierar automatiskt dubbletter

**Konflikthantering:**
Vid dubbletter får du följande alternativ:

| Alternativ | Beskrivning |
|------------|-------------|
| **Uppdatera** | Uppdatera befintlig kontakt med ny data |
| **Skapa** | Skapa ny kontakt trots dubblett |
| **Hoppa över** | Importera inte denna post |
| **Ta bort från lista** | Ta bort befintlig kontakt från ringlistan |

Dubbletter identifieras via telefonnummer och fältvärden. Upp till 200 konflikter per import.

### Automatisk fältkoppling

Konfigureras under **Inställningar > Automation > Informationskoppling**.

Kontaktfält kan kopplas till orderfält för automatisk ifyllning:
- **1:1-koppling** -- Ett kontaktfält till ett orderfält
- **1:M-koppling** -- Ett kontaktfält till flera orderfält (delas med mellanslag)

Exempel: Kontaktfältet "Fullständigt namn" kan delas till orderfälten "Förnamn" och "Efternamn".

### Rättigheter

| Rättighet | Beskrivning |
|-----------|-------------|
| `ContactsGetAll` | Se kontaktlistan |
| `ContactsCreate` | Skapa nya kontakter |
| `ContactsUpdate` | Redigera kontakter |
| `ContactsDelete` | Ta bort kontakter |

Låsta kontakter (med låsande tagg) kan enbart redigeras av administratörer, oavsett rättigheter.

### Säkerhet

- Alla kontaktfältvärden lagras krypterade (AES)
- Sökning sker via krypterade sammanfattningar
- Flera varianter av samma värde stöds för matchning (t.ex. olika telefonnummerformat)

### Kopplingar

- **Samtal** -- Alla samtal till en kontakt visas i kontaktvyn
- **Ordrar** -- Ordrar kopplade till kontakten listas
- **Avtal** -- Avtal skickade till kontakten visas
- **Ringlistor** -- Kontakter tillhör en eller flera ringlistor
- **Orderfält** -- Kontaktdata fylls automatiskt i orderfält via fältkoppling
