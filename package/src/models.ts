export enum MLXModel {
  // Llama 3.2 (Meta) - 1B and 3B variants
  Llama_3_2_1B_Instruct_4bit = 'mlx-community/Llama-3.2-1B-Instruct-4bit',
  Llama_3_2_1B_Instruct_8bit = 'mlx-community/Llama-3.2-1B-Instruct-8bit',
  Llama_3_2_3B_Instruct_4bit = 'mlx-community/Llama-3.2-3B-Instruct-4bit',
  Llama_3_2_3B_Instruct_8bit = 'mlx-community/Llama-3.2-3B-Instruct-8bit',

  // Qwen 2.5 (Alibaba) - 0.5B, 1.5B, 3B variants
  Qwen2_5_0_5B_Instruct_4bit = 'mlx-community/Qwen2.5-0.5B-Instruct-4bit',
  Qwen2_5_0_5B_Instruct_8bit = 'mlx-community/Qwen2.5-0.5B-Instruct-8bit',
  Qwen2_5_1_5B_Instruct_4bit = 'mlx-community/Qwen2.5-1.5B-Instruct-4bit',
  Qwen2_5_1_5B_Instruct_8bit = 'mlx-community/Qwen2.5-1.5B-Instruct-8bit',
  Qwen2_5_3B_Instruct_4bit = 'mlx-community/Qwen2.5-3B-Instruct-4bit',
  Qwen2_5_3B_Instruct_8bit = 'mlx-community/Qwen2.5-3B-Instruct-8bit',

  // Qwen 3 - 1.7B variant
  Qwen3_1_7B_4bit = 'mlx-community/Qwen3-1.7B-4bit',
  Qwen3_1_7B_8bit = 'mlx-community/Qwen3-1.7B-8bit',

  // Gemma 3 (Google) - 1B variant
  Gemma_3_1B_IT_4bit = 'mlx-community/gemma-3-1b-it-4bit',
  Gemma_3_1B_IT_8bit = 'mlx-community/gemma-3-1b-it-8bit',

  // Phi 3.5 Mini (Microsoft) - ~3.8B but runs well on mobile
  Phi_3_5_Mini_Instruct_4bit = 'mlx-community/Phi-3.5-mini-instruct-4bit',
  Phi_3_5_Mini_Instruct_8bit = 'mlx-community/Phi-3.5-mini-instruct-8bit',

  // Phi 4 Mini (Microsoft)
  Phi_4_Mini_Instruct_4bit = 'mlx-community/Phi-4-mini-instruct-4bit',
  Phi_4_Mini_Instruct_8bit = 'mlx-community/Phi-4-mini-instruct-8bit',

  // SmolLM (HuggingFace) - 1.7B
  SmolLM_1_7B_Instruct_4bit = 'mlx-community/SmolLM-1.7B-Instruct-4bit',
  SmolLM_1_7B_Instruct_8bit = 'mlx-community/SmolLM-1.7B-Instruct-8bit',

  // SmolLM2 (HuggingFace) - 1.7B
  SmolLM2_1_7B_Instruct_4bit = 'mlx-community/SmolLM2-1.7B-Instruct-4bit',
  SmolLM2_1_7B_Instruct_8bit = 'mlx-community/SmolLM2-1.7B-Instruct-8bit',

  // OpenELM (Apple) - 1.1B and 3B
  OpenELM_1_1B_4bit = 'mlx-community/OpenELM-1_1B-4bit',
  OpenELM_1_1B_8bit = 'mlx-community/OpenELM-1_1B-8bit',
  OpenELM_3B_4bit = 'mlx-community/OpenELM-3B-4bit',
  OpenELM_3B_8bit = 'mlx-community/OpenELM-3B-8bit',
}
