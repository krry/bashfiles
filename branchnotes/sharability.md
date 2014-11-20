# sharable designs #

this branch will enable a user to:
 - create a design, and share it's link
 - open an existing design

this branch will not:
 - save areas for review later (that's a later branch)
 - return users to previous state (that's a diff branch)

## we need a sharable url

location.com/#/{design_id}


### steps

create a new state -- 
1) for sharing:
    + get base URL
    + get design_ref
    + return something like 
        +  ```www.solarcity.com/#/share_design/{design_ref_id}```
        +  ```www.solarcity.com/#/save_design/{design_ref_id}```

2) for opening a design:
    + detect design_id variable in link
    + [eventually] verify identity
    + direct to the correct Firebase object for that ID
