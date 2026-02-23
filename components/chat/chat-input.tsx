"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { ArrowUpRight, Send } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "../ui/form";

const formSchema = z.object({
  message: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isLoading) return;
    onSend(values.message);
    form.reset();
  }

  return (
    <div className="border-t border-white/10 p-4 bg-black">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="flex justify-between   items-center w-full rounded-xl bg-zinc-900 transition-[border-color,box-shadow] relative outline-0">
                      <Input
                        list="chat-suggestions "
                        placeholder="Pergunte qualquer coisa"
                        className="flex-1 w-full min-w-full border-0 bg-transparent shadow-none   pl-4 pr-3 py-4 text-sm placeholder:text-zinc-500"
                        {...field}
                      />
                      <button
                        type="submit"
                        disabled={isLoading || !form.formState.isValid}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full mr-1.5 text-zinc-400 hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none absolute right-0 cursor-pointer"
                        aria-label="Enviar mensagem"
                      >
                        <ArrowUpRight size={24} className="text-bubble-assistant" />
                      </button>
                      <datalist id="chat-suggestions">
                        <option value="Relogio de couro" />
                        <option value="Mais Visualizado " />
                        <option value="Produtos em promoção" />
                      </datalist>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
