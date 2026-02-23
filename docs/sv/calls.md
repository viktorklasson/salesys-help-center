# Samtal

## Kort version

Samtalsfunktionen i SaleSys gör det möjligt att ringa kontakter automatiskt via ringlistor. Funktionen kräver att **Samtal** är aktiverat under Inställningar > Funktioner. Användare kan ringa sekventiellt (en och en), prediktivt (systemet ringer flera samtidigt) eller direkt till enskilda kontakter.

Ringlistor är samlingar av kontakter som ska ringas. De konfigureras med teamåtkomst, spärrlistor och eventuell prediktiv uppringning. Kontakter i en ringlista kan reserveras (någon ringer just nu), vara i karantän (ring tillbaka senare) eller hoppas över.

Under samtalet kan användaren tagga samtalet med förkonfigurerade samtalstaggar som styr karantänperiod och koppling till ordrar. Medlyssning låter administratörer eller teamledare lyssna på pågående samtal, med möjlighet att viska privata meddelanden. All samtalsstatistik spåras och kan exporteras.

## Fullständig guide

### Ringlistor

Ringlistor är samlingar av kontakter som ska ringas. De hanteras under **Ringlistor** i navigeringen.

**Skapa en ringlista:**
1. Gå till **Ringlistor**
2. Klicka **Lägg till**
3. Ange namn och teamåtkomst
4. Importera kontakter via CSV-fil eller lägg till manuellt

**Ringlisteinställningar:**
- **Namn** -- Ringlistans visningsnamn
- **Teamåtkomst** -- Vilka team och roller som har tillgång
- **Spärrlistor** -- Välj vilka spärrlistor som ska filtrera bort kontakter
- **Hoppa över återringda** -- Hoppa över kontakter som redan ringts tillbaka
- **Karantänhantering** -- Flytta kontakter i karantän till slutet av listan
- **Land** -- Styr telefonnummerformatering

**Kontaktstatus i ringlistan:**
| Status | Beskrivning |
|--------|-------------|
| **Tillgänglig** | Kontakten kan ringas |
| **Reserverad** | Någon ringer eller förbereder ett samtal |
| **Karantän** | Kontakten ska ringas igen efter en viss tid |
| **Hoppad** | Kontakten har hoppats över |

**Blandade ringlistor (Shuffle):**
Flera ringlistor kan kombineras till en blandad lista som fördelar kontakter från olika källor.

### Ringa samtal

**Samtalsflöde:**
1. Välj en ringlista
2. Välj telefonnummer att ringa från
3. Systemet kopplar upp samtalet
4. Under samtalet: använd samtalsverktyg, anteckna, skapa order
5. Efter samtalet: tagga samtalet med samtalstaggar
6. Nästa kontakt väljs automatiskt

**Uppringningslägen:**
- **Sekventiell** -- En kontakt i taget
- **Prediktiv** -- Systemet ringer flera kontakter i förväg för att minimera väntetid
- **Direkt** -- Ring en enskild kontakt (inte via ringlista)

**Prediktiv uppringning:**
- Konfigurerbar aggressivitet (0-150)
- Ringningsgräns för tid
- Automatisk broms vid hög tröskel
- Röstbrevlådedetektering med konfidensintervall

### Telefonnummer

Telefonnummer konfigureras under **Inställningar > Samtal > Telefonnummer**.

- **Utgående** -- Kan göra utgående samtal
- **Inkommande** -- Kan ta emot inkommande samtal
- **Status** -- Ready, Creating, Deleting, Renewing
- **Projektbegränsning** -- Nummer kan begränsas till specifika projekt
- Senast använda nummer visas överst

### Samtalstaggar

Konfigureras under **Inställningar > Samtal > Taggar**.

**Taggegenskaper:**
- **Namn och färg** -- Visuell identifiering
- **Standard** -- Läggs till automatiskt
- **Valbar under utvärdering** -- Kan väljas efter samtal
- **Kopplingsbar** -- Inspelningar kan kopplas till ordrar/avtal
- **Karantänperiod** -- Tid innan kontakten kan ringas igen (timmar/dagar/minuter)
- **Återringning av vem som helst** -- Om true kan alla ringa tillbaka, annars bara den som reserverade
- **Position** -- Ordning i gränssnittet

