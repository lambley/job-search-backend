import { KeywordJobStatus } from '@prisma/client';

export interface KeywordJobRequest {
  description: string;
  adzuna_id: string;
}

export interface KeywordJobCreateRequest extends KeywordJobRequest {
  status: KeywordJobStatus;
}
