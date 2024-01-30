import { INewComment, INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

export async function createUserAccount (user: INewUser) {
    try {
        const newAccout = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )
        
        if (!newAccout) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccout.$id,
            email: newAccout.email,
            name: newAccout.name,
            imageUrl: avatarUrl,
            username: user.username
        });

        return newUser;
    } 
    
    catch (error) {
        console.log(error);
    }
}

export async function saveUserToDB (user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )

        return newUser;
    }

    catch (error) {
        console.log(error);
    }
}

export async function signInAccount (user : {
    email: string;
    password: string;
}) {
    try {

        const session = await account.createEmailSession(user.email, user.password);
        localStorage.setItem('userEmail', JSON.stringify({email: user.email}));
        return session;
        
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser () {
    try {
        // const currentAccount = await account.get();
        const currentAccount = JSON.parse(localStorage.getItem('userEmail') || "{}");

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            // [Query.equal('accountId', currentAccount.$id)]
            [Query.equal('email', currentAccount.email)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];
        // const currentUser = JSON.parse(localStorage.getItem('userDetails') || "{}");
        // return currentUser;
    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount () {
    try {

        const session = await account.deleteSession('current');
        return session;
        
    } catch (error) {
        
    }
}

export async function getPostById (postId: string) {
    try {

        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        );

        if (!post) throw Error;

        return post;
        
    } catch (error) {
        console.log(error);
    }
}

export async function createPost (post: INewPost) {
    try {

        const uploadedFile = await uploadFile(post.file[0]);

        if (!uploadedFile) throw Error;

        const fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        const tags = post.tags?.replace(/ /g, '').split(',');

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                location: post.location,
                tags: tags,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id
            }
        )

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newPost;
        
    } catch (error) {
        console.log(error);
    }
}

export async function updatePost (post: IUpdatePost) {

    const hasFileToUpdate = post.file.length > 0;
    let image = {
        imageUrl: post.imageUrl,   
        imageId: post.imageId,   
    }

    try {

        if (hasFileToUpdate) {
            const uploadedFile = await uploadFile(post.file[0]);
    
            if (!uploadedFile) throw Error;
    
            const fileUrl = getFilePreview(uploadedFile.$id);
    
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = {...image, imageId: uploadedFile.$id, imageUrl: fileUrl}
        }

        const tags = post.tags?.replace(/ /g, '').split(',');

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                location: post.location,
                tags: tags,
                imageUrl: image.imageUrl,
                imageId: image.imageId
            }
        )

        if (!updatedPost) {
            if (hasFileToUpdate) {
              await deleteFile(image.imageId);
            }
            throw Error;
        }
      
        
        if (post.imageId && hasFileToUpdate) {
            await deleteFile(post.imageId);
        }

        return updatedPost;
        
    } catch (error) {
        console.log(error);
    }
}

export async function deletePost (postId: string, imageId: string) {
    try {

        if (!postId || !imageId) throw Error;

        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        );
        
        if (!statusCode) throw Error;

        return { status : 'ok'};
        
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFile (file: File) {
    try {

        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        )

        return uploadedFile;
        
    } catch (error) {
        console.log(error);
    }
}

export function getFilePreview (fileId: string) {
    try {

        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId
        )

        return fileUrl;
        
    } catch (error) {
        console.log(error);
    }
}

export async function deleteFile (fileId: string) {
    try {
        await storage.deleteFile(
            appwriteConfig.storageId,
            fileId
        );

        return { status : 'ok' };
    } catch (error) {
        console.log(error);
    }
}

export async function getRecentPosts ({ pageParam } : { pageParam: number }) {

    const queries: any[] = [Query.orderDesc('$createdAt'), Query.limit(20)];

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {

        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        );

        if (!posts) throw Error;

        return posts;
        
    } catch (error) {
        console.log(error);
    }
}

export async function likePost (postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )
        if (!updatedPost) throw Error;
        return updatedPost;
        
    } catch (error) {
        console.log(error);
    }
}

export async function savePost (postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )
        if (!updatedPost) throw Error;
        return updatedPost;
        
    } catch (error) {
        console.log(error);
    }
}

export async function deleteSavedPost (savedPostId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedPostId
        )
        if (!statusCode) throw Error;
        return { status: 'ok'};
        
    } catch (error) {
        console.log(error);
    }
}

export async function getInfinitePosts ({ pageParam } : { pageParam : number }) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)];

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        );

        if (!posts) throw Error;

        return posts;

    } catch (error) {
        console.log(error);
    }
}

export async function searchPosts (searchTerm: string) {
    try {
        
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )

        if (!posts) throw Error;

        return posts;

    } catch (error) {
        console.log(error);
    }
}

export async function getUsers ({ pageParam } : { pageParam : number }) {

    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)];

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {

        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries
        )

        if (!users) throw Error;

        return users;
        
    } catch (error) {
        console.log(error);
    }
}

export async function searchUsers (searchTerm: string) {
    try {
        
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.startsWith('username', searchTerm)]
        )

        if (!users) throw Error;

        return users;

    } catch (error) {
        console.log(error);
    }
}

export async function getUserById (userId: string) {
    try {

        const user = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('$id', userId)]
        );

        if (!user) throw Error;

        return user.documents[0];

    } catch (error) {
        console.log(error);
    }
}

export async function updateUser (user: IUpdateUser) {

    const hasFileToUpdate = user.file.length > 0;
    let image = {
        imageUrl: user.imageUrl,   
        imageId: user.imageId,   
    }

    try {

        if (hasFileToUpdate) {
            const uploadedFile = await uploadFile(user.file[0]);
    
            if (!uploadedFile) throw Error;
    
            const fileUrl = getFilePreview(uploadedFile.$id);
    
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = {...image, imageId: uploadedFile.$id, imageUrl: fileUrl}
        }

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                bio: user.bio,
                imageUrl: image.imageUrl,
                imageId: image.imageId
            }
        )

        if (!updatedUser) {
            if (hasFileToUpdate) {
              await deleteFile(image.imageId);
            }
            throw Error;
        }
      
        
        if (user.imageId && hasFileToUpdate) {
            await deleteFile(user.imageId);
        }

        return updatedUser;
        
    } catch (error) {
        console.log(error);
    }
}

export async function followUser (userId: string, followersArray: string[]) {
    try {
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId,
            {
                followers: followersArray
            }
        )
        if (!updatedUser) throw Error;
        return updatedUser;
        
    } catch (error) {
        console.log(error);
    }
}

export async function postComment(comment: INewComment) {
    try {

        const newComment = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            ID.unique(),
            {
                creator: comment.userId,
                comment: comment.comment,
                post: comment.postId
            }
        )

        if (!newComment) throw Error;

        return newComment;
        
    } catch (error) {
        console.log(error);
    }
}

export async function deleteComment(commentId: string) {
    try {

        const deletedComment = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            commentId
        )

        if (!deletedComment) throw Error;

        return { status: "ok" };
        
    } catch (error) {
        console.log(error);
    }
}
