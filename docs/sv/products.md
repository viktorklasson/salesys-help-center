# Produkter

## Kort version

Produkter i SaleSys organiseras i kategorier och används vid skapande av ordrar och avtal. Enbart administratörer kan skapa produktkategorier och produkter. Varje produkt har namn, pris, moms, produktfält och kan ha teamspecifik prissättning.

Produktkategorier konfigureras under Inställningar > Produkter och styr vilka orderfält som visas, vilka team som har tillgång och vilka projekt de tillhör. Produktfält är anpassade fält som kan vara statiska eller ifyllningsbara beroende på kategori.

Vid order- och avtalsskapande väljs produkter från kategorier. Produktinformation sparas som ögonblicksbilder -- om en produkt ändras efteråt påverkas inte befintliga ordrar. Produktsökaren (Shift+Shift) ger snabb åtkomst till produkter via textsökning.

## Fullständig guide

### Produktkategorier

Kategorier hanteras under **Inställningar > Produkter**.

**Skapa en kategori:**
1. Gå till Inställningar > Produkter
2. Klicka **Skapa kategori**
3. Ange namn och eventuellt projekt
4. Spara

**Kategoriinställningar:**
- **Namn** -- Kategorinamn
- **Synlighet** -- Vilka team som ser kategorin (null = alla)
- **Orderfältsynlighet** -- Vilka orderfält som visas vid val av denna kategori
  - **Inkludera** -- Visa enbart dessa fält
  - **Exkludera** -- Visa alla utom dessa fält
- **Projekt** -- Begränsa till specifika projekt
- **Express Flow-hostnamn** -- På vilka webbplatser kategorin syns
- **Produktfält** -- Anpassade fält för kategorins produkter

Kategorier kan ordnas med drag-and-drop. Att ta bort en kategori tar även bort alla dess produkter (mjuk borttagning).

### Produkter

**Skapa en produkt:**
1. Gå till en produktkategori
2. Klicka **Lägg till produkt**
3. Fyll i produktinformation

**Produktegenskaper:**

| Egenskap | Beskrivning |
|----------|-------------|
| **Namn** | Produktens visningsnamn |
| **Pris** | Standardpris |
| **Prislägsta/högsta** | Prisintervall för validering |
| **Prisalternativ** | Fördefinierade priser att välja mellan |
| **Moms** | Momssats i procent (0-100, vanligtvis 25%) |
| **Löneunderlag** | Alternativt värde för HR-beräkningar |
| **Inmatningstyp** | Vad användaren anger: Ingen, Antal eller Pris |
| **Bild** | Produktbild (ladda upp) |
| **Synlig i express-flöden** | Visa i snabbflöden |
| **Synlig i webbformulär** | Visa i avtalsformulär |
| **Kalendertid** | Möteslängd i minuter (för kalenderintegration) |

### Prissättning

**Standardpris:** Alla användare ser samma pris.

**Prisintervall:** Min- och maxgränser valideras vid orderinmatning.

**Prisalternativ:** Lista med valbara priser (visas som rullgardinsmeny).

**Teamspecifik prissättning:**
Produkter kan ha separata prislistor per team:
- Varje konfiguration har eget pris, intervall och alternativ
- Teammedlemmar ser automatiskt rätt prislista
- Administratörer ser standardprislistan
- Konfigureras i produktinställningarna under fliken "Konfigurationer"

**Momsberäkning:**
```
Pris exklusive moms = Pris × (100 - momsprocent) / 100
```

### Produktfält

Produktfält är anpassade fält som kan tilldelas produkter. Hanteras under **Inställningar > Produktfält**.

**Fältegenskaper:**
- **Etikett** -- Fältnamn
- **Kategorier** -- Vilka kategorier som använder fältet
- **Inmatningskategorier** -- I vilka kategorier fältet kan fyllas i
  - `null` = Statiskt fält (enbart läsning)
  - Tom lista = Ifyllningsbart i alla kategorier
  - Specifika ID:n = Ifyllningsbart enbart i de kategorierna
- **Fördefinierade värden** -- Valbara alternativ (kan vara projektspecifika)
- **Standardvärde** -- Fylls i automatiskt vid produktskapande

Att ta bort ett produktfält tar bort det från alla produkter permanent.

### Produktsökare

Tryck **Shift+Shift** för att öppna produktsökaren.

- Söker i produktnamn och fältvärden
- Flerordssökning (mellanrumsseparerad)
- Rankar resultat efter relevans
- Visar matchande fält markerade
- Stäng med Escape

### Produktval i ordrar och avtal

**ProductSelectList:**
- Visar produkter per kategori med kryssrutor
- Beroende på `inputType`:
  - **Antal** -- Inmatningsfält för antal
  - **Pris** -- Inmatningsfält eller rullgardinsmeny med prisalternativ
- Inaktiverade produkter kan inte väljas

**Ögonblicksbilder:**
När en produkt väljs i en order eller ett avtal sparas en kopia av produktdata (namn, pris, moms, fält). Ändringar av produkten efteråt påverkar inte befintliga ordrar.

### Rättigheter

| Rättighet | Beskrivning |
|-----------|-------------|
| **Admin** | Skapa/ta bort kategorier, produkter och fält |
| `ProductsUpdate` | Redigera befintliga produkter (kan ges till icke-admin) |
| `ProductsGetPrice` | Se produktpriser (annars visas löneunderlag) |

### Kopplingar

- **Ordrar** -- Produkter väljs vid orderskapande, pris och moms beräknas
- **Avtal** -- Produkter inkluderas i avtalsmallar
- **Orderfält** -- Kategorisynlighet styr vilka orderfält som visas
- **Projekt** -- Kategorier kan begränsas till projekt
- **Team** -- Kategorier och priser kan variera per team
