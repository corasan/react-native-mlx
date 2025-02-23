import { type HybridObject } from 'react-native-nitro-modules';
export interface MLX extends HybridObject<{
    ios: 'swift';
}> {
    output: String;
    load(modelId: string): Promise<void>;
    generate(prompt: string): Promise<void>;
}
