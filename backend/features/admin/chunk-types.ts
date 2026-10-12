import { Topic } from '@/backend/shared/types';
import { ObjectId } from 'mongodb';

export type ChunkResponse = {
  _id: string;
  id: string;
  pageContent: string;
  metadata: {
    tags: Topic[];
    source: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type ChunkCreateInput = {
  pageContent: string;
  metadata: {
    tags: Topic[];
    source: string;
  };
};

export type ChunkUpdateInput = {
  pageContent?: string;
  metadata?: {
    tags?: Topic[];
    source?: string;
  };
};

export type ChunkListResponse = {
  chunks: ChunkResponse[];
  total: number;
};

export type ChunkFilter = {
  topic?: Topic;
  source?: string;
  search?: string;
};