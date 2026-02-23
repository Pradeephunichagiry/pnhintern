

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { badges } from "@/lib/data"
import Link from "next/link"
import React, { startTransition } from "react"
import { createChallenge } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useActionState } from "react"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  whyItMatters: z.string().min(10, {
    message: "This field must be at least 10 characters.",
  }),
  points: z.coerce.number().min(10, {
    message: "Points must be at least 10.",
  }),
  deadline: z.date({
    required_error: "A deadline is required.",
  }),
  badgeId: z.string().optional(),
})

const initialState = {
  message: "",
  status: "",
};


export default function NewChallengePage() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(createChallenge, { message: "", status: "" });

  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      whyItMatters: "",
      points: 100,
      badgeId: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, String(value));
      }
    });
    startTransition(() => {
      formAction(formData);
    });
  });

  React.useEffect(() => {
    if (state && state.status === "success") {
      toast({
        title: "Challenge Created!",
        description: state.message,
      });
      router.push('/educator/challenges');
    } else if (state && state.status === "error") {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast, router]);


  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Create New Challenge</h1>
            <p className="text-muted-foreground">Fill out the form below to create a new eco-challenge for your students.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Challenge Details</CardTitle>
                <CardDescription>Provide all the necessary information for the new challenge.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Plastic-Free Day" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Describe the challenge for your students..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="whyItMatters"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Why It Matters</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Explain the environmental importance of this challenge..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FormField
                        control={form.control}
                        name="points"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Points</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="deadline"
                            render={({ field }) => (
                                <FormItem className="flex flex-col pt-2">
                                <FormLabel>Deadline</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="badgeId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col pt-2">
                                <FormLabel>Associated Badge (Optional)</FormLabel>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className={cn(
                                            "w-full justify-between",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value
                                            ? badges.find(
                                                (badge) => badge.id === field.value
                                            )?.title
                                            : "Select badge"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search badges..." />
                                        <CommandList>
                                            <CommandEmpty>No badge found.</CommandEmpty>
                                            <CommandGroup>
                                            {badges.map((badge) => (
                                                <CommandItem
                                                value={badge.id}
                                                key={badge.id}
                                                onSelect={(currentValue) => {
                                                    form.setValue("badgeId", currentValue === field.value ? "" : currentValue)
                                                    setOpen(false)
                                                }}
                                                >
                                                <Check
                                                    className={cn(
                                                    "mr-2 h-4 w-4",
                                                    badge.id === field.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    )}
                                                />
                                                {badge.title}
                                                </CommandItem>
                                            ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/educator/challenges">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Challenge
                        </Button>
                    </div>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  )
}
