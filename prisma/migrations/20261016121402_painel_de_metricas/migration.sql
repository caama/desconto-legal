-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "created_by_id" TEXT;

-- CreateTable
CREATE TABLE "company_daily_stats" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "whatsapp_clicks" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "company_daily_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "company_daily_stats_date_idx" ON "company_daily_stats"("date");

-- CreateIndex
CREATE UNIQUE INDEX "company_daily_stats_company_id_date_key" ON "company_daily_stats"("company_id", "date");

-- CreateIndex
CREATE INDEX "companies_created_by_id_idx" ON "companies"("created_by_id");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_daily_stats" ADD CONSTRAINT "company_daily_stats_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