**Tagggrupper:**
Taggar kan grupperas för bättre organisation i utvärderingsvyn.

### Standardmeddelanden

Fördefinierade meddelanden för medlyssningssessioner. Konfigureras under **Inställningar > Samtal > Meddelanden**. Används för att skicka snabbmeddelanden under samtal.

### Medlyssning

Medlyssning låter auktoriserade användare lyssna på pågående samtal.

**Funktioner:**
- **Lyssna** -- Hör samtalet utan att höras
- **Viska** -- Tala privat med den som ringer (kunden hör inte)
- **Skicka meddelanden** -- Fördefinierade eller fria meddelanden
- **Ta över** -- Överta samtalet

**Åtkomst:**
- `CallsCreateCohearingAll` -- Lyssna på alla samtal
- `CallsCreateCohearingOwnTeam` -- Lyssna på teamets samtal
- `CallsWhisper` -- Viska under medlyssning

### Samtalsverktyg och åtgärder

Konfigureras under **Inställningar > Samtal > Verktyg**.

**Inbyggda verktyg:**
- Lägg på
- Vidarekoppla
- DTMF-toner

**Anpassade åtgärder:**
- **SMS** -- Skicka SMS under/efter samtal
- **E-post** -- Skicka e-post
- **HTTP-anrop** -- Anropa externa tjänster
- **Instruktioner** -- Visa vägledande text

Åtgärder kan vara automatiska eller manuella, med villkor och tidsstyrning.

### Samtalsstatistik

Tillgänglig under **Samtal > Statistik**.

**Mätvärden:**
- Anslutna vs icke-anslutna samtal
- Samtalstid
- Röstbrevlådeträffar
- Samtal per användare, team och ringlista
- Samtalsresultat per tagg
- Tidsfördelning per timme

### Export

Samtalsdata kan exporteras från samtalslistan med aktuella filter. Inkluderar samtalsdetaljer, varaktighet, taggar och kontaktinformation.

### Anledningar till avslut

| Anledning | Beskrivning |
|-----------|-------------|
| **Kontakten la på** | Kontakten avslutade samtalet |
| **Användaren la på** | Säljaren avslutade normalt |
| **Röstbrevlåda** | Samtalet gick till röstbrevlåda |
| **Samtalsåtgärd** | En automatisk åtgärd avslutade samtalet |
| **Timeout** | Anslutningen bröts (>15 sekunder utan heartbeat) |
| **Avtal skickat** | Användaren skickade ett avtal under samtalet |

### Rättigheter

| Rättighet | Beskrivning |
|-----------|-------------|
| `CallsCreate` | Ringa samtal |
| `CallsGetAll` | Se alla samtal |
| `CallsGetByOwnTeam` | Se teamets samtal |
| `CallsGetRecording` | Ladda ned inspelningar |
| `CallsUpdate` | Ändra samtalsdata |
| `CallsDelete` | Ta bort samtal |
| `CallsCreateCohearingAll` | Medlyssna på alla samtal |
| `CallsCreateCohearingOwnTeam` | Medlyssna på teamets samtal |
| `CallsWhisper` | Viska under medlyssning |
| `LeadListsGetAll` | Se alla ringlistor |
| `LeadListsCreateForOwnTeam` | Skapa ringlistor för eget team |
| `LeadListsUpdateForOwnTeam` | Redigera eget teams ringlistor |
| `LeadListsDelete` | Ta bort ringlistor |

### Kopplingar

- **Kontakter** -- Samtal kopplas till kontakter via telefonnummer
- **Ordrar** -- Inspelningar kan kopplas till ordrar via kopplingsbara taggar
- **Ringlistor** -- Samtal spåras per ringlista för kampanjuppföljning
- **Avtal** -- Avtal kan skickas direkt under ett samtal
