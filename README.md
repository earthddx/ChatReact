## Back-end of the chat application

deployed at https://rens-chat-app.herokuapp.com/


### router.js
Pretty simple router that is typical for express applications. Created to see if the server is up on <code>localhost:4000</code>.

### users.js
Contains helper functions that manage users signing in and out, adding users to channel and removing them and keeping track of what channels they are at.
<code>addUser</code> receives 3 paramateres, where the first one <code>id</code> is a socket instance id.
