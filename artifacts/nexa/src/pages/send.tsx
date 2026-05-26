import { useCreateTransaction, getListTransactionsQueryKey, useListAssets } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  asset: z.string().min(1, "Select an asset"),
  amount: z.coerce.number().positive("Amount must be positive"),
  toAddress: z.string().min(10, "Enter a valid address"),
  note: z.string().optional(),
});

export default function SendPage() {
  const createTx = useCreateTransaction();
  const { data: assets } = useListAssets();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { asset: "BTC", amount: 0, toAddress: "", note: "" },
  });

  const selectedAsset = assets?.find((a) => a.symbol === form.watch("asset"));
  const amountValue = form.watch("amount");
  const usdValue = selectedAsset ? Number(selectedAsset.priceUsd) * Number(amountValue) : 0;

  const onSubmit = (values: z.infer<typeof schema>) => {
    createTx.mutate(
      { data: { asset: values.asset, amount: values.amount, toAddress: values.toAddress, note: values.note } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });
          toast({ title: "Transaction submitted!" });
          form.reset();
        },
        onError: () => toast({ title: "Transaction failed", variant: "destructive" }),
      }
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Send Crypto</h1>
        <p className="text-muted-foreground mt-1 text-sm">Transfer to any address on the network</p>
      </div>

      <Card className="bg-card/50 border-border/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="asset" render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/30 border-border/50" data-testid="select-send-asset">
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(assets ?? [{ symbol: "BTC", name: "Bitcoin" }]).map((a) => (
                        <SelectItem key={a.symbol} value={a.symbol}>{a.name} ({a.symbol})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} type="number" step="any" placeholder="0.00" className="bg-background/30 border-border/50 pr-24" data-testid="input-send-amount" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <span className="text-xs text-muted-foreground font-mono">{form.watch("asset")}</span>
                      </div>
                    </div>
                  </FormControl>
                  {usdValue > 0 && (
                    <p className="text-xs text-muted-foreground">≈ ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  )}
                  {selectedAsset && (
                    <p className="text-xs text-muted-foreground">
                      Balance: {Number(selectedAsset.balance).toFixed(6)} {selectedAsset.symbol}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="toAddress" render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0x..." className="bg-background/30 border-border/50 font-mono text-sm" data-testid="input-to-address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="note" render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Payment for..." className="bg-background/30 border-border/50 resize-none" rows={2} data-testid="input-send-note" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {usdValue > 0 && (
                <div className="rounded-lg border border-border/50 bg-background/20 p-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-mono">{amountValue} {form.watch("asset")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">USD Value</span>
                    <span className="font-semibold text-primary">${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}

              <Button type="submit" disabled={createTx.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold gap-2" data-testid="button-send-submit">
                <Send className="h-5 w-5" />
                {createTx.isPending ? "Sending..." : "Send"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
