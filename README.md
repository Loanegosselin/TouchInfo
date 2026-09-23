# TouchInfo

> A tactile and audio widget that makes everyday and school information faster and easier to access for blind and visually impaired users.

TouchInfo is a browser-based accessibility project powered by the DotPad tactile display. It transforms selected digital information into simple tactile pictograms, with optional audio feedback when the user needs more detail.

The goal is to offer the tactile equivalent of a smartphone widget: essential information available at a glance becomes available **at the fingertips**.

## Project overview

Smartphones provide quick visual summaries for notifications, calendars, weather forecasts and news. These interfaces are not directly accessible to blind users, and existing alternatives may require several navigation steps, continuous audio playback or knowledge of Braille.

TouchInfo provides a complementary physical interface that can be placed on a desk at school, at work or at home. The system simplifies information before displaying it on the DotPad:

```text
Web application  ->  Bluetooth Low Energy  ->  DotPad  ->  Tactile pictograms
                                                      |
                                                       ->  Optional audio feedback
```

The interface is designed around four principles:

- **Simple:** only the most useful information is displayed.
- **Fast:** categories and items can be accessed in one touch.
- **Multimodal:** the user can choose tactile feedback, audio feedback or both.
- **Customizable:** the displayed categories can be selected according to the user's needs.

## Target users

TouchInfo is designed for:

- blind and visually impaired users who want faster access to everyday information;
- people who do not read Braille fluently and can benefit from simple tactile pictograms;
- users who want discreet tactile access in public, professional or educational environments;
- blind and visually impaired students who need quick access to school notifications, timetable changes, room updates, assignment reminders and campus announcements.

## Main features

### Notifications

The DotPad can display one or two alerts at a time using recognizable pictograms, for example:

- a message;
- a missed call;
- an email;
- a system warning;
- a school or campus announcement.

Optional audio feedback can provide the sender, application and essential content.

### Calendar

Calendar events are reduced to a time and a simple tactile pictogram, such as:

- a meeting;
- a class;
- an appointment;
- a sports activity;
- a meal.

Audio feedback can announce the number of events, the next event or a short daily summary.

### Weather

The weather interface displays only the essential forecast:

- a tactile weather symbol, such as sun, cloud or rain;
- the temperature.

Example audio feedback:

> "Today, sunny, 24 degrees."

### News

Long articles are condensed into a limited number of topic pictograms. The user can browse articles with the physical controls and request a short spoken headline or summary when needed.

### School notifications

TouchInfo can simplify authorized alerts from a school platform or calendar. Possible use cases include:

- classroom changes;
- cancelled or delayed lectures;
- timetable updates;
- assignment deadlines;
- examination reminders;
- important campus announcements.

A room-change notification could be represented by a classroom pictogram, an arrow and a short room identifier.

Example audio feedback:

> "Your 2 PM lecture has moved to room B204."

## Example use cases

### On campus

A student receives a timetable update. The DotPad displays a classroom pictogram, an arrow and the new room number. The student can immediately understand that a location has changed, then request the complete announcement through audio.

### At work

The device displays a message and a missed-call pictogram. The user browses the alerts through the physical controls and activates audio only for the notification that requires more detail.

### At home

Before leaving, the user selects the weather category. The DotPad displays a sun and `24°`. Later, the user browses a summarized news item and activates audio to hear the headline.

## Technical approach

TouchInfo is designed as a web application rather than a native Android or iOS application.

### Proposed stack

- **Frontend:** JavaScript or TypeScript
- **Application format:** browser-based web application or Progressive Web App
- **Device communication:** Bluetooth Low Energy, using Web Bluetooth where supported
- **Tactile rendering:** DotPad SDK, development kit and simulator
- **Audio feedback:** Web Speech API or another browser-compatible text-to-speech solution
- **Optional controller:** ESP32 with C or C++ if an additional hardware relay is required
- **Charging or wired communication:** USB-C, depending on the development kit capabilities

### Data sources

The proof of concept may connect to:

- a calendar API;
- a weather API;
- a news API;
- authorized school-platform data;
- notification sources supported by the selected web environment;
- local storage for settings and future notes support.

## Information processing

Each feature follows the same workflow:

1. **Collect** selected information from an authorized source.
2. **Prioritize** the most important element.
3. **Simplify** the information into a pictogram, number or short pattern.
4. **Transmit** the result to the DotPad through BLE.
5. **Render** the tactile output.
6. **Expand** the information through audio only when requested.

This approach prevents information overload and keeps the tactile interface quick to explore.

## Planned project structure

```text
TouchInfo/
├── public/                 # Static assets
├── src/
│   ├── api/                # Calendar, weather, news and school connectors
│   ├── bluetooth/          # BLE and Web Bluetooth communication
│   ├── components/         # Web interface components
│   ├── converters/         # Data-to-pictogram conversion rules
│   ├── dotpad/             # DotPad SDK integration
│   ├── speech/             # Audio and text-to-speech functions
│   ├── assets/             # Pictograms and interface assets
│   └── app/                # Main application logic
├── tests/                  # Unit and integration tests
├── docs/                   # Research, mock-ups and project documentation
├── .env.example            # Example environment variables
├── package.json
└── README.md
```

The repository structure may evolve during the proof-of-concept phase.


## Accessibility guidelines

Every interface decision should follow these rules:

- display no more information than the user can understand quickly through touch;
- use large, distinct and consistently positioned pictograms;
- avoid relying exclusively on Braille;
- provide audio as an option, not as a mandatory interaction;
- confirm actions through a short tactile or audio response;
- allow users to repeat, skip or stop spoken information;
- avoid transmitting school, calendar or notification data without explicit authorization;
- test pictograms with blind and visually impaired users instead of assuming that a visual icon will remain understandable through touch.

## Testing strategy

### Unit tests

- API and data retrieval
- data prioritization and simplification
- pictogram conversion
- BLE message formatting
- tactile rendering commands
- speech output

### End-to-end tests

Validate the complete flow from receiving information in the web application to displaying it on the DotPad and playing the optional audio summary.

### User testing

Sessions with blind and visually impaired participants should evaluate:

- pictogram recognition;
- time required to understand an item;
- error rate;
- tactile comfort;
- usefulness of audio feedback;
- navigation between categories;
- understanding of school-specific notifications.

## Roadmap

- [x] Define the project concept and target users
- [x] Create interface mock-ups for weather, calendar, news and notifications
- [x] Add a school-notification use case
- [x] Complete the state of the art
- [ ] Confirm access to the DotPad SDK and simulator
- [ ] Select the web framework and initialize the application
- [ ] Implement the tactile pictogram data model
- [ ] Connect the first external API
- [ ] Test Web Bluetooth communication
- [ ] Implement optional text-to-speech feedback
- [ ] Build the first end-to-end proof of concept
- [ ] Conduct tests with blind and visually impaired users
- [ ] Improve the interface based on user feedback

## Project status

TouchInfo is currently in the **design and feasibility phase**. The mock-ups describe the intended user experience, but the technical implementation and external integrations still need to be validated with the DotPad development environment.

## Team

- [Lyanh Renkin](https://github.com/renlahh)
- [Evangéline Vuchot](https://github.com/EvangelineVuchot)
- [Loane Gosselin](https://github.com/Loanegosselin)
