import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
        required: true,
      unique:true
    },
    password: {
      type: String,
        required: true,
      minlength:6
    },
    bio: {
      type: String,
       default:''
    },
    profilePic: {
      type: String,
       default:''
    },
    nativeLanguage: {
      type: String,
       default:''
    },
    learningLanguage: {
      type: String,
       default:''
    },
    location: {
      type: String,
       default:''
    },
    isOnboarded: {
      type: Boolean,
       default:false
        },
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'User'
        }
    ]
  },
  { timestamps: true }
);

//pre hook

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next()
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next();
    }
    catch (e) {
        next(error);
    }
})

UserSchema.method.matchPassword = async (enteredpassword) => {
  const isPasswordCorrect = await bcrypt.compare(enteredpassword, this.password)
  return isPasswordCorrect
}

const User = mongoose.model('User', UserSchema);
export default User