# Inställningar

## Kort version

Inställningar i SaleSys nås via kugghjulsikonen i navigeringen. Administratörer ser alla inställningskategorier medan vanliga användare enbart ser Mitt konto och eventuella begränsade sektioner. Inställningarna är organiserade i sektioner: Användare, Order, Avtal, Kontakter, Samtal, Automation, Produkter, Funktioner, Projekt och Mitt konto.

Under Funktioner kan administratörer aktivera och inaktivera moduler som Kontakter, Samtal, Avtal, Kalender, Statistik och mer. Alla funktioner är kostnadsfria att aktivera och ändringen börjar gälla omedelbart.

Automation-sektionen innehåller informationskoppling som låter dig koppla kontaktfält till orderfält för automatisk ifyllning. Projekt grupperar inställningar och dokument för olika affärsområden.

## Fullständig guide

### Navigeringsstruktur

Inställningarna är organiserade i följande sektioner:

```
Inställningar
├── Användare
│   ├── Lista
│   ├── Team
│   ├── Roller
│   └── Registreringslänkar*
├── Order
│   ├── Taggar
│   ├── Information (fält)
│   └── Verktyg
├── Avtal*
│   ├── Mallar
│   ├── Utskick
│   └── Webbformulär*
├── Kontakter*
│   ├── Taggar
│   ├── Information (fält)
│   └── Spärrlistor
├── Samtal*
│   ├── Allmänt
│   ├── Taggar
│   ├── Telefonnummer
│   ├── Meddelanden
│   ├── Verktyg
│   └── Export
├── Automation*
│   └── Informationskoppling
├── Produkter
│   ├── Alla kategorier
│   ├── [Enskilda kategorier]
│   └── Alla produktfält
├── Topplista**
├── Funktioner
├── Projekt*
└── Mitt konto

* = Kräver att funktionen är aktiverad
** = Visas bara om Dashboard-funktionen INTE är aktiverad
```

### Funktioner

Under **Inställningar > Funktioner** kan administratörer aktivera och inaktivera moduler.

| Funktion | Internt namn | Beskrivning |
|----------|-------------|-------------|
| **Kontakter** | `contact` | Samla eller ring kontakter |
| **Samtal** | `dial` | Ring samtal automatiskt |
| **Avtal** | `offer` | Skicka avtal via e-post och SMS |
| **Aktivitet** | `events` | Se företagets aktivitet |
| **Kalender** | `calendar` | Se och skapa användares kalender |
| **Projekt** | `project` | Gruppera inställningar och dokument |
| **Registreringslänkar** | `reglink` | Användare kan registrera sig själva via länk |
| **Statistik** | `dashboard` | Anpassade statistikvyer |
| **Avtalsformulär** | `offerwebform` | Skapa avtal från webbformulär |

**Så här aktiverar du en funktion:**
1. Gå till Inställningar > Funktioner
2. Klicka på funktionskortet
3. Funktionen aktiveras/inaktiveras omedelbart

**Beroenden:**
- **Samtal** kräver att **Kontakter** är aktiverat
- **Avtalsformulär** kräver att **Avtal** är aktiverat

Alla funktioner är kostnadsfria.

### Automation -- Informationskoppling

Under **Inställningar > Automation > Informationskoppling** kopplas kontaktfält till orderfält.

**Hur det fungerar:**
- När en order skapas från en kontakt fylls orderfält automatiskt i med kontaktdata
- Stöder 1:1-koppling (ett fält till ett fält) och 1:M-koppling (ett fält till flera)
- Vid 1:M-koppling delas värdet med mellanslag

**Exempel:**
Kontaktfältet "Fullständigt namn" med värdet "Anna Svensson" kan kopplas till:
- Orderfältet "Förnamn" → "Anna"
- Orderfältet "Efternamn" → "Svensson"

**Hantering:**
- Sök bland befintliga kopplingar
- Skapa nya kopplingar
- Redigera eller ta bort kopplingar
- Nya kopplingsbara fält markeras med notis

### Projekt

Under **Inställningar > Projekt** (kräver Feature.Project och administratör).

Projekt grupperar inställningar och dokument för olika affärsområden eller kampanjer.

**Projektanvändning:**
- Produktkategorier kan begränsas till projekt
- Taggar (order, kontakt, samtal) kan vara projektspecifika
- Dashboards kan begränsas till projekt
- Användare kan tilldelas projekt
- Kontaktfält och produktfält kan vara projektspecifika

**Skapa ett projekt:**
1. Gå till Inställningar > Projekt
2. Klicka **Skapa**
3. Ange namn och beskrivning
4. Tilldela användare
5. Konfigurera synlighet

### Mitt konto

Under **Inställningar > Mitt konto** hanterar du personliga inställningar.

**Personligt:**
- **Användarnamn** -- Skrivskyddat
- **E-post** -- För notifieringar
- **Språk** -- Svenska eller English (US). Kräver sidladdning efter byte
- **Tvåstegsverifiering (MFA)** -- Se separat sektion nedan

**Organisation (enbart administratörer):**
- Kontakt-e-post
- Telefonnummer
- Webbplats

### Tvåstegsverifiering (MFA)

1. Gå till Mitt konto
2. Aktivera Tvåstegsverifiering
3. Konfigurera mottagare:
   - **E-post** -- Standard, verifieringskod till din e-post
   - **SMS** -- Valfritt, ange telefonnummer
4. Minst en mottagare krävs
5. Vid inloggning väljer du leveransmetod

### Inställningar per sektion

#### Order
- **Taggar** -- Skapa och hantera ordertaggar med färger, låsning och negeringsfunktion
- **Information** -- Konfigurera orderfält med typer, validering och synlighet
- **Verktyg** -- Konfigurera automatiska arbetsflöden (SMS, e-post, HTTP) efter orderskapande

#### Avtal
- **Mallar** -- Skapa avtalsmallar med layout, signeringsmetod och inserts
- **Utskick** -- Konfigurera meddelandemallar och påminnelseregler
- **Webbformulär** -- Bygg flerstegsformulär för webbplatser

#### Kontakter
- **Taggar** -- Skapa kontakttaggar med färger och låsning
- **Information** -- Konfigurera kontaktfält med typer och kopplingar
- **Spärrlistor** -- Hantera listor med nummer/termer som inte ska kontaktas

#### Samtal
- **Allmänt** -- Generella samtalsinställningar
- **Taggar** -- Samtalstaggar med karantänperiod och gruppering
- **Telefonnummer** -- Hantera telefonnummer för utgående/inkommande samtal
- **Meddelanden** -- Standardmeddelanden för medlyssning
- **Verktyg** -- Samtalsåtgärder och arbetsflöden
- **Export** -- Exportera samtalsdata

#### Produkter
- **Kategorier** -- Skapa och ordna produktkategorier
- **Produktfält** -- Konfigurera anpassade produktfält
