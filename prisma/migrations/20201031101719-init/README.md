# Migration `20201031101719-init`

This migration has been generated by Ali Zahid at 10/31/2020, 3:17:19 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201031101719-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,97 @@
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model Account {
+  id Int @id @default(autoincrement())
+
+  compoundId         String    @unique
+  userId             Int
+  providerType       String
+  providerId         String
+  providerAccountId  String
+  refreshToken       String?
+  accessToken        String?
+  accessTokenExpires DateTime?
+
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+
+  @@index([providerAccountId], name: "providerAccountId")
+  @@index([providerId], name: "providerId")
+  @@index([userId], name: "userId")
+}
+
+model Session {
+  id Int @id @default(autoincrement())
+
+  userId       Int
+  expires      DateTime
+  sessionToken String   @unique
+  accessToken  String   @unique
+
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+}
+
+model User {
+  id Int @id @default(autoincrement())
+
+  name          String?
+  email         String?   @unique
+  emailVerified DateTime?
+  image         String?
+
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+
+  projects Project[]
+}
+
+model Project {
+  id Int @id @default(autoincrement())
+
+  user   User @relation(fields: [userId], references: [id])
+  userId Int
+
+  slug String @unique
+  name String
+
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+
+  forms Form[]
+}
+
+model Form {
+  id Int @id @default(autoincrement())
+
+  project   Project @relation(fields: [projectId], references: [id])
+  projectId Int
+
+  slug String @unique
+  name String
+
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+
+  responses Response[]
+}
+
+model Response {
+  id Int @id @default(autoincrement())
+
+  form   Form @relation(fields: [formId], references: [id])
+  formId Int
+
+  data Json
+  meta Json
+
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+}
```