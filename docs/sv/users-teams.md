# Användare & Team

## Kort version

Användarhantering i SaleSys låter administratörer skapa och hantera användarkonton, organisera dem i team och tilldela roller med specifika rättigheter. Användare hanteras under Inställningar > Användare > Lista, team under Inställningar > Användare > Team och roller under Inställningar > Användare > Roller.

Varje användare tillhör ett eller flera team och kan ha individuella eller rollbaserade rättigheter. Rättigheter är uppdelade i kategorier: Ordrar, Statistik, Avtal, Produkter, Samtal, Kontakter, Kommentarer och Kalender. Administratörer har alltid full åtkomst.

Registreringslänkar (Inställningar > Användare > Länkar) låter nya användare registrera sig själva. Tvåstegsverifiering (MFA) kan aktiveras under Mitt konto med e-post eller SMS som verifieringsmetod.

## Fullständig guide

### Användare

Användare hanteras under **Inställningar > Användare > Lista**.

**Skapa en användare:**
1. Klicka **Lägg till**
2. Fyll i användarnamn och e-post
3. Tilldela till ett eller flera team
4. Välj roller
5. Ange eventuella individuella rättigheter
6. Skicka aktiveringslänk

**Användartyper:**
| Typ | Beskrivning |
|-----|-------------|
| **Vanlig** | Åtkomst baserad på roller och rättigheter |
| **Administratör** | Full tillgång till alla funktioner och inställningar |
| **Systemanvändare** | Automatiserade konton, normalt dolda |

**Användarstatus:**
- **Aktiv** -- Användaren kan logga in och arbeta
- **Inaktiv** -- Användaren är avaktiverad
- **Avstängd** -- Tillfälligt avstängd

**Användarlistan:**
- Sök på namn, användarnamn eller team
- Visa/dölj användarnamn
- Visa/dölj systemanvändare
- Klicka på en användare för detaljerad redigering

**Användarinställningar (modal):**
- Grundinformation (användarnamn, e-post, telefon)
- Team och roller
- Individuella rättigheter
- Åtkomstnycklar

### Team

Team hanteras under **Inställningar > Användare > Team**.

**Skapa ett team:**
1. Klicka **Lägg till**
2. Ange teamnamn
3. Välj färg (auto-förslag från palett)
4. Lägg till medlemmar
5. Ange teamrättigheter

**Teamegenskaper:**
- **Namn** -- Teamets visningsnamn
- **Färg** -- Visuell identifiering (automatiskt tilldelad)
- **Medlemmar** -- Användare i teamet
- **Låst** -- Hindrar vanliga användare från att administrera medlemmar
- **Rättigheter** -- Teamgemensamma roller/rättigheter

**Teammodal (två flikar):**
- **Användare** -- Lägg till och ta bort teammedlemmar
- **Rättigheter** -- Konfigurera teamets gemensamma rättigheter

Team kan ordnas om med drag-and-drop.

### Roller och rättigheter

Roller hanteras under **Inställningar > Användare > Roller**.

**Skapa en roll:**
1. Klicka **Skapa**
2. Namnge rollen
3. Välj vilka rättigheter som ingår
4. Spara

**Rättighetskategorier:**

| Kategori | Exempel på rättigheter |
|----------|----------------------|
| **Ordrar** | Skapa, se alla, se egna, redigera, ta bort |
| **Statistik** | Global, eget team, alla team, provision |
| **Avtal** | Se alla, se eget team, öppna skickade, granska |
| **Produkter** | Se priser, redigera produkter |
| **Samtal** | Ringa, se alla, medlyssna, viska, inspelningar |
| **Kontakter** | Se, skapa, redigera, ta bort, spärrlistor |
| **Kommentarer** | Se, skapa kommentarer |
| **Kalender** | Se, redigera kalendrar |

**Rättighetsimplikationer:**
Vissa rättigheter ger automatiskt relaterade rättigheter. Till exempel:
- "Se alla ordrar" inkluderar "Se eget teams ordrar"
- "Medlyssna alla" inkluderar "Medlyssna eget team" + "Se alla samtal"

**Tilldelning:**
Roller kan tilldelas på:
- **Teamnivå** -- Alla teammedlemmar får rollen
- **Användarnivå** -- Enskild användare får rollen

Administratörer kringgår alla rättighetskontroller.

### Registreringslänkar

Hanteras under **Inställningar > Användare > Länkar** (kräver Feature.RegistrationLink).

**Skapa en registreringslänk:**
1. Klicka **Skapa**
2. Namnge länken
3. Välj standardteam för nya användare
4. Konfigurera notifieringar
5. Valfritt: ange utgångsdatum

**Länkhantering:**
- Lista alla aktiva registreringslänkar
- Redigera befintliga länkar
- Ta bort länkar
- Skicka länk via e-post eller SMS

### Kontoinställningar

Under **Inställningar > Mitt konto** kan alla användare hantera sitt konto.

**Personliga inställningar:**
- **Användarnamn** -- Visas (skrivskyddat)
- **E-post** -- Används för notifieringar
- **Språk** -- Svenska eller English (US) -- kräver sidladdning
- **Tvåstegsverifiering** -- Aktivera/inaktivera MFA

**Organisationsinställningar (enbart administratörer):**
- Kontakt-e-post
- Telefonnummer
- Webbplats

### Tvåstegsverifiering (MFA)

1. Gå till **Inställningar > Mitt konto**
2. Aktivera **Tvåstegsverifiering**
3. Konfigurera mottagare:
   - **E-post** -- Verifieringskod skickas till din e-post (standard)
   - **SMS** -- Valfritt, ange telefonnummer
4. Vid inloggning väljer du leveransmetod om båda finns

**Krav:**
- Minst en mottagare (e-post eller telefon) måste vara konfigurerad
- Telefonnummerformat valideras
- Kan lägga till eller ta bort SMS-mottagare

### Rättigheter för användarhantering

| Rättighet | Beskrivning |
|-----------|-------------|
| `UsersCreateForOwnTeam` | Skapa användare i eget team |
| `UsersUpdateForOwnTeam` | Redigera användare i eget team |
| `UsersDeleteForOwnTeam` | Ta bort användare i eget team |
| `UsersLogOutForOwnTeam` | Tvinga utloggning av teammedlemmar |
| `UsersCreateUserMessage` | Skapa användarmeddelanden |
