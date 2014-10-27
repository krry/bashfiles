# flannel methodology

## System Design Wizard Flow

### Philosophy

#### Primary user objectives: 
    * maximize production
    * minimize rate

#### Methodology: 
    * minimize possible errors
            by removing interaction complexity
    * minimize confusion
            one tool at a time
    * easily testable
            reconfigurable flow
            easily adjustable steps
            contrastable user instructions and calls-to-action

### Legend
    * STATUS - status and progress
    * MAP - edliter
    * INSTR - contextual written or animated steps
    * FEEDBACK - results of inputs, displays calculations 
    * INTERACTION - edliter interactions
    * CALC - calculated info, returned to user

### Steps
    1. Neighborhood
            INPUT - zipcode
            FEEDBACK
                    MAP - with NearMe markers
            STATUS - Hood found (1 of n)
    2. Roof
            INPUT - street address
            FEEDBACK
                    MAP - maxzoomed in roof view with marker on address
                    INTERACTION - mousezoom, dragpan
            STATUS - Roof found (2 of n)
    3. Draw
            CTA - outline the roof section/segment that gets the most sun
            INSTR - shows how-to-draw-roof-polygon GIF
            FEEDBACK
                    MAP - show poly as drawn and styled as active overlay, show clearlines control
                    INTERACTION - panlock, zoomlock, drawmount, button zoom, button pan, clear draw
            STATUS - first draw attempt complete (3 of n)
    4. Reshape
            INSTR - how-to-reshape-polygon GIF
            FEEDBACK
                    MAP - previously drawn panel highlighted
            INTERACTION - remove draw, add modify
            STATUS - outline accurate (4 of n)
    5. Roofpeak
            INSTR - find highest side of polygon
            INPUT - approve or select the highest side
            FEEDBACK
                    MAP - highlight best guess for highest side
                    CALC - system production estimate, electricity rate price
            STATUS - peak identified (5 of n)
    6. Slope
            INSTR - how slopey is your roof? 
            INPUT - user selected slope by animated roofslope icon
            FEEDBACK
                    CALC - autofill mp from api (use default orientation, substrate, shading)
                    MAP  - populate panels in plane
            INTERACTION - no map interaction, or plane only
                    
            STATUS - bare minimum design threshold met


    | increase accuracy?  | no thanks             |
    | label obstruction   | credit check          |
    | describe shading    | get help              |
    | add more panels     | ??????                |
    |                     |                       |
    |                     |                       |
    |                     |                       |