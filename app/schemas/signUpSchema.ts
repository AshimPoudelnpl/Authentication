import {z} from 'zod';

export const usernameValidation=
z
.string()
.min(2,"Username must be at least 2 characters")
.max(20,"Username must be at most 20 characters")
.regex(/^[a-zA-Z0-9]+$/,"Username must contain only letters and numbers");


export const emailValidation=
z
.string()
.email("Please enter a valid email address");


export const passwordValidation=
z
.string()
.min(8,"Password must be at least 8 characters")
.max(100,"Password must be at most 100 characters")
.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,"Password must contain at least one uppercase letter, one lowercase letter, one number and one special character");


export const signUpSchema = z.object({
   username: usernameValidation,
   email: emailValidation,
   password: passwordValidation
})