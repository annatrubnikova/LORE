<h1>USOF back-end</h1>

<p>This project is a back-end part of the full-stack project for the ucode-connect</p>

<h2>Setup</h2>

<p>Clone this repository.
</p>
<p> 
Installation

`npm i`

To Start Server:

`npm run serve`

To Visit App:

`http://localhost:5000/`

To Start Admin Server:

`npm run admin
`
To Visit Admin Panel:

`http://localhost:5001`

</p>

<h2>Using the API</h2>
<p>
    <b>Authorization module</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Request</b></td>
                    <td><b>Description</b></td>
                </tr>
            </thead>
            <tr>
                <td><code>POST - /api/auth/register</code></td>
                <td>Registration of a new user</td>
            </tr>
            <tr>
                <td><code>POST - /api/auth/confirmation/:token</code></td>
                <td>Confirm registration of a new user</td>
            </tr>
            <tr>
                <td><code>POST - /api/auth/login</code></td>
                <td>Log in user</td>
            </tr>
            <tr>
                <td><code>POST - /api/auth/logout</code></td>
                <td>Log out authorized user</td>
            </tr>
            <tr>
                <td><code>POST - /api/auth/password-reset</code></td>
                <td>Send a reset link to user email</td>
            </tr>
            <tr>
                <td><code>POST - /api/auth/password-reset/:token</code></td>
                <td>Confirm new password</td>
            </tr>
        </table>
    </p>
    <br>
    <p><b>User module</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Request</b></td>
                    <td><b>Description</b></td>
                </tr>
            </thead>
            <tr>
                <td><code>GET - /api/users</code></td>
                <td>Get all users</td>
            </tr>
            <tr>
                <td><code>GET - /api/users/:id</code></td>
                <td>Get specified user data</td>
            </tr>
            <tr>
                <td><code>POST - /api/users</code></td>
                <td>Create a new user</td>
            </tr>
            <tr>
                <td><code>PATCH - /api/users/avatar</code></td>
                <td>Upload user avatar</td>
            </tr>
            <tr>
                <td><code>PATCH - /api/users/:id</code></td>
                <td>Update user data</td>
            </tr>
            <tr>
                <td><code>DELETE - /api/users/:id</code></td>
                <td>Delete user</td>
            </tr>
        </table>
    </p>
    <br>
    <p><b>Posts module</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Request</b></td>
                    <td><b>Description</b></td>
                </tr>
            </thead>
            <tr>
                <td><code>GET - /api/posts</code></td>
                <td>Get all posts</td>
            </tr>
            <tr>
                <td><code>GET - /api/posts/:id</code></td>
                <td>Get specified post data</td>
            </tr>
            <tr>
                <td><code>GET - /api/posts/:id/comments</code></td>
                <td>Get all comments for the specified post.</td>
            </tr>
            <tr>
                <td><code>POST - /api/posts/:post_id/comments</code></td>
                <td>Create a new comment</td>
            </tr>
            <tr>
                <td><code>GET - /api/posts/:id/categories</code></td>
                <td>Get all categories associated with the specified post</td>
            </tr>
            <tr>
                <td><code>GET - /api/posts/:id/like</code></td>
                <td>Get all likes under the specified post</td>
            </tr>
            <tr>
                <td><code>POST - /api/posts</code></td>
                <td>Create a new post</td>
            </tr>
            <tr>
                <td><code>POST - /api/posts/:id/like</code></td>
                <td>Create a new like under a post</td>
            </tr>
            <tr>
                <td><code>PATCH - /api/posts/:post_id</code></td>
                <td>Update the specified post</td>
            </tr>
            <tr>
                <td><code>DELETE - /api/posts/:id</code></td>
                <td>Delete a post</td>
            </tr>
            <tr>
                <td><code>DELETE - /api/posts/:id/like</code></td>
                <td>Delete a like under a post</td>
            </tr>
        </table>
    </p>
    <br>
    <p><b>Categories module</b>
        <table width="100%">
           <thead>
                <tr>
                    <td><b>Request</b></td>
                    <td><b>Description</b></td>
                </tr>
            </thead>
            <tr>
                <td><code>GET - /api/categories</code></td>
                <td>Get all categories</td>
            </tr>
            <tr>
                <td><code>GET - /api/categories/:id</code></td>
                <td>Get specified category data</td>
            </tr>
            <tr>
                <td><code>GET - /api/categories/:id/posts</code></td>
                <td>Get all posts associated with the specified category</td>
            </tr>
            <tr>
                <td><code>POST - /api/categories/</code></td>
                <td>Create a new category</td>
            </tr>
            <tr>
                <td><code>PATCH - /api/categories/:id</code></td>
                <td>Update specified category data</td>
            </tr>
            <tr>
                <td><code>DELETE - /api/categories/:id</code></td>
                <td>Delete a category</td>
            </tr>
        </table>
    </p>
    <br>
    <p><b>Comments module</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Request</b></td>
                    <td><b>Description</b></td>
                </tr>
            </thead>
            <tr>
                <td><code>GET - /api/comments/:id</code></td>
                <td>Get specified comment data</td>
            </tr>
            <tr>
                <td><code>GET - /api/comments/:id/like</code></td>
                <td>Get all likes under the specified comment</td>
            </tr>
            <tr>
                <td><code>POST - /api/comments/:id/like</code></td>
                <td>Create a new like under a comment</td>
            </tr>
            <tr>
                <td><code>PATCH - /api/comments/:id</code></td>
                <td>Update specified comment data</td>
            </tr>
            <tr>
                <td><code>DELETE - /api/comments/:id</code></td>
                <td>Delete a comment</td>
            </tr>
            <tr>
                <td><code>DELETE - /api/comments/:id/like</code></td>
                <td>Delete a like under a comment</td>
            </tr>
        </table>
    </p>
        <p><b>Favorites module</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Request</b></td>
                    <td><b>Description</b></td>
                </tr>
            </thead>
            <tr>
                <td><code>GET - /api/fav</code></td>
                <td>Get all your favorites posts</td>
            </tr>
            <tr>
                <td><code>POST - /api/fav</code></td>
                <td>Add a new post to favorites</td>
            </tr>
            <tr>
                <td><code>DELETE - /api/fav/:id</code></td>
                <td>Delete post from favorites</td>
            </tr>
        </table>
    </p>


