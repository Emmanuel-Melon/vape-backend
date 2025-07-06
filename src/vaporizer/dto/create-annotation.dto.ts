import { z } from 'zod';
import { AnnotationType } from '@prisma/client';

export const createAnnotationSchema = z.object({
  type: z.nativeEnum(AnnotationType),
  text: z.string().min(5, 'Annotation text must be at least 5 characters long.'),
});

export type CreateAnnotationDto = z.infer<typeof createAnnotationSchema>;
