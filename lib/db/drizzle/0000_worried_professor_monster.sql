CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'confirmed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('send', 'receive', 'swap', 'nfc_pay');--> statement-breakpoint
CREATE TYPE "public"."card_status" AS ENUM('active', 'frozen', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."card_type" AS ENUM('virtual', 'physical');--> statement-breakpoint
CREATE TYPE "public"."nfc_status" AS ENUM('pending', 'confirmed', 'expired');--> statement-breakpoint
CREATE TABLE "wallet_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_id" integer NOT NULL,
	"symbol" text NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"network" text NOT NULL,
	"qr_code" text
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_name" text NOT NULL,
	"total_value_usd" numeric(20, 8) DEFAULT '0' NOT NULL,
	"total_value_change_24h" numeric(20, 8) DEFAULT '0' NOT NULL,
	"total_value_change_pct_24h" numeric(10, 4) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_id" integer NOT NULL,
	"symbol" text NOT NULL,
	"name" text NOT NULL,
	"balance" numeric(30, 10) DEFAULT '0' NOT NULL,
	"value_usd" numeric(20, 8) DEFAULT '0' NOT NULL,
	"price_usd" numeric(20, 8) DEFAULT '0' NOT NULL,
	"change_24h" numeric(20, 8) DEFAULT '0' NOT NULL,
	"change_pct_24h" numeric(10, 4) DEFAULT '0' NOT NULL,
	"logo_color" text DEFAULT '#0080ff' NOT NULL,
	"allocation_pct" numeric(10, 4)
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_id" integer NOT NULL,
	"type" "transaction_type" NOT NULL,
	"asset" text NOT NULL,
	"amount" numeric(30, 10) NOT NULL,
	"value_usd" numeric(20, 8) NOT NULL,
	"to_address" text NOT NULL,
	"from_address" text NOT NULL,
	"status" "transaction_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"hash" text NOT NULL,
	"note" text,
	"merchant_name" text,
	"card_id" integer
);
--> statement-breakpoint
CREATE TABLE "crypto_cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_id" integer NOT NULL,
	"card_number" text NOT NULL,
	"cardholder_name" text NOT NULL,
	"expiry_month" integer NOT NULL,
	"expiry_year" integer NOT NULL,
	"cvv" text NOT NULL,
	"asset" text NOT NULL,
	"spending_limit" numeric(20, 8) DEFAULT '0' NOT NULL,
	"spent_amount" numeric(20, 8) DEFAULT '0' NOT NULL,
	"status" "card_status" DEFAULT 'active' NOT NULL,
	"card_type" "card_type" DEFAULT 'virtual' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"nfc_enabled" boolean DEFAULT true NOT NULL,
	"apple_pass_url" text,
	"google_pass_url" text,
	"pass_token" text
);
--> statement-breakpoint
CREATE TABLE "market_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" text NOT NULL,
	"name" text NOT NULL,
	"price_usd" numeric(20, 8) NOT NULL,
	"change_24h" numeric(20, 8) DEFAULT '0' NOT NULL,
	"change_pct_24h" numeric(10, 4) DEFAULT '0' NOT NULL,
	"market_cap_usd" numeric(30, 2) DEFAULT '0' NOT NULL,
	"volume_24h_usd" numeric(30, 2) DEFAULT '0' NOT NULL,
	"logo_color" text DEFAULT '#0080ff' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "market_prices_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
CREATE TABLE "price_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" text NOT NULL,
	"price" numeric(20, 8) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nfc_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_token" text NOT NULL,
	"merchant_name" text NOT NULL,
	"amount" numeric(20, 8) NOT NULL,
	"asset" text NOT NULL,
	"status" "nfc_status" DEFAULT 'pending' NOT NULL,
	"card_id" integer,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "nfc_sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
ALTER TABLE "wallet_addresses" ADD CONSTRAINT "wallet_addresses_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crypto_cards" ADD CONSTRAINT "crypto_cards_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;