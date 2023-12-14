import {DataTypes, Sequelize} from 'sequelize';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import express from 'express';
import bcrypt from 'bcryptjs';

const sequelize = new Sequelize('usof', 'atrubnikov', 'securepass', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
});


const User = sequelize.define('User', {
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'default.jpg',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'User'),
    defaultValue: 'User',
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

const Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
    publishDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
});
  
const Category = sequelize.define('Category', {
  title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
  },
  description: {
      type: DataTypes.STRING,
      allowNull: true,
  },
});
  
const Comment = sequelize.define('Comment', {
  content: {
      type: DataTypes.TEXT,
      allowNull: false,
  },
  publishDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
  },
});
  
const LikePost = sequelize.define('LikePost', {
  publish_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  type: {
    type: DataTypes.ENUM('like', 'dislike'),
    allowNull: false,
  },
}, {
  tableName: 'likes_post',
});

  
const LikeComment = sequelize.define('LikeComment', {
  publish_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  type: {
      type: DataTypes.ENUM('like', 'dislike'),
      allowNull: false,
  },
}, {
  tableName: 'likes_comment',
});

const CategoryFavorites = sequelize.define('CategoryFavorites', {

}, {
  tableName: 'category_favorites',
});
  

Post.belongsTo(User, { foreignKey: 'author_id' });
User.hasMany(Post, { foreignKey: 'author_id' });
  
Post.belongsToMany(Category, { through: 'posts_categories', foreignKey: 'post_id' });
Category.belongsToMany(Post, { through: 'posts_categories', foreignKey: 'category_id' });
  
Comment.belongsTo(User, { foreignKey: 'author_id' });
User.hasMany(Comment, { foreignKey: 'author_id' });
  
LikePost.belongsTo(User, { foreignKey: 'author_id' });
User.hasMany(LikePost, { foreignKey: 'author_id' });

LikePost.belongsTo(Post, { foreignKey: 'post_id' });
Post.hasMany(LikePost, { foreignKey: 'post_id' });
  
LikeComment.belongsTo(User, { foreignKey: 'author_id' });
User.hasMany(LikeComment, { foreignKey: 'author_id' });
  
LikeComment.belongsTo(Comment, { foreignKey: 'comment_id' });
Comment.hasMany(LikeComment, { foreignKey: 'comment_id' });

User.beforeCreate(async (user, options) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user, options) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

CategoryFavorites.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(CategoryFavorites, { foreignKey: 'user_id' });

CategoryFavorites.belongsTo(Post, { foreignKey: 'post_id' });
Post.hasMany(CategoryFavorites, { foreignKey: 'post_id' });


AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});


const authenticate = async (email, password) => {
  let user = await User.findOne({
    where: {
      email: email,
      role: 'Admin',
    },
  });
  if (!user) return null;
  if (await bcrypt.compare(password, user.password)) {
    return Promise.resolve(user);
  } else return null;
};

const PORT = 5001;


const app = express();
const options = {
  origin: `http://localhost:${PORT}`,
  credentials: true,
  optionSuccessStatus: 200,
};

const adminOptions = {
  resources: [
    {
      resource: User,
      options: {
        properties: {
          id: { isVisible: { list: true, show: true, edit: false } },
          login: { isVisible: { list: true, show: true, edit: true } },
          password: { isVisible: { list: false, show: false, edit: true } },
          full_name: { isVisible: { list: true, show: true, edit: true } },
          avatar: { isVisible: { list: true, show: true, edit: true } },
          email: { isVisible: { list: true, show: true, edit: true } },
          role: { isVisible: { list: true, show: true, edit: true } },
          rating: { isVisible: { list: true, show: true, edit: true } },
        }, sort: {
          sortBy: 'rating',
          direction: 'asc',
        },
      },
    },
    {
      resource: Post,
      options: {
        properties: {
          id: { isVisible: { list: true, show: true, edit: false } },
          author_id: { isVisible: { list: true, show: true, edit: false } },
          title: { isVisible: { list: true, show: true, edit: true } },
          content: { isVisible: { list: true, show: true, edit: true } },
          image: { isVisible: { list: true, show: true, edit: true } },
          status: { isVisible: { list: true, show: true, edit: true } },
          publishDate: { isVisible: { list: true, show: true, edit: false } },
        }, sort: {
          sortBy: 'publishDate',
          direction: 'asc',
        },
        filterProperties: ['title', 'status', 'publishDate'],
      },
    },
    {
      resource: Category,
      options: {
        properties: {
          id: { isVisible: { list: true, show: true, edit: false } },
          title: { isVisible: { list: true, show: true, edit: true } },
          description: { isVisible: { list: true, show: true, edit: true } },
        }
      },
    },
    {
      resource: Comment,
      options: {
        properties: {
          id: { isVisible: { list: true, show: true, edit: false } },
          author_id: { isVisible: { list: true, show: true, edit: false } },
          postId: { isVisible: { list: true, show: true, edit: false } },
          content: { isVisible: { list: true, show: true, edit: true } },
          publishDate: { isVisible: { list: true, show: true, edit: false } },
          status: { isVisible: { list: true, show: true, edit: true } },
        }, sort: {
          sortBy: 'publishDate',
          direction: 'asc',
        },
      },
    },
    {
      resource: LikePost,
      options: {
        properties: {
          id: { isVisible: { list: true, show: true, edit: false } },
          author_id: { isVisible: { list: true, show: true, edit: false } },
          post_id: { isVisible: { list: true, show: true, edit: false } },
          type: { isVisible: { list: true, show: true, edit: true } },
          publish_date: { isVisible: { list: true, show: true, edit: false } },
        }
      },
    },
    {
      resource: LikeComment,
      options: {
        properties: {
          id: { isVisible: { list: true, show: true, edit: false } },
          author_id: { isVisible: { list: true, show: true, edit: false } },
          comment_id: { isVisible: { list: true, show: true, edit: false } },
          type: { isVisible: { list: true, show: true, edit: true } },
          publish_date: { isVisible: { list: true, show: true, edit: false } },
        }
      },
    },
    {
      resource: CategoryFavorites,
      options: {
        properties: {
          id: { isVisible: { list: true, show: true, edit: false } },
          post_id: { isVisible: { list: true, show: true, edit: false } },
          user_id: { isVisible: { list: true, show: true, edit: false } },
        }
      },
    },
  ],
};

const admin = new AdminJS(adminOptions);
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
  authenticate,
  cookieName: 'adminjs_admin',
  cookiePassword: 'securepass',
});

app.use(admin.options.rootPath, adminRouter);

app.listen(PORT, () => {
  console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
});
