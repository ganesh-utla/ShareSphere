import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpSchema } from "@/lib/validation";
import { Loader } from "@/components/shared";
import { useToast } from "@/components/ui/use-toast";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";


const SignUpForm = () => {

  const { toast } = useToast();
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();
  const { mutateAsync: signInAccount } = useSignInAccount();
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: ""
    },
  })
 
  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    const newUser = await createUserAccount(values);
    if (!newUser) {
      return toast({ title: "Sign up failed! Please try again.", variant: 'destructive' });
    }

    
    const session = await signInAccount(values);
    if (!session) {
      return toast({ title: "Sign up failed! Please try again.", variant: 'destructive' });
    }

    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate('/');
    } else {
      return toast({ title: "Sign up failed! Please try again.", variant: 'destructive' });
    }
  }

  return (
    <Form {...form}>

      <div className="sm:w-420 flex-center flex-col">

        <div className="flex gap-3 justify-center items-center">
          <img 
            src="/assets/images/logo.png"
            alt="logo"
            className="max-h-14 object-contain"
          />
        </div>

        <h2 className="sm:h2-bold h3-bold pt-5 text-center">
          Create a new account
        </h2>

        <p className="small-medium md:base-regular text-light-4 text-center mt-2">
          To use sharesphere, please enter your details
        </p>

        <h2></h2>
      
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4 px-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    className="shad-input"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password"
                    className="shad-input"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary active:!bg-primary-600">
            {
              isCreatingUser? (
                <div className="flex-center gap-2">
                  <Loader /> Loading...
                </div>
              ) : "Sign in"
            }
          </Button>

          <p className="text-small-regular text-light-4 text-center">
            Already have an account? <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Log in</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignUpForm