# Ordrar

## Kort version

Ordrar är kärnan i SaleSys och representerar genomförda försäljningar. Du skapar ordrar under **Ordrar** i navigeringen genom att klicka **Lägg till**. Varje order innehåller anpassade orderfält, produktval, taggar och eventuellt bifogade filer.

Orderfält konfigureras av administratörer under Inställningar > Order > Information. Fälten kan vara av olika typer (text, nummer, datum, telefon, e-post m.m.) och kan kopplas till kontaktfält för automatisk ifyllning. Vilka fält som visas kan styras per produktkategori.

Taggar används för att markera orderstatus och kan konfigureras under Inställningar > Order > Taggar. En tagg kan vara negerande (retur), låsande (enbart administratör kan redigera) eller standard (läggs till automatiskt). Under Inställningar > Order > Verktyg kan du konfigurera automatiska arbetsflöden som körs efter att en order skapats, till exempel att skicka SMS, e-post eller göra HTTP-anrop.

## Fullständig guide

### Skapa en order

1. Gå till **Ordrar** i navigeringen
2. Klicka på **Lägg till** (kräver rättigheten `OrdersCreate`)
3. Fyll i följande sektioner:

#### Grundinformation
- **Säljare** -- Välj vilken användare ordern tillhör (visas bara för administratörer)
- **Ordinarie datum** -- Valfritt datum för när försäljningen gjordes
- **Orderfält** -- Fyll i de anpassade fälten som din organisation har konfigurerat

#### Produktval
- Välj produkter från tillgängliga produktkategorier
- Ange antal eller pris beroende på produktens inställning
- Produktinformation sparas som en ögonblicksbild vid ordertillfället

#### Taggar
- Standardtaggar läggs till automatiskt
- Du kan lägga till eller ta bort taggar (om ordern inte är låst)

#### Kalenderhändelser
- Om projektet kräver det kan du koppla ordern till en kalenderhändelse

#### Filer
- Bifoga filer till ordern vid skapande eller efteråt

4. Klicka **Spara**

### Orderfält

Orderfält är anpassade informationsfält som konfigureras av administratörer under **Inställningar > Order > Information**.

**Fälttyper:**
- Text
- Nummer
- E-post
- Telefonnummer
- Datum
- Ja/Nej (Boolean)
- Personnummer
- Rullgardinsmeny (fördefinierade värden)

**Fältegenskaper:**
- **Obligatoriskt** -- Fältet måste fyllas i
- **Validering** -- Regex-mönster, min/max längd
- **Beskrivning** -- Hjälptext som visas för användaren
- **Konfidentiellt** -- Dolt för vanliga användare (enbart administratörer)
- **Standarddatum** -- Fyll automatiskt med relativt datum

**Koppling till kontaktfält:**
Orderfält kan kopplas till kontaktfält via Inställningar > Automation > Informationskoppling. När en order skapas från en kontakt fylls orderfälten i automatiskt.

**Synlighet per produktkategori:**
Under varje produktkategori kan du välja vilka orderfält som ska visas eller döljas när den kategorin väljs.

### Ordertaggar

Taggar konfigureras under **Inställningar > Order > Taggar**.

**Taggegenskaper:**
| Egenskap | Beskrivning |
|----------|-------------|
| **Namn** | Taggens visningsnamn |
| **Färg** | Visuell färgkod |
| **Negerande** | Markerar ordern som retur/annullerad (påverkar summaberäkningar) |
| **Låsande** | Enbart administratörer kan redigera ordern |
| **Standard** | Läggs automatiskt till på nya ordrar |
| **Kategori** | Valfri gruppering |
| **Projekt** | Begränsa till specifika projekt |
| **Teamåtkomst** | Begränsa till specifika team |

### Orderverktyg (After-order-work)

Automatiska arbetsflöden som körs efter att en order skapats. Konfigureras under **Inställningar > Order > Verktyg**.

**Åtgärdstyper:**
- **SMS** -- Skicka SMS till säljare, kontakt eller anpassat nummer
- **E-post** -- Skicka e-post med bilagor
- **HTTP-anrop** -- Gör anrop till externa tjänster med fältmappningar
- **Dokument** -- Skapa dokument från order

Åtgärder kan ha villkor baserade på projekt, fältvärden och taggar. Flera åtgärder kan köras i sekvens.

### Orderlistan

Orderlistan visar alla ordrar du har tillgång till med kraftfulla filtreringsmöjligheter.

**Filter:**
- **Datumintervall** -- Filtrera på skapandedatum eller ordinarie datum
- **Datumstrategi** -- Välj vilken datumtyp som ska användas
- **Användare/Team** -- Visa ordrar från specifika säljare eller team
- **Taggar** -- Filtrera på en eller flera taggar (alla/någon/ingen)
- **Fält** -- Filtrera på fältvärden
- **Produkter** -- Filtrera på produktkategori
- **Textsökning** -- Sök i orderfält (krypterad sökning)

**Sortering:**
Sortera efter datum, serienummer, användare eller ordinarie datum.

**Kolumner:**
Anpassningsbara kolumner inklusive säljare, serienummer, summa, datum, taggar, produkter, ringlista och anpassade orderfält.

**Snabbstatistik:**
När filter är aktiva visas summa för icke-negerande ordrar, negerande ordrar (returer) och eventuella fältsummor.

### Exportera ordrar

1. Öppna orderlistan
2. Klicka på **Exportera** (kräver `OrdersCreate`)
3. Välj datumintervall eller exportera alla med aktuella filter
4. Välj format: **CSV** eller **XLSX**
5. Filen laddas ned med namn `orderexport-YYYY-MM-DD`

Exporten inkluderar serienummer, datum, säljare, produkter, fältvärden, taggar och summor.

### Orderdelar

Ordrar kan delas upp i delar med separata fält. Varje del kan redigeras separat och visas som expanderbara rader i orderlistan.

### Rättigheter

| Rättighet | Beskrivning |
|-----------|-------------|
| `OrdersCreate` | Skapa nya ordrar |
| `OrdersGetAll` | Se alla organisationens ordrar |
| `OrdersGetByOwnTeam` | Se ordrar från det egna teamet |
| `OrdersGetOwn` | Se enbart egna ordrar |
| `OrdersUpdate` | Redigera ordrar |
| `OrdersDelete` | Ta bort alla ordrar |
| `OrdersDeleteOwn` | Ta bort enbart egna ordrar |
| `OrdersGetFieldData` | Se konfidentiella orderfält |
| `OrdersBypassValidation` | Hoppa över fältvalidering |

### Kopplingar till andra funktioner

- **Avtal** -- Ordrar kan skapas från signerade avtal
- **Kontakter** -- Orderfält fylls i automatiskt från kontaktdata
- **Produkter** -- Produktval bestämmer pris och summor
- **Projekt** -- Ordrar kan tillhöra specifika projekt
- **Ringlistor** -- Ordrar kopplas till ringlistor vid telefonförsäljning
- **Kalender** -- Kalenderhändelser kan kopplas till ordrar
