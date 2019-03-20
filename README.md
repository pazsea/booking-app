# Project Grex - By Team Coffee :coffee:
![landing](/readme/signin.png "Our KYH Booking App")

## About

Project Grex (working title!) is a booking app intended to enable both students and teachers to plan their scheduling better by providing real-time oversight of free times and rooms plus enabling students to plan and arrange their own bookings/events.

Our current scope is to only support our local school, but there is the possibility to adapt the current structure to fit other schools and expand in the future.

Thank you for your interest!

## Key Functions

Our app is connected to firebase. Here you can sign up a new user, sign in existing user, change password, reset password. Standard stuff. 

When you sign up you can do so with different roles: ADMIN, TEACHER, STUDENT or no role. Depending on the different roles you will get different access. ADMIN and TEACHER is the only role that gets full access. 

Let's check out the different key functions.



### Book Room
![bookroom](/readme/bookroom.gif "Book Room function")
<br>
Here you can choose the date and timeslot for the room that you want to book. Also you can invite other users that have registered.

### Invitations
![invitations](/readme/invite.gif "Invitations function")
<br>
Every user that is invited to the event gets a notification in the app and can view it here. You can either accept or decline.

### Upcoming
![invitations](/readme/upcoming.gif "Upcoming Events function")
<br>
When you accepted a event. It shows up in the upcoming event page. This is the first page an user sees when he/she logs in. Therefore it's the perfect place to se your upcoming events.

### My Bookings
![invitations](/readme/myevents.gif "My Bookings function")
<br>
If you created an event, you can see it in the my bookings page. Here you have an overview on all the users that accepted, decline or have yet to answer. One hour before the event you can open a map to watch where the accepted users are located. 
If they are in school when the event starts they will automatically show up as "attendees" for that event. Neat, huh?


**Note: This project is no longer being actively developed!**
## Features
### Implemented Features
- **Create bookings** with custom descriptions and invite any users you like with the search function.
- **Track attending students** with map and ETAs generated based on their proximity to the school.
- **Automatically get updated** when the students are within school vicinity, *no more paperwork.*

### Planned Features
- **Intergrated help queue** allowing the teacher to effectively see who asked for help and in what order.
- **One-click exporting** of automatically registered student attendance for easier administration.
- **Invite by group** to save time when creating your events, like inviting a particular class.
## Getting Started
Project Grex uses React and Firebase. To install dependencies simply run `npm install`.
