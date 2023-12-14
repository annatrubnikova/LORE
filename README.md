# LORE
# Forum for questions and answers about the game Dota 2

## Welcome to LORE
>An usof project made as a part of Innovation Campus stage. It is a web application where you can ask or answer the question about Dota 2.
> Project was created by @annatrubnikova as developer and @appol1nar1a as designer.
## Explaining the project and the database
This project is a website that allows an unauthorized user to:
1. View posts.
    - View specific post.
    - Sort.
    - Filter.
    - View the categories to which the post belongs.
    - See comments under the post.
2. View categories.
    - View specific category posts.
3. View user ratings.
    - View specific user profile.
4. Sign up / Reset password / Sign in.

Authorized user:
1. Have all the capabilities of an unauthorized user.
2. Interact with posts.
    - Change own post.
    - Create post.
    - Delete own post.
    - Add to favorites.
    - Create a comment under post.
    - Change own comment.
    - Delete own comment.
    - Like/dislike post.
    - Like/dislike comment.
3. Change profile data.
    - Change avatar.
    - Change login/fullname/email.
    - Delete profile.
4. Log out.

Admin:
1. Have all the capabilities of an authorized user.
2. Interact with categories.
    - Create new category.
    - Change category data.
    - Delete category.
3. Interact with posts.
    - Delete posts.
    - Make them active/inactive.
    - Delete comment.
4. Interact with user.
    - Change user data.
    - Delete user.
    - Create new user/admin.
    - Change user role.
### Database:
There is eight tables for database:

- First table users. Simple table for storing info about users.

- Second table is posts. It stores information about posts, which was made by user.

- Third table is comments. It stores information about comments above each post.

- Fourth table is categories. It stores information about categories.

- Fifth table is likes_comment. It stores information about likes which was made above comments.

- Sixth table is likes_post. It stores information about likes which was made above posts.

- Seventh table is likes_post. It stores information about likes which was made above posts.

- Eigth table is posts_categories. It stores information about which posts belong to which category.

<img src="https://i.imgur.com/MRF928B.png">

## User Instruction

### Running server
> To start the server you need to initially download the libraries. To do this, go to the server directory and write:

### `npm i`

> Then:

### `npm run serve`

> To Start Admin Server:

### `npm run admin`

> To Visit Admin Panel:

`http://localhost:5001`

### Running client
> To start the server you need to initially download the libraries. To do this, go to the server directory and write:

### `npm install`

> Then:

### `npm start`
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Register & Login
> Create a new account by the **"Create an account"** button on the main page, after you need to approve your email. You'll get an email message with confirmation link. After you need to sign in.

| Register | Login |
| :---: | :---: |
| <img src="https://i.imgur.com/gDx6zMj.png">  | <img src="https://i.imgur.com/LTCYprD.png">|

### Posts

| All posts | Specific post |
| :---: |  :---: |
| <img src="https://i.imgur.com/BYRNDcb.png">| <img src="https://i.imgur.com/qpSpmmG.png">|

| Comments | Create post |
| :---: | :---: |
| <img src="https://i.imgur.com/0NvjHgR.png">| <img src="https://i.imgur.com/ZcnRzqy.png">|

### Categories

| Page with categories for admin |
| :---: |
| <img src="https://i.imgur.com/DMKcK7x.png">|

### Users

| User rating | User profile |
| :---: |  :---: |
| <img src="https://i.imgur.com/2MuK2Fd.png">| <img src="https://i.imgur.com/d425Gh9.png">|

| Change user data |
| :---: |
| <img src="https://i.imgur.com/IVK5YJd.png">|

## Demonstration on youtube
[My Project presentation](https://youtu.be/clrqZ5buY4U)

## Features Server

- [Node JS](nodejs.org)
- [Express JS](expressjs.com)
- [Nodemailer](https://nodemailer.com)
- [MySQL](https://www.mysql.com)

## Features Client
- [React](https://react.dev)
- [Redux](https://redux.js.org)
