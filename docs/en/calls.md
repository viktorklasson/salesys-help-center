# Calls

## Short version

The Calls feature in SaleSys enables automatic calling of contacts through lead lists. The feature requires **Calls** to be enabled under Settings > Features. Users can call sequentially (one by one), predictively (system dials multiple contacts simultaneously), or directly to individual contacts.

Lead lists are collections of contacts to be called. They are configured with team access, exclude lists, and optional predictive dialing. Contacts in a lead list can be reserved (someone is calling right now), quarantined (call back later), or skipped.

During the call, users can tag the call with preconfigured call tags that control quarantine periods and linking to orders. Co-hearing allows administrators or team leaders to listen to ongoing calls, with the ability to whisper private messages. All call statistics are tracked and can be exported.

## Full guide

### Lead lists

Lead lists are collections of contacts to be called. They are managed under **Lead Lists** in the navigation.

**Creating a lead list:**
1. Go to **Lead Lists**
2. Click **Add**
3. Enter name and team access
4. Import contacts via CSV file or add manually

**Lead list settings:**
- **Name** -- Display name of the lead list
- **Team access** -- Which teams and roles have access
- **Exclude lists** -- Select which exclude lists to filter out contacts
- **Skip called-back contacts** -- Skip contacts already called back
- **Quarantine handling** -- Move quarantined contacts to end of list
- **Country** -- Controls phone number formatting

**Contact states in the lead list:**
| Status | Description |
|--------|-------------|
| **Available** | Contact can be called |
| **Reserved** | Someone is calling or preparing a call |
| **Quarantined** | Contact should be called again after a set time |
| **Skipped** | Contact has been skipped |

**Shuffle lead lists:**
Multiple lead lists can be combined into a shuffle list that distributes contacts from different sources.

### Making calls

**Call flow:**
1. Select a lead list
2. Choose a phone number to call from
3. The system connects the call
4. During the call: use call utilities, take notes, create orders
5. After the call: tag the call with call tags
6. The next contact is selected automatically

**Dialing modes:**
- **Sequential** -- One contact at a time
- **Predictive** -- System dials multiple contacts in advance to minimize wait time
- **Direct** -- Call an individual contact (not via lead list)

**Predictive dialing:**
- Configurable aggression level (0-150)
- Ringing timeout limit
- Automatic brake at high threshold
- Voicemail detection with confidence levels

### Phone numbers

Phone numbers are configured under **Settings > Calls > Phone Numbers**.

- **Outbound** -- Can make outgoing calls
- **Inbound** -- Can receive incoming calls
- **Status** -- Ready, Creating, Deleting, Renewing
- **Project restriction** -- Numbers can be limited to specific projects
- Recently used numbers appear at the top

### Call tags

Configured under **Settings > Calls > Tags**.

**Tag properties:**
- **Name and color** -- Visual identification
- **Default** -- Automatically applied
- **Selectable during evaluation** -- Can be chosen after a call
- **Linkable** -- Recordings can be linked to orders/offers
- **Quarantine period** -- Time before the contact can be called again (hours/days/minutes)
- **Callback by anyone** -- If true, anyone can call back; otherwise only the reserver
- **Position** -- Order in the interface

**Tag groups:**
Tags can be grouped for better organization in the evaluation view.

### Standard messages

Predefined messages for co-hearing sessions. Configured under **Settings > Calls > Messages**. Used to send quick messages during calls.

### Co-hearing

Co-hearing allows authorized users to listen to ongoing calls.

**Features:**
- **Listen** -- Hear the call without being heard
- **Whisper** -- Speak privately with the caller (customer cannot hear)
- **Send messages** -- Predefined or free-text messages
- **Take over** -- Take over the call

**Access:**
- `CallsCreateCohearingAll` -- Listen to all calls
- `CallsCreateCohearingOwnTeam` -- Listen to team calls
- `CallsWhisper` -- Whisper during co-hearing

### Call utilities and actions

Configured under **Settings > Calls > Utilities**.

**Built-in utilities:**
- Hang up
- Transfer
- DTMF tones

**Custom actions:**
- **SMS** -- Send SMS during/after call
- **Email** -- Send email
- **HTTP request** -- Call external services
- **Instructions** -- Display guidance text

Actions can be automatic or manual, with conditions and timing control.

### Call statistics

Available under **Calls > Statistics**.

**Metrics:**
- Connected vs. not connected calls
- Call duration
- Voicemail hits
- Calls per user, team, and lead list
- Call outcomes by tag
- Hourly distribution

### Export

Call data can be exported from the call list with current filters. Includes call details, duration, tags, and contact information.

### Disconnect reasons

| Reason | Description |
|--------|-------------|
| **Contact hung up** | Contact ended the call |
| **User hung up** | Seller ended normally |
| **Voicemail** | Call went to voicemail |
| **Call action** | An automatic action ended the call |
| **Timeout** | Connection lost (>15 seconds without heartbeat) |
| **Offer sent** | User sent an agreement during the call |

### Permissions

| Permission | Description |
|------------|-------------|
| `CallsCreate` | Make calls |
| `CallsGetAll` | View all calls |
| `CallsGetByOwnTeam` | View team calls |
| `CallsGetRecording` | Download recordings |
| `CallsUpdate` | Modify call data |
| `CallsDelete` | Delete calls |
| `CallsCreateCohearingAll` | Co-hear all calls |
| `CallsCreateCohearingOwnTeam` | Co-hear team calls |
| `CallsWhisper` | Whisper during co-hearing |
| `LeadListsGetAll` | View all lead lists |
| `LeadListsCreateForOwnTeam` | Create lead lists for own team |
| `LeadListsUpdateForOwnTeam` | Edit own team's lead lists |
| `LeadListsDelete` | Delete lead lists |

### Connections

- **Contacts** -- Calls are linked to contacts via phone numbers
- **Orders** -- Recordings can be linked to orders via linkable tags
- **Lead lists** -- Calls are tracked per lead list for campaign follow-up
- **Offers** -- Offers can be sent directly during a call
