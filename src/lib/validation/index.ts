import * as z from "zod";

export const SignUpSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters."}),
    username: z.string().min(3, { message: "Username must be at least 3 characters."}),
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters."})
});

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const PostSchema = z.object({
    caption: z.string().min(5).max(2200),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(2200),
    tags: z.string(),
});

export const ProfileValidation = z.object({
    file: z.custom<File[]>(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    username: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email(),
    bio: z.string(),
});