# Avtal

## Kort version

Avtal i SaleSys är digitala dokument som skickas till kunder för signering. Funktionen kräver att **Avtal** är aktiverat under Inställningar > Funktioner. Du skapar avtal utifrån mallar som definierar dokumentets layout, signeringsmetod och vilka fält som ska ingå.

Avtal skickas via e-post eller SMS och kan signeras digitalt med olika metoder: Rita signatur, Ett-klick, BankID eller SMS-svar. Hela livscykeln spåras automatiskt -- från Väntande till Skickat, Läst och Signerat. När ett avtal signeras kan en order skapas automatiskt.

Administratörer konfigurerar avtalsmallar under Inställningar > Avtal > Mallar, utskicksinställningar under Inställningar > Avtal > Utskick, och webbformulär under Inställningar > Avtal > Webbformulär.

## Fullständig guide

### Översikt

Ett avtal genomgår följande livscykel:

```
Väntande → Skickat → Läst → Signerat
                  ↘ Avvisat / Utgånget / Avbrutet
```

Statusen **Granskas** kan förekomma om avtalet kräver godkännande innan det skickas.

### Skapa ett avtal

1. Gå till **Avtal** i navigeringen
2. Välj en **avtalsmall** som grund
3. Fyll i mottagaruppgifter (namn, e-post och/eller telefon)
4. Välj produkter som ska ingå i avtalet
5. Fyll i eventuella avtalsfält
6. Förhandsgranska avtalet som PDF
7. Skicka via e-post eller SMS

### Avtalsmallar

Mallar skapas och hanteras under **Inställningar > Avtal > Mallar**.

**Mallkomponenter (inserts):**
- **Fält** -- Orderfält, produktfält, datum, namn och andra dynamiska värden
- **Signatur** -- Plats för kundens signatur i dokumentet
- **Text** -- Statisk text, villkor, instruktioner

**Signeringsmetoder:**
| Metod | Beskrivning |
|-------|-------------|
| **Ingen** | Ingen signering krävs |
| **Rita** | Kunden ritar sin signatur digitalt |
| **Ett-klick** | Kunden signerar med ett knapptryck |
| **BankID** | Signering med svenskt BankID |
| **SMS-svar** | Kunden svarar via SMS för att bekräfta |

**Mallinställningar:**
- Signeringsmetod
- Automatisk orderskapande vid signering
- Påminnelseregler för osignerade avtal
- Synlighet per användare, team och projekt
- Produktbegränsningar
- Standardmeddelanden

### Utskick

Avtal distribueras via e-post och/eller SMS. Inställningar finns under **Inställningar > Avtal > Utskick**.

- **Meddelandemallar** -- Anpassa texten i utskicksmeddelanden
- **Tvåvägs-SMS** -- Ta emot svar från kunder via SMS
- **Påminnelser** -- Automatiska påminnelser om avtalet inte signerats

### Webbformulär

Webbformulär låter kunder fylla i och skapa avtal direkt från er hemsida. Kräver att **Avtalsformulär** är aktiverat.

Konfigureras under **Inställningar > Avtal > Webbformulär**.

**Formulärelement:**
- Text och rubriker
- Fältlistor (kontakt- och orderfält)
- Produktlistor
- Kryssrutor och alternativlistor
- Datahämtning (t.ex. organisationsnummer)
- Anpassade element

Formuläret guidar kunden genom flera steg och skapar automatiskt ett avtal med ifylld information.

### PDF-generering

- **Förhandsgranskning** -- Osignerat dokument för granskning
- **Signerat avtal** -- Slutgiltigt dokument med signatur som bevis
- **Kvitto** -- Genereras automatiskt vid signering

### Avtalschat

Om aktiverat kan du kommunicera med avtalsmottagaren via en inbyggd chattfunktion direkt i avtalet.

### Avtalsdelar

Avtal kan ha flera delar för olika mottagare med separata produkturval. Varje del kan ha egna fält och produkter.

### Bilagor

Filer kan bifogas till avtal för att inkludera ytterligare dokumentation, villkor eller bilagor.

### Rättigheter och åtkomst

Avtalsfunktionen kräver att **Feature.Offer** är aktiverat. Dessutom:

- Administratörer kan se och hantera alla avtal
- Vanliga användare ser avtal baserat på teamtillhörighet
- Granskning av avtal kräver specifika rättigheter

### Kopplingar

- **Ordrar** -- En order skapas automatiskt (eller manuellt) när ett avtal signeras
- **Kontakter** -- Kontaktuppgifter fylls i automatiskt (namn, e-post, telefon)
- **Produkter** -- Avtal innehåller produktreferenser med priser
- **Mallar** -- Varje avtal baseras på en mall som styr layout och regler
