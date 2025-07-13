## Guide to Update Prisma Schema for Comprehensive Vaporizer Data

This guide outlines the steps to modify your Prisma schema (`schema.prisma`) to fully capture the details provided in your JSON vaporizer data.

### **Phase 1: Adding Core Vaporizer Attributes to the `Vaporizer` Model**

Many fields from your JSON can be directly mapped as new columns in the `Vaporizer` table.

**1. Update `Vaporizer` Model:**

Modify the `Vaporizer` model to include the following new fields.

```prisma
// schema.prisma

model Vaporizer {
  id                    Int            @id @default(autoincrement())
  name                  String
  manufacturer          String?
  msrp                  Decimal?
  releaseDate           DateTime?      @map("release_date") @db.Date
  heatingMethod         HeatingMethod? @map("heating_method")
  tempControl           TempControl?   @map("temp_control")
  expertScore           Decimal?       @map("expert_score") @db.Decimal(3, 1)
  userRating            Decimal?       @map("user_rating") @db.Decimal(2, 1)
  bestFor               String[]       @map("best_for")
  slug                  String         @unique

  // New fields from JSON data
  category              String?        // e.g., "Desktop", "Portable"
  subCategory           String?        @map("sub_category") // e.g., "Classic", "Log Vape"
  powerSource           String?        @map("power_source") // e.g., "Wall Outlet", "Battery"
  minBowlSizeGrams      Decimal?       @map("min_bowl_size_grams") @db.Decimal(4, 3) // Use Decimal for precision
  maxBowlSizeGrams      Decimal?       @map("max_bowl_size_grams") @db.Decimal(4, 3)
  minHeatUpTimeSeconds  Int?           @map("min_heat_up_time_seconds")
  maxHeatUpTimeSeconds  Int?           @map("max_heat_up_time_seconds")
  deliveryMethods       String[]       @map("delivery_methods") // e.g., ["Balloon", "Whip", "Direct Draw"]

  // Summary fields (can be long text)
  vaporQualitySummary   String?        @map("vapor_quality_summary")
  efficiencySummary     String?        @map("efficiency_summary")
  easeOfUseSummary      String?        @map("ease_of_use_summary")
  maintenanceSummary    String?        @map("maintenance_summary")
  communityFeedback     String?        @map("community_feedback")

  // Vibe and preference scores
  moods                 String[]       @default([])
  contexts              String[]       @default([])
  scenarios             String[]       @default([])
  portabilityScore      Decimal?       @map("portability_score") @db.Decimal(3, 1)
  easeOfUseScore        Decimal?       @map("ease_of_use_score") @db.Decimal(3, 1)
  discreetnessScore     Decimal?       @map("discreetness_score") @db.Decimal(3, 1)

  // Relation to Annotations
  annotations           Annotation[]

  // Relation to Key Features
  keyFeatures           KeyFeature[]   // New relation

  // Relation to Materials
  materials             VaporizerMaterial[] // New relation

  @@map("vaporizers")
}
```

**Explanation of Changes:**

  * **`category` (String?), `subCategory` (String?)**: Direct mapping for `category` and `sub_category`.
  * **`powerSource` (String?)**: Maps to `power_source`.
  * **`minBowlSizeGrams` (Decimal?), `maxBowlSizeGrams` (Decimal?)**: Breaking down `bowl_size_grams` (e.g., "0.25-0.5") into numerical fields for better querying and filtering. Using `Decimal(4,3)` for precision.
  * **`minHeatUpTimeSeconds` (Int?), `maxHeatUpTimeSeconds` (Int?)**: Breaking down `heat_up_time_seconds` (e.g., "40-90") into numerical fields.
  * **`deliveryMethods` (String[])**: Captures `delivery_methods` as an array of strings. This is flexible. If these methods become fixed and numerous, an enum or a separate join table might be considered.
  * **`vaporQualitySummary` (String?), `efficiencySummary` (String?), `easeOfUseSummary` (String?), `maintenanceSummary` (String?), `communityFeedback` (String?)**: These large text blocks from the JSON can be directly stored as `String` fields on the `Vaporizer` model. This is better than putting them into `Annotation`s of type `NOTE` if they represent core, distinct summaries.

### **Phase 2: Modeling Complex Relationships and Structured Data**

Some JSON fields, like `key_features`, `tags`, `comparisons`, and `accessories`, are more complex and benefit from dedicated models or join tables for better normalization and querying.

**2. Add `KeyFeature` Model:**

Your JSON has `key_features` as a list of strings. While it could be a `String[]` on `Vaporizer`, having it as a separate model allows for potential future expansion (e.g., adding descriptions to features, categorizing features).

