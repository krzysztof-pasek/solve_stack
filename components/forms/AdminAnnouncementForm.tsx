"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createAnnouncement } from "@/lib/actions/announcement.action";
import {
    CreateAnnouncementSchema,
    CreateAnnouncementInput,
} from "@/lib/validations";

import { Button } from "../ui/button";

export default function AdminAnnouncementForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const defaultExpiresAt = useMemo(
        () => new Date(Date.now() + 7 * 864e5),
        []
    );

    const form = useForm<CreateAnnouncementInput>({
        resolver: zodResolver(CreateAnnouncementSchema),
        defaultValues: {
            title: "",
            body: "",
            expiresAt: defaultExpiresAt,
        },
    });

    const onSubmit = (data: CreateAnnouncementInput) => {
        startTransition(async () => {
            const endOfDay = new Date(data.expiresAt);
            endOfDay.setHours(23, 59, 59, 999);

            const res = await createAnnouncement({
                ...data,
                expiresAt: endOfDay,
            });
            if (res.success) {
                toast("Announcement created");
                router.push("/");
            } else {
                toast(res.error?.message ?? "An error occurred");
            }
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Type title here"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description *</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={6}
                                    {...field}
                                    placeholder="Type description…"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ends at *</FormLabel>
                            <FormControl>
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) =>
                                        date && field.onChange(date)
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="self-end primary-gradient text-white font-semibold px-6 py-2 rounded"
                    disabled={isPending}
                >
                    {isPending ? "Saving…" : "Publish"}
                </Button>
            </form>
        </Form>
    );
}
