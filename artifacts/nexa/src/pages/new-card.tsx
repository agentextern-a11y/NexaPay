import { useCreateCard, getListCardsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  cardholderName: z.string().min(2, "Name too short"),
  asset: z.string().min(1, "Select an asset"),
  spendingLimit: z.coerce.number().positive("Must be positive"),
  cardType: z.enum(["virtual", "physical"]),
  nfcEnabled: z.boolean(),
});

export default function NewCard() {
  const createCard = useCreateCard();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { cardholderName: "", asset: "BTC", spendingLimit: 1000, cardType: "virtual", nfcEnabled: true },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    createCard.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCardsQueryKey() });
          toast({ title: "Card issued successfully!" });
          setLocation("/cards");
        },
        onError: () => toast({ title: "Failed to issue card", variant: "destructive" }),
      }
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg space-y-6">
      <Link href="/cards" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to Cards
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Issue New Card</h1>

      <Card className="bg-card/50 border-border/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="cardholderName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="JOHN DOE" className="bg-background/30 border-border/50 uppercase" data-testid="input-cardholder-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="asset" render={({ field }) => (
                <FormItem>
                  <FormLabel>Linked Asset</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/30 border-border/50" data-testid="select-asset">
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="USDT">Tether (USDT)</SelectItem>
                      <SelectItem value="SOL">Solana (SOL)</SelectItem>
                      <SelectItem value="BNB">BNB</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="spendingLimit" render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Spending Limit (USD)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="1000" className="bg-background/30 border-border/50" data-testid="input-spending-limit" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="cardType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/30 border-border/50" data-testid="select-card-type">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="nfcEnabled" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                  <div>
                    <FormLabel>NFC Tap-to-Pay</FormLabel>
                    <p className="text-xs text-muted-foreground mt-0.5">Enable contactless payments</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-nfc-enabled" />
                  </FormControl>
                </FormItem>
              )} />

              <Button type="submit" disabled={createCard.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-submit-card">
                {createCard.isPending ? "Issuing..." : "Issue Card"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
