# Statistik & Dashboards

## Kort version

Statistikfunktionen i SaleSys ger dig anpassade dashboards för att följa försäljningsresultat i realtid. Funktionen kräver att **Statistik** är aktiverat under Inställningar > Funktioner. Dashboards nås via **Statistik** i navigeringen.

Varje dashboard innehåller ett eller flera block (readers) som visar specifika mätvärden som orderantal, ordersumma, provision, antal samtal eller skickade avtal. Block kan filtreras på datum, användare, team och taggar, och uppdateras automatiskt var sjätte sekund.

Topplistan rankar användare och team efter prestation och uppdateras var 30:e sekund. Aktivitetsloggen (kräver Feature.Events) visar systemhändelser och användaraktivitet.

## Fullständig guide

### Dashboards

#### Skapa en dashboard

1. Gå till **Statistik** i navigeringen
2. Klicka **Skapa vy**
3. Ange namn eller välj en färdig mall
4. Dashboard skapas -- lägg till block

**Mallar:**
Systemet erbjuder förbyggda mallar med ikoner och beskrivningar. Mallar är språkanpassade (svenska/engelska).

#### Dashboard-inställningar

- **Namn** -- Redigeras direkt i rubrikfältet (admin)
- **Synlighet** -- Vem som kan se dashboarden:
  - Enbart administratörer
  - Specifika team
  - Alla
- **Projekt** -- Begränsa till specifika projekt
- **Gruppering** -- Data kan grupperas efter:
  - Användare
  - Team
  - Produkt
  - Ringlista

#### Dashboard-funktioner

- **Helskärmsläge** -- Expandera till fullskärm
- **Automatisk uppdatering** -- Data hämtas var 6:e sekund
- **Länkdelning** -- Generera delbar länk för extern visning
- **Utskriftsvänlig** -- Optimerad för utskrift
- **Filter** -- Konfigurera synliga filter (datum, användare, team, taggar)

### Block (Readers)

Block är widgetar som visar specifika mätvärden.

**Skapa ett block:**
1. Öppna en dashboard
2. Klicka **Skapa block**
3. Konfigurera:
   - **Namn** -- Blocktitel
   - **Variabler** -- Vad som ska visas (ordrar, samtal, avtal)
   - **Filter** -- Villkor för data
   - **Gruppering** -- Hur data grupperas
   - **Diagramintervall** -- Tidsperiod

**Mätvärden:**
- Orderantal
- Ordersumma (totalt värde)
- Provision
- Antal samtal
- Antal skickade avtal

**Filter:**
- **Datumintervall** -- Anpassat eller förinställt
- **Datumstrategi** -- Ordinarie datum eller skapandedatum
- **Användare** -- Specifika säljare
- **Team** -- Specifika team
- **Taggar** -- Order- eller samtalstaggar
- **Ringlistor** -- Specifika ringlistor

Block kan läggas till, redigeras, tas bort och ordnas om inom en dashboard.

### Topplista

Topplistan rankar användare och team efter försäljningsprestation.

**Placering:** Visas i Statistik-vyn eller under Inställningar > Topplista (om Dashboard-funktionen inte är aktiverad).

**Inställningar:**
- **Sortera efter** -- Orderantal eller provision
- **Datumstrategi** -- Ordinarie datum eller skapandedatum
- **Teamval** -- Visa globalt eller per team
- **Anpassade filter** -- Datumintervall

**Uppdatering:** Automatisk uppdatering var 30:e sekund med nedräkningstimer.

**Visning:**
- Placeringsnummer
- Användarnamn
- Orderantal
- Provisionstotaler (om behörighet finns)

### Aktivitetslogg

Kräver att **Aktivitet** (Feature.Events) är aktiverat. Visar systemhändelser och användaraktivitet i organisationen.

### Rättigheter

| Rättighet | Beskrivning |
|-----------|-------------|
| `StatisticsGetGlobal` | Se global topplista/statistik |
| `StatisticsGetByOwnTeam` | Se eget teams topplista |
| `StatisticsGetByAllTeams` | Se alla teams topplista |
| `StatisticsGetCommissionByOwnTeam` | Se provision för eget team |
| `StatisticsGetCommissionAll` | Se provision för alla |

Administratörer har alltid full tillgång till all statistik.
