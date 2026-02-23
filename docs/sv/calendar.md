# Kalender

## Kort version

Kalendern i SaleSys visar en veckovy med händelser för dig och dina kollegor. Funktionen kräver att **Kalender** är aktiverat under Inställningar > Funktioner. Du kan skapa händelser genom att klicka på en tidslucka, och varje händelse kan ha titel, tid, färg, upprepning, påminnelse och koppling till kontakter eller ordrar.

Kalendern stöder synkronisering med externa kalendrar som Google Calendar och Outlook via Cronofy. Påminnelser kan ställas in relativt (t.ex. 15 minuter innan) eller absolut (specifikt datum och tid) och visas som webbläsar- och app-notiser.

Du kan se andra användares kalendrar via en rullgardinsmeny. Administratörer kan se alla kalendrar, medan vanliga användare ser baserat på team- och rollbehörighet. Privata händelser visas som "Upptagen" för andra.

## Fullständig guide

### Veckoöversikt

Kalendern visar en hel vecka i taget enligt ISO-veckostandard.

**Layout:**
- 7 dagar (helger kan döljas via inställning)
- Tidslinjer från 00:00 till 24:00 på vänster sida
- Veckonummer och navigeringsknappar i toppen

**Navigering:**
- Föregående/nästa vecka med pilknappar
- Knapp för att hoppa till aktuell vecka
- Veckonummervisning
- URL-format: `/calendar/:userId/:year/:isoWeek`

### Skapa händelser

1. Klicka på en tidslucka i kalendern
2. En modal öppnas med standardlängd 15 minuter
3. Fyll i:
   - **Titel** (max 120 tecken)
   - **Från/Till-tid** (samma dag)
   - **Färg** (valfritt)
   - **Upprepning** (veckovis eller varannan vecka)
   - **Påminnelse** (relativ eller absolut tid)
   - **Kontaktkoppling** (valfritt)
   - **Projektkoppling** (valfritt)
   - **Orderkopplingar** (valfritt)
   - **Bilagor** (valfritt)
   - **Anteckning/Beskrivning**
   - **Privat** (dölj detaljer för andra)
   - **Återringning** (markera som callback)
4. Spara händelsen

### Redigera och ta bort

- **Redigera** -- Klicka på en händelse för att öppna modalen och ändra
- **Ta bort enskild** -- Ta bort bara denna händelse
- **Ta bort denna och framtida** -- Ta bort alla framtida upprepningar

### Upprepande händelser

- **Veckovis** -- Samma tid varje vecka
- **Varannan vecka** -- Samma tid varannan vecka
- Enskilda datum kan exkluderas från upprepningen
- Redigering av en upprepning påverkar bara den instansen

### Kalendersynkronisering

SaleSys stöder synkronisering med externa kalendrar via Cronofy.

**Stöd för:**
- Google Calendar
- Microsoft Outlook
- Andra kalendertjänster via OAuth 2.0

**Inställningar:**
- Läs-synk (importera händelser)
- Skriv-synk (exportera händelser)
- Manuell synkutlösare
- Konfigureras per kalender

### Påminnelser

**Relativa påminnelser:**
- Ange antal minuter, timmar eller dagar innan händelsen
- Exempel: "30 minuter innan"

**Absoluta påminnelser:**
- Ange ett specifikt datum och tid
- Användbart för händelser som kräver förberedelse

**Notifieringar:**
- Webbläsarnotiser (push)
- In-app-notiser
- Systemet kontrollerar påminnelser var 10:e sekund

### Visa andras kalendrar

En rullgardinsmeny låter dig välja vilken användares kalender du vill se.

**Åtkomstnivåer:**
- **Administratörer** -- Kan se alla användares kalendrar
- **FullEdit** -- Kan se och redigera händelser
- **ReadOnly** -- Kan enbart se händelser
- **Ingen åtkomst** -- Kan inte se kalendern

Åtkomst styrs av team- och rollinställningar (TeamCalendarAccess).

**Privata händelser:**
Händelser markerade som privata visas som "Upptagen" för andra användare -- utan titel eller detaljer.

### Projekt och kalenderorderkonfiguration

Projekt kan kräva att en kalenderhändelse skapas för varje order. Detta konfigureras i projektinställningarna med:
- Automatisk händelsetitel (mall)
- Automatisk händelsebeskrivning (mall)
- Obligatorisk kalenderhändelse vid orderskapande

### Helginställning

Visa eller dölj lördag och söndag. Inställningen sparas lokalt i webbläsaren.
