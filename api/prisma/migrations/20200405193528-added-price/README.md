# Migration `20200405193528-added-price`

This migration has been generated by Jan Mechtel at 4/5/2020, 7:35:28 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "quaint"."Price" (
    "date" DATE NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    "id" INTEGER NOT NULL  PRIMARY KEY AUTOINCREMENT,
    "symbol_exchange" TEXT NOT NULL DEFAULT '' ,
    "value" INTEGER NOT NULL DEFAULT 0 
) 

CREATE UNIQUE INDEX "quaint"."Price.symbol_exchange_date" ON "Price"("symbol_exchange","date")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200405193528-added-price
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,21 @@
+datasource DS {
+  provider = "sqlite"
+  url      = env("DATABASE_URL")
+}
+
+generator client {
+  provider      = "prisma-client-js"
+  binaryTargets = env("BINARY_TARGET")
+}
+
+// Define your own datamodels here and run `yarn redwood db save` to create
+// migrations for them.
+// TODO: Please remove the following example:
+model Price {
+  id    Int     @id @default(autoincrement())
+  symbol_exchange String
+  date DateTime
+  value  Int
+
+  @@unique ([symbol_exchange,date])
+}
```


