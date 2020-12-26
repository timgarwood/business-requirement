#Technical Approach

My approach to solving the business requirement of a sign up page was to create 2 REST endpoints - one to sign up spies and another to retrieve them.

For the database, I chose sqlite because I wanted to keep the application simple.  I wasn't too concerned about scalability due to time constraints, and didn't want to have to worry about setting up an external database like MySQL or Postgres, having to configure connection strings, etc.

#Creating Spies
The first REST endpoint is a POST method called ```/api/signup```.  The purpose of this endpoint is to sign up a new spy.  The endpoint needs to accept name, email address, age and a photo of the spy.  Since a photo was required, I decided to use ```multipart/form-data``` as the content type being passed between client and server.

On the server, I used an express package called ```express-fileupload``` to parse the file content and write it to the disk. Other alternatives to ```express-fileupload``` are ```multer``` and ```busboy``` but I think ```express-fileupload``` worked fine for what I needed.

To store the images, I could have saved the raw image content directly in the database as a base64 encoded string, but this would make the database file very large.  Instead, I saved the images to the public/ folder and stored the filepath to the photo in the database.  I chose to name the file with ```uid``` instead of the photo filename in case 2 different spies upload the exact same photo.  When the list of spies is retrieved, the model returned to the client just contains a path to ```public/<filename>``` which the client can retrieve.

##Handling Errors
I categorized errors as either HTTP Bad Request (400) or HTTP Internal Server Error (500).  In each case, I wanted to notify the client that an error had occurred. A simple solution to this is to return a JSON object containing an error message when an error is encountered.

I accounted for the following HTTP Bad Request (400) errors:
1. Missing spy name, email address, age, or photo.
2. Spy name too long (to save space in database)
3. Email address too long (to save space in database)
4. Email address invalid
5. Age less than 18 years old (just for fun)
6. Photo file too large

#Retrieving Spies
The second REST endpoint is a GET method also called ```/api/signup```. The purpose of this endpoint is to retrieve the list of spies that have already signed up.  The endpoint does not need to take any parameters because it always retrieves all of the spies. (This could be improved to take a paging object to limit the result set).  The endpoint just returns an array of spy models.