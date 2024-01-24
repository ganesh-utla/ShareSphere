import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfileValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserById, useUpdateUser } from "@/lib/react-query/queriesAndMutations";
import { Loader, ProfileUploader } from "@/components/shared";

const UpdateProfile = () => {

    const { toast } = useToast();
    const { id } = useParams();
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();

    const { data: currentUser } = useGetUserById(id || "");
    const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
      useUpdateUser();
  
    const form = useForm<z.infer<typeof ProfileValidation>>({
        resolver: zodResolver(ProfileValidation),
        defaultValues: {
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          bio: user.bio || "",
          file: []
        }
    });

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  
  async function onSubmit (values: z.infer<typeof ProfileValidation>) {

      const updatedUser = await updateUser({
        userId: currentUser?.$id || "",
        imageId: currentUser?.imageId || "",
        imageUrl: currentUser?.imageUrl || "",
        name: values.name,
        bio: values.bio,
        file: values.file
      });

      if (!updatedUser) {
        toast({
          title: `Update user failed. Please try again.`,
        });
      }

      setUser({
        ...user,
        name: updatedUser?.name,
        bio: updatedUser?.bio,
        imageUrl: updatedUser?.imageUrl
      })

      return navigate(`/profile/${id}`);
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="w-full max-w-5xl flex flex-col gap-9"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <ProfileUploader 
                    fieldChange={field.onChange}
                    mediaUrl={user?.imageUrl}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Name
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input className="shad-input" {...field} disabled />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Optional
                  </FormLabel>
                  <FormControl>
                    <Input className="shad-input" {...field} disabled />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Bio
                  </FormLabel>
                  <FormControl>
                    <Textarea className="shad-textarea custom-scrollbar" {...field} />
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
                disabled={isLoadingUpdate}
              >
                {
                  isLoadingUpdate? (
                    <div className="flex-center gap-2">
                      <Loader /> Updating
                    </div>
                  ) : "Update"
                }
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default UpdateProfile