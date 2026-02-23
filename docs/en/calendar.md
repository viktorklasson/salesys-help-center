# Calendar

## Short version

The Calendar in SaleSys displays a week view with events for you and your colleagues. The feature requires **Calendar** to be enabled under Settings > Features. You can create events by clicking on a time slot, and each event can have a title, time, color, repetition, reminder, and links to contacts or orders.

The calendar supports synchronization with external calendars like Google Calendar and Outlook via Cronofy. Reminders can be set relatively (e.g., 15 minutes before) or absolutely (specific date and time) and appear as browser and in-app notifications.

You can view other users' calendars via a dropdown menu. Administrators can view all calendars, while regular users see based on team and role permissions. Private events are displayed as "Busy" to others.

## Full guide

### Week overview

The calendar displays a full week at a time using the ISO week standard.

**Layout:**
- 7 days (weekends can be hidden via settings)
- Time ruler from 00:00 to 24:00 on the left
- Week number and navigation buttons at the top

**Navigation:**
- Previous/next week with arrow buttons
- Button to jump to current week
- Week number display
- URL format: `/calendar/:userId/:year/:isoWeek`

### Creating events

1. Click on a time slot in the calendar
2. A modal opens with a default duration of 15 minutes
3. Fill in:
   - **Title** (max 120 characters)
   - **From/To time** (same day)
   - **Color** (optional)
   - **Repetition** (weekly or biweekly)
   - **Reminder** (relative or absolute time)
   - **Contact link** (optional)
   - **Project link** (optional)
   - **Order links** (optional)
   - **Attachments** (optional)
   - **Note/Description**
   - **Private** (hide details from others)
   - **Callback** (mark as callback)
4. Save the event

### Editing and deleting

- **Edit** -- Click an event to open the modal and make changes
- **Delete single** -- Delete only this event
- **Delete this and future** -- Delete all future repetitions

### Repeating events

- **Weekly** -- Same time every week
- **Biweekly** -- Same time every other week
- Individual dates can be excluded from the repetition
- Editing a repetition only affects that instance

### Calendar synchronization

SaleSys supports synchronization with external calendars via Cronofy.

**Supported:**
- Google Calendar
- Microsoft Outlook
- Other calendar services via OAuth 2.0

**Settings:**
- Read sync (import events)
- Write sync (export events)
- Manual sync trigger
- Configured per calendar

### Reminders

**Relative reminders:**
- Specify number of minutes, hours, or days before the event
- Example: "30 minutes before"

**Absolute reminders:**
- Specify a specific date and time
- Useful for events requiring preparation

**Notifications:**
- Browser notifications (push)
- In-app notifications
- System checks for reminders every 10 seconds

### Viewing others' calendars

A dropdown menu lets you select which user's calendar to view.

**Access levels:**
- **Administrators** -- Can view all users' calendars
- **FullEdit** -- Can view and edit events
- **ReadOnly** -- Can only view events
- **No access** -- Cannot view the calendar

Access is controlled by team and role settings (TeamCalendarAccess).

**Private events:**
Events marked as private are displayed as "Busy" to other users -- without title or details.

### Projects and calendar order configuration

Projects can require a calendar event to be created for each order. This is configured in project settings with:
- Automatic event title (template)
- Automatic event description (template)
- Mandatory calendar event when creating orders

### Weekend setting

Show or hide Saturday and Sunday. The setting is stored locally in the browser.
