import type { InputFileNodeProps } from "../components/node/input/FileNode";
import type { OutputFileNodeProps } from "../components/node/output/FileNode";
import type { FilterConfigNodeProps } from "../components/node/transform/ConfigNode";

export type PipelineFile = {
  nodeId: string;
  fileName: string;
  fileSize: number | string;
  fileType: string;
  rawFile?: File | null;
};

export type PipelineConfig = {
  nodeId: string;
  nodeType: string;
  settings: Record<string, any>;
};

export type PipelinePayload = {
  isValid: boolean;
  files: PipelineFile[];
  configs: PipelineConfig[];
  errors?: string[];
};

export type CustomAppNode =
  | InputFileNodeProps
  | FilterConfigNodeProps
  | OutputFileNodeProps;