```prisma
// schema.prisma

model KeyFeature {
  id          Int       @id @default(autoincrement())
  vaporizerId Int
  description String    // The key feature text
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  vaporizer   Vaporizer @relation(fields: [vaporizerId], references: [id], onDelete: Cascade)

  @@map("key_features")
}
```

  * **Update `Vaporizer` model**: Add `keyFeatures KeyFeature[]` to `Vaporizer`. (Already done in Phase 1 example).

**3. Add `VaporizerMaterial` Model (for `tags.materials`):**

The `tags.materials` array (e.g., `["glass", "wood", "ceramic"]`) suggests a list of materials. This is a perfect candidate for a many-to-many relationship using an explicit join table (`VaporizerMaterial`). This allows for consistent material names and easy querying of vaporizers by material.

```prisma
// schema.prisma

// Define an enum for common materials, or keep as string if truly dynamic
enum MaterialType {
  GLASS
  WOOD
  CERAMIC
  METAL
  PLASTIC
  // Add other materials as needed
}

model Material {
  id          Int                 @id @default(autoincrement())
  name        String              @unique // e.g., "Glass", "Wood"
  type        MaterialType?       // Optional: Categorize materials if needed
  createdAt   DateTime            @default(now()) @map("created_at")
  updatedAt   DateTime            @updatedAt @map("updated_at")
  vaporizers  VaporizerMaterial[] // Join table

  @@map("materials")
}

model VaporizerMaterial {
  vaporizerId Int
  materialId  Int
  assignedAt  DateTime @default(now()) @map("assigned_at")

  vaporizer   Vaporizer @relation(fields: [vaporizerId], references: [id], onDelete: Cascade)
  material    Material  @relation(fields: [materialId], references: [id], onDelete: Cascade)

  @@id([vaporizerId, materialId]) // Composite primary key
  @@map("vaporizer_materials")
}
```

  * **Update `Vaporizer` model**: Add `materials VaporizerMaterial[]` to `Vaporizer`. (Already done in Phase 1 example).
  * **Remove `materials` from `Vaporizer.tags`**: The `tags` object in JSON had `materials`. With this new model, you would remove "materials" from the `tags` object or define tags as a separate concept.

**4. Handle `comparisons` and `accessories` (Consider separate models or JSON fields):**

These are quite structured in your JSON.

  * **`VaporizerComparison` Model (Recommended for `comparisons`):**
    This allows you to link vaporizers and provide a summary of the comparison.

    ```prisma
    // schema.prisma

    model VaporizerComparison {
      id            Int       @id @default(autoincrement())
      vaporizerId   Int       // The vaporizer being compared
      comparedToId  Int       // The vaporizer it's compared against
      summary       String    // The comparison text
      createdAt     DateTime  @default(now()) @map("created_at")
      updatedAt     DateTime  @updatedAt @map("updated_at")

      vaporizer     Vaporizer @relation("VaporizerComparedFrom", fields: [vaporizerId], references: [id], onDelete: Cascade)
      comparedTo    Vaporizer @relation("VaporizerComparedTo", fields: [comparedToId], references: [id], onDelete: Cascade)

      @@map("vaporizer_comparisons")
    }
    ```

      * **Note**: This requires adding relations to the `Vaporizer` model if you want to query "what is compared to this vaporizer?". For now, it might be simpler to query `VaporizerComparison` directly. If you want direct relations on the `Vaporizer` model, you'd add:
        ```prisma
        // Inside Vaporizer model
        comparisonsFrom   VaporizerComparison[] @relation("VaporizerComparedFrom")
        comparisonsTo     VaporizerComparison[] @relation("VaporizerComparedTo")
        ```

  * **`Accessory` and `VaporizerAccessory` Models (Recommended for `accessories`):**
    This is best normalized for managing a catalog of accessories and linking them to specific vaporizers.

    ```prisma
    // schema.prisma

    enum AccessoryType {
      OFFICIAL
      THIRD_PARTY
    }

    model Accessory {
      id          Int                 @id @default(autoincrement())
      name        String              @unique
      description String?
      type        AccessoryType       // Official or Third-Party
      createdAt   DateTime            @default(now()) @map("created_at")
      updatedAt   DateTime            @updatedAt @map("updated_at")
      vaporizers  VaporizerAccessory[] // Join table

      @@map("accessories")
    }

    model VaporizerAccessory {
      vaporizerId Int
      accessoryId Int
      assignedAt  DateTime @default(now()) @map("assigned_at")

      vaporizer   Vaporizer @relation(fields: [vaporizerId], references: [id], onDelete: Cascade)
      accessory   Accessory @relation(fields: [accessoryId], references: [id], onDelete: Cascade)

      @@id([vaporizerId, accessoryId])
      @@map("vaporizer_accessories")
    }
    ```

**5. `BallVapeDetails` Model (Optional, if needed for specific vaporizers):**

If "ball vapes" become a distinct and important category with specific, consistent attributes, a separate model would be appropriate. Otherwise, a `Json?` field on `Vaporizer` could suffice for now.

