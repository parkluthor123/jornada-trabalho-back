-- CreateTable
CREATE TABLE "configs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "next_workday" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "days_weeks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" TEXT NOT NULL,
    "initial_date" DATETIME NOT NULL,
    "final_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_config" INTEGER NOT NULL,
    CONSTRAINT "days_weeks_id_config_fkey" FOREIGN KEY ("id_config") REFERENCES "configs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
