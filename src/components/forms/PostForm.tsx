import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { PostSchema } from "@/lib/validation";
import { Models } from "appwrite";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader, FileUploader } from "../shared";

type PostFormProps = {
  post?: Models.Document,
  action: 'Create' | 'Update',
}

const PostForm = ({ post, action } : PostFormProps) => {

    const { toast } = useToast();
    const { mutateAsync: createPost, isPending: isCreateLoading } = useCreatePost();
    const { mutateAsync: updatePost, isPending: isUpdateLoading } = useUpdatePost();
    const { user } = useUserContext();
    const navigate = useNavigate();
  
    const form = useForm<z.infer<typeof PostSchema>>({
        resolver: zodResolver(PostSchema),
        defaultValues: {
          caption: post? post.caption : "",
          location: post? post.location : "",
          tags: post? post.tags.join(",") : "",
          file: []
        }
    });
    
    async function onSubmit (values: z.infer<typeof PostSchema>) {

      if (post && action==='Update') {
        const updatedPost = await updatePost({
          ...values,
          postId: post.$id,
          imageId: post.imageId,
          imageUrl: post.imageUrl
        });

        if (!updatedPost) 
          return toast({ title: "Unable to update post!! Please try again...", variant: 'destructive' });
        
        return navigate(`/posts/${post.$id}`);
      }

      const newPost = await createPost({ ...values, userId: user.id });

      if (!newPost) 
        return toast({ title: "Unable to create post!! Please try again...", variant: 'destructive' });
      
      navigate('/');
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-5xl flex flex-col gap-9">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Caption
              </FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FileUploader 
                fieldChange={field.onChange}
                mediaUrl={post?.imageUrl}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Location
              </FormLabel>
              <FormControl>
                <Input className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (seperated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Art, Nature, Coding" 
                  className="shad-input" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex justify-end items-center gap-4">
          <Button 
            type="button" 
            className="shad-button_dark_4" 
            onClick={() => navigate(-1)}
          >
              Cancel
          </Button>
          <Button 
            type="submit" 
            className="shad-button_primary whitespace-nowrap"
            disabled={isCreateLoading || isUpdateLoading}
          >
            {
              isCreateLoading || isUpdateLoading? (
                <div className="flex-center gap-2">
                  <Loader /> {`${action.slice(0,5)}ing...`}
                </div>
              ) : action
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm