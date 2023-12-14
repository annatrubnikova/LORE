import { Routes, Route } from 'react-router-dom';
import StartPage from './StartPage';
import LoginPage from './LoginPage';
import RegPage from './RegPage';
import ConfirmReg from './ConfirmReg';
import Categories from './Categories';
import Error from './404error';
import Menu from './Menu';
import Posts from './Posts';
import Category from './Category';
import Post from './Post';
import AvatarChange from './AvatarChange';
import PassReset from './PassReset';
import ChangePass from './ChangePass';
import Users from './Users';
import User from './User';
import UserCreate from './UserCreate';
import UserChange from './UserChange';
import CategoryChange from './CategoryChange';
import CreatePost from './CreatePost';
import ChangePost from './ChangePost';
import Favourites from './Favourites';


function App() {
    return (
        <Routes>
            <Route path="/" element={<Menu />} >
                <Route path='/' element={<StartPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegPage />} />
                <Route path="confirmation/:token" element={<ConfirmReg />} />
                <Route path='categories' element={<Categories />} />
                <Route path='categories/favourites' element={<Favourites />} />
                {/*<Route path='categories/change/:id' element={<CategoryChange />} />*/}
                <Route path='users' element={<Users />} />
                <Route path='users/change/:id' element={<UserChange />} />
                <Route path='posts' element={<Posts />} />
                <Route path='posts/create' element={<CreatePost />} />
                <Route path='posts/change/:id' element={<ChangePost />} />
                <Route path='password-reset' element={<PassReset />} />
                <Route path='password-reset/:token' element={<ChangePass />} />
                <Route path="*" element={<Error />} />

                <Route path='categories/:id' element={<Category />} />
                <Route path='posts/:id' element={<Post />} />
                <Route path='users/:id' element={<User />} />

                <Route path='admin/user-create' element={<UserCreate />} />
                <Route path='admin/user-change/:id' element={<UserChange />} />
                {/*<Route path='users/:id/avatar' element={<AvatarChange />} />*/}
            </Route>
        </Routes>
    )
}

export default App;