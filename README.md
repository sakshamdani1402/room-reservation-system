# Room Reservation System
Each File in the **lambda** folder is individually deployed to an **AWS lambda**. Which is Invoked by **AWS API GATEWAY**. The Lambda Handlers Interact with **AWS RDS (MYSQL)** to fetch Data.

Steps to run And Build.
1. run npm i in `backend` folder to resolve dependencies.
2. navigate to backend folder.
3. call each `handler()` in their respective files to invoke the functions. Pass Arguments as mentioned in 
   https://docs.google.com/document/d/1HSQ3Fe77hnthw8hizqvXJU-qGEPHavMkctvCCadkVbY/edit?tab=t.0 to get desired responses.
4. Optinally can open index.html in the frontend folder to insertact directly with the hosted lambdas on the cloud.
   
Live Link => https://hotel-room-booking-unstop-asignment.netlify.app/
