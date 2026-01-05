`Project Overview`

Novasync is a web application where user can create groups add expenses and get data of all transactions, and minimum transactions to be done.



`Problem Stattement`

Build a web application where an individual user can create expense groups, invite or add members, log expenses with metadata (payer,
participants, description, tags), choose splitting rules (equal, exact amounts, or percent), view a group ledger, and obtain a minimal-set
settlement plan that tells who should pay whom. The product should include a simple group chat or comment mechanism for contextual discussion.

`Setup And Installation`

1. cd server then npm run dev
2. cd client then npx nodemon server.js


`Usage Guide`

Create an account in Novasync.

Create a group with your friends.

Add an expense in the group (With split type, paid by and contributors).

Get transaction data and minimal settlement.

Use chat feature to talk to friends.




`Feature Description`
The below are important features of Novasync -

Dashboard : A general overview of all transactions of user with amount user owes, total amount user is supposed to recieve and tota balance.

Groups Creation : A user can create a group with group name and description, where members can be selected.

Groups page : A page displaying all groups where current user is member.

Viewing a group : This page shows group information (group name, description, members, created by etc..), with list of all expenses

Adding an expense : User can add expense in a group with options like split type (equal, value based, percenage).

Transaction data : In each group user can see data of all transactions made, contribution of user in each expense.

Minimal Settlements : A who owes whom? section which displays mimimum transactions to settle all expenses.

Filter option : User can do simple filtering on basis of data (Today, This Week, This Month, This Year, Other) and on the basis of user.

Expenses page : A page displaying all expenses made by current user

Chat option : A chat page where members of a group can have discussion.

`Simple Explanation Of Minimal Settlements Algorithm - `

The algorithm seperates the object of users and their respective amounts to two (one with positive amounts, ie the ones which are to be recieved and the other into negative amounts ie the ones which are to be paid)
Then recursively subtracting the largest positive value and least negative value of each of the two arrays by simultaneously changing them to 0 in the actual object till the whole object has amounts as 0.


`Tech Stack Details`

Frontend : React js

Backend : Express, Node js

Database : Mongodb


`Credits And Attributions`

Youtube videos reffered : 

1. https://www.youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW (Backend tutorials of chai aur code).

2. https://www.youtube.com/playlist?list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH (Backend tutorials of sheriyans coding school).

3. https://www.youtube.com/watch?v=I3TdUxDwhOg (Tutorial for pagination, where i learnt about .skip() operator).



Use of AI tools -

1. Use of ai tools for learning, especially in areas like : 

    -React router (usage and applications of useParams(), useNaigate(), nested routes, outlet component etc..)
    
    -Aggregation Pipelines.
    
    -Access tokens, refresh tokens and json web tokens.

    -Methods like .populate() which confused me a lot.

    
3. Use of ai tools for debugging.

4. Used ai tools when i got stuck while working on minimal settlements part (When i was unsure how to record transaction data in textual format I referred ai).

5. Used ai to generate a cover image for my register and login page


Frontend Libraries Used - 

1. https://lucide.dev/ Lucide React for icons

2. https://react-hot-toast.com/ React hot toast for toasts.

Help From Mentors - 

Recieved great guidance from my mentors Rahul joshi sir and Samriddhi Singh Mam.


 


