import mongoose from "mongoose";
import { Age, Behavioral, Breed, FosterType, Gender, GoodWith, IDraftPost, IPost, IUser, Medical, Role, Size, Temperament, Trained } from "./types";

const { Schema } = mongoose;

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    lowerEmail: {
        type: String,
        required: true,
        unique: true,
    },
    picture: {
        type: String,
        required: false,
        default: undefined,
    },
    preferredEmail: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    uid: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(Role),
    },
    hasCompletedOnboarding: {
        type: Boolean,
        required: true,
        default: false,
    },
    disabled: {
        type: Boolean,
        required: true,
        default: false,
    },
    type: {
        type: [
            {
                type: String,
                enum: Object.values(FosterType),
            },
        ],
        default: undefined,
        required: false,
    },
    size: {
        type: [
            {
                type: String,
                enum: Object.values(Size),
            },
        ],
        default: undefined,
        required: false,
    },
    restrictedBreeds: {
        type: [
            {
                type: String,
                enum: Object.values(Breed),
            },
        ],
        default: undefined,
        required: false,
    },
    preferredBreeds: {
        type: [
            {
                type: String,
                enum: Object.values(Breed),
            },
        ],
        default: undefined,
        required: false,
    },
    gender: {
        type: [
            {
                type: String,
                enum: Object.values(Gender),
            },
        ],
        default: undefined,
        required: false,
    },
    age: {
        type: [
            {
                type: String,
                enum: Object.values(Age),
            },
        ],
        default: undefined,
        required: false,
    },
    dogsNotGoodWith: {
        type: [
            {
                type: String,
                enum: Object.values(GoodWith),
            },
        ],
        default: undefined,
        required: false,
    },
    medical: {
        type: [
            {
                type: String,
                enum: Object.values(Medical),
            },
        ],
        default: undefined,
        required: false,
    },
    behavioral: {
        type: [
            {
                type: String,
                enum: Object.values(Behavioral),
            },
        ],
        default: undefined,
        required: false,
    },
});
export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);


const postSchema = new Schema<IPost | IDraftPost>({
    date: { type: Date, default: Date.now },
    name: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        default: null,
        enum: [...Object.values(FosterType), null],
    },
    size: {
        type: String,
        default: null,
        enum: [...Object.values(Size), null],
    },
    breed: [
        {
            type: String,
            enum: Object.values(Breed),
        },
    ],
    gender: {
        type: String,
        default: null,
        enum: [...Object.values(Gender), null],
    },
    age: {
        type: String,
        default: null,
        enum: [...Object.values(Age), null],
    },
    temperament: [
        {
            type: String,
            enum: Object.values(Temperament),
        },
    ],
    medical: [
        {
            type: String,
            enum: Object.values(Medical),
        },
    ],
    behavioral: [
        {
            type: String,
            enum: Object.values(Behavioral),
        },
    ],
    houseTrained: {
        type: String,
        required: true,
        enum: Object.values(Trained),
    },
    crateTrained: {
        type: String,
        required: true,
        enum: Object.values(Trained),
    },
    spayNeuterStatus: {
        type: String,
        required: true,
        enum: Object.values(Trained),
    },
    getsAlongWithMen: {
        type: String,
        required: true,
        enum: Object.values(Trained),
    },
    getsAlongWithWomen: {
        type: String,
        required: true,
        enum: Object.values(Trained),
    },
    getsAlongWithOlderKids: {
        type: String,
        required: true,
        enum: Object.values(Trained),
    },
    getsAlongWithYoungKids: {
        type: String,
        required: true,
        enum: Object.values(Trained),
    },
    getsAlongWithLargeDogs: {
        type: String,
        required: true,
        enum: Object.values(Trained),
    },
    getsAlongWithSmallDogs: {
        type: String,
        required: true,
        enum: Object.values(Trained),
    },
    getsAlongWithCats: {
        type: String,
        required: true,
        enum: Object.values(Trained),
    },
    covered: {
        type: Boolean,
        default: false,
    },
    draft: {
        type: Boolean,
        default: undefined,
    },
    pending: {
        type: Boolean,
        default: true,
    },
    attachments: [
        {
            type: String,
            required: true,
        },
    ],
    usersAppliedTo: {
        type: [{ type: String }],
        default: [],
        required: true,
    },
});

export const PostModel = mongoose.models.Post || mongoose.model("Post", postSchema);