```prisma
// schema.prisma

// If you need more structure beyond a JSON field
model BallVapeDetails {
  id                 Int       @id @default(autoincrement())
  vaporizerId        Int       @unique // One-to-one relation with Vaporizer
  ballMaterial       String?
  ballSizeMm         Decimal?  @map("ball_size_mm") @db.Decimal(4, 1)
  ballCount          Int?
  coilSizeMm         Decimal?  @map("coil_size_mm") @db.Decimal(4, 1)
  recommendedTempF   Int?      @map("recommended_temp_f")
  createdAt          DateTime  @default(now()) @map("created_at")
  updatedAt          DateTime  @updatedAt @map("updated_at")

  vaporizer          Vaporizer @relation(fields: [vaporizerId], references: [id], onDelete: Cascade)

  @@map("ball_vape_details")
}
```

  * **Update `Vaporizer` model (if using this model):**
    `ballVapeDetails BallVapeDetails?`

**6. Refine `tags` (JSON `tags` object):**

The `tags` object in your JSON (e.g., `heating`, `power`, `delivery`, `features`, `materials`, `type`) implies various types of tags.

  * `heating`, `power`, `delivery`, `type` are largely covered by `heatingMethod`, `powerSource`, `deliveryMethods`, `category`/`subCategory` fields.
  * `materials` is now covered by `VaporizerMaterial`.
  * `features` (`fast_heat_up`, `app_connectivity`, `microdosing`, `water_pipe_compatibility`) could be handled in a few ways:
      * Many are now explicit fields (e.g., `minHeatUpTimeSeconds`, `tempControl` for app).
      * Some can be part of `bestFor` array (e.g., "microdosing", "water pipe compatibility").
      * You could have a generic `tags String[]` field on `Vaporizer` for miscellaneous tags that don't fit specific columns.

**Recommendation for `tags.features` and other remaining generic tags:** Add a generic `tags` array of strings to the `Vaporizer` model, or refine `bestFor` to encompass these.

```prisma
// Inside Vaporizer model (existing or add if not there)
  genericTags           String[]       @default([]) // For any remaining miscellaneous tags from JSON 'tags'
```

### **Phase 3: Cleanup and Deployment**

**7. Review and Remove Redundant Fields/Enums:**

After adding new specific fields, you might find some existing enum or String[] fields on `Vaporizer` become redundant. For example, if `deliveryMethods` is a `String[]`, you might not need a separate enum `DeliveryMethod` if you had one.

  * Ensure your `AnnotationType` enum is still valid (PRO, CON, TIP, NOTE).
  * The `ball_vape_details` block in your JSON suggests fields like `ball_material`, `ball_size_mm`, etc. If you don't create a `BallVapeDetails` model, these specific attributes would be lost unless you choose to store the entire `ball_vape_details` JSON object as a `Json?` field on `Vaporizer`.

**8. Generate New Migration:**

After making all these changes to your `schema.prisma` file, you'll need to generate a new database migration.

```bash
npx prisma migrate dev --name add_detailed_vaporizer_fields
```

Follow the prompts. Prisma will analyze the changes and generate SQL files to alter your database tables (add new columns, create new tables, etc.).

**9. Apply Migration and Seed Data:**

Apply the migration to your database:

```bash
npx prisma migrate deploy
```

Then, you'll need to write a script (e.g., a Node.js script using Prisma Client) to iterate through your JSON data and populate the new fields in your database. This will involve:

  * **Fetching/Parsing JSON:** Load your JSON file into your application.
  * **Iterating Vaporizers:** Loop through each vaporizer object in the `vaporizers` array.
  * **Mapping Data:** For each vaporizer, map the JSON fields to the corresponding Prisma model fields.
      * For `minBowlSizeGrams` and `maxBowlSizeGrams`, you'll need to parse "0.25-0.5" into `0.25` and `0.5`.
      * For `minHeatUpTimeSeconds` and `maxHeatUpTimeSeconds`, parse "40-90" into `40` and `90`.
      * For `HeatingMethod` and `TempControl`, map the string from JSON to the appropriate enum value.
  * **Creating Records:** Use `prisma.vaporizer.create()` or `prisma.vaporizer.upsert()` to add/update vaporizer records.
  * **Creating Related Records:** For `KeyFeature`, `VaporizerMaterial`, `VaporizerComparison`, `Accessory`, and `VaporizerAccessory`, you'll need to create those records *after* the main `Vaporizer` record is created (to get its `id`).
      * For materials and accessories, you'd likely want to `upsert` them into their respective `Material` or `Accessory` tables first, then create the join table entries (`VaporizerMaterial`, `VaporizerAccessory`).
  * **Populating `Annotations`:** Continue to use the `Annotation` model for `pros`, `cons`, and `user_tips`.

